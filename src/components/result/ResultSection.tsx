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
  
  // 문단으로 분리
  const paragraphs = content.split('\n\n').filter(p => p.trim());
  
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
      p-6
      md:p-8
    `}>
      <div className="mb-5">
        <h3 className={`
          text-base
          sm:text-lg 
          md:text-xl 
          font-bold 
          ${colors.title} 
          leading-tight
          tracking-tight
          whitespace-nowrap
          overflow-hidden
          text-ellipsis
          flex
          items-center
          gap-2
        `}>
          {emoji && <span className="text-xl md:text-2xl flex-shrink-0">{emoji}</span>}
          <span>{title}</span>
        </h3>
      </div>
      
      <div className={`space-y-3.5 ${colors.text}`}>
        {paragraphs.map((paragraph, index) => (
          <p 
            key={index} 
            className="
              text-sm 
              md:text-base
              text-[#4E5968] 
              leading-[1.7]
              font-normal
              tracking-normal
            "
          >
            {paragraph.trim()}
          </p>
        ))}
      </div>
    </div>
  );
};

