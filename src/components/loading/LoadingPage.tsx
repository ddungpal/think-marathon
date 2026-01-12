'use client';

import React from 'react';
import { loadingTheme } from '@/theme/loading-theme';
import { ThinkingIllustration } from './ThinkingIllustration';

interface LoadingPageProps {
  userName?: string;
}

/**
 * LoadingPage Component
 * Toss-style friendly and witty loading page.
 * Displays personalized messages that rotate or stay consistent.
 */
export const LoadingPage: React.FC<LoadingPageProps> = ({ userName = '님' }) => {
  const theme = loadingTheme;

  // Friendly and witty message (Toss style - consistent)
  const message = {
    title: `${userName}님의 생각을 깊이 들여다보고 있어요`,
    body: [
      '지금 페이지를 닫으면 생각하는 시간이 멈추게 돼요.',
      '잠시만 기다려주세요.',
    ],
  };

  return (
    <div 
      className="min-h-screen bg-[#F7F8FA] flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16"
      style={{ fontFamily: theme.fonts.family }}
    >
      <div className="max-w-[600px] w-full flex flex-col items-center text-center">
        <ThinkingIllustration />
        <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-[#191F28] mb-2 sm:mb-3 md:mb-4 leading-[1.4]">
          {message.title}
        </h1>
        {message.body.map((line, index) => (
          <p 
            key={index} 
            className="text-xs sm:text-sm md:text-base text-[#4E5968] mb-1 sm:mb-2 leading-[1.6]"
          >
            {line}
          </p>
        ))}
      </div>
    </div>
  );
};

