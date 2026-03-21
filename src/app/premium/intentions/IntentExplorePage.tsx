import { mockIntentTrails } from '@/app/data/mocks/premium';
import { mockLiveEvents, mockUpcomingEvents } from '@/app/data/mocks/events';
import type { SportEvent } from '@/app/data/models/types';
import type { IntentTrail } from '@/app/premium/types';
import { useSimulatedFetch } from '@/app/premium/hooks/useSimulatedFetch';
import {
  FeatureStateBoundary,
  PremiumEmptyInline,
  PremiumErrorInline,
} from '@/app/premium/ui/FeatureStateBoundary';
import { useBetslipStore } from '@/app/state/betslipStore';
import { quickOddLabelClass, quickOddSlotClass, quickOddValueClass } from '@/lib/oddsQuickStyles';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ChevronDown, Compass, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function resolveEvents(ids: string[]): SportEvent[] {
  const pool = [...mockLiveEvents, ...mockUpcomingEvents];
  return ids.map((id) => pool.find((e) => e.id === id)).filter((e): e is SportEvent => Boolean(e));
}

function IntentBlock({ trail }: { trail: IntentTrail }) {
  const navigate = useNavigate();
  const toggleSelection = useBetslipStore((s) => s.toggleSelection);
  const selections = useBetslipStore((s) => s.selections);
  const [open, setOpen] = useState(false);
  const events = resolveEvents(trail.eventIds);

  return (
    <div className="rounded-2xl border border-border/50 bg-card/80 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-secondary/40 transition-colors"
      >
        <div className="min-w-0">
          <p className="text-sm font-display font-bold">{trail.title}</p>
          <p className="text-xs text-muted-foreground">{trail.subtitle}</p>
        </div>
        <ChevronDown className={cn('w-4 h-4 text-muted-foreground transition-transform shrink-0', open && 'rotate-180')} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-border/40 bg-secondary/20"
          >
            <div className="p-4 space-y-3">
              <p className="text-xs text-muted-foreground leading-relaxed">{trail.justification}</p>
              {events.map((event) => {
                const featured = event.markets.find((m) => m.isFeatured) ?? event.markets[0];
                const isLive = event.status.type === 'live';
                return (
                  <div key={event.id} className="rounded-xl border border-border/40 bg-card/60 p-3 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[10px] text-muted-foreground">{event.league.name}</p>
                        <p className="text-sm font-semibold truncate">
                          {event.home.shortName} × {event.away.shortName}
                        </p>
                      </div>
                      <span className="text-[10px] font-semibold text-muted-foreground">
                        {isLive ? `${event.status.clock}` : 'Pré-jogo'}
                      </span>
                    </div>
                    {featured && (
                      <div className="flex gap-1.5">
                        {featured.outcomes.slice(0, 3).map((o) => {
                          const isSel = selections.some((sel) => sel.outcomeId === o.id);
                          return (
                            <button
                              key={o.id}
                              type="button"
                              onClick={() =>
                                toggleSelection({
                                  id: `${event.id}-${o.id}`,
                                  eventId: event.id,
                                  event,
                                  marketId: featured.id,
                                  marketName: featured.name,
                                  outcomeId: o.id,
                                  outcomeName: o.name,
                                  odds: o.odds,
                                })
                              }
                              className={cn('flex-1 rounded-lg py-1.5 text-center', quickOddSlotClass(isSel))}
                            >
                              <span className={cn('text-[9px]', quickOddLabelClass(isSel))}>{o.name}</span>
                              <span className={cn('text-xs', quickOddValueClass(isSel))}>{o.odds.toFixed(2)}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => navigate(`/event/${event.id}`)}
                        className="flex-1 h-9 rounded-xl bg-primary/15 text-primary text-xs font-semibold flex items-center justify-center gap-1"
                      >
                        Abrir <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          featured &&
                          toggleSelection({
                            id: `${event.id}-${featured.outcomes[0].id}`,
                            eventId: event.id,
                            event,
                            marketId: featured.id,
                            marketName: featured.name,
                            outcomeId: featured.outcomes[0].id,
                            outcomeName: featured.outcomes[0].name,
                            odds: featured.outcomes[0].odds,
                          })
                        }
                        className="flex-1 h-9 rounded-xl bg-primary text-primary-foreground text-xs font-bold"
                      >
                        + Cupom
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PageSkeleton() {
  return (
    <div className="px-4 space-y-3 animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-16 rounded-2xl bg-secondary/70" />
      ))}
    </div>
  );
}

export default function IntentExplorePage() {
  const navigate = useNavigate();
  const loader = useMemo(() => async () => mockIntentTrails, []);

  const { state, data, error, retry } = useSimulatedFetch(loader, { latencyMs: 500 });
  const trails = data ?? [];
  const effectiveState = state === 'success' && trails.length === 0 ? 'empty' : state;

  return (
    <div className="space-y-4 py-4 pb-24">
      <div className="px-4 flex items-center gap-2">
        <button type="button" onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-secondary">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-primary/90">Premium</p>
          <h1 className="text-lg font-display font-bold flex items-center gap-2">
            <Compass className="w-5 h-5 text-primary" /> Explorar por intenção
          </h1>
          <p className="text-xs text-muted-foreground">Escolha o que você quer agora — nós montamos o caminho.</p>
        </div>
      </div>

      <div className="px-4">
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-3 flex gap-2 items-start">
          <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            Cada intenção combina contexto, mercados rápidos e justificativa curta — para decidir em segundos, não minutos.
          </p>
        </div>
      </div>

      <FeatureStateBoundary
        state={effectiveState}
        loading={<PageSkeleton />}
        empty={
          <div className="px-4">
            <PremiumEmptyInline title="Trilhas indisponíveis" description="Tente novamente em instantes." />
          </div>
        }
        error={
          <div className="px-4">
            <PremiumErrorInline message={error ?? ''} onRetry={retry} />
          </div>
        }
      >
        <div className="px-4 space-y-3">
          {trails.map((trail) => (
            <IntentBlock key={trail.intentId} trail={trail} />
          ))}
        </div>
      </FeatureStateBoundary>
    </div>
  );
}
