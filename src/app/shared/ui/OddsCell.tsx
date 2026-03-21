import { cn } from '@/lib/utils';
import { MarketOutcome } from '@/app/data/models/types';
import { useBetslipStore } from '@/app/state/betslipStore';
import { motion, AnimatePresence } from 'framer-motion';

interface OddsCellProps {
  outcome: MarketOutcome;
  onSelect: () => void;
  className?: string;
  compact?: boolean;
}

export function OddsCell({ outcome, onSelect, className, compact }: OddsCellProps) {
  // Inscrever em `selections` (não na função `hasSelection`), senão o Zustand não re-renderiza quando o cupom muda.
  const isSelected = useBetslipStore((s) => s.selections.some((sel) => sel.outcomeId === outcome.id));
  const oddsChange = outcome.previousOdds
    ? outcome.odds > outcome.previousOdds ? 'up' : outcome.odds < outcome.previousOdds ? 'down' : null
    : null;

  if (outcome.isLocked) {
    return (
      <div className={cn('odds-cell opacity-50 cursor-not-allowed', className)}>
        <span className="text-xs text-muted-foreground">🔒</span>
      </div>
    );
  }

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onSelect}
      className={cn(
        'odds-cell relative overflow-hidden',
        isSelected && 'odds-cell-selected',
        className
      )}
    >
      {!compact && (
        <span
          className={cn(
            'odds-label block text-[10px] mb-0.5 truncate',
            isSelected ? 'text-white/85' : 'text-muted-foreground'
          )}
        >
          {outcome.name}
        </span>
      )}
      <span
        className={cn(
          'odds-value font-semibold tabular-nums text-sm',
          isSelected ? 'text-white font-bold' : 'text-foreground',
          oddsChange === 'up' && !isSelected && 'odds-up',
          oddsChange === 'down' && !isSelected && 'odds-down',
        )}
      >
        {outcome.odds.toFixed(2)}
      </span>
      <AnimatePresence>
        {oddsChange && (
          <motion.span
            initial={{ opacity: 0, y: oddsChange === 'up' ? 4 : -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={cn(
              'absolute top-0.5 right-1 text-[9px]',
              oddsChange === 'up' ? 'odds-up' : 'odds-down'
            )}
          >
            {oddsChange === 'up' ? '▲' : '▼'}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
