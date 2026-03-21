/** Design tokens — foundations para UI consistente (mobile-first) */
export const tokens = {
  color: {
    background: 'hsl(222 47% 6%)',
    foreground: 'hsl(210 40% 96%)',
    primary: 'hsl(152 69% 53%)',
    destructive: 'hsl(0 72% 51%)',
    warning: 'hsl(38 92% 50%)',
    muted: 'hsl(215 20% 55%)',
    live: 'hsl(0 72% 51%)',
  },
  radius: { sm: '0.5rem', md: '0.75rem', lg: '1rem', xl: '1.25rem', '2xl': '1.5rem' },
  space: { xs: '0.25rem', sm: '0.5rem', md: '0.75rem', lg: '1rem', xl: '1.5rem', '2xl': '2rem' },
  font: { sans: "'Inter', system-ui, sans-serif", display: "'Space Grotesk', 'Inter', sans-serif" },
  motion: { fast: '150ms', base: '200ms', slow: '300ms', easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
  elevation: { sm: '0 1px 2px rgb(0 0 0 / 0.25)', md: '0 4px 12px rgb(0 0 0 / 0.35)' },
} as const;
