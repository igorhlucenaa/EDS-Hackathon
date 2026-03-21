import { mockLiveEvents, mockUpcomingEvents, pickHeroLiveEvent } from '@/app/data/mocks/events';
import { mockSports } from '@/app/data/mocks/sports';
import { mockPromotions, mockBets } from '@/app/data/mocks/user';
import type { SportEvent } from '@/app/data/models/types';
import { OpportunityRadarSection } from '@/app/premium/opportunity/OpportunityRadarSection';
import { SmartResumeSection } from '@/app/premium/resume/SmartResumeSection';
import { LiveSnapshotCard } from '@/app/shared/ui/LiveSnapshotCard';
import { EventCard } from '@/app/shared/ui/EventCard';
import { HorizontalScrollRow } from '@/app/shared/ui/HorizontalScrollRow';
import { useBetslipStore } from '@/app/state/betslipStore';
import { useUserStore } from '@/app/state/userStore';
import { useVisitStore } from '@/app/state/visitStore';
import { HomeWelcomeBanner } from './HomeWelcomeBanner';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Zap,
  ChevronRight,
  Clock,
  TrendingUp,
  Star,
  Gift,
  LayoutGrid,
  type LucideIcon,
} from 'lucide-react';

function SectionHeader({
  title,
  description,
  icon: Icon,
  actionLabel,
  onAction,
}: {
  title: string;
  description?: string;
  icon?: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="mb-3 space-y-1">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {Icon && <Icon className="w-4 h-4 text-primary shrink-0" aria-hidden />}
          <h2 className="text-base font-display font-bold">{title}</h2>
        </div>
        {actionLabel && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="flex items-center gap-0.5 text-xs text-primary font-medium hover:underline shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
          >
            {actionLabel} <ChevronRight className="w-3 h-3" aria-hidden />
          </button>
        )}
      </div>
      {description && <p className="text-xs text-muted-foreground leading-snug">{description}</p>}
    </div>
  );
}

const QUICK_CHIPS: { emoji: string; label: string; to: string }[] = [
  { emoji: '⚡', label: 'Odds altas', to: '/intencoes' },
  { emoji: '🔥', label: 'Ao vivo', to: '/live' },
  { emoji: '⏰', label: 'Começando', to: '/explore' },
  { emoji: '🎯', label: 'Mercados', to: '/market-explorer' },
  { emoji: '⭐', label: 'Favoritos', to: '/favorites' },
];

function HeroFeaturedCard({ event }: { event: SportEvent }) {
  const navigate = useNavigate();
  const toggleSelection = useBetslipStore((s) => s.toggleSelection);
  const selections = useBetslipStore((s) => s.selections);
  const m = event.markets[0];

  return (
    <section className="px-4">
      <div className="mb-2 px-0.5">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-primary/90">Destaque da home</p>
        <p className="text-xs text-muted-foreground">Partida ao vivo com maior audiência no momento — abra para ver todos os mercados.</p>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-br from-primary/20 via-card to-card border border-primary/20 rounded-2xl p-4 cursor-pointer overflow-hidden"
        onClick={() => navigate(`/event/${event.id}`)}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" aria-hidden />
        <div className="flex items-center gap-1.5 mb-3 flex-wrap">
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">Jogo em destaque</span>
          <span className="text-xs text-muted-foreground" aria-hidden>
            ·
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-live-pulse">
            <span className="w-2 h-2 rounded-full bg-live-pulse live-pulse" aria-hidden />
            Ao vivo
          </span>
          <span className="text-xs text-muted-foreground">· {event.status.clock}</span>
          <span className="text-xs text-muted-foreground ml-auto">{event.league.name}</span>
        </div>
        <div className="flex items-center justify-between mb-4">
          <div className="text-center flex-1">
            <div className="text-2xl font-display font-bold">{event.home.shortName}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{event.home.name}</div>
          </div>
          <div className="px-4 text-center">
            <div className="text-3xl font-display font-black tabular-nums text-primary">
              {event.status.score?.home} - {event.status.score?.away}
            </div>
            <div className="text-[10px] text-muted-foreground mt-1">{event.status.period}</div>
          </div>
          <div className="text-center flex-1">
            <div className="text-2xl font-display font-bold">{event.away.shortName}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{event.away.name}</div>
          </div>
        </div>
        {m && (
          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
            {m.outcomes.map((o) => {
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
                      marketId: m.id,
                      marketName: m.name,
                      outcomeId: o.id,
                      outcomeName: o.name,
                      odds: o.odds,
                    })
                  }
                  className={cn(
                    'flex-1 rounded-lg py-2 text-center transition-all duration-200',
                    isSel ? 'odds-cell-selected' : 'bg-secondary/80 hover:bg-secondary border border-border/50',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card'
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
        )}
      </motion.div>
    </section>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const openBets = mockBets.filter((b) => b.status === 'open' || b.status === 'live');
  const isPro = useUserStore((s) => s.experienceMode === 'pro');
  const welcomeDismissed = useVisitStore((s) => s.homeWelcomeDismissed);

  const heroEvent = pickHeroLiveEvent(mockLiveEvents);
  const liveGridEvents = mockLiveEvents.filter((e) => !heroEvent || e.id !== heroEvent.id).slice(0, 3);

  const adaptiveTop =
    !welcomeDismissed ? (
      <SmartResumeSection />
    ) : isPro ? (
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
      <HomeWelcomeBanner />

      {adaptiveTop}

      {heroEvent && <HeroFeaturedCard event={heroEvent} />}

      <section className="px-4">
        <SectionHeader
          title="Apostas rápidas"
          description="Atalhos por objetivo — a aba Ao vivo concentra tudo que está rolando agora."
          icon={TrendingUp}
          actionLabel="Por intenção"
          onAction={() => navigate('/intencoes')}
        />
        <HorizontalScrollRow ariaLabel="Atalhos de apostas rápidas">
          {QUICK_CHIPS.map((item) => (
            <button
              key={item.to + item.label}
              type="button"
              role="listitem"
              onClick={() => navigate(item.to)}
              className={cn(
                'flex-shrink-0 flex items-center gap-1.5 bg-secondary border border-border/50 rounded-full px-4 py-2',
                'text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors snap-start',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'
              )}
            >
              <span aria-hidden>{item.emoji}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </HorizontalScrollRow>
      </section>

      <section className="px-4">
        <SectionHeader
          title="Esportes"
          description="Escolha um esporte para ver competições e jogos."
          icon={LayoutGrid}
        />
        <HorizontalScrollRow ariaLabel="Lista de esportes" showScrollHint={false}>
          {mockSports.slice(0, 6).map((sport) => (
            <button
              key={sport.id}
              type="button"
              role="listitem"
              onClick={() => navigate(`/sport/${sport.id}`)}
              className={cn(
                'flex-shrink-0 flex flex-col items-center gap-1 bg-card border border-border/50 rounded-xl px-4 py-2.5',
                'hover:border-primary/30 transition-colors min-w-[72px] snap-start',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'
              )}
            >
              <span className="text-lg" aria-hidden>
                {sport.icon}
              </span>
              <span className="text-[10px] font-medium text-muted-foreground">{sport.name}</span>
              {sport.liveCount > 0 && (
                <span className="text-[9px] text-live-pulse font-medium">
                  {sport.liveCount} ao vivo
                </span>
              )}
            </button>
          ))}
        </HorizontalScrollRow>
      </section>

      {openBets.length > 0 && (
        <section className="px-4">
          <SectionHeader title="Suas apostas abertas" icon={Star} actionLabel="Ver todas" onAction={() => navigate('/bets')} />
          <div className="space-y-2">
            {openBets.slice(0, 2).map((bet) => (
              <div key={bet.id} className="bg-card border border-border/50 rounded-xl p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={cn(
                      'text-[10px] font-medium px-2 py-0.5 rounded-full',
                      bet.status === 'live' ? 'bg-live-pulse/20 text-live-pulse' : 'bg-primary/10 text-primary'
                    )}
                  >
                    <span className="sr-only">Status: </span>
                    {bet.status === 'live' ? 'Ao vivo' : 'Aberta'}
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

      <section className="px-4">
        <SectionHeader
          title="Mais jogos ao vivo"
          description="Grade resumida — na aba Ao vivo você vê a lista completa e filtros."
          icon={Zap}
          actionLabel="Ver todos"
          onAction={() => navigate('/live')}
        />
        {liveGridEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {liveGridEvents.map((event) => (
              <LiveSnapshotCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">Não há outros jogos ao vivo no momento.</p>
        )}
      </section>

      <section className="px-4">
        <SectionHeader title="Começando em breve" icon={Clock} actionLabel="Explorar" onAction={() => navigate('/explore')} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {mockUpcomingEvents.slice(0, 3).map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      <section className="px-4">
        <SectionHeader title="Promoções" icon={Gift} actionLabel="Ver todas" onAction={() => navigate('/promotions')} />
        <HorizontalScrollRow ariaLabel="Promoções em destaque">
          {mockPromotions.map((promo) => (
            <div
              key={promo.id}
              role="listitem"
              className="flex-shrink-0 w-[260px] snap-start bg-gradient-to-br from-primary/10 to-card border border-border/50 rounded-xl p-4 space-y-2"
            >
              <span className="text-[10px] font-medium text-primary uppercase tracking-wider">{promo.category}</span>
              <h3 className="text-sm font-display font-bold">{promo.title}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2">{promo.description}</p>
              <button
                type="button"
                onClick={() => navigate('/promotions')}
                className="text-xs font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
              >
                {promo.ctaText} →
              </button>
            </div>
          ))}
        </HorizontalScrollRow>
      </section>
    </div>
  );
}
