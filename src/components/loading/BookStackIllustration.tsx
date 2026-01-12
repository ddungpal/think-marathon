'use client';

import React from 'react';
import { loadingTheme } from '@/theme/loading-theme';

/**
 * BookStackIllustration Component
 * 3D-style book stack illustration with green, blue, and yellow books.
 * Toss-style clean and modern design.
 */
export class BookStackIllustration extends React.Component {
  private theme = loadingTheme;

  render() {
    const { colors, spacing } = this.theme;
    const { green, blue, yellow, page } = colors.book;

    const containerStyle: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: spacing.illustration.marginTop,
      marginBottom: spacing.illustration.marginBottom,
    };

    // Book dimensions
    const bookWidth = 120;
    const bookHeight = 80;
    const bookDepth = 12;
    const spacingBetween = 4;

    const bookStackStyle: React.CSSProperties = {
      position: 'relative',
      width: `${bookWidth}px`,
      height: `${bookHeight + bookDepth * 2}px`,
    };

    // Bottom book (yellow)
    const bottomBookStyle: React.CSSProperties = {
      position: 'absolute',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: `${bookWidth}px`,
      height: `${bookHeight}px`,
      backgroundColor: yellow,
      borderRadius: '4px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    };

    const bottomBookPageStyle: React.CSSProperties = {
      position: 'absolute',
      bottom: `-${bookDepth}px`,
      left: '50%',
      transform: 'translateX(-50%)',
      width: `${bookWidth}px`,
      height: `${bookDepth}px`,
      backgroundColor: page,
      borderRadius: '0 0 4px 4px',
    };

    // Middle book (blue)
    const middleBookStyle: React.CSSProperties = {
      position: 'absolute',
      bottom: `${bookHeight - 20}px`,
      left: '50%',
      transform: 'translateX(-50%) translateY(-10px) rotate(-2deg)',
      width: `${bookWidth}px`,
      height: `${bookHeight}px`,
      backgroundColor: blue,
      borderRadius: '4px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    };

    const middleBookPageStyle: React.CSSProperties = {
      position: 'absolute',
      bottom: `-${bookDepth}px`,
      left: '50%',
      transform: 'translateX(-50%)',
      width: `${bookWidth}px`,
      height: `${bookDepth}px`,
      backgroundColor: page,
      borderRadius: '0 0 4px 4px',
    };

    // Top book (green)
    const topBookStyle: React.CSSProperties = {
      position: 'absolute',
      bottom: `${bookHeight * 2 - 30}px`,
      left: '50%',
      transform: 'translateX(-50%) translateY(-10px) rotate(2deg)',
      width: `${bookWidth}px`,
      height: `${bookHeight}px`,
      backgroundColor: green,
      borderRadius: '4px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    };

    const topBookPageStyle: React.CSSProperties = {
      position: 'absolute',
      bottom: `-${bookDepth}px`,
      left: '50%',
      transform: 'translateX(-50%)',
      width: `${bookWidth}px`,
      height: `${bookDepth}px`,
      backgroundColor: page,
      borderRadius: '0 0 4px 4px',
    };

    return (
      <div style={containerStyle}>
        <div style={bookStackStyle}>
          {/* Bottom book (yellow) */}
          <div style={bottomBookStyle}></div>
          <div style={bottomBookPageStyle}></div>

          {/* Middle book (blue) */}
          <div
            style={{
              ...middleBookStyle,
              animation: 'bookFloatReverse 3s ease-in-out infinite',
            }}
          ></div>
          <div style={middleBookPageStyle}></div>

          {/* Top book (green) */}
          <div
            style={{
              ...topBookStyle,
              animation: 'bookFloat 3s ease-in-out infinite',
              animationDelay: '0.5s',
            }}
          ></div>
          <div style={topBookPageStyle}></div>
        </div>
      </div>
    );
  }
}

