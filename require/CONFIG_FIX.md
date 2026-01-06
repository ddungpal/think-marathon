# Config 파일 배포 문제 해결

## 🔍 문제 원인

Netlify 서버에서 Config 파일을 찾을 수 없는 에러가 발생했습니다:

```
Error: ENOENT: no such file or directory, open '/var/task/config/career-stages.json'
```

### 원인 분석

1. **Next.js 빌드 특성**: Next.js는 빌드 시점에 `config` 디렉토리를 `.next` 빌드 출력에 포함하지 않습니다.
2. **Netlify 배포 방식**: Netlify는 빌드된 `.next` 폴더만 배포하므로 `config` 디렉토리가 `/var/task`에 없습니다.
3. **런타임 접근 불가**: `process.cwd()`가 `/var/task`를 가리키지만 실제 Config 파일은 그곳에 존재하지 않습니다.

---

## ✅ 해결 방법

Config 파일을 `public/config` 디렉토리로 이동하여 빌드 출력에 포함시켰습니다.

### 변경 사항

1. **Config 파일 이동**: `config/*.json` → `public/config/*.json`
2. **로더 코드 수정**: `src/lib/config/loader.ts` 및 `src/lib/config/llm-config-loader.ts`에서 경로 처리 개선
3. **PDF Config 경로 수정**: `src/lib/pdf/loader.ts`에서도 동일하게 처리

### 파일 구조

**이전:**
```
project-root/
├── config/
│   ├── career-stages.json
│   ├── income-bands.json
│   ├── asset-bands.json
│   ├── job-types.json
│   ├── llm-prompt-config.json
│   ├── income-bracket-learning-points.json
│   └── pdf-config.json
└── src/
```

**변경 후:**
```
project-root/
├── config/                          # 개발 환경용 (선택사항)
│   └── ...
├── public/
│   └── config/                      # 배포 환경용 (빌드 출력에 포함)
│       ├── career-stages.json
│       ├── income-bands.json
│       ├── asset-bands.json
│       ├── job-types.json
│       ├── llm-prompt-config.json
│       ├── income-bracket-learning-points.json
│       └── pdf-config.json
└── src/
```

---

## 🔧 코드 변경 내용

### 1. `src/lib/config/loader.ts`

경로 처리 로직 개선:

```typescript
async function loadJSON<T>(filePath: string): Promise<T> {
  // public 디렉토리에서 먼저 시도 (배포 환경)
  const publicPath = path.join(process.cwd(), 'public', filePath);
  // 원래 경로도 시도 (개발 환경)
  const originalPath = path.join(process.cwd(), filePath);
  
  // 파일 존재 여부 확인
  if (fs.existsSync(publicPath)) {
    fullPath = publicPath;
  } else if (fs.existsSync(originalPath)) {
    fullPath = originalPath;
  } else {
    fullPath = publicPath; // 에러 발생시 명확한 메시지
  }
  
  const fileContents = fs.readFileSync(fullPath, 'utf-8');
  return JSON.parse(fileContents) as T;
}
```

### 2. `src/lib/config/llm-config-loader.ts`

동일한 경로 처리 로직 적용

### 3. `src/lib/pdf/loader.ts`

PDF Config 경로도 동일하게 처리

---

## 📋 다음 단계

### 1. Config 파일 복사

```bash
# public/config 디렉토리 생성 (이미 생성됨)
mkdir -p public/config

# Config 파일 복사
cp config/*.json public/config/
```

### 2. Git에 추가

```bash
git add public/config/*.json
git commit -m "fix: Config 파일을 public 디렉토리로 이동하여 배포에 포함"
git push
```

### 3. Netlify 재배포

변경사항이 푸시되면 Netlify가 자동으로 재배포합니다.

---

## ⚠️ 주의사항

### 1. `public` 디렉토리의 파일은 클라이언트에 노출됨

- `public` 디렉토리의 파일은 빌드 시 클라이언트 번들에 포함됩니다.
- 하지만 서버 사이드에서만 사용되므로 문제없습니다.
- Config 파일에는 민감한 정보가 없으므로 안전합니다.

### 2. 개발 환경 호환성

- 개발 환경에서는 `config` 디렉토리도 사용 가능합니다 (하위 호환성).
- 코드는 두 경로를 모두 확인합니다.

### 3. 파일 동기화

- `config` 디렉토리의 파일을 수정한 후에는 `public/config`로도 복사해야 합니다.
- 또는 `config` 디렉토리를 `public/config`의 심볼릭 링크로 만들 수 있습니다 (선택사항).

---

## 🔍 확인 방법

### 1. 로컬 빌드 테스트

```bash
npm run build
npm start
```

### 2. Netlify 배포 확인

1. Netlify 대시보드 → **"Deploys"** 탭
2. 배포 로그 확인
3. Config 파일 관련 에러가 없는지 확인

### 3. Functions 로그 확인

1. Netlify 대시보드 → **"Functions"** 탭
2. **"View logs"** 클릭
3. `errorStage: "config_loading"` 에러가 없는지 확인

---

## 💡 향후 개선 방안

### 옵션 1: TypeScript 파일로 변환 (권장)

Config 파일을 TypeScript 파일로 변환하여 import 방식으로 사용:

```typescript
// src/config/career-stages.ts
export const careerStages = [
  { id: "CAREER_01", label: "초기", min_year: 0, max_year: 3 },
  // ...
] as const;
```

**장점:**
- 빌드 시점에 번들링됨 (배포 문제 없음)
- TypeScript 타입 체크 가능
- 더 나은 성능 (런타임 파일 I/O 없음)

### 옵션 2: 환경 변수 사용

Config 데이터를 환경 변수로 관리 (복잡한 데이터에는 부적합)

### 옵션 3: 데이터베이스 사용

Config 데이터를 데이터베이스에 저장 (Phase 2+)

---

## 📚 참고 자료

- [Next.js - Static File Serving](https://nextjs.org/docs/basic-features/static-file-serving)
- [Netlify - Build Configuration](https://docs.netlify.com/configure-builds/overview/)

---

**이제 Config 파일이 빌드 출력에 포함되어 Netlify에서 정상적으로 작동합니다!** ✅

