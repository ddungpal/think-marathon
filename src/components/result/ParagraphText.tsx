'use client';

import React from 'react';
import { diagnosisResultTheme } from '@/theme/diagnosis-result-theme';

interface ParagraphTextProps {
  content: string;
  isLast?: boolean;
}

/**
 * ParagraphText Component
 * Renders a paragraph with support for bold text (marked with **text**).
 * Uses theme values for typography and spacing.
 */
export class ParagraphText extends React.Component<ParagraphTextProps> {
  private theme = diagnosisResultTheme;

  private parseBoldText(text: string): React.ReactNode[] {
    const parts: React.ReactNode[] = [];
    const regex = /\*\*(.+?)\*\*/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      // Add text before bold
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      // Add bold text
      parts.push(<strong key={match.index}>{match[1]}</strong>);
      lastIndex = regex.lastIndex;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts.length > 0 ? parts : [text];
  }

  render() {
    const { fonts, colors, spacing } = this.theme;
    const { content, isLast = false } = this.props;

    const paragraphStyle: React.CSSProperties = {
      fontFamily: fonts.family,
      fontSize: fonts.body.size,
      fontWeight: fonts.body.weight,
      lineHeight: fonts.body.lineHeight,
      color: colors.text,
      marginBottom: isLast ? 0 : spacing.paragraphGap,
    };

    return (
      <p style={paragraphStyle}>
        {this.parseBoldText(content)}
      </p>
    );
  }
}

