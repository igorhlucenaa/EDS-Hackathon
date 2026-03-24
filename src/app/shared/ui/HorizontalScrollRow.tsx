import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

type HorizontalScrollRowProps = {
  children: ReactNode;
  /** Rótulo para leitores de tela (grupo de itens rolável). */
  ariaLabel: string;
  className?: string;
  innerClassName?: string;
  /** Dica visual curta em telas pequenas (affordance de rolagem). */
  showScrollHint?: boolean;
};

export function HorizontalScrollRow({
  children,
  ariaLabel,
  className,
  innerClassName,
  showScrollHint = true,
}: HorizontalScrollRowProps) {
  return (
    <div className={cn('relative', className)}>
      {showScrollHint && (
        <span className="sm:hidden text-[10px] text-muted-foreground px-4 -mb-0.5 block" aria-hidden>
          Deslize para o lado para ver mais
        </span>
      )}
      <div className="relative">
        <div
          className={cn(
            'flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory scroll-pl-4 scroll-smooth touch-pan-x',
            'overscroll-x-contain',
            innerClassName
          )}
          role="group"
          aria-label={ariaLabel}
        >
          {children}
        </div>
        {/* Só gradiente à direita — o da esquerda “comia” o primeiro item em telas estreitas */}
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-5 bg-gradient-to-l from-background to-transparent z-[1]"
          aria-hidden
        />
      </div>
    </div>
  );
}
