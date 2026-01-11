'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ResultDisplay } from '@/components/result/ResultDisplay';
import { DiagnosisResult, StageInfo } from '@/types/output';
import { DiagnoseRequest } from '@/types/api';

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [input, setInput] = useState<DiagnoseRequest | null>(null);
  const [stage, setStage] = useState<StageInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // sessionStorage에서 결과와 입력값 가져오기
    const storedResult = sessionStorage.getItem('diagnosisResult');
    const storedInput = sessionStorage.getItem('diagnosisInput');
    const storedStage = sessionStorage.getItem('diagnosisStage');

    if (!storedResult || !storedInput) {
      // 결과가 없으면 메인 페이지로 리다이렉트
      router.push('/');
      return;
    }

    try {
      setResult(JSON.parse(storedResult));
      setInput(JSON.parse(storedInput));
      if (storedStage) {
        setStage(JSON.parse(storedStage));
      }
    } catch (error) {
      console.error('Failed to parse stored data:', error);
      router.push('/');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">결과를 불러오는 중...</p>
        </div>
      </main>
    );
  }

  if (!result || !input) {
    return null;
  }

  return (
    <ResultDisplay result={result} input={input} stage={stage} />
  );
}

