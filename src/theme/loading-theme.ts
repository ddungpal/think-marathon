/**
 * Loading Page Theme
 * Global theme configuration for the loading/processing page.
 * Toss-style clean and friendly design.
 */
export const loadingTheme = {
  colors: {
    background: '#F7F8FA', // Page background (light gray, same as main page)
    primary: '#3182F6', // Primary blue
    text: {
      primary: '#191F28', // Main text (dark gray, almost black)
      secondary: '#4E5968', // Secondary text (dark gray)
      tertiary: '#8B95A1', // Tertiary text (light gray)
    },
    book: {
      green: '#22C55E', // Top book (green)
      blue: '#3182F6', // Middle book (blue)
      yellow: '#FACC15', // Bottom book (yellow)
      page: '#FFFFFF', // Book pages (white)
    },
  },
  fonts: {
    family: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Pretendard', 'Noto Sans KR', Roboto, sans-serif",
    title: {
      size: '24px',
      weight: '700', // Bold
      lineHeight: '1.4',
    },
    body: {
      size: '16px',
      weight: '400', // Regular
      lineHeight: '1.6',
    },
    small: {
      size: '14px',
      weight: '400', // Regular
      lineHeight: '1.5',
    },
  },
  spacing: {
    container: {
      padding: '24px',
      maxWidth: '600px',
    },
    title: {
      marginBottom: '8px',
    },
    body: {
      marginBottom: '8px',
    },
    illustration: {
      marginTop: '48px',
      marginBottom: '24px',
    },
  },
  animations: {
    duration: {
      fast: '0.2s',
      normal: '0.3s',
      slow: '0.5s',
    },
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
  },
} as const;

export type LoadingTheme = typeof loadingTheme;

