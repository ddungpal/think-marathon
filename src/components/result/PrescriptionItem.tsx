'use client';

import React from 'react';
import { diagnosisResultTheme } from '@/theme/diagnosis-result-theme';

interface PrescriptionItemProps {
  text: string;
  isLast?: boolean;
}

/**
 * PrescriptionItem Component
 * List item with green checkmark icon and text.
 * Uses theme values for styling and spacing.
 */
export class PrescriptionItem extends React.Component<PrescriptionItemProps> {
  private theme = diagnosisResultTheme;

  private renderCheckmarkIcon(): React.ReactNode {
    const { colors, icon } = this.theme;

    const iconStyle: React.CSSProperties = {
      width: icon.size,
      height: icon.size,
      backgroundColor: colors.checkmark,
      borderRadius: '50%',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      color: '#FFFFFF',
      fontSize: '14px',
      fontWeight: 'bold',
      lineHeight: '1',
    };

    return (
      <span style={iconStyle}>
        ✓
      </span>
    );
  }

  render() {
    const { fonts, colors, spacing } = this.theme;
    const { text, isLast = false } = this.props;

    const containerStyle: React.CSSProperties = {
      display: 'flex',
      alignItems: 'flex-start',
      gap: spacing.iconTextGap,
      marginBottom: isLast ? 0 : spacing.listItemGap,
    };

    const textStyle: React.CSSProperties = {
      fontFamily: fonts.family,
      fontSize: fonts.body.size,
      fontWeight: fonts.body.weight,
      lineHeight: fonts.body.lineHeight,
      color: colors.text,
      flex: 1,
    };

    return (
      <div style={containerStyle}>
        {this.renderCheckmarkIcon()}
        <span style={textStyle}>{text}</span>
      </div>
    );
  }
}

