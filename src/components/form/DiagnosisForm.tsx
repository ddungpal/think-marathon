'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z, ZodTypeAny } from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { NameInput } from './NameInput';
import { AgeInput } from './AgeInput';
import { JobTypeSelect } from './JobTypeSelect';
import { CareerYearsInput } from './CareerYearsInput';
import { IncomeInput } from './IncomeInput';
import { AssetInput } from './AssetInput';
import { callDiagnoseAPI } from '@/lib/api/diagnose';
import { DiagnoseRequest } from '@/types/api';
import { saveDiagnosisInput, updateDiagnosisResult } from '@/lib/firebase/diagnosis';

// 숫자 필드를 위한 커스텀 스키마 (간단하고 확실한 방법)
const numberSchema = (fieldName: string, min: number = 0, max?: number): ZodTypeAny => {
  // preprocess로 문자열을 숫자로 변환
  const preprocessedSchema = z.preprocess(
    (val) => {
      // 빈 값 처리
      if (val === '' || val === null || val === undefined) {
        return undefined; // undefined를 반환하면 required_error가 발생
      }
      // 문자열을 숫자로 변환
      if (typeof val === 'string') {
        const num = Number(val);
        return isNaN(num) ? undefined : num;
      }
      // 이미 숫자면 그대로 반환
      return typeof val === 'number' ? val : undefined;
    },
    z.number({
      required_error: `${fieldName}을(를) 입력해주세요.`,
      invalid_type_error: `${fieldName}은(는) 숫자여야 합니다.`,
    })
  );

  // min과 max 검증을 refine으로 추가 (타입 안정성 확보)
  let schema: ZodTypeAny = preprocessedSchema.refine(
    (val) => val >= min,
    { message: `${fieldName}은(는) ${min} 이상이어야 합니다.` }
  );

  // max 값이 있으면 추가 refine
  if (max !== undefined) {
    schema = schema.refine(
      (val) => val <= max,
      { message: `${fieldName}은(는) ${max} 이하여야 합니다.` }
    );
  }

  return schema;
};

const diagnosisSchema = z.object({
  name: z
    .string({
      required_error: '이름을 입력해주세요.',
    })
    .min(1, '이름을 입력해주세요.')
    .trim(),
  age: numberSchema('나이', 0, 70),
  job_type: z
    .string({
      required_error: '직업을 선택해주세요.',
    })
    .min(1, '직업을 선택해주세요.')
    .refine(
      (val) => val === '직장인' || val === '프리랜서/사업자',
      { message: '직업을 선택해주세요.' }
    ),
  career_years: numberSchema('연차', 0, 30),
  monthly_income: numberSchema('월평균소득', 0),
  net_worth: numberSchema('순자산', 0),
});

export const DiagnosisForm: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DiagnoseRequest>({
    resolver: zodResolver(diagnosisSchema),
    mode: 'onChange', // 실시간 검증
  });

  const onSubmit = async (data: DiagnoseRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. 진단 입력 데이터를 Firestore에 저장 (결과는 나중에 업데이트)
      let diagnosisDocId: string | null = null;
      try {
        diagnosisDocId = await saveDiagnosisInput(data);
        console.log('진단 입력 데이터 저장 완료:', diagnosisDocId);
      } catch (firebaseError) {
        // Firebase 저장 실패해도 진단은 계속 진행
        console.warn('Firebase 저장 실패 (진단 계속 진행):', firebaseError);
      }

      // 2. 진단 API 호출
      const response = await callDiagnoseAPI(data);
      
      if (response.success && response.data) {
        // 3. 진단 결과도 Firestore에 업데이트 (문서 ID가 있는 경우)
        if (diagnosisDocId) {
          try {
            await updateDiagnosisResult(diagnosisDocId, response.data);
            console.log('진단 결과 업데이트 완료:', diagnosisDocId);
          } catch (firebaseError) {
            // 결과 업데이트 실패해도 계속 진행
            console.warn('Firebase 결과 업데이트 실패 (계속 진행):', firebaseError);
          }
        }

        // 4. 결과를 sessionStorage에 저장하고 결과 페이지로 이동
        sessionStorage.setItem('diagnosisResult', JSON.stringify(response.data));
        sessionStorage.setItem('diagnosisInput', JSON.stringify(data));
        router.push('/result');
      } else {
        setError(response.error?.message || '진단에 실패했습니다.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto">
      <div className="space-y-4">
        <NameInput register={register} error={errors.name} />
        <AgeInput register={register} error={errors.age} />
        <JobTypeSelect register={register} error={errors.job_type} />
        <CareerYearsInput register={register} error={errors.career_years} />
        <IncomeInput register={register} error={errors.monthly_income} />
        <AssetInput register={register} error={errors.net_worth} />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex justify-center">
        <Button type="submit" isLoading={isLoading} size="large" className="w-full sm:w-auto min-w-[200px]">
          진단 시작하기
        </Button>
      </div>
    </form>
  );
};

