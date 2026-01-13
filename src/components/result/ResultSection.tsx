'use client';

import React from 'react';

interface ResultSectionProps {
  title: string;
  content: string;
  emoji?: string;
  icon?: string;
  color?: 'blue' | 'indigo' | 'amber' | 'green' | 'purple' | 'pink' | 'teal' | 'red';
}

const colorClasses = {
  blue: {
    bg: 'bg-white',
    border: 'border-[#E5E8EB]',
    accent: 'border-l-4 border-l-[#3182F6]',
    icon: 'bg-[#E8F4FD] text-[#3182F6]',
    text: 'text-[#191F28]',
    title: 'text-[#191F28]',
  },
  indigo: {
    bg: 'bg-white',
    border: 'border-[#E5E8EB]',
    accent: 'border-l-4 border-l-[#6366F1]',
    icon: 'bg-[#E8EBF5] text-[#6366F1]',
    text: 'text-[#191F28]',
    title: 'text-[#191F28]',
  },
  amber: {
    bg: 'bg-white',
    border: 'border-[#E5E8EB]',
    accent: 'border-l-4 border-l-[#F59E0B]',
    icon: 'bg-[#FEF3C7] text-[#F59E0B]',
    text: 'text-[#191F28]',
    title: 'text-[#191F28]',
  },
  green: {
    bg: 'bg-white',
    border: 'border-[#E5E8EB]',
    accent: 'border-l-4 border-l-[#10B981]',
    icon: 'bg-[#D1FAE5] text-[#10B981]',
    text: 'text-[#191F28]',
    title: 'text-[#191F28]',
  },
  purple: {
    bg: 'bg-white',
    border: 'border-[#E5E8EB]',
    accent: 'border-l-4 border-l-[#8B5CF6]',
    icon: 'bg-[#F3E8FF] text-[#8B5CF6]',
    text: 'text-[#191F28]',
    title: 'text-[#191F28]',
  },
  pink: {
    bg: 'bg-white',
    border: 'border-[#E5E8EB]',
    accent: 'border-l-4 border-l-[#EC4899]',
    icon: 'bg-[#FCE7F3] text-[#EC4899]',
    text: 'text-[#191F28]',
    title: 'text-[#191F28]',
  },
  teal: {
    bg: 'bg-white',
    border: 'border-[#E5E8EB]',
    accent: 'border-l-4 border-l-[#14B8A6]',
    icon: 'bg-[#CCFBF1] text-[#14B8A6]',
    text: 'text-[#191F28]',
    title: 'text-[#191F28]',
  },
  red: {
    bg: 'bg-white',
    border: 'border-[#E5E8EB]',
    accent: 'border-l-4 border-l-[#F04452]',
    icon: 'bg-[#FEE2E2] text-[#F04452]',
    text: 'text-[#191F28]',
    title: 'text-[#191F28]',
  },
};

export const ResultSection: React.FC<ResultSectionProps> = ({ 
  title, 
  content, 
  emoji,
  icon,
  color = 'blue'
}) => {
  const colors = colorClasses[color];
  
  // 핵심 문장과 이유 설명 분리
  // 첫 번째 줄바꿈을 기준으로 핵심 문장과 이유 설명을 분리
  const parts = content.split(/\n+/).map(s => s.trim()).filter(s => s.length > 0);
  const coreSentence = parts[0] || content; // 첫 번째 문장이 핵심 문장
  const reasonExplanation = parts.slice(1).join(' '); // 나머지가 이유 설명
  
  return (
    <div className={`
      ${colors.bg} 
      ${colors.border} 
      ${colors.accent}
      rounded-2xl 
      border 
      shadow-sm
      hover:shadow-md
      transition-shadow
      duration-200
      p-4
      sm:p-5
      md:p-6
      lg:p-8
    `}>
      <div className="mb-3 sm:mb-4 md:mb-5">
        <h3 className={`
          text-sm
          sm:text-base
          md:text-lg 
          lg:text-xl 
          font-bold 
          ${colors.title} 
          leading-tight
          tracking-tight
          flex
          items-center
          gap-1.5
          sm:gap-2
        `}>
          {emoji && <span className="text-base sm:text-lg md:text-xl lg:text-2xl flex-shrink-0">{emoji}</span>}
          <span className="break-words">{title}</span>
        </h3>
      </div>
      
      <div className={`space-y-3 sm:space-y-4 md:space-y-5 ${colors.text}`}>
        {/* 핵심 문장 */}
        <div className="flex items-start gap-2 sm:gap-3">
          <span className="text-base sm:text-lg md:text-xl flex-shrink-0 mt-0.5">💡</span>
          <p 
            className="
              text-sm
              sm:text-base 
              md:text-lg
              text-[#191F28] 
              leading-[1.6]
              sm:leading-[1.65]
              md:leading-[1.7]
              font-semibold
              tracking-normal
              flex-1
            "
          >
            {coreSentence}
          </p>
        </div>
        
        {/* 이유 설명 */}
        {reasonExplanation && (
          <div className="pl-5 sm:pl-6 md:pl-7">
            <p 
              className="
                text-xs
                sm:text-sm 
                md:text-base
                text-[#4E5968] 
                leading-[1.6]
                sm:leading-[1.65]
                md:leading-[1.7]
                font-normal
                tracking-normal
              "
            >
              {reasonExplanation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

