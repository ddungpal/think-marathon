'use client';

import React from 'react';
import { StageInfo } from '@/types/output';
import { getStageColor } from '@/lib/config/stage-mapper';

interface StageBadgeProps {
  stage: StageInfo;
}

export const StageBadge: React.FC<StageBadgeProps> = ({ stage }) => {
  const colors = getStageColor(stage.type);
  const stages = ['노동자', '숙련자', '실력자', '전문가', '시스템', '브랜드'];
  const currentIndex = stages.indexOf(stage.type);

  return (
    <div className="inline-block">
      <div 
        className="px-8 py-4 rounded-2xl shadow-xl backdrop-blur-sm border-2 font-bold text-2xl md:text-3xl mb-4"
        style={{
          backgroundColor: colors.primary + '15',
          borderColor: colors.primary,
          color: colors.primary,
        }}
      >
        {stage.type}
      </div>
      <div className="flex items-center justify-center gap-2 mt-4">
        {stages.map((s, index) => (
          <div
            key={s}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex 
                ? 'scale-125' 
                : 'opacity-30'
            }`}
            style={{
              backgroundColor: index === currentIndex ? colors.primary : '#D1D5DB',
            }}
          />
        ))}
      </div>
      <p className="text-gray-600 mt-4 text-lg">{stage.description}</p>
    </div>
  );
};

