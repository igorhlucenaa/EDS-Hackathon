import { cn } from '@/lib/utils';
import { SportEvent } from '@/app/data/models/types';
import { OddsCell } from './OddsCell';
import { useBetslipStore } from '@/app/state/betslipStore';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface EventCardProps {
  event: SportEvent;
  className?: string;
}

function timeUntil(date: string) {
  const diff = new Date(date).getTime() - Date.now();
  if (diff < 0) return 'Agora';
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ${mins % 60}min`;
  return `${Math.floor(hrs / 24)}d`;
}

export function EventCard({ event, className }: EventCardProps) {
  const navigate = useNavigate();
  const toggleSelection = useBetslipStore((s) => s.toggleSelection);
  const featured = event.markets.find((m) => m.isFeatured) ?? event.markets[0];
  const isLive = event.status.type === 'live';

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('bg-card border border-border/50 rounded-xl p-3 space-y-2 cursor-pointer hover:border-primary/30 transition-colors', className)}
      onClick={() => navigate(`/event/${event.id}`)}
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground truncate">{event.league.name}</span>
        {isLive ? (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-live-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-live-pulse live-pulse" />
            {event.status.clock}
          </span>
        ) : (
          <span className="text-[10px] text-muted-foreground">{timeUntil(event.startTime)}</span>
        )}
      </div>

      <div className="space-y-0.5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium truncate">{event.home.name}</span>
          {isLive && <span className="text-sm font-bold tabular-nums">{event.status.score?.home}</span>}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium truncate">{event.away.name}</span>
          {isLive && <span className="text-sm font-bold tabular-nums">{event.status.score?.away}</span>}
        </div>
      </div>

      {featured && (
        <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
          {featured.outcomes.map((outcome) => (
            <OddsCell
              key={outcome.id}
              outcome={outcome}
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
