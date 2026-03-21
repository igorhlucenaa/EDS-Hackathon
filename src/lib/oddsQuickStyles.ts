import { cn } from '@/lib/utils';

/** Botões de odd fora do OddsCell — mesmo visual do CTA “Rápido” quando no cupom */
export function quickOddSlotClass(isSelected: boolean) {
  return cn(
    'border transition-colors',
    isSelected
      ? 'bg-primary text-primary-foreground border-primary shadow-sm hover:bg-primary/90'
      : 'bg-secondary/80 hover:bg-secondary border-border/40 text-foreground'
  );
}

export function quickOddLabelClass(isSelected: boolean) {
  return cn('block truncate', isSelected ? 'text-primary-foreground/90' : 'text-muted-foreground');
}

export function quickOddValueClass(isSelected: boolean) {
  return cn('tabular-nums', isSelected ? 'text-primary-foreground font-bold' : 'font-bold');
}
