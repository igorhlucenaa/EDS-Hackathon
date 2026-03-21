import { mockLiveEvents, mockUpcomingEvents } from '@/app/data/mocks/events';
import { mockSports } from '@/app/data/mocks/sports';
import { mockPromotions, mockBets } from '@/app/data/mocks/user';
import { OpportunityRadarSection } from '@/app/premium/opportunity/OpportunityRadarSection';
import { SmartResumeSection } from '@/app/premium/resume/SmartResumeSection';
import { LiveSnapshotCard } from '@/app/shared/ui/LiveSnapshotCard';
import { EventCard } from '@/app/shared/ui/EventCard';
import { useBetslipStore } from '@/app/state/betslipStore';
import { useUserStore } from '@/app/state/userStore';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Zap, ChevronRight, Clock, TrendingUp, Star, Gift } from 'lucide-react';

function SectionHeader({ title, icon: Icon, actionLabel, onAction }: { title: string; icon?: any; actionLabel?: string; onAction?: () => void }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 text-primary" />}
        <h2 className="text-base font-display font-bold">{title}</h2>
      </div>
      {actionLabel && (
        <button onClick={onAction} className="flex items-center gap-0.5 text-xs text-primary font-medium hover:underline">
          {actionLabel} <ChevronRight className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const toggleSelection = useBetslipStore((s) => s.toggleSelection);
  const selections = useBetslipStore((s) => s.selections);
  const openBets = mockBets.filter(b => b.status === 'open' || b.status === 'live');
  const isPro = useUserStore((s) => s.experienceMode === 'pro');

  const adaptiveTop = isPro ? (
    <>
      <OpportunityRadarSection />
      <SmartResumeSection />
    </>
  ) : (
    <>
      <SmartResumeSection />
      <OpportunityRadarSection />
    </>
  );

  return (
    <div className="space-y-6 py-4">
      {adaptiveTop}

      {/* Hero — Featured Event */}
      {mockLiveEvents[2] && (
        <section className="px-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative bg-gradient-to-br from-primary/20 via-card to-card border border-primary/20 rounded-2xl p-4 cursor-pointer overflow-hidden"
            onClick={() => navigate(`/event/${mockLiveEvents[2].id}`)}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="flex items-center gap-1.5 mb-3">
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-live-pulse">
                <span className="w-2 h-2 rounded-full bg-live-pulse live-pulse" />
                AO VIVO
              </span>
              <span className="text-xs text-muted-foreground">• {mockLiveEvents[2].status.clock}</span>
              <span className="text-xs text-muted-foreground ml-auto">{mockLiveEvents[2].league.name}</span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="text-center flex-1">
                <div className="text-2xl font-display font-bold">{mockLiveEvents[2].home.shortName}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{mockLiveEvents[2].home.name}</div>
              </div>
              <div className="px-4 text-center">
                <div className="text-3xl font-display font-black tabular-nums text-primary">
                  {mockLiveEvents[2].status.score?.home} - {mockLiveEvents[2].status.score?.away}
                </div>
                <div className="text-[10px] text-muted-foreground mt-1">{mockLiveEvents[2].status.period}</div>
              </div>
              <div className="text-center flex-1">
                <div className="text-2xl font-display font-bold">{mockLiveEvents[2].away.shortName}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{mockLiveEvents[2].away.name}</div>
              </div>
            </div>
            {/* Quick odds */}
            {mockLiveEvents[2].featuredMarket ?? mockLiveEvents[2].markets[0] ? (() => {
              const m = mockLiveEvents[2].markets[0];
              return (
                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                  {m.outcomes.map((o) => {
                    const isSel = selections.some((sel) => sel.outcomeId === o.id);
                    return (
                      <button
                        key={o.id}
                        type="button"
                        onClick={() =>
                          toggleSelection({
                            id: `${mockLiveEvents[2].id}-${o.id}`,
                            eventId: mockLiveEvents[2].id,
                            event: mockLiveEvents[2],
                            marketId: m.id,
                            marketName: m.name,
                            outcomeId: o.id,
                            outcomeName: o.name,
                            odds: o.odds,
                          })
                        }
                        className={cn(
                          'flex-1 rounded-lg py-2 text-center transition-all duration-200',
                          isSel ? 'odds-cell-selected' : 'bg-secondary/80 hover:bg-secondary border border-border/50'
                        )}
                      >
                        <span className={cn('block text-[10px]', isSel ? 'text-white/85' : 'text-muted-foreground')}>
                          {o.name}
                        </span>
                        <span className={cn('text-sm tabular-nums', isSel ? 'text-white font-bold' : 'font-semibold')}>
                          {o.odds.toFixed(2)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              );
            })() : null}
          </motion.div>
        </section>
      )}

      {/* Quick Bet Strip — trilhas reais */}
      <section className="px-4">
        <SectionHeader title="Apostas Rápidas" icon={TrendingUp} actionLabel="Por intenção" onAction={() => navigate('/intencoes')} />
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
          {[
            { label: '⚡ Odds altas', to: '/intencoes' },
            { label: '🔥 Ao vivo', to: '/live' },
            { label: '⏰ Começando', to: '/explore' },
            { label: '🎯 Mercados', to: '/market-explorer' },
            { label: '⭐ Favoritos', to: '/favorites' },
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => navigate(item.to)}
              className="flex-shrink-0 bg-secondary border border-border/50 rounded-full px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>
      </section>

      {/* Sports Strip */}
      <section className="px-4">
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
          {mockSports.slice(0, 6).map((sport) => (
            <button
              key={sport.id}
              onClick={() => navigate(`/sport/${sport.id}`)}
              className="flex-shrink-0 flex flex-col items-center gap-1 bg-card border border-border/50 rounded-xl px-4 py-2.5 hover:border-primary/30 transition-colors min-w-[72px]"
            >
              <span className="text-lg">{sport.icon}</span>
              <span className="text-[10px] font-medium text-muted-foreground">{sport.name}</span>
              {sport.liveCount > 0 && (
                <span className="text-[9px] text-live-pulse font-medium">{sport.liveCount} ao vivo</span>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Open Bets — Continue de onde parou */}
      {openBets.length > 0 && (
        <section className="px-4">
          <SectionHeader title="Suas Apostas Abertas" icon={Star} actionLabel="Ver Todas" onAction={() => navigate('/bets')} />
          <div className="space-y-2">
            {openBets.slice(0, 2).map((bet) => (
              <div key={bet.id} className="bg-card border border-border/50 rounded-xl p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full',
                    bet.status === 'live' ? 'bg-live-pulse/20 text-live-pulse' : 'bg-primary/10 text-primary'
                  )}>
                    {bet.status === 'live' ? '🔴 Ao Vivo' : '⏳ Aberta'}
                  </span>
                  <span className="text-xs text-muted-foreground">{bet.betType === 'accumulator' ? 'Acumulada' : 'Simples'}</span>
                </div>
                {bet.selections.map((sel) => (
                  <div key={sel.id} className="text-xs text-muted-foreground">
                    <span className="text-foreground font-medium">{sel.outcomeName}</span> — {sel.marketName}
                  </div>
                ))}
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/30">
                  <span className="text-xs text-muted-foreground">Stake: R${bet.stake.toFixed(2)}</span>
                  <span className="text-sm font-semibold text-primary">R${bet.potentialReturn.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Live Now */}
      <section className="px-4">
        <SectionHeader title="Ao Vivo Agora" icon={Zap} actionLabel="Ver Todos" onAction={() => navigate('/live')} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {mockLiveEvents.slice(0, 3).map((event) => (
            <LiveSnapshotCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      {/* Starting Soon */}
      <section className="px-4">
        <SectionHeader title="Começando em Breve" icon={Clock} actionLabel="Explorar" onAction={() => navigate('/explore')} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {mockUpcomingEvents.slice(0, 3).map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      {/* Promotions */}
      <section className="px-4">
        <SectionHeader title="Promoções" icon={Gift} actionLabel="Ver Todas" onAction={() => navigate('/promotions')} />
        <div className="flex gap-3 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
          {mockPromotions.map((promo) => (
            <div key={promo.id} className="flex-shrink-0 w-[260px] bg-gradient-to-br from-primary/10 to-card border border-border/50 rounded-xl p-4 space-y-2">
              <span className="text-[10px] font-medium text-primary uppercase tracking-wider">{promo.category}</span>
              <h3 className="text-sm font-display font-bold">{promo.title}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2">{promo.description}</p>
              <button type="button" onClick={() => navigate('/promotions')} className="text-xs font-semibold text-primary hover:underline">
                {promo.ctaText} →
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
