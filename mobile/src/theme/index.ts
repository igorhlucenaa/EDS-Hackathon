/**
 * Tema Esportes da Sorte - Design System
 * Cores principais: Azul #023397, Verde #38E67D
 * Dark mode premium com identidade forte
 */

// ========== CORES DA MARCA ==========
export const brandColors = {
  // Azul principal - identidade da marca
  blue: {
    50: '#E6F0FF',
    100: '#B3D1FF',
    200: '#80B3FF',
    300: '#4D94FF',
    400: '#1A75FF',
    500: '#023397', // Primary brand blue
    600: '#002A7A',
    700: '#00205C',
    800: '#00163D',
    900: '#000B1F',
  },
  // Verde de ação - CTAs, odds, sucesso
  green: {
    50: '#E8FCF0',
    100: '#B8F6D3',
    200: '#88F0B6',
    300: '#58EA99',
    400: '#38E67D', // Primary action green
    500: '#1FD166',
    600: '#18B857',
    700: '#129F48',
    800: '#0C8639',
    900: '#066D2A',
  },
} as const;

// ========== CORES SEMÂNTICAS ==========
export const semanticColors = {
  // Backgrounds - Dark premium
  background: {
    base: '#050505',         // Fundo mais escuro
    primary: '#0A0A0F',      // Fundo principal
    secondary: '#0F1117',    // Cards/superfícies
    tertiary: '#141821',     // Cards elevados
    elevated: '#1A1F2A',     // Modais/overlays
  },
  
  // Superfícies
  surface: {
    default: '#141821',
    hover: '#1A1F2A',
    pressed: '#1F2533',
    disabled: '#0F1117',
  },
  
  // Textos
  text: {
    primary: '#FAFAFA',      // Títulos principais
    secondary: '#B8C0CC',    // Subtítulos
    tertiary: '#6B7280',     // Texto auxiliar
    muted: '#4B5563',        // Placeholders
    inverse: '#050505',      // Texto em fundos claros
  },
  
  // Ações
  action: {
    primary: brandColors.green[400],    // CTAs principais
    primaryHover: brandColors.green[500],
    primaryPressed: brandColors.green[600],
    
    secondary: brandColors.blue[500],     // Botões secundários
    secondaryHover: brandColors.blue[600],
    secondaryPressed: brandColors.blue[700],
    
    ghost: 'transparent',
    ghostHover: 'rgba(56, 230, 125, 0.1)',
  },
  
  // Estados
  state: {
    success: brandColors.green[400],
    warning: '#F59E0B',
    error: '#EF4444',
    info: brandColors.blue[400],
    live: '#EF4444',
  },
  
  // Bordas
  border: {
    default: '#1F2937',
    subtle: '#1A1F2A',
    strong: '#374151',
    focus: brandColors.green[400],
    error: '#EF4444',
  },
  
  // Odds e betting
  odds: {
    default: brandColors.green[400],
    hover: brandColors.green[300],
    active: brandColors.green[500],
    selected: brandColors.blue[500],
  },
  
  // Cashout
  cashout: {
    available: brandColors.green[400],
    value: brandColors.green[400],
  },
} as const;

// ========== CORES LEGACY (compatibilidade) ==========
export const legacyColors = {
  primary: semanticColors.action.primary,
  primaryForeground: '#050505',
  background: semanticColors.background.primary,
  foreground: semanticColors.text.primary,
  card: semanticColors.surface.default,
  cardForeground: semanticColors.text.primary,
  muted: semanticColors.text.tertiary,
  mutedForeground: semanticColors.text.muted,
  border: semanticColors.border.default,
  secondary: semanticColors.surface.default,
  secondaryForeground: semanticColors.text.primary,
  destructive: semanticColors.state.error,
  live: semanticColors.state.live,
} as const;

// Export all colors
export const colors = {
  ...legacyColors,
  brand: brandColors,
  semantic: semanticColors,
};

// ========== ESPAÇAMENTO ==========
export const spacing = {
  '0': 0,
  '1': 4,
  '2': 8,
  '3': 12,
  '4': 16,
  '5': 20,
  '6': 24,
  '8': 32,
  '10': 40,
  '12': 48,
  '16': 64,
  '20': 80,
  '24': 96,
} as const;

// ========== RAIO DE BORDA ==========
export const radius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 9999,
} as const;

// ========== TIPOGRAFIA ==========
export const typography = {
  fontFamily: {
    sans: 'Inter',
    mono: 'monospace',
  },
  fontSize: {
    xs: 10,
    sm: 12,
    base: 14,
    lg: 16,
    xl: 18,
    '2xl': 20,
    '3xl': 24,
    '4xl': 32,
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

// ========== SOMBRAS/ELEVAÇÃO ==========
export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  glow: {
    // Efeito de glow para elementos premium
    shadowColor: brandColors.green[400],
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 0,
  },
} as const;

// ========== TEMA COMPLETO ==========
export const theme = {
  colors,
  spacing,
  radius,
  typography,
  shadows,
} as const;

export type Theme = typeof theme;
export default theme;
