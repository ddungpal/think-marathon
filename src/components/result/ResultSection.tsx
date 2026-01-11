'use client';

import React from 'react';

interface ResultSectionProps {
  title: string;
  content: string;
  icon?: string;
  color?: 'blue' | 'indigo' | 'amber' | 'green' | 'purple' | 'pink' | 'teal' | 'red';
}

const colorClasses = {
  blue: {
    bg: 'bg-white',
    border: 'border-[#E5E8EB]',
    icon: 'bg-[#E8F4FD] text-[#3182F6]',
    text: 'text-[#191F28]',
    title: 'text-[#191F28]',
  },
  indigo: {
    bg: 'bg-white',
    border: 'border-[#E5E8EB]',
    icon: 'bg-[#E8EBF5] text-[#6366F1]',
    text: 'text-[#191F28]',
    title: 'text-[#191F28]',
  },
  amber: {
    bg: 'bg-white',
    border: 'border-[#E5E8EB]',
    icon: 'bg-[#FEF3C7] text-[#F59E0B]',
    text: 'text-[#191F28]',
    title: 'text-[#191F28]',
  },
  green: {
    bg: 'bg-white',
    border: 'border-[#E5E8EB]',
    icon: 'bg-[#D1FAE5] text-[#10B981]',
    text: 'text-[#191F28]',
    title: 'text-[#191F28]',
  },
  purple: {
    bg: 'bg-white',
    border: 'border-[#E5E8EB]',
    icon: 'bg-[#F3E8FF] text-[#8B5CF6]',
    text: 'text-[#191F28]',
    title: 'text-[#191F28]',
  },
  pink: {
    bg: 'bg-white',
    border: 'border-[#E5E8EB]',
    icon: 'bg-[#FCE7F3] text-[#EC4899]',
    text: 'text-[#191F28]',
    title: 'text-[#191F28]',
  },
  teal: {
    bg: 'bg-white',
    border: 'border-[#E5E8EB]',
    icon: 'bg-[#CCFBF1] text-[#14B8A6]',
    text: 'text-[#191F28]',
    title: 'text-[#191F28]',
  },
  red: {
    bg: 'bg-white',
    border: 'border-[#E5E8EB]',
    icon: 'bg-[#FEE2E2] text-[#F04452]',
    text: 'text-[#191F28]',
    title: 'text-[#191F28]',
  },
};

export const ResultSection: React.FC<ResultSectionProps> = ({ 
  title, 
  content, 
  icon,
  color = 'blue'
}) => {
  const colors = colorClasses[color];
  
  // 문단으로 분리
  const paragraphs = content.split('\n\n').filter(p => p.trim());
  
  return (
    <div className={`${colors.bg} rounded-2xl p-8 border ${colors.border}`}>
      <div className="flex items-start gap-4 mb-6">
        {icon && (
          <div className={`${colors.icon} w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0`}>
            {icon}
          </div>
        )}
        <h3 className={`text-2xl font-bold ${colors.title} flex-1 leading-tight`}>
          {title}
        </h3>
      </div>
      
      <div className={`space-y-4 ${colors.text} leading-relaxed`}>
        {paragraphs.map((paragraph, index) => (
          <p key={index} className="text-base text-[#4E5968]">
            {paragraph.trim()}
          </p>
        ))}
      </div>
    </div>
  );
};

