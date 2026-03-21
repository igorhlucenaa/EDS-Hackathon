import type { SportEvent } from '@/app/data/models/types';
import type { GamePressureMetrics } from '@/app/premium/types';
import { getPressureForEvent } from '@/app/data/mocks/premium';
import { OddsCell } from '@/app/shared/ui/OddsCell';
import { useBetslipStore } from '@/app/state/betslipStore';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Activity, ArrowRight, Gauge, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function phaseLabel(p: GamePressureMetrics['phase']) {
  switch (p) {
    case 'cold':
      return 'Fase morna';
    case 'warming':
      return 'Aquecendo';
    case 'hot':
      return 'Momento quente';
    case 'critical':
      return 'Decisivo';
    default:
      return '';
  }
}

interface Props {
  event: SportEvent;
  className?: string;
}

export function GamePressureCard({ event, className }: Props) {
  const navigate = useNavigate();
  const toggleSelection = useBetslipStore((s) => s.toggleSelection);
  const metrics = getPressureForEvent(event.id);
  const featured = event.markets.find((m) => m.isFeatured) ?? event.markets[0];
  const { status } = event;

  if (!metrics) {
    return null;
  }

  const domSide = metrics.dominance.side;
  const domPct = metrics.dominance.value;

  return (
    <motion.article
      layout
      className={cn(
        'rounded-2xl border border-border/50 bg-card/95 overflow-hidden shadow-sm hover:border-primary/25 transition-colors',
        className
      )}
    >
      <div className="p-3 space-y-3" onClick={() => navigate(`/event/${event.id}`)}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-live-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-live-pulse live-pulse" />
              AO VIVO
            </span>
            <span className="text-[10px] text-muted-foreground truncate">{event.league.name}</span>
          </div>
          <span className="text-[10px] text-muted-foreground shrink-0">{status.clock}</span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center justify-between">
              <span className={cn('text-sm font-semibold truncate', domSide === 'home' && 'text-primary')}>{event.home.shortName}</span>
              <span className="text-xl font-black font-display tabular-nums">{status.score?.home}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className={cn('text-sm font-semibold truncate', domSide === 'away' && 'text-primary')}>{event.away.shortName}</span>
              <span className="text-xl font-black font-display tabular-nums">{status.score?.away}</span>
            </div>
          </div>
          <div className="text-right space-y-1">
            <p className="text-[10px] text-muted-foreground">{status.period}</p>
            <div className="inline-flex items-center gap-1 rounded-full bg-secondary/80 px-2 py-0.5 text-[10px] font-semibold text-primary border border-primary/20">
              <Gauge className="w-3 h-3" />
              {phaseLabel(metrics.phase)}
            </div>
          </div>
        </div>

        {/* Pressão visual */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[10px] text-muted-foreground uppercase tracking-wide">
            <span className="flex items-center gap-1">
              <Activity className="w-3 h-3 text-primary" /> Pressão do jogo
            </span>
            <span className="tabular-nums">{metrics.intensity}/100</span>
          </div>
          <div className="h-2 rounded-full bg-secondary overflow-hidden relative">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary/40 via-primary to-live-pulse/80"
              initial={{ width: 0 }}
              animate={{ width: `${metrics.intensity}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-foreground/80"
              style={{ left: `${domPct}%` }}
              title="Dominância"
            />
          </div>
          <div className="flex justify-between text-[9px] text-muted-foreground">
            <span>Casa {domSide === 'home' ? '↑' : ''}</span>
            <span className="flex items-center gap-0.5 text-primary">
              <Zap className="w-3 h-3" /> +{metrics.pressureAcceleration}% ritmo
            </span>
            <span>Fora {domSide === 'away' ? '↑' : ''}</span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground leading-snug line-clamp-2">{metrics.momentSummary}</p>
        <ul className="text-[10px] text-muted-foreground space-y-0.5">
          {metrics.recentEvents.slice(0, 2).map((line) => (
            <li key={line}>• {line}</li>
          ))}
        </ul>
      </div>

      {featured && (
        <div className="border-t border-border/40 bg-secondary/20 px-3 py-2.5 space-y-2">
          <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
            {featured.outcomes.map((outcome) => (
              <OddsCell
                key={outcome.id}
                outcome={outcome}
                compact
                className="flex-1 py-1.5"
                onSelect={() =>
                  toggleSelection({
                    id: `${event.id}-${outcome.id}`,
                    eventId: event.id,
                    event,
                    marketId: featured.id,
                    marketName: featured.name,
                    outcomeId: outcome.id,
                    outcomeName: outcome.name,
                    odds: outcome.odds,
                    previousOdds: outcome.previousOdds,
                  })
                }
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/event/${event.id}`);
              }}
              className="flex-1 h-9 rounded-xl bg-primary/15 text-primary text-xs font-semibold flex items-center justify-center gap-1"
            >
              Abrir evento <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                const o = featured.outcomes[0];
                toggleSelection({
                  id: `${event.id}-${o.id}`,
                  eventId: event.id,
                  event,
                  marketId: featured.id,
                  marketName: featured.name,
                  outcomeId: o.id,
                  outcomeName: o.name,
                  odds: o.odds,
                });
              }}
              className="flex-1 h-9 rounded-xl bg-primary text-primary-foreground text-xs font-bold"
            >
              Cupom rápido
            </button>
          </div>
        </div>
      )}
    </motion.article>
  );
}
