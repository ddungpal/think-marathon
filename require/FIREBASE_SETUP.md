# Firebase 설정 가이드

이 문서는 Firebase를 사용하여 진단 데이터를 저장하는 방법을 설명합니다.

## 📋 사전 준비

1. Firebase 프로젝트가 이미 생성되어 있습니다 (`think-marathon`)
2. Firebase SDK가 설치되어 있습니다 (`package.json`에 포함)

## 1단계: 환경 변수 설정

### `.env.local` 파일 생성

프로젝트 루트 디렉토리에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyA4Cb5SDOQqi8IF6ikQaQPrCbdSQ_Lbfe8
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=think-marathon.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=think-marathon
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=think-marathon.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=550015102782
NEXT_PUBLIC_FIREBASE_APP_ID=1:550015102782:web:13afe71578788a5ac4866f
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-3FQ05ZY981
```

### 중요 사항

- `.env.local` 파일은 `.gitignore`에 포함되어 있어 Git에 커밋되지 않습니다.
- `NEXT_PUBLIC_` 접두사가 붙은 환경 변수만 클라이언트 사이드에서 접근 가능합니다.
- 서버를 재시작해야 환경 변수 변경사항이 적용됩니다.

## 2단계: Firestore 데이터베이스 설정

### Firestore 데이터베이스 생성

1. [Firebase Console](https://console.firebase.google.com/)에 접속
2. `think-marathon` 프로젝트 선택
3. 왼쪽 메뉴에서 **"Firestore Database"** 클릭
4. **"데이터베이스 만들기"** 클릭
5. **"프로덕션 모드에서 시작"** 또는 **"테스트 모드에서 시작"** 선택
   - 테스트 모드: 개발 중에는 테스트 모드로 시작 (30일 후 자동 만료)
   - 프로덕션 모드: 보안 규칙을 설정해야 함

### 보안 규칙 설정 (프로덕션 모드)

프로덕션 모드인 경우, Firestore 보안 규칙을 설정해야 합니다:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // diagnoses 컬렉션에 대한 규칙
    match /diagnoses/{document=**} {
      // 읽기: 인증된 사용자만 가능 (또는 모든 사용자 허용)
      allow read: if request.auth != null; // 또는 allow read: if true;
      
      // 쓰기: 모든 사용자 허용 (개발 단계)
      // 프로덕션에서는 더 엄격한 규칙 적용 권장
      allow create: if true;
      allow update: if true;
    }
  }
}
```

## 3단계: 구현 내용

### 생성된 파일

1. **`src/lib/firebase/config.ts`**
   - Firebase 앱 초기화
   - Firestore 인스턴스 관리
   - Analytics 초기화 (선택사항)

2. **`src/lib/firebase/diagnosis.ts`**
   - `saveDiagnosisInput()`: 진단 입력 데이터 저장
   - `updateDiagnosisResult()`: 진단 결과 업데이트
   - `saveDiagnosisToFirestore()`: 입력과 결과를 한 번에 저장

3. **`src/components/form/DiagnosisForm.tsx`** (수정됨)
   - 진단 시작 버튼 클릭 시:
     1. 입력 데이터를 Firestore에 저장
     2. 진단 API 호출
     3. 진단 결과를 Firestore에 업데이트

### 데이터 구조

Firestore에 저장되는 데이터 구조:

```typescript
{
  input: {
    name: string;
    age: number;
    job_type: string;
    career_years: number;
    monthly_income: number;
    net_worth: number;
  },
  result?: {
    common_concerns: string;
    current_capabilities: string;
    learning_points: string;
  },
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

## 4단계: 테스트

### 로컬 개발 서버 실행

```bash
npm run dev
```

### 테스트 방법

1. 브라우저에서 `http://localhost:3000` 접속
2. 진단 폼에 데이터 입력
3. **"진단 시작하기"** 버튼 클릭
4. 브라우저 콘솔에서 다음 메시지 확인:
   - `진단 입력 데이터 저장 완료: [문서ID]`
   - `진단 결과 업데이트 완료: [문서ID]`
5. Firebase Console → Firestore Database에서 데이터 확인

## 5단계: 배포 환경 설정

### Netlify 환경 변수 설정

1. Netlify 대시보드 → **"Site settings"** → **"Environment variables"**
2. 다음 환경 변수 추가:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | `AIzaSyA4Cb5SDOQqi8IF6ikQaQPrCbdSQ_Lbfe8` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `think-marathon.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `think-marathon` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `think-marathon.firebasestorage.app` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `550015102782` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | `1:550015102782:web:13afe71578788a5ac4866f` |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | `G-3FQ05ZY981` |

3. **"Save"** 클릭
4. 재배포 실행

## 🔒 보안 고려사항

### 현재 구현

- Firebase 저장 실패 시에도 진단은 계속 진행됩니다 (사용자 경험 우선)
- 모든 사용자가 데이터를 읽고 쓸 수 있습니다 (개발 단계)

### 프로덕션 권장사항

1. **Firestore 보안 규칙 강화**
   - 인증된 사용자만 읽기/쓰기 허용
   - 또는 특정 조건에 따라 접근 제한

2. **데이터 암호화**
   - 민감한 정보(이름 등)는 암호화하여 저장 고려

3. **접근 로그 모니터링**
   - Firebase Console에서 접근 로그 확인

## 📊 데이터 조회

### Firebase Console에서 조회

1. Firebase Console → Firestore Database
2. `diagnoses` 컬렉션 선택
3. 저장된 문서 확인

### 프로그래밍 방식으로 조회 (향후 추가 가능)

```typescript
import { collection, getDocs } from 'firebase/firestore';
import { getFirestoreInstance } from '@/lib/firebase/config';

const db = getFirestoreInstance();
const querySnapshot = await getDocs(collection(db, 'diagnoses'));
querySnapshot.forEach((doc) => {
  console.log(doc.id, ' => ', doc.data());
});
```

## 🐛 문제 해결

### 환경 변수가 로드되지 않는 경우

1. `.env.local` 파일이 프로젝트 루트에 있는지 확인
2. 환경 변수 이름이 `NEXT_PUBLIC_`로 시작하는지 확인
3. 개발 서버 재시작 (`npm run dev`)

### Firestore 저장 실패

1. Firebase Console에서 Firestore가 활성화되어 있는지 확인
2. 보안 규칙이 올바르게 설정되어 있는지 확인
3. 브라우저 콘솔에서 에러 메시지 확인

### 타입 에러

1. `npm install` 실행하여 의존성 확인
2. TypeScript 서버 재시작 (VS Code: `Cmd+Shift+P` → "TypeScript: Restart TS Server")

## 📝 참고 자료

- [Firebase 공식 문서](https://firebase.google.com/docs)
- [Firestore 보안 규칙](https://firebase.google.com/docs/firestore/security/get-started)
- [Next.js 환경 변수](https://nextjs.org/docs/basic-features/environment-variables)

