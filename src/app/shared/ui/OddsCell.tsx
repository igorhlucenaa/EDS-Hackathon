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
  const hasSelection = useBetslipStore((s) => s.hasSelection);
  const isSelected = hasSelection(outcome.id);
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
        <span className="block text-[10px] text-muted-foreground mb-0.5 truncate">
          {outcome.name}
        </span>
      )}
      <span className={cn(
        'font-semibold tabular-nums text-sm',
        isSelected ? 'text-primary-foreground' : 'text-foreground',
        oddsChange === 'up' && !isSelected && 'odds-up',
        oddsChange === 'down' && !isSelected && 'odds-down',
      )}>
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
