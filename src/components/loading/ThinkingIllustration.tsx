'use client';

import React from 'react';
import { loadingTheme } from '@/theme/loading-theme';

/**
 * ThinkingIllustration Component
 * Sophisticated and engaging illustration showing a brain with thought bubbles,
 * representing the deep thinking process.
 * Includes smooth animations to keep users engaged.
 */
export class ThinkingIllustration extends React.Component {
  private theme = loadingTheme;

  render() {
    const { colors, spacing } = this.theme;
    const { primary } = colors;

    // Brain shape (simplified, modern style) - 반응형 크기
    const brainStyle: React.CSSProperties = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 'clamp(100px, 20vw, 140px)',
      height: 'clamp(85px, 17vw, 120px)',
      borderRadius: '60px 60px 50px 50px',
      background: `linear-gradient(135deg, ${primary} 0%, #2563EB 100%)`,
      opacity: 0.9,
      boxShadow: `0 8px 32px rgba(49, 130, 246, 0.3)`,
      animation: 'brainPulse 2s ease-in-out infinite',
    };

    // Thought bubbles - circles that float upward (반응형 크기)
    const thoughtBubbles = [
      { 
        size: 'clamp(16px, 4vw, 24px)', 
        top: '10%', 
        left: '15%', 
        delay: '0s', 
        color: colors.book.green,
        opacity: 0.7,
      },
      { 
        size: 'clamp(14px, 3.5vw, 20px)', 
        top: '5%', 
        right: '20%', 
        delay: '0.3s', 
        color: colors.book.yellow,
        opacity: 0.6,
      },
      { 
        size: 'clamp(12px, 3vw, 18px)', 
        top: '8%', 
        left: '70%', 
        delay: '0.6s', 
        color: colors.book.blue,
        opacity: 0.8,
      },
      { 
        size: 'clamp(15px, 3.8vw, 22px)', 
        top: '12%', 
        right: '15%', 
        delay: '0.9s', 
        color: colors.book.green,
        opacity: 0.65,
      },
    ];

    // Sparkle dots around the brain
    const sparkles = [
      { top: '40%', left: '20%', delay: '0s', color: colors.book.green },
      { top: '35%', right: '25%', delay: '0.4s', color: colors.book.yellow },
      { top: '55%', left: '15%', delay: '0.8s', color: colors.book.blue },
      { top: '60%', right: '20%', delay: '1.2s', color: colors.book.green },
      { top: '50%', left: '75%', delay: '1.6s', color: colors.book.yellow },
    ];

    const sparkleBaseStyle: React.CSSProperties = {
      position: 'absolute',
      width: 'clamp(4px, 1.2vw, 6px)',
      height: 'clamp(4px, 1.2vw, 6px)',
      borderRadius: '50%',
      background: colors.book.green,
      boxShadow: `0 0 8px ${colors.book.green}`,
    };

    return (
      <div className="flex flex-col items-center justify-center mt-8 sm:mt-10 md:mt-12 mb-4 sm:mb-6 md:mb-8 relative w-[clamp(180px,50vw,240px)] h-[clamp(180px,50vw,240px)]">
        <div className="brain-container" style={{ position: 'relative', width: '100%', height: '100%' }}>
          {/* Thought bubbles floating upward */}
          {thoughtBubbles.map((bubble, index) => (
            <div
              key={`bubble-${index}`}
              className="thought-bubble"
              style={{
                position: 'absolute',
                width: bubble.size,
                height: bubble.size,
                borderRadius: '50%',
                background: bubble.color,
                opacity: bubble.opacity,
                top: bubble.top,
                left: bubble.left !== undefined ? bubble.left : 'auto',
                right: bubble.right !== undefined ? bubble.right : 'auto',
                boxShadow: `0 0 16px ${bubble.color}`,
                animation: 'floatUp 3s ease-in-out infinite',
                animationDelay: bubble.delay,
              }}
            />
          ))}

          {/* Brain */}
          <div style={brainStyle}></div>

          {/* Sparkles around the brain */}
          {sparkles.map((sparkle, index) => (
            <div
              key={`sparkle-${index}`}
              className="sparkle"
              style={{
                ...sparkleBaseStyle,
                top: sparkle.top,
                left: sparkle.left !== undefined ? sparkle.left : 'auto',
                right: sparkle.right !== undefined ? sparkle.right : 'auto',
                background: sparkle.color,
                boxShadow: `0 0 8px ${sparkle.color}`,
                animationDelay: sparkle.delay,
              }}
            />
          ))}
        </div>
      </div>
    );
  }
}
