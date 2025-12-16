# [프로젝트 제목]

> **배포 URL**: https://soccer-field-front.vercel.app/
> **테스트 계정**: EMAIL: `test@test.com` / PW: `test1234`

## 📌 프로젝트 소개

⚽ 축구 경기장 리뷰 커뮤니티 서비스

축구 경기장의 잔디 상태는 선수의 퍼포먼스와 부상 위험에 큰 영향을 줍니다.
같은 인조잔디·천연잔디라도 잔디 길이, 경도, 관리 상태에 따라 체감은 완전히 다르며, 이에 따라 적합한 축구화(AG, FG, MG, TF) 또한 달라집니다.

하지만 현재 대부분의 구장 정보는 단순히 ‘인조/천연’ 정도만 제공되어, 선수들은 실제 잔디 상태를 알지 못한 채 경기에 나서고 있습니다. 이로 인해 미끄러짐, 접지력 부족, 발목·무릎 부상 같은 문제가 자주 발생합니다.
저 역시 선수 생활 중 잔디 정보를 알지 못해 부적절한 축구화를 착용했고, 경기 중 미끄러져 실점까지 이어진 경험이 있습니다. 이 경험을 통해 구장에 대한 사전 정보의 필요성을 느끼게 되었습니다.

이 서비스는 축구인들이 직접 구장을 방문한 후 잔디 상태, 시설, 추천 축구화 등을 리뷰로 남기고 공유하는 커뮤니티입니다.
사용자는 해당 정보를 바탕으로 경기에 대비할 수 있으며, 더 나은 퍼포먼스와 부상 예방을 기대할 수 있습니다.

구장을 알면, 경기가 달라집니다.

- **개발 기간**: 2025.12.01 ~ 2024.12.16
- **개발 인원**: 1인 (개인 프로젝트)

---

## 🔍 개선 사항

### 기존 코드의 문제점

| 문제점                                       | 개선 방법                               |
|-------------------------------------------|-------------------------------------|
| 댓글 구현 코드중 service 부분에 도메인과 애플리케이션 경계가 불명확 | DomainService를 통해 애플리케이션과 도메인 계층 분리 |

### 개선 결과

**[개선 1: 예: 전역 예외 처리]**

- **개선 전**: Service 코드에 도메인과 애플리케이션 계층 경계가 불명확
- **개선 후**: Domain Service로 도메인 로직을 구분하여 계층별 구분 명확

---

## ✨ 주요 기능

### 1. 사용자 인증
- 회원가입 / 로그인 / 로그아웃
- JWT 토큰 기반 인증
- Spring Security를 통한 인증/인가 처리

### 2. 축구장 관리
- 축구장 등록 요청 (사용자)
- 축구장 목록 조회 및 상세 정보 확인
- 축구장 검색 (키워드 기반)
- Google Maps를 통한 위치 정보 표시
- 축구장 승인 관리 (관리자)

### 3. 리뷰 관리
- 축구장 리뷰 작성/수정/삭제
- 리뷰 목록 조회 (커서 기반 무한 스크롤)
- 잔디 상태, 추천 축구화, 평점 정보 포함
- 축구화 구매 링크 제공

### 4. 댓글 기능
- 리뷰에 대한 댓글 작성/수정/삭제
- 댓글 목록 조회
- 계층형 댓글 구조

### 5. 관리자 기능
- 승인 대기 중인 축구장 관리
- 축구장 등록 요청 승인/거부

---

## 🛠️ 기술 스택

### Backend
- Java 17
- Spring Boot 4.0.0
- Spring Data JPA
- Spring Security + JWT (JJWT 0.11.5)
- Spring Validation
- MySQL 8.0
- Lombok
- Swagger/OpenAPI (SpringDoc)

### Frontend
- React 19.2.0
- TypeScript 5.9.3
- Vite 7.2.4
- React Router DOM 7.9.6
- Google Maps API (@react-google-maps/api)
- Leaflet (지도 라이브러리)
- Lucide React (아이콘)

### Development Tools
- Git & GitHub
- IntelliJ IDEA / VS Code

---

## 📂 프로젝트 구조

### Backend
```
back/
├── src/main/java/com/community/back/
│   ├── domain/
│   │   ├── auth/                    # 인증 도메인
│   │   │   ├── application/         # AuthService
│   │   │   ├── domain/              # User, Role, UserRepository
│   │   │   └── presentation/        # AuthController, DTO
│   │   ├── field/                   # 축구장 도메인
│   │   │   ├── application/         # FieldService, GeocodingService
│   │   │   ├── domain/              # Field, FieldStatus, FieldRepository
│   │   │   └── presentation/        # FieldController, DTO
│   │   ├── review/                  # 리뷰 도메인
│   │   │   ├── application/         # ReviewService
│   │   │   ├── domain/              # Review, ReviewRepository
│   │   │   └── presentation/        # ReviewController, DTO
│   │   ├── comment/                 # 댓글 도메인
│   │   │   ├── application/         # CommentService
│   │   │   ├── domain/              # Comment, CommentRepository, CommentDomainService
│   │   │   └── presentation/        # CommentController, DTO
│   │   └── global/                  # 전역 설정
│   │       ├── config/              # Spring 설정
│   │       ├── exception/           # 전역 예외 처리
│   │       └── security/            # Security, JWT 설정
│   └── resources/
│       └── application.yml
└── build.gradle
```

### Frontend
```
front/
├── src/
│   ├── api/                         # API 클라이언트
│   │   ├── authApi.ts
│   │   ├── fieldApi.ts
│   │   ├── reviewApi.ts
│   │   ├── commentApi.ts
│   │   └── client.ts
│   ├── components/                  # 재사용 컴포넌트
│   │   ├── Navbar.tsx
│   │   ├── FieldSidebar.tsx
│   │   ├── ReviewList.tsx
│   │   ├── ReviewModal.tsx
│   │   ├── ReviewComments.tsx
│   │   ├── AddFieldModal.tsx
│   │   └── ProtectedRoute.tsx
│   ├── contexts/                    # Context API
│   │   └── AuthContext.tsx
│   ├── pages/                       # 페이지 컴포넌트
│   │   ├── HomePage.tsx
│   │   ├── AuthPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── SignupPage.tsx
│   │   ├── FieldPage.tsx
│   │   └── AdminPage.tsx
│   ├── types/                       # TypeScript 타입 정의
│   ├── styles/                      # 스타일 파일
│   ├── App.tsx
│   └── main.tsx
└── package.json
```


---

## 🔗 API 명세

### 인증

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/signup` | 회원가입 |
| POST | `/auth/login` | 로그인 |
| POST | `/auth/logout` | 로그아웃 |

### 축구장

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/fields` | 축구장 목록 조회 |
| GET | `/fields/pending` | 승인 대기 중인 축구장 목록 조회 (관리자) |
| GET | `/fields/{id}` | 축구장 상세 조회 |
| GET | `/fields/search?keyword={keyword}` | 축구장 검색 |
| POST | `/fields` | 축구장 등록 요청 |
| PATCH | `/fields/{id}/approve` | 축구장 승인 (관리자) |

### 리뷰

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/fields/{fieldId}/reviews?lastId={lastId}` | 리뷰 목록 조회 (커서 기반 페이징) |
| POST | `/fields/{fieldId}/reviews` | 리뷰 작성 |
| PUT | `/reviews/{reviewId}` | 리뷰 수정 |
| DELETE | `/reviews/{reviewId}` | 리뷰 삭제 |

### 댓글

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/reviews/{reviewId}/comments` | 댓글 목록 조회 |
| POST | `/reviews/{reviewId}/comments` | 댓글 작성 |
| PUT | `/comments/{commentId}` | 댓글 수정 |
| DELETE | `/comments/{commentId}` | 댓글 삭제 |

---

## 💻 로컬 실행 방법

### 1. 레포지토리 클론
```bash
git clone https://github.com/Soccer-Field/Soccer-Field-Back
cd your-repo

### 2. 백엔드 실행
```bash

# .env 설정
# DB 설정
DB_URL=jdbc:mysql://localhost:3306/soccer_field
DB_USERNAME=root
DB_PASSWORD=root

# 🔐 JWT 설정
JWT_SECRET=YOUR-SECRET-KEY
JWT_ACCESS_TOKEN_MS=1800000
JWT_REFRESH_TOKEN_MS=1209600000

# 🗺️ Google Maps API (선택사항)
GOOGLE_MAPS_API_KEY=YOUR-API-KEY

./gradlew bootRun
```

### 3. 프론트엔드 실행
```bash
cd /front
npm install

# .env 파일에 환경 변수 설정
# VITE_API_BASE_URL=http://localhost:8080

npm run dev
```

프론트엔드는 기본적으로 http://localhost:5173 에서 실행됩니다.
---

## 🎥 시연 영상

https://youtu.be/R6pnmo-_x4Y

---