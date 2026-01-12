/**
 * Diagnosis Result Page Theme
 * Global theme configuration for the diagnosis result UI.
 * All styling values must be referenced from this file - no hardcoded values in components.
 */
export const diagnosisResultTheme = {
  colors: {
    background: '#FFFFFF', // Card background (white)
    pageBackground: '#F7F8FA', // Page background (light gray)
    title: '#191F28', // Section titles (dark gray, almost black)
    text: '#4E5968', // Body text (dark gray)
    separator: '#E5E8EB', // Separator lines (light gray)
    checkmark: '#22C55E', // Checkmark icon (vibrant green)
  },
  fonts: {
    family: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Pretendard', 'Noto Sans KR', Roboto, sans-serif",
    title: {
      size: '24px',
      weight: '700', // Bold
      lineHeight: '1.2',
    },
    body: {
      size: '18px',
      weight: '400', // Regular
      lineHeight: '1.6',
    },
  },
  spacing: {
    cardPadding: {
      horizontal: '40px',
      vertical: '40px',
    },
    sectionTop: '32px', // Top margin for first section
    sectionBottom: '32px', // Bottom margin after separator
    titleBottom: '20px', // Bottom margin after title
    paragraphGap: '14px', // Gap between paragraphs
    listItemGap: '18px', // Gap between list items
    iconTextGap: '14px', // Gap between icon and text
  },
  borderRadius: {
    card: '22px', // Rounded corners for card
  },
  shadows: {
    card: '0px 4px 12px rgba(0, 0, 0, 0.08)', // Subtle drop shadow
  },
  icon: {
    size: '22px', // Checkmark icon size
  },
} as const;

export type DiagnosisResultTheme = typeof diagnosisResultTheme;

