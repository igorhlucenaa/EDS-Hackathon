import { cn } from '@/lib/utils';
import { SportEvent } from '@/app/data/models/types';
import { OddsCell } from './OddsCell';
import { useBetslipStore } from '@/app/state/betslipStore';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface LiveSnapshotCardProps {
  event: SportEvent;
  className?: string;
}

export function LiveSnapshotCard({ event, className }: LiveSnapshotCardProps) {
  const navigate = useNavigate();
  const toggleSelection = useBetslipStore((s) => s.toggleSelection);
  const featured = event.markets.find((m) => m.isFeatured) ?? event.markets[0];
  const { status } = event;

  const momentumWidth = status.momentum === 'home' ? '70%' : status.momentum === 'away' ? '30%' : '50%';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('bg-card border border-border/50 rounded-xl p-3 space-y-2.5 cursor-pointer hover:border-primary/30 transition-colors', className)}
      onClick={() => navigate(`/event/${event.id}`)}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-live-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-live-pulse live-pulse" />
            AO VIVO
          </span>
          <span className="text-[10px] text-muted-foreground">{status.clock}</span>
        </div>
        <span className="text-[10px] text-muted-foreground truncate max-w-[120px]">
          {event.league.name}
        </span>
      </div>

      {/* Teams & Score */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center justify-between">
            <span className={cn('text-sm font-medium truncate', status.momentum === 'home' && 'text-primary')}>
              {event.home.shortName}
            </span>
            <span className="text-lg font-bold font-display tabular-nums">{status.score?.home}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className={cn('text-sm font-medium truncate', status.momentum === 'away' && 'text-primary')}>
              {event.away.shortName}
            </span>
            <span className="text-lg font-bold font-display tabular-nums">{status.score?.away}</span>
          </div>
        </div>
      </div>

      {/* Momentum Bar */}
      <div className="h-1 bg-secondary rounded-full overflow-hidden">
        <div className="momentum-bar" style={{ width: momentumWidth }} />
      </div>

      {/* Quick Odds */}
      {featured && (
        <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
          {featured.outcomes.map((outcome) => (
            <OddsCell
              key={outcome.id}
              outcome={outcome}
              compact
              className="flex-1 py-1.5"
              onSelect={() => toggleSelection({
                id: `${event.id}-${outcome.id}`,
                eventId: event.id,
                event,
                marketId: featured.id,
                marketName: featured.name,
                outcomeId: outcome.id,
                outcomeName: outcome.name,
                odds: outcome.odds,
              })}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}
