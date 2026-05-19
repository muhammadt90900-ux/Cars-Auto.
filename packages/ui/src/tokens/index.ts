// packages/ui/src/tokens/index.ts
export const colors = {
  primary: {
    900: '#0f3460',
    800: '#16213e',
    700: '#1a1a2e',
  },
  accent: '#e94560',
  gold: '#f5a623',
  success: '#00d4aa',
  warning: '#ffb800',
  error: '#ff4757',
  background: {
    light: '#f8f9ff',
    dark: '#0d0d1a',
  },
  surface: {
    light: '#ffffff',
    dark: '#1a1a2e',
  },
  text: {
    light: '#1a1a2e',
    dark: '#f0f0ff',
  },
} as const;

export const fontFamily = {
  latin: 'var(--font-inter)',
  arabic: 'var(--font-noto-arabic)',
  chinese: 'var(--font-noto-sc)',
  mono: 'var(--font-jetbrains-mono)',
};

export const spacing = {
  0: '0',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',
} as const;

export const borderRadius = {
  sm: '8px',
  md: '16px',
  lg: '24px',
  full: '9999px',
} as const;

export const shadows = {
  sm: '0 1px 3px rgba(0,0,0,0.08)',
  md: '0 4px 20px rgba(0,0,0,0.10)',
  lg: '0 10px 40px rgba(0,0,0,0.12)',
  glow: '0 0 30px rgba(233,69,96,0.20)',
} as const;

export const glassmorphism = {
  background: 'rgba(255,255,255,0.08)',
  backdropFilter: 'blur(20px) saturate(180%)',
  border: '1px solid rgba(255,255,255,0.12)',
};
