'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ResultDisplay } from '@/components/result/ResultDisplay';
import { DiagnosisResult } from '@/types/output';
import { DiagnoseRequest } from '@/types/api';

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [input, setInput] = useState<DiagnoseRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // sessionStorage에서 결과와 입력값 가져오기
    const storedResult = sessionStorage.getItem('diagnosisResult');
    const storedInput = sessionStorage.getItem('diagnosisInput');

    if (!storedResult || !storedInput) {
      // 결과가 없으면 메인 페이지로 리다이렉트
      router.push('/');
      return;
    }

    try {
      setResult(JSON.parse(storedResult));
      setInput(JSON.parse(storedInput));
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
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              진단 결과
            </h1>
            <p className="text-gray-600">
              당신의 상황을 깊이 생각해볼 수 있는 진단 결과입니다.
            </p>
          </div>
          <ResultDisplay result={result} input={input} />
        </div>
      </div>
    </main>
  );
}

