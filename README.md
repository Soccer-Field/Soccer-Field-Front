# ⚽ 필드파인더 (Field Finder)

축구장 잔디 상태를 미리 확인하고 최적의 축구화를 선택할 수 있는 커뮤니티 플랫폼

## 📖 프로젝트 소개

필드파인더는 축구인들이 각 축구장의 잔디 상태에 대한 정보를 공유하고, 해당 구장에 적합한 축구화를 추천받을 수 있는 서비스입니다.

### 주요 기능

- 🗺️ **지도 기반 축구장 검색**: Leaflet을 사용한 인터랙티브 지도에서 축구장 위치 확인
- 👟 **축구화 추천**: 잔디 타입(AG, FG, MG, TF)에 따른 최적의 축구화 추천
- ⭐ **리뷰 시스템**: 실제 경험을 바탕으로 한 잔디 상태 평가 및 리뷰 작성
- 📊 **통계 정보**: 커뮤니티 평가를 기반으로 한 평균 평점 및 잔디 상태 분석

## 🏃 프로젝트 배경

축구 선수들은 경기나 훈련 전에 구장의 잔디 상태를 알지 못해 다음과 같은 문제를 겪습니다:

1. **부적절한 축구화 선택**: 인조잔디라고 명시되어 있어도 실제 상태가 다른 경우가 많음
2. **부상 위험**: 잘못된 축구화 착용으로 인한 발목, 무릎 부상
3. **퍼포먼스 저하**: 잔디에 맞지 않는 스터드로 인한 미끄러짐

필드파인더는 이러한 문제를 해결하기 위해 커뮤니티 기반의 정보 공유 플랫폼을 제공합니다.

## 🛠️ 기술 스택

- **Frontend Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **Map Library**: Leaflet + React-Leaflet
- **Icons**: Lucide React
- **Styling**: CSS3 (CSS Variables)

## 🚀 시작하기

### 필수 요구사항

- Node.js 18.x 이상
- npm 또는 yarn

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 프리뷰
npm run preview
```

개발 서버는 기본적으로 [http://localhost:5173](http://localhost:5173)에서 실행됩니다.

## 📁 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 컴포넌트
│   ├── Navbar.tsx      # 네비게이션 바
│   ├── FieldSidebar.tsx # 축구장 정보 사이드바
│   └── ReviewModal.tsx  # 리뷰 작성 모달
├── pages/              # 페이지 컴포넌트
│   ├── HomePage.tsx    # 홈 페이지
│   └── FieldPage.tsx   # 축구장 지도 페이지
├── types/              # TypeScript 타입 정의
│   └── index.ts
└── App.tsx             # 메인 앱 컴포넌트
```

## 🎨 잔디 타입 가이드

| 타입 | 설명 | 추천 구장 |
|------|------|-----------|
| **AG** | 인조잔디용 | 인조잔디 구장 |
| **FG** | 천연잔디용 | 천연 잔디 구장 |
| **MG** | 맨땅용 | 딱딱한 인조잔디, 맨땅 |
| **TF** | 풋살용 | 실내, 짧은 인조잔디 |

## 🤝 기여하기

프로젝트 개선을 위한 기여를 환영합니다!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 향후 계획

- [ ] 실제 축구장 데이터베이스 연동
- [ ] 사용자 인증 시스템
- [ ] 이미지 업로드 기능
- [ ] 축구장 등록 요청 기능
- [ ] 검색 및 필터링 고도화
- [ ] 모바일 앱 개발

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 👨‍💻 개발자

프로축구 선수 경험을 바탕으로 개발된 프로젝트입니다.

---

**필드파인더**로 더 안전하고 즐거운 축구 경험을 만들어가세요! ⚽
