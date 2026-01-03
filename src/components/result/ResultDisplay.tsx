'use client';

import React from 'react';
import { DiagnosisResult } from '@/types/output';
import { DiagnoseRequest } from '@/types/api';
import { ResultHeader } from './ResultHeader';
import { CommonConcerns } from './CommonConcerns';
import { CurrentCapabilities } from './CurrentCapabilities';
import { LearningPoints } from './LearningPoints';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

interface ResultDisplayProps {
  result: DiagnosisResult;
  input: DiagnoseRequest;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, input }) => {
  const router = useRouter();

  const handleRestart = () => {
    sessionStorage.removeItem('diagnosisResult');
    sessionStorage.removeItem('diagnosisInput');
    router.push('/');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <ResultHeader input={input} />
      
      <div className="space-y-6">
        <CommonConcerns content={result.common_concerns} />
        <CurrentCapabilities content={result.current_capabilities} />
        <LearningPoints content={result.learning_points} />
      </div>

      <div className="mt-8 flex justify-center">
        <Button onClick={handleRestart} variant="primary" size="large">
          다시 진단하기
        </Button>
      </div>
    </div>
  );
};

