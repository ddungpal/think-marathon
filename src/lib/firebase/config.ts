import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAnalytics, Analytics } from 'firebase/analytics';

// Firebase 설정 타입
interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

// 환경 변수에서 Firebase 설정 가져오기
const getFirebaseConfig = (): FirebaseConfig => {
  const config: FirebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
  };

  // measurementId는 선택사항
  if (process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID) {
    config.measurementId = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID;
  }

  // 필수 값 검증
  const requiredKeys: (keyof FirebaseConfig)[] = [
    'apiKey',
    'authDomain',
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId',
  ];

  for (const key of requiredKeys) {
    if (!config[key]) {
      throw new Error(`Firebase ${key} is not set. Please check your .env.local file.`);
    }
  }

  return config;
};

// Firebase 앱 초기화 (싱글톤 패턴)
let app: FirebaseApp | null = null;
let firestore: Firestore | null = null;
let analytics: Analytics | null = null;

export const getFirebaseApp = (): FirebaseApp => {
  if (app) {
    return app;
  }

  // 이미 초기화된 앱이 있는지 확인
  const existingApps = getApps();
  if (existingApps.length > 0) {
    app = existingApps[0];
    return app;
  }

  // 새 앱 초기화
  const config = getFirebaseConfig();
  app = initializeApp(config);
  return app;
};

export const getFirestoreInstance = (): Firestore => {
  if (firestore) {
    return firestore;
  }

  const firebaseApp = getFirebaseApp();
  firestore = getFirestore(firebaseApp);
  return firestore;
};

export const getAnalyticsInstance = (): Analytics | null => {
  // Analytics는 클라이언트 사이드에서만 사용 가능
  if (typeof window === 'undefined') {
    return null;
  }

  if (analytics) {
    return analytics;
  }

  try {
    const firebaseApp = getFirebaseApp();
    analytics = getAnalytics(firebaseApp);
    return analytics;
  } catch (error) {
    console.warn('Firebase Analytics 초기화 실패:', error);
    return null;
  }
};

