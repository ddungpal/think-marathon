'use client';

import React from 'react';
import { diagnosisResultTheme } from '@/theme/diagnosis-result-theme';

interface DiagnosisSectionProps {
  title: string;
  children: React.ReactNode;
  isFirst?: boolean;
}

/**
 * DiagnosisSection Component
 * Reusable section component with title and content.
 * Handles spacing and typography according to theme.
 */
export class DiagnosisSection extends React.Component<DiagnosisSectionProps> {
  private theme = diagnosisResultTheme;

  render() {
    const { fonts, colors, spacing } = this.theme;
    const { title, children, isFirst = false } = this.props;

    const containerStyle: React.CSSProperties = {
      marginTop: isFirst ? spacing.sectionTop : 0,
    };

    const titleStyle: React.CSSProperties = {
      fontFamily: fonts.family,
      fontSize: fonts.title.size,
      fontWeight: fonts.title.weight,
      lineHeight: fonts.title.lineHeight,
      color: colors.title,
      marginBottom: spacing.titleBottom,
    };

    return (
      <div style={containerStyle}>
        <h2 style={titleStyle}>{title}</h2>
        <div>{children}</div>
      </div>
    );
  }
}

