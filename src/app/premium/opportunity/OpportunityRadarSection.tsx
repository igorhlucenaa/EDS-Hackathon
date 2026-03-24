import { mockOpportunityRadar } from '@/app/data/mocks/premium';
import type { OpportunityRadarItem, UrgencyLevel } from '@/app/premium/types';
import { useSimulatedFetch } from '@/app/premium/hooks/useSimulatedFetch';
import { FeatureStateBoundary, PremiumEmptyInline, PremiumErrorInline } from '@/app/premium/ui/FeatureStateBoundary';
import { useBetslipStore } from '@/app/state/betslipStore';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ArrowRight, Flame, Radio, Sparkles, Zap } from 'lucide-react';
import { quickOddLabelClass, quickOddSlotClass, quickOddValueClass } from '@/lib/oddsQuickStyles';
import { useNavigate } from 'react-router-dom';

function urgencyStyles(u: UrgencyLevel) {
  switch (u) {
    case 'critical':
      return 'border-live-pulse/50 bg-live-pulse/10 text-live-pulse';
    case 'high':
      return 'border-primary/40 bg-primary/10 text-primary';
    case 'medium':
      return 'border-warning/40 bg-warning/5 text-warning';
    default:
      return 'border-border/60 bg-secondary/40 text-muted-foreground';
  }
}

function kindIcon(kind: OpportunityRadarItem['kind']) {
  switch (kind) {
    case 'starting_soon':
      return Sparkles;
    case 'decisive_moment':
      return Zap;
    case 'high_movement':
      return Radio;
    case 'favorite_context':
      return Flame;
    default:
      return Sparkles;
  }
}

function RadarCard({ item }: { item: OpportunityRadarItem }) {
  const navigate = useNavigate();
  const toggleSelection = useBetslipStore((s) => s.toggleSelection);
  const selections = useBetslipStore((s) => s.selections);
  const Icon = kindIcon(item.kind);
  const m = item.event.markets.find((mk) => mk.isFeatured) ?? item.event.markets[0];

  return (
    <motion.article
      className="flex-shrink-0 w-[min(320px,calc(100vw-2.5rem))] rounded-2xl border border-border/50 bg-card/90 backdrop-blur-sm p-3.5 shadow-sm"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className={cn('rounded-lg p-1.5 border', urgencyStyles(item.urgency))}>
            <Icon className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{item.sportLabel} · {item.leagueLabel}</p>
            <h3 className="text-sm font-display font-bold leading-tight truncate">
              {item.event.home.shortName} × {item.event.away.shortName}
            </h3>
          </div>
        </div>
        <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0', urgencyStyles(item.urgency))}>
          {item.statusOrTime}
        </span>
      </div>

      <p className="text-xs text-muted-foreground leading-snug line-clamp-2 mb-2">{item.highlightReason}</p>
      {item.movementNote && (
        <p className="text-[10px] text-primary/90 mb-2 flex items-center gap-1">
          <Radio className="w-3 h-3" /> {item.movementNote}
        </p>
      )}
      {item.favoriteContext && (
        <p className="text-[10px] text-warning mb-2">{item.favoriteContext}</p>
      )}

      <div className="flex gap-1.5 mb-3" onClick={(e) => e.stopPropagation()}>
        {item.quickMarket.outcomes.slice(0, 3).map((o) => {
          const isSel = selections.some((sel) => sel.outcomeId === o.id);
          return (
            <button
              key={o.id}
              type="button"
              onClick={() =>
                m &&
                toggleSelection({
                  id: `${item.event.id}-${o.id}`,
                  eventId: item.event.id,
                  event: item.event,
                  marketId: m.id,
                  marketName: m.name,
                  outcomeId: o.id,
                  outcomeName: o.name,
                  odds: o.odds,
                  previousOdds: m.outcomes.find((x) => x.id === o.id)?.previousOdds,
                })
              }
              className={cn('flex-1 rounded-lg py-1.5 text-center text-[9px]', quickOddSlotClass(isSel))}
            >
              <span className={cn('text-[9px]', quickOddLabelClass(isSel))}>{o.name}</span>
              <span className={cn('text-xs', quickOddValueClass(isSel))}>{o.odds.toFixed(2)}</span>
            </button>
          );
        })}
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => navigate(`/event/${item.event.id}`)}
          className="flex-1 h-9 rounded-xl bg-primary/15 text-primary text-xs font-semibold flex items-center justify-center gap-1 hover:bg-primary/25 transition-colors"
        >
          Abrir evento <ArrowRight className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() =>
            m &&
            toggleSelection({
              id: `${item.event.id}-${item.quickMarket.outcomes[0].id}`,
              eventId: item.event.id,
              event: item.event,
              marketId: m.id,
              marketName: m.name,
              outcomeId: item.quickMarket.outcomes[0].id,
              outcomeName: item.quickMarket.outcomes[0].name,
              odds: item.quickMarket.outcomes[0].odds,
            })
          }
          className="flex-1 h-9 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-colors"
        >
          Rápido
        </button>
      </div>
    </motion.article>
  );
}

function RadarSkeleton() {
  return (
    <div className="flex gap-3 overflow-hidden -mx-4 pb-1 pl-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))]">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex-shrink-0 w-[min(320px,calc(100vw-2.5rem))] h-[220px] rounded-2xl bg-secondary/60 animate-pulse" />
      ))}
    </div>
  );
}

export function OpportunityRadarSection() {
  const { state, data, error, retry } = useSimulatedFetch(
    async () => mockOpportunityRadar,
    { latencyMs: 550 }
  );

  const items = data ?? [];
  const effectiveState = state === 'success' && items.length === 0 ? 'empty' : state;

  return (
    <section className="space-y-3">
      <div className="px-4 flex items-end justify-between gap-2">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-primary/90">Premium</p>
          <h2 className="text-base font-display font-bold">Radar de Oportunidade</h2>
          <p className="text-xs text-muted-foreground">Curadoria em tempo real — menos ruído, mais contexto.</p>
        </div>
      </div>

      <FeatureStateBoundary
        state={effectiveState}
        loading={<RadarSkeleton />}
        empty={
          <div className="px-4">
            <PremiumEmptyInline
              title="Radar em pausa"
              description="Sem oportunidades destacadas no momento. Volte em instantes."
            />
          </div>
        }
        error={
          <div className="px-4">
            <PremiumErrorInline message={error ?? ''} onRetry={retry} />
          </div>
        }
      >
        <div
          className={cn(
            'flex gap-3 overflow-x-auto overflow-y-visible pb-1 -mx-4 scrollbar-hide snap-x snap-mandatory',
            'scroll-pl-4 scroll-pr-4',
            'pl-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))]'
          )}
        >
          {items.map((item) => (
            <div key={item.id} className="snap-start shrink-0">
              <RadarCard item={item} />
            </div>
          ))}
        </div>
      </FeatureStateBoundary>
    </section>
  );
}
