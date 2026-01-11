'use client';

import React from 'react';
import { StageInfo } from '@/types/output';
import { getStageColor } from '@/lib/config/stage-mapper';

interface StageGaugeProps {
  stage: StageInfo;
}

export const StageGauge: React.FC<StageGaugeProps> = ({ stage }) => {
  const colors = getStageColor(stage.type);
  const stages = [
    { name: '노동자', level: 1 },
    { name: '숙련자', level: 2 },
    { name: '실력자', level: 3 },
    { name: '전문가', level: 4 },
    { name: '시스템', level: 5 },
    { name: '브랜드', level: 6 },
  ];
  
  const currentStage = stages.find(s => s.name === stage.type);
  const currentLevel = currentStage?.level || 1;
  const totalStages = 6;
  const percentage = (currentLevel / totalStages) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Stage Label */}
      <div className="text-center mb-10">
        <div 
          className="inline-block px-6 py-3 rounded-2xl font-bold text-2xl md:text-3xl mb-4"
          style={{
            backgroundColor: colors.primary + '15',
            color: colors.primary,
          }}
        >
          {stage.type}
        </div>
        <p className="text-[#191F28] text-lg font-semibold mb-2">
          총 {totalStages}단계 중 당신의 레벨은 <span className="font-bold" style={{ color: colors.primary }}>{currentLevel}단계</span>입니다
        </p>
        <p className="text-[#8B95A1] text-base">{stage.description}</p>
      </div>

      {/* Progress Gauge */}
      <div className="relative">
        {/* Background Bar with Markers */}
        <div className="relative w-full h-3 bg-[#F2F4F6] rounded-full overflow-visible mb-10">
          {/* Progress Fill */}
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{
              width: `${percentage}%`,
              backgroundColor: colors.primary,
            }}
          />

          {/* Stage Markers on Bar */}
          {stages.map((s, index) => {
            const isActive = s.level <= currentLevel;
            const isCurrent = s.name === stage.type;
            const position = (s.level / totalStages) * 100;
            
            return (
              <div
                key={s.name}
                className="absolute flex flex-col items-center"
                style={{
                  left: `calc(${position}% - 8px)`,
                  top: '-6px',
                }}
              >
                {/* Marker Dot */}
                <div
                  className={`w-4 h-4 rounded-full border-2 transition-all duration-300 mb-2 z-10 ${
                    isCurrent ? 'scale-125' : ''
                  }`}
                  style={{
                    backgroundColor: isActive ? colors.primary : '#E5E8EB',
                    borderColor: isActive ? colors.primary : '#D1D6DB',
                  }}
                >
                  {isCurrent && (
                    <div className="w-full h-full rounded-full flex items-center justify-center">
                      <div 
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: 'white' }}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Stage Labels Below */}
        <div className="flex justify-between">
          {stages.map((s) => {
            const isActive = s.level <= currentLevel;
            const isCurrent = s.name === stage.type;
            
            return (
              <div
                key={s.name}
                className="flex flex-col items-center flex-1"
              >
                {/* Stage Name */}
                <span
                  className={`text-xs font-semibold text-center ${
                    isCurrent ? 'text-[#191F28]' : 'text-[#8B95A1]'
                  }`}
                  style={isCurrent ? { color: colors.primary } : {}}
                >
                  {s.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

