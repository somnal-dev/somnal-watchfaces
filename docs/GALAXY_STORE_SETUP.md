# Galaxy Store 배포 설정 가이드

이 문서는 Somnal Watchface를 Samsung Galaxy Store에 배포하기 위한 설정 방법을 안내합니다.

## 📋 목차

1. [사전 요구사항](#사전-요구사항)
2. [Samsung Seller Office 가입](#samsung-seller-office-가입)
3. [개발자 인증서 발급](#개발자-인증서-발급)
4. [환경 설정](#환경-설정)
5. [Fastlane 설치](#fastlane-설치)
6. [첫 배포 절차](#첫-배포-절차)
7. [정기 배포 절차](#정기-배포-절차)
8. [문제 해결](#문제-해결)

---

## 사전 요구사항

### 필수 항목

- **Node.js** v18 이상
- **Ruby** 2.7 이상 (Fastlane용)
- **Bundler** (Ruby gem 관리)
- **Tizen Studio** (선택사항, .wgt 패키징용)

### 권장 항목

- **Git** 버전 관리용
- **PM2** 서버 실행용

---

## Samsung Seller Office 가입

### 1단계: 계정 생성

1. [Samsung Seller Portal](https://seller.samsungapps.com/) 접속
2. "Sign Up" 클릭
3. 개발자 유형 선택:
   - **Individual**: 개인 개발자
   - **Company**: 기업/법인
4. 필수 정보 입력:
   - 이메일 (인증 필요)
   - 비밀번호
   - 개발자/회사명
   - 연락처

### 2단계: 개발자 등록

1. 이메일 인증 완료
2. 개발자 프로필 작성
3. **개발자 등록비 결제** ($25 일회성)
4. 등록 승인 대기 (보통 1-3일)

### 3단계: Seller ID 확인

1. Seller Portal 로그인
2. **Settings** > **Account Info**
3. **Seller ID** 기록 (배포 시 필요)

---

## 개발자 인증서 발급

### Galaxy Watch용 인증서

Galaxy Watch 앱은 Tizen/Wear OS 기반이므로 인증서가 필요합니다.

### 1단계: 인증서 관리자 실행

1. Tizen Studio 실행
2. **Tools** > **Certificate Manager**
3. **+** 버튼 클릭

### 2단계: 인증서 생성

1. **Samsung** 선택
2. **Mobile/Wearable** 선택
3. **Create a new certificate profile** 선택
4. 프로필 이름 입력 (예: `somnal-watchface`)
5. **Create a new author certificate** 선택
6. 개발자 정보 입력:
   - Name: 개발자/회사명
   - Email: 등록된 이메일
   - Password: 인증서 비밀번호 (기억할 것!)
7. 인증서 파일 저장 위치 선택
8. **Finish**

### 3단계: Distributor 인증서

1. 동일한 프로필에서 **Distributor Certificate** 생성
2. **DUID** (Device Unique ID) 입력
   - 개발용 기기: 설정 > 기기 정보에서 확인
   - 테스트 기기가 없다면 스킵 가능
3. **Finish**

### 4단계: 인증서 백업

```bash
# 인증서 파일 백업
cp -r ~/TizenStudio-data/keystore/ ~/backup/somnal-certificates/

# Git에서 제외 (보안)
echo "*.p12" >> ~/.gitignore
```

⚠️ **중요**: 인증서 파일(.p12)은 절대 Git에 커밋하지 마세요!

---

## 환경 설정

### 환경 변수 설정

`.env` 파일 생성:

```bash
# Samsung Seller Portal
SAMSUNG_SELLER_ID="your-seller-id"
SAMSUNG_ACCESS_TOKEN="your-access-token"

# Tizen CLI (선택사항)
TIZEN_CLI_PATH="/opt/tizen-studio/tools/ide/bin/tizen"

# Galaxy Store API
GALAXY_STORE_API_URL="https://seller.samsungapps.com/api/v2"
```

### 액세스 토큰 발급

1. Samsung Seller Portal 로그인
2. **Settings** > **API Access**
3. **Generate New Token**
4. 토큰 복사 (한 번만 표시됨)
5. `.env` 파일에 추가

---

## Fastlane 설치

### 1단계: Ruby 설치

#### rbenv 사용 (권장)

```bash
# rbenv 설치
brew install rbenv  # macOS
# 또는
sudo apt install rbenv  # Ubuntu/Debian

# Ruby 설치
rbenv install 3.2.0
rbenv global 3.2.0

# 쉘 설정
echo 'eval "$(rbenv init -)"' >> ~/.bashrc
source ~/.bashrc
```

#### 시스템 Ruby 사용

```bash
# Ubuntu/Debian
sudo apt install ruby ruby-dev

# macOS (이미 설치됨)
ruby --version
```

### 2단계: Bundler 설치

```bash
gem install bundler
```

### 3단계: Fastlane 설치

```bash
cd /home/choi/.openclaw/workspace/somnal-watchfaces/galaxy-watchface

# 의존성 설치
bundle install
```

### 4단계: Fastlane 확인

```bash
bundle exec fastlane --version
```

---

## 첫 배포 절차

### 1단계: 워치페이스 생성

```bash
cd /home/choi/.openclaw/workspace/somnal-watchfaces

# 샘플 워치페이스 3개 생성
./scripts/deploy.sh generate -c 3
```

또는 특정 템플릿 사용:

```bash
./scripts/deploy.sh generate -t neon
./scripts/deploy.sh generate -t minimal
./scripts/deploy.sh generate -t galaxy
```

### 2단계: Galaxy 포맷으로 변환

```bash
./scripts/deploy.sh convert
```

### 3단계: 패키지 빌드

```bash
./scripts/deploy.sh build
```

### 4단계: 환경 확인

```bash
./scripts/deploy.sh check
```

출력 예시:
```
🔍 Checking Fastlane setup...

Ruby version: 3.2.0
Node.js: v22.22.2

Environment variables:
  SAMSUNG_SELLER_ID: ✓ Set
  SAMSUNG_ACCESS_TOKEN: ✓ Set
  Tizen CLI: ✓ Installed

✅ Ready for deployment
```

### 5단계: 업로드

#### 시뮬레이션 모드 (테스트)

```bash
./scripts/deploy.sh upload --dry-run
```

#### 실제 업로드

```bash
./scripts/deploy.sh upload
```

### 6단계: 전체 파이프라인 한 번에 실행

```bash
# 3개 워치페이스 생성 후 배포
./scripts/deploy.sh deploy -c 3

# 특정 템플릿 배포
./scripts/deploy.sh deploy -t neon

# 베타 트랙에 배포
./scripts/deploy.sh deploy -r beta
```

---

## 정기 배포 절차

### 자동화된 배포

매일/매주 정기적으로 새 워치페이스를 배포하려면:

#### Cron 설정

```bash
# crontab 편집
crontab -e

# 매일 오전 9시에 배포
0 9 * * * cd /home/choi/.openclaw/workspace/somnal-watchfaces && ./scripts/deploy.sh deploy -c 1

# 매주 월요일 오전 10시에 3개 배포
0 10 * * 1 cd /home/choi/.openclaw/workspace/somnal-watchfaces && ./scripts/deploy.sh deploy -c 3
```

#### n8n 웹훅 연동

n8n에서 배포를 트리거하려면:

1. n8n 워크플로우에 **HTTP Request** 노드 추가
2. URL 설정:
   ```
   http://your-server:3003/api/deploy/watchface
   ```
3. Method: `POST`
4. Body:
   ```json
   {
     "template": "neon",
     "count": 1,
     "track": "production"
   }
   ```

### Fastlane 직접 사용

```bash
cd /home/choi/.openclaw/workspace/somnal-watchfaces/galaxy-watchface

# 전체 배포
bundle exec fastlane android deploy

# 목록 확인
bundle exec fastlane android list_watchfaces

# 배치 업로드
bundle exec fastlane android batch_upload
```

---

## 문제 해결

### 인증 오류

```
Error: Authentication failed
```

**해결방법:**
1. Seller ID와 Access Token 확인
2. 토큰 만료 여부 확인 (Seller Portal에서 재발급)
3. `.env` 파일이 올바른 위치에 있는지 확인

### Tizen CLI 오류

```
Error: Tizen CLI not found
```

**해결방법:**
```bash
# Tizen Studio 설치
# https://developer.tizen.org/development/tizen-studio/download

# 환경 변수 설정
export TIZEN_CLI_PATH="/opt/tizen-studio/tools/ide/bin/tizen"
```

### Ruby 버전 오류

```
Error: Ruby version 2.7+ required
```

**해결방법:**
```bash
# rbenv로 최신 Ruby 설치
rbenv install 3.2.0
rbenv global 3.2.0

# 확인
ruby --version
```

### 패키지 빌드 오류

```
Error: Failed to create .wgt package
```

**해결방법:**
1. `zip` 명령어로 수동 패키징:
   ```bash
   cd output/galaxy-watchfaces/<watchface-id>
   zip -r ../../../build/<watchface-id>.wgt .
   ```
2. Seller Portal에서 수동 업로드

---

## 📚 참고 자료

- [Samsung Seller Portal](https://seller.samsungapps.com/)
- [Tizen Studio 다운로드](https://developer.tizen.org/development/tizen-studio/download)
- [Fastlane 문서](https://docs.fastlane.tools/)
- [Galaxy Watch 개발 가이드](https://developer.samsung.com/galaxy-watch)

---

## 🆘 지원

문제가 지속되면 다음을 확인하세요:

1. 이 문서의 문제 해결 섹션
2. 프로젝트 `README.md`
3. Samsung Developer 포럼

---

**마지막 업데이트**: 2026-03-26
**버전**: 1.0.0
