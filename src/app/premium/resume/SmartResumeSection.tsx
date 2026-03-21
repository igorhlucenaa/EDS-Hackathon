import { mockBets, mockUser } from '@/app/data/mocks/user';
import type { SportEvent } from '@/app/data/models/types';
import { mockLiveEvents, mockUpcomingEvents } from '@/app/data/mocks/events';
import { mockResumeChangesSince } from '@/app/data/mocks/premium';
import { useSimulatedFetch } from '@/app/premium/hooks/useSimulatedFetch';
import {
  FeatureStateBoundary,
  PremiumEmptyInline,
  PremiumErrorInline,
} from '@/app/premium/ui/FeatureStateBoundary';
import { useBetslipDraftStore } from '@/app/state/betslipDraftStore';
import { useUserStore } from '@/app/state/userStore';
import { useVisitStore } from '@/app/state/visitStore';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { ArrowRight, Bookmark, Clock, Flame, History, Radio, Sparkles } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SkeletonResume() {
  return (
    <div className="px-4 space-y-3 animate-pulse">
      <div className="h-28 rounded-2xl bg-secondary/70" />
      <div className="h-20 rounded-2xl bg-secondary/60" />
      <div className="h-16 rounded-xl bg-secondary/50" />
    </div>
  );
}

export function SmartResumeSection() {
  const navigate = useNavigate();
  const [anchorVisit] = useState(() => useVisitStore.getState().lastVisitAt);
  const drafts = useBetslipDraftStore((s) => s.drafts);
  const removeDraft = useBetslipDraftStore((s) => s.removeDraft);
  const recentIds = useVisitStore((s) => s.recentEventIds);
  const pushRecent = useVisitStore((s) => s.pushRecentEvent);
  const favoriteTeams = useUserStore((s) => s.favoriteTeams);

  useEffect(() => {
    useVisitStore.getState().markVisitComplete();
  }, []);

  const loader = useMemo(
    () => async () => {
      const allEvents = [...mockLiveEvents, ...mockUpcomingEvents];
      return {
        changes: mockResumeChangesSince(anchorVisit),
        openLive: mockBets.filter((b) => b.status === 'live'),
        openRest: mockBets.filter((b) => b.status === 'open'),
        upcoming: mockUpcomingEvents.slice(0, 2),
        recentEvents: recentIds
          .map((id) => allEvents.find((e) => e.id === id))
          .filter((e): e is SportEvent => Boolean(e)),
      };
    },
    [anchorVisit, recentIds]
  );

  const { state, data, error, retry } = useSimulatedFetch(loader, { latencyMs: 600 });

  const hasContent =
    data &&
    (data.openLive.length > 0 ||
      data.openRest.length > 0 ||
      drafts.length > 0 ||
      favoriteTeams.length > 0 ||
      data.recentEvents.length > 0 ||
      data.upcoming.length > 0);

  const effectiveState = state === 'success' && !hasContent ? 'empty' : state;

  return (
    <section className="space-y-3">
      <div className="px-4 flex items-end justify-between gap-2">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-primary/90">Premium</p>
          <h2 className="text-base font-display font-bold">Retomada inteligente</h2>
          <p className="text-xs text-muted-foreground">
            {anchorVisit
              ? `Desde ${formatDistanceToNow(new Date(anchorVisit), { addSuffix: true, locale: ptBR })}`
              : 'Bem-vindo de volta — priorizamos o que importa agora.'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/intencoes')}
          className="text-[10px] font-semibold text-primary flex items-center gap-0.5 shrink-0"
        >
          Intenções <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <FeatureStateBoundary
        state={effectiveState}
        loading={<SkeletonResume />}
        empty={
          <div className="px-4">
            <PremiumEmptyInline
              title="Tudo em dia"
              description="Sem apostas abertas ou rascunhos. Explore o radar ou monte uma múltipla."
            />
          </div>
        }
        error={
          <div className="px-4">
            <PremiumErrorInline message={error ?? ''} onRetry={retry} />
          </div>
        }
      >
        {data && (
          <div className="space-y-3 px-4">
            {/* Novidades */}
            <div className="rounded-2xl border border-primary/20 bg-primary/5 px-3 py-2.5 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1 rounded-full bg-card/80 px-2 py-0.5 border border-border/50">
                <Radio className="w-3 h-3 text-primary" /> {data.changes.lineMovements} linhas mexeram
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-card/80 px-2 py-0.5 border border-border/50">
                <Sparkles className="w-3 h-3 text-warning" /> {data.changes.newFeaturedEvents} jogos em destaque
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-card/80 px-2 py-0.5 border border-border/50">
                <Flame className="w-3 h-3 text-live-pulse" /> {data.changes.promotionsAdded} promo nova(s)
              </span>
            </div>

            {/* 1 — Apostas ao vivo / abertas */}
            {(data.openLive.length > 0 || data.openRest.length > 0) && (
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Suas apostas</p>
                {[...data.openLive, ...data.openRest].slice(0, 3).map((bet) => (
                  <motion.button
                    key={bet.id}
                    type="button"
                    onClick={() => navigate('/bets')}
                    className="w-full text-left rounded-2xl border border-border/50 bg-card p-3 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={cn(
                          'text-[10px] font-semibold px-2 py-0.5 rounded-full',
                          bet.status === 'live' ? 'bg-live-pulse/15 text-live-pulse' : 'bg-primary/10 text-primary'
                        )}
                      >
                        {bet.status === 'live' ? 'Ao vivo' : 'Aberta'}
                      </span>
                      <span className="text-[10px] text-muted-foreground">{bet.betType === 'accumulator' ? 'Múltipla' : 'Simples'}</span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {bet.selections.map((s) => s.outcomeName).join(' · ')}
                    </p>
                    <div className="flex items-center justify-between mt-2 text-xs">
                      <span className="text-muted-foreground">Stake R${bet.stake.toFixed(2)}</span>
                      <span className="font-semibold text-primary">Retorno R${bet.potentialReturn.toFixed(2)}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}

            {/* 2 — Rascunhos */}
            {drafts.length > 0 && (
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Cupons salvos</p>
                {drafts.slice(0, 2).map((d) => (
                  <div key={d.id} className="rounded-2xl border border-border/50 bg-secondary/30 p-3 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate flex items-center gap-1">
                        <Bookmark className="w-3.5 h-3.5 text-primary shrink-0" /> {d.label}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {d.selections.length} seleções ·{' '}
                        {d.selections.reduce((a, s) => a * s.odds, 1).toFixed(2)} odds · R${d.stake.toFixed(2)}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="text-[10px] font-semibold text-destructive/90"
                      onClick={() => removeDraft(d.id)}
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* 3 — Favoritos em contexto */}
            {favoriteTeams.length > 0 && (
              <div className="rounded-2xl border border-warning/20 bg-warning/5 p-3">
                <p className="text-[10px] font-bold uppercase tracking-wide text-warning mb-1">Favoritos em campo</p>
                <p className="text-xs text-muted-foreground">
                  {mockUser.name.split(' ')[0]}, Flamengo está no radar ao vivo — alinhado aos seus times.
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/event/ev-live-1')}
                  className="mt-2 text-xs font-semibold text-primary flex items-center gap-1"
                >
                  Abrir jogo <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* 4 — Recentes */}
            {data.recentEvents.length > 0 && (
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                  <History className="w-3 h-3" /> Eventos recentes
                </p>
                {data.recentEvents.slice(0, 2).map((e) => (
                  <button
                    key={e.id}
                    type="button"
                    onClick={() => navigate(`/event/${e.id}`)}
                    className="w-full rounded-xl border border-border/40 bg-card/50 px-3 py-2 text-left text-xs hover:border-primary/30 transition-colors"
                  >
                    {e.home.shortName} × {e.away.shortName}
                  </button>
                ))}
              </div>
            )}

            {/* 5 — Começando em breve / oportunidades */}
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" /> Em breve
              </p>
              <div className="flex gap-2 overflow-x-auto -mx-4 px-4 pb-1 scrollbar-hide">
                {data.upcoming.map((e) => (
                  <button
                    key={e.id}
                    type="button"
                    onClick={() => {
                      pushRecent(e.id);
                      navigate(`/event/${e.id}`);
                    }}
                    className="flex-shrink-0 min-w-[200px] rounded-xl border border-border/50 bg-secondary/30 px-3 py-2 text-left hover:border-primary/30 transition-colors"
                  >
                    <p className="text-[10px] text-muted-foreground">{e.league.name}</p>
                    <p className="text-sm font-semibold">
                      {e.home.shortName} × {e.away.shortName}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </FeatureStateBoundary>
    </section>
  );
}
