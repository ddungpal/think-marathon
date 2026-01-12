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

  const pageStyle: React.CSSProperties = {
    backgroundColor: theme.colors.background,
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.container.padding,
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: theme.spacing.container.maxWidth,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: theme.fonts.family,
    fontSize: theme.fonts.title.size,
    fontWeight: theme.fonts.title.weight,
    lineHeight: theme.fonts.title.lineHeight,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.title.marginBottom,
  };

  const bodyTextStyle: React.CSSProperties = {
    fontFamily: theme.fonts.family,
    fontSize: theme.fonts.body.size,
    fontWeight: theme.fonts.body.weight,
    lineHeight: theme.fonts.body.lineHeight,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.body.marginBottom,
  };

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <ThinkingIllustration />
        <h1 style={titleStyle}>{message.title}</h1>
        {message.body.map((line, index) => (
          <p key={index} style={bodyTextStyle}>
            {line}
          </p>
        ))}
      </div>
    </div>
  );
};

