'use client';

import React from 'react';
import { diagnosisResultTheme } from '@/theme/diagnosis-result-theme';

interface SectionSeparatorProps {
  className?: string;
}

/**
 * SectionSeparator Component
 * Thin horizontal line separating sections.
 * Uses theme values for color and spacing.
 */
export class SectionSeparator extends React.Component<SectionSeparatorProps> {
  private theme = diagnosisResultTheme;

  render() {
    const { colors, spacing } = this.theme;

    const separatorStyle: React.CSSProperties = {
      borderTop: `1px solid ${colors.separator}`,
      marginTop: spacing.sectionBottom,
      marginBottom: spacing.sectionTop,
      width: '100%',
    };

    return <div style={separatorStyle} className={this.props.className} />;
  }
}

