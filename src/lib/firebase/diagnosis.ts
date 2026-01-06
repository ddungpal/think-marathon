import { 
  collection, 
  addDoc,
  updateDoc,
  doc,
  Timestamp,
  serverTimestamp 
} from 'firebase/firestore';
import { getFirestoreInstance } from './config';
import { DiagnoseRequest } from '@/types/api';
import { DiagnosisResult } from '@/types/output';

/**
 * 진단 입력 데이터와 결과를 Firestore에 저장
 */
export interface DiagnosisDocument {
  // 입력 데이터
  input: {
    name: string;
    age: number;
    job_type: string;
    career_years: number;
    monthly_income: number;
    net_worth: number;
  };
  // 진단 결과
  result?: {
    common_concerns: string;
    current_capabilities: string;
    learning_points: string;
  };
  // 메타데이터
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * 진단 입력 데이터를 Firestore에 저장
 * @param input 진단 입력 데이터
 * @returns 저장된 문서 ID
 */
export async function saveDiagnosisInput(input: DiagnoseRequest): Promise<string> {
  try {
    const db = getFirestoreInstance();
    const diagnosisCollection = collection(db, 'diagnoses');

    const diagnosisData: Omit<DiagnosisDocument, 'createdAt' | 'updatedAt'> & {
      createdAt: ReturnType<typeof serverTimestamp>;
      updatedAt: ReturnType<typeof serverTimestamp>;
    } = {
      input: {
        name: input.name,
        age: input.age,
        job_type: input.job_type,
        career_years: input.career_years,
        monthly_income: input.monthly_income,
        net_worth: input.net_worth,
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(diagnosisCollection, diagnosisData);
    
    console.log('진단 입력 데이터가 Firestore에 저장되었습니다:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Firestore 저장 실패:', error);
    throw new Error('진단 데이터 저장에 실패했습니다.');
  }
}

/**
 * 기존 진단 문서에 결과를 업데이트
 * @param docId 문서 ID
 * @param result 진단 결과
 */
export async function updateDiagnosisResult(
  docId: string,
  result: DiagnosisResult
): Promise<void> {
  try {
    const db = getFirestoreInstance();
    const docRef = doc(db, 'diagnoses', docId);

    await updateDoc(docRef, {
      result: {
        common_concerns: result.common_concerns,
        current_capabilities: result.current_capabilities,
        learning_points: result.learning_points,
      },
      updatedAt: serverTimestamp(),
    });

    console.log('진단 결과가 Firestore에 업데이트되었습니다:', docId);
  } catch (error) {
    console.error('Firestore 업데이트 실패:', error);
    throw new Error('진단 결과 업데이트에 실패했습니다.');
  }
}

/**
 * 진단 입력 데이터와 결과를 한 번에 저장 (편의 함수)
 * @param input 진단 입력 데이터
 * @param result 진단 결과
 * @returns 저장된 문서 ID
 */
export async function saveDiagnosisToFirestore(
  input: DiagnoseRequest,
  result?: DiagnosisResult
): Promise<string> {
  // 입력 데이터 저장
  const docId = await saveDiagnosisInput(input);
  
  // 결과가 있으면 업데이트
  if (result) {
    await updateDiagnosisResult(docId, result);
  }
  
  return docId;
}

