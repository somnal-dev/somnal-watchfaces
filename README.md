# Somnal Watchface Factory

🎨 SVG 기반 워치페이스 생성 및 갤럭시 스토어 배포 시스템

## 📱 개요

Somnal Watchface Factory는 다양한 스타일의 워치페이스를 자동으로 생성하고 Samsung Galaxy Store에 배포할 수 있는 시스템입니다.

### 주요 기능

- **SVG 워치페이스 생성**: 11개 템플릿, 6개 카테고리
- **Galaxy Watch 지원**: Wear OS / Tizen 호환
- **Fastlane 배포**: 자동화된 Galaxy Store 배포
- **REST API**: 워치페이스 생성 및 관리 API

## 🚀 빠른 시작

### 설치

```bash
git clone <repository-url>
cd somnal-watchfaces
npm install
```

### 서버 실행

```bash
npm start
# 또는 개발 모드
npm run dev
```

서버가 `http://localhost:3003`에서 실행됩니다.

### 샘플 워치페이스 생성

```bash
# 3개 샘플 생성
npm run galaxy:generate

# Galaxy 포맷으로 변환
npm run galaxy:export

# 목록 확인
npm run galaxy:list
```

## 📂 프로젝트 구조

```
somnal-watchfaces/
├── index.js                 # Express 서버
├── src/
│   ├── generator.js         # 워치페이스 생성 로직
│   ├── renderer.js          # SVG 렌더링 유틸리티
│   ├── galaxy-exporter.js   # Galaxy 포맷 변환
│   └── templates/           # 워치페이스 템플릿
│       ├── minimal.js
│       ├── neon.js
│       ├── digital.js
│       └── ...
├── galaxy-watchface/        # Galaxy Watchface 프로젝트
│   ├── app/
│   │   ├── index.html       # 워치페이스 HTML
│   │   ├── css/style.css    # 스타일
│   │   ├── js/main.js       # 워치페이스 로직
│   │   └── config.json      # 설정
│   ├── resources/
│   │   └── manifest.json    # Galaxy manifest
│   ├── Fastfile             # Fastlane 설정
│   ├── Appfile              # 앱 정보
│   └── Gemfile              # Ruby 의존성
├── scripts/
│   └── deploy.sh            # 배포 자동화 스크립트
├── docs/
│   └── GALAXY_STORE_SETUP.md # 배포 설정 가이드
├── data/watchfaces/         # 생성된 워치페이스 (SVG/JSON)
└── output/
    └── galaxy-watchfaces/   # Galaxy 포맷 변환 결과
```

## 🎨 워치페이스 템플릿

### 카테고리

| 카테고리 | 템플릿 | 설명 |
|---------|--------|------|
| Minimal | Minimal Clean | 심플하고 우아한 디자인 |
| Sport | Sport Active | 활동적인 스포츠 스타일 |
| Classic | Classic Analog | 클래식 아날로그 시계 |
| Digital | Neon Digital, Neon Glow | 사이버펑크 디지털 |
| Gradient | Gradient Flow | 그라데이션 디자인 |
| Artistic | Galaxy, Ocean, Forest, Sunset | 자연/우주 테마 |

### 템플릿 목록 조회

```bash
curl http://localhost:3003/api/templates
```

## 📡 API 엔드포인트

### 워치페이스 생성

```bash
POST /api/watchfaces/generate
Content-Type: application/json

{
  "templateId": "neon",
  "name": "My Custom Watchface",
  "colors": {
    "backgroundColor": "#000000",
    "primaryColor": "#00ffff"
  }
}
```

### 워치페이스 목록

```bash
GET /api/watchfaces
```

### 워치페이스 SVG 다운로드

```bash
GET /api/watchfaces/:id/download
```

### 템플릿 목록

```bash
GET /api/templates
GET /api/categories
```

## 📦 Galaxy Store 배포

### 사전 요구사항

1. Samsung Seller Portal 계정
2. Ruby 2.7+ (Fastlane용)
3. Tizen Studio (선택사항)

### 배포 설정

```bash
# 환경 변수 설정
export SAMSUNG_SELLER_ID="your-seller-id"
export SAMSUNG_ACCESS_TOKEN="your-access-token"
```

### 배포 명령어

```bash
# 전체 파이프라인 실행
./scripts/deploy.sh deploy -c 3

# 개별 단계 실행
./scripts/deploy.sh generate -c 3
./scripts/deploy.sh convert
./scripts/deploy.sh build
./scripts/deploy.sh upload

# 배치 처리
./scripts/deploy.sh batch
```

### Fastlane 사용

```bash
cd galaxy-watchface
bundle install
bundle exec fastlane android deploy
```

자세한 설정 방법은 [docs/GALAXY_STORE_SETUP.md](docs/GALAXY_STORE_SETUP.md)을 참조하세요.

## 🛠️ 개발

### 새 템플릿 추가

```javascript
// src/templates/my-template.js
const { createBaseSVG, drawMarkers, drawHands, CENTER } = require('../renderer');

module.exports = {
  id: 'my-template',
  name: 'My Template',
  category: 'custom',
  description: '내 커스텀 템플릿',
  
  generate(options = {}) {
    const { primaryColor = '#ffffff' } = options;
    // SVG 생성 로직
    const content = `...`;
    return createBaseSVG(content, { background: '#000000' });
  },
  
  defaultColors: {
    primaryColor: '#ffffff'
  }
};
```

### 테스트

```bash
npm test
```

## 📝 라이선스

MIT License

## 👤 작성자

somnal-dev

---

**Galaxy Watchface를 위한 Somnal Watchface Factory** 🎨⌚
