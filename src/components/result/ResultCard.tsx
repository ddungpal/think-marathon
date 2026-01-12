'use client';

import React from 'react';
import { diagnosisResultTheme } from '@/theme/diagnosis-result-theme';

interface ResultCardProps {
  children: React.ReactNode;
}

/**
 * ResultCard Component
 * Main container card with white background, rounded corners, and shadow.
 * Follows OOP principles - uses theme values only.
 */
export class ResultCard extends React.Component<ResultCardProps> {
  private theme = diagnosisResultTheme;

  render() {
    const { colors, borderRadius, shadows, spacing } = this.theme;

    const cardStyle: React.CSSProperties = {
      backgroundColor: colors.background,
      borderRadius: borderRadius.card,
      boxShadow: shadows.card,
      paddingLeft: spacing.cardPadding.horizontal,
      paddingRight: spacing.cardPadding.horizontal,
      paddingTop: spacing.cardPadding.vertical,
      paddingBottom: spacing.cardPadding.vertical,
    };

    return (
      <div style={cardStyle}>
        {this.props.children}
      </div>
    );
  }
}

