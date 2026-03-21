import { useParams, useNavigate } from 'react-router-dom';
import { mockLiveEvents, mockUpcomingEvents } from '@/app/data/mocks/events';
import { OddsCell } from '@/app/shared/ui/OddsCell';
import { useBetslipStore } from '@/app/state/betslipStore';
import { useUserStore } from '@/app/state/userStore';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { Market, SportEvent } from '@/app/data/models/types';

function MarketGroup({ market, event }: { market: Market; event: SportEvent }) {
  const [expanded, setExpanded] = useState(market.isFeatured);
  const [showExplanation, setShowExplanation] = useState(false);
  const toggleSelection = useBetslipStore((s) => s.toggleSelection);
  const mode = useUserStore((s) => s.experienceMode);

  return (
    <div className="border border-border/50 rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full px-3 py-2.5 bg-surface-2 hover:bg-surface-3 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{market.name}</span>
          {market.isSuspended && <span className="text-[10px] text-odds-suspended font-medium">Suspenso</span>}
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>
      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="px-3 py-2.5 space-y-2"
        >
          {mode === 'beginner' && market.explanation && (
            <button onClick={() => setShowExplanation(!showExplanation)} className="flex items-center gap-1 text-[10px] text-primary">
              <Info className="w-3 h-3" /> {showExplanation ? 'Ocultar' : 'Como funciona?'}
            </button>
          )}
          {showExplanation && market.explanation && (
            <p className="text-xs text-muted-foreground bg-primary/5 rounded-lg p-2">{market.explanation}</p>
          )}
          <div className={cn('grid gap-1.5', market.outcomes.length === 2 ? 'grid-cols-2' : 'grid-cols-3')}>
            {market.outcomes.map((outcome) => (
              <OddsCell
                key={outcome.id}
                outcome={outcome}
                onSelect={() => toggleSelection({
                  id: `${event.id}-${outcome.id}`,
                  eventId: event.id,
                  event,
                  marketId: market.id,
                  marketName: market.name,
                  outcomeId: outcome.id,
                  outcomeName: outcome.name,
                  odds: outcome.odds,
                })}
              />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default function EventPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'markets' | 'stats' | 'timeline'>('markets');

  const event = [...mockLiveEvents, ...mockUpcomingEvents].find((e) => e.id === id);
  if (!event) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-muted-foreground">
        <p>Evento não encontrado</p>
      </div>
    );
  }

  const isLive = event.status.type === 'live';
  const categories = [...new Set(event.markets.map((m) => m.category))];

  return (
    <div className="space-y-4 pb-4">
      {/* Match Header */}
      <div className={cn('px-4 pt-4 pb-3', isLive ? 'bg-gradient-to-b from-live-pulse/10 to-transparent' : 'bg-gradient-to-b from-primary/5 to-transparent')}>
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-xs text-muted-foreground mb-3 hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>

        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-muted-foreground">{event.league.name}</span>
          {isLive && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-live-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-live-pulse live-pulse" /> AO VIVO • {event.status.clock}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between py-4">
          <div className="text-center flex-1">
            <div className="text-xl font-display font-bold">{event.home.shortName}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{event.home.name}</div>
          </div>
          <div className="px-6 text-center">
            {isLive ? (
              <div className="text-4xl font-display font-black tabular-nums">
                {event.status.score?.home} <span className="text-muted-foreground">-</span> {event.status.score?.away}
              </div>
            ) : (
              <div className="text-lg font-display font-bold text-muted-foreground">VS</div>
            )}
            {isLive && event.status.period && (
              <div className="text-[10px] text-muted-foreground mt-1">{event.status.period}</div>
            )}
          </div>
          <div className="text-center flex-1">
            <div className="text-xl font-display font-bold">{event.away.shortName}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{event.away.name}</div>
          </div>
        </div>

        {/* Momentum */}
        {isLive && (
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
            <div
              className="momentum-bar h-full"
              style={{ width: event.status.momentum === 'home' ? '70%' : event.status.momentum === 'away' ? '30%' : '50%' }}
            />
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="px-4">
        <div className="flex gap-1 bg-secondary rounded-lg p-0.5">
          {(['markets', 'stats', 'timeline'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'flex-1 py-2 rounded-md text-xs font-medium transition-colors',
                activeTab === tab ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {tab === 'markets' ? 'Mercados' : tab === 'stats' ? 'Estatísticas' : 'Timeline'}
            </button>
          ))}
        </div>
      </div>

      {/* Markets */}
      {activeTab === 'markets' && (
        <div className="px-4 space-y-2">
          {event.markets.map((market) => (
            <MarketGroup key={market.id} market={market} event={event} />
          ))}
        </div>
      )}

      {/* Stats placeholder */}
      {activeTab === 'stats' && (
        <div className="px-4 text-center py-12 text-muted-foreground">
          <p className="text-sm">Estatísticas em breve</p>
        </div>
      )}

      {/* Timeline placeholder */}
      {activeTab === 'timeline' && (
        <div className="px-4 text-center py-12 text-muted-foreground">
          <p className="text-sm">Timeline em breve</p>
        </div>
      )}
    </div>
  );
}
