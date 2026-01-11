'use client';

import React from 'react';
import { DiagnosisResult, StageInfo } from '@/types/output';
import { DiagnoseRequest } from '@/types/api';
import { StageGauge } from './StageGauge';
import { ResultSection } from './ResultSection';
import { ShareButtons } from './ShareButtons';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { getStageColor } from '@/lib/config/stage-mapper';

interface ResultDisplayProps {
  result: DiagnosisResult;
  input: DiagnoseRequest;
  stage?: StageInfo | null;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, input, stage }) => {
  const router = useRouter();
  const stageColors = stage ? getStageColor(stage.type) : null;

  const handleRestart = () => {
    sessionStorage.removeItem('diagnosisResult');
    sessionStorage.removeItem('diagnosisInput');
    sessionStorage.removeItem('diagnosisStage');
    router.push('/');
  };

  return (
    <main className="min-h-screen bg-[#F7F8FA]">
      {/* Hero Section with Stage Badge */}
      <div className="bg-white pt-16 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-[#191F28] mb-12">
              {input.name}님의 진단 결과
            </h1>
            {stage && <StageGauge stage={stage} />}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Result Sections - 요청한 항목만 표시 */}
          <div className="space-y-6">
            {result.frequent_thoughts && (
              <ResultSection
                title="내가 자주 하는 생각"
                content={result.frequent_thoughts}
                color="blue"
              />
            )}

            {result.unknown_things && (
              <ResultSection
                title="이 구간에서 잘 모르는 것"
                content={result.unknown_things}
                color="amber"
              />
            )}

            {result.must_learn && (
              <ResultSection
                title="반드시 배워야 하는 것"
                content={result.must_learn}
                color="purple"
              />
            )}

            {result.recommended_training && (
              <ResultSection
                title="추천 생각 훈련"
                content={result.recommended_training}
                color="teal"
              />
            )}

            {result.avoid_studies && (
              <ResultSection
                title="지금은 피해야 할 공부"
                content={result.avoid_studies}
                color="red"
              />
            )}
          </div>

          {/* Share Section */}
          <div className="mt-16 pt-12 border-t border-[#E5E8EB]">
            <ShareButtons input={input} stage={stage} />
          </div>

          {/* Restart Button */}
          <div className="mt-10">
            <Button 
              onClick={handleRestart} 
              variant="secondary" 
              size="large"
              className="w-full"
            >
              다시 진단하기
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};
