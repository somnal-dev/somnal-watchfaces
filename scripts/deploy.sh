#!/bin/bash

# ==============================================================================
# Somnal Watchface Deployment Script
# 갤럭시 워치페이스 배포 자동화 스크립트
# ==============================================================================

set -e

# 색상 코드
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 설정
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
GALAXY_DIR="$PROJECT_DIR/galaxy-watchface"
OUTPUT_DIR="$PROJECT_DIR/output"
BUILD_DIR="$PROJECT_DIR/build"

# 기본값
COUNT=1
TEMPLATE=""
WATCHFACE_ID=""
TRACK="production"
DRY_RUN=false

# 사용법
usage() {
    cat << EOF
📱 Somnal Watchface Deployment Script

사용법: $0 [옵션] [명령]

명령:
    deploy        워치페이스 생성 → 변환 → 빌드 → 업로드 전체 파이프라인
    generate      새 워치페이스 생성
    convert       기존 워치페이스를 Galaxy 포맷으로 변환
    build         워치페이스 패키지 빌드 (.wgt)
    upload        Galaxy Store에 업로드
    batch         모든 워치페이스 일괄 처리
    list          사용 가능한 워치페이스 목록
    clean         빌드 아티팩트 정리
    check         환경 설정 확인

옵션:
    -c, --count N         생성할 워치페이스 개수 (기본값: 1)
    -t, --template ID     사용할 템플릿 ID
    -w, --watchface ID    특정 워치페이스 ID
    -r, --track TRACK     배포 트랙 (production|beta, 기본값: production)
    -d, --dry-run         실제 업로드 없이 시뮬레이션
    -h, --help            도움말 표시

예제:
    $0 deploy                    # 기본 배포 (샘플 1개)
    $0 deploy -c 3               # 3개 워치페이스 생성 후 배포
    $0 generate -t neon          # neon 템플릿으로 생성
    $0 build -w abc123           # 특정 워치페이스 빌드
    $0 upload -r beta            # 베타 트랙에 업로드
    $0 batch                     # 모든 워치페이스 일괄 배포
    $0 check                     # 환경 확인

EOF
    exit 0
}

# 로그 함수
log_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

log_success() {
    echo -e "${GREEN}✓${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

log_error() {
    echo -e "${RED}✗${NC} $1"
}

# 환경 확인
check_environment() {
    log_info "환경 확인 중..."
    
    # Node.js 확인
    if ! command -v node &> /dev/null; then
        log_error "Node.js가 설치되어 있지 않습니다."
        exit 1
    fi
    log_success "Node.js: $(node --version)"
    
    # npm 확인
    if ! command -v npm &> /dev/null; then
        log_error "npm이 설치되어 있지 않습니다."
        exit 1
    fi
    log_success "npm: $(npm --version)"
    
    # 프로젝트 디렉토리 확인
    if [ ! -d "$PROJECT_DIR" ]; then
        log_error "프로젝트 디렉토리를 찾을 수 없습니다: $PROJECT_DIR"
        exit 1
    fi
    log_success "프로젝트: $PROJECT_DIR"
    
    # Ruby 확인 (Fastlane용)
    if command -v ruby &> /dev/null; then
        log_success "Ruby: $(ruby --version)"
    else
        log_warning "Ruby가 설치되어 있지 않습니다. Fastlane을 사용하려면 설치가 필요합니다."
    fi
    
    # Tizen CLI 확인
    if [ -n "$TIZEN_CLI_PATH" ] && [ -x "$TIZEN_CLI_PATH" ]; then
        log_success "Tizen CLI: $TIZEN_CLI_PATH"
    else
        log_warning "Tizen CLI가 설정되지 않았습니다. .wgt 패키징에 필요할 수 있습니다."
    fi
    
    # Samsung 인증 정보 확인
    if [ -n "$SAMSUNG_SELLER_ID" ] && [ -n "$SAMSUNG_ACCESS_TOKEN" ]; then
        log_success "Samsung 인증: 설정됨"
    else
        log_warning "Samsung 인증 정보가 없습니다. 업로드 시 설정이 필요합니다."
    fi
    
    echo ""
}

# 워치페이스 생성
generate_watchfaces() {
    log_info "워치페이스 생성 중..."
    
    cd "$PROJECT_DIR"
    
    if [ -n "$TEMPLATE" ]; then
        node src/generator.js generate --template "$TEMPLATE"
    else
        node src/galaxy-exporter.js generate "$COUNT"
    fi
    
    log_success "$COUNT개 워치페이스 생성 완료"
}

# Galaxy 포맷 변환
convert_to_galaxy() {
    log_info "Galaxy Watchface 포맷으로 변환 중..."
    
    cd "$PROJECT_DIR"
    
    if [ -n "$WATCHFACE_ID" ]; then
        node src/galaxy-exporter.js export "$WATCHFACE_ID"
    else
        node src/galaxy-exporter.js export
    fi
    
    log_success "변환 완료"
}

# 패키지 빌드
build_package() {
    log_info "워치페이스 패키지 빌드 중..."
    
    mkdir -p "$BUILD_DIR"
    
    # 워치페이스 디렉토리 찾기
    WATCHFACE_DIR=""
    if [ -n "$WATCHFACE_ID" ]; then
        WATCHFACE_DIR="$OUTPUT_DIR/galaxy-watchfaces/$WATCHFACE_ID"
    else
        # 최신 워치페이스
        WATCHFACE_DIR=$(find "$OUTPUT_DIR/galaxy-watchfaces" -mindepth 1 -maxdepth 1 -type d -printf '%T@ %p\n' 2>/dev/null | sort -n | tail -1 | cut -d' ' -f2-)
    fi
    
    if [ -z "$WATCHFACE_DIR" ] || [ ! -d "$WATCHFACE_DIR" ]; then
        log_error "워치페이스 디렉토리를 찾을 수 없습니다."
        exit 1
    fi
    
    PACKAGE_NAME=$(basename "$WATCHFACE_DIR")
    OUTPUT_FILE="$BUILD_DIR/$PACKAGE_NAME.wgt"
    
    # .wgt 파일 생성 (ZIP 형식)
    cd "$WATCHFACE_DIR"
    zip -r "$OUTPUT_FILE" . > /dev/null
    
    log_success "패키지 생성 완료: $OUTPUT_FILE"
    
    # 환경 변수로 출력 경로 저장
    export WGT_OUTPUT_PATH="$OUTPUT_FILE"
}

# Galaxy Store 업로드
upload_to_galaxy() {
    if [ "$DRY_RUN" = true ]; then
        log_warning "시뮬레이션 모드 - 실제 업로드 건너뜀"
        return
    fi
    
    log_info "Galaxy Store에 업로드 중..."
    
    if [ -z "$SAMSUNG_SELLER_ID" ] || [ -z "$SAMSUNG_ACCESS_TOKEN" ]; then
        log_warning "Samsung 인증 정보가 없습니다."
        echo ""
        echo "업로드를 완료하려면 다음 환경 변수를 설정하세요:"
        echo "  export SAMSUNG_SELLER_ID='your-seller-id'"
        echo "  export SAMSUNG_ACCESS_TOKEN='your-access-token'"
        echo ""
        echo "자세한 내용은 docs/GALAXY_STORE_SETUP.md를 참조하세요."
        echo ""
        log_warning "시뮬레이션 모드로 진행합니다..."
        return
    fi
    
    # Fastlane이 있으면 사용
    if command -v fastlane &> /dev/null && [ -d "$GALAXY_DIR" ]; then
        cd "$GALAXY_DIR"
        fastlane android upload_to_galaxy_store track:"$TRACK"
    else
        log_warning "Fastlane이 설치되지 않았습니다. 수동 업로드가 필요합니다."
        echo ""
        echo "다음 파일을 Samsung Seller Portal에 수동으로 업로드하세요:"
        echo "  $WGT_OUTPUT_PATH"
        echo ""
        echo "Seller Portal: https://seller.samsungapps.com/"
    fi
    
    log_success "업로드 완료"
}

# 전체 배포 파이프라인
deploy() {
    log_info "🚀 배포 파이프라인 시작..."
    echo ""
    
    check_environment
    
    # 1. 워치페이스 생성
    generate_watchfaces
    
    # 2. Galaxy 포맷 변환
    convert_to_galaxy
    
    # 3. 패키지 빌드
    build_package
    
    # 4. 업로드
    upload_to_galaxy
    
    echo ""
    log_success "✅ 배포 완료!"
}

# 배치 처리
batch_process() {
    log_info "🔄 배치 처리 시작..."
    
    check_environment
    
    # 모든 워치페이스 변환
    convert_to_galaxy
    
    # 각 워치페이스 빌드 및 업로드
    find "$OUTPUT_DIR/galaxy-watchfaces" -mindepth 1 -maxdepth 1 -type d | while read -r dir; do
        WATCHFACE_ID=$(basename "$dir")
        log_info "처리 중: $WATCHFACE_ID"
        
        export WATCHFACE_ID
        build_package
        upload_to_galaxy
    done
    
    log_success "✅ 배치 처리 완료!"
}

# 워치페이스 목록
list_watchfaces() {
    log_info "📱 사용 가능한 워치페이스 목록"
    echo ""
    
    cd "$PROJECT_DIR"
    node src/galaxy-exporter.js list
}

# 정리
clean() {
    log_info "🧹 빌드 아티팩트 정리 중..."
    
    rm -rf "$BUILD_DIR"
    
    log_success "정리 완료"
}

# 옵션 파싱
while [[ $# -gt 0 ]]; do
    case $1 in
        -c|--count)
            COUNT="$2"
            shift 2
            ;;
        -t|--template)
            TEMPLATE="$2"
            shift 2
            ;;
        -w|--watchface)
            WATCHFACE_ID="$2"
            shift 2
            ;;
        -r|--track)
            TRACK="$2"
            shift 2
            ;;
        -d|--dry-run)
            DRY_RUN=true
            shift
            ;;
        -h|--help)
            usage
            ;;
        deploy|generate|convert|build|upload|batch|list|clean|check)
            COMMAND="$1"
            shift
            ;;
        *)
            log_error "알 수 없는 옵션: $1"
            usage
            ;;
    esac
done

# 명령 실행
case ${COMMAND:-deploy} in
    deploy)
        deploy
        ;;
    generate)
        generate_watchfaces
        ;;
    convert)
        convert_to_galaxy
        ;;
    build)
        build_package
        ;;
    upload)
        upload_to_galaxy
        ;;
    batch)
        batch_process
        ;;
    list)
        list_watchfaces
        ;;
    clean)
        clean
        ;;
    check)
        check_environment
        ;;
    *)
        log_error "알 수 없는 명령: $COMMAND"
        usage
        ;;
esac
