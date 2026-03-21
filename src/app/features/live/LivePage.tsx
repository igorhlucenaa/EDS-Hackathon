import { mockLiveEvents } from '@/app/data/mocks/events';
import { mockSports } from '@/app/data/mocks/sports';
import { getPressureForEvent } from '@/app/data/mocks/premium';
import { GamePressureCard } from '@/app/premium/pressure/GamePressureCard';
import { LiveSnapshotCard } from '@/app/shared/ui/LiveSnapshotCard';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

export default function LivePage() {
  const [activeSport, setActiveSport] = useState<string | null>(null);
  const filtered = activeSport ? mockLiveEvents.filter(e => e.sportId === activeSport) : mockLiveEvents;

  const liveSports = mockSports.filter(s => s.liveCount > 0);
  const totalLive = mockLiveEvents.length;

  return (
    <div className="space-y-4 py-4">
      {/* Header */}
      <div className="px-4">
        <div className="flex items-center gap-2 mb-1">
          <Zap className="w-5 h-5 text-live-pulse" />
          <h1 className="text-xl font-display font-bold">Ao Vivo</h1>
          <span className="text-xs text-muted-foreground ml-1">{totalLive} eventos</span>
        </div>
        <p className="text-xs text-muted-foreground">Acompanhe e aposte em tempo real</p>
      </div>

      {/* Sport Filters */}
      <div className="px-4">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-primary/90 mb-2">Premium · Pressão do jogo</p>
        <p className="text-xs text-muted-foreground mb-3">Intensidade, dominância e ritmo — sem ruído extra.</p>
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
          <button
            onClick={() => setActiveSport(null)}
            className={cn(
              'flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
              !activeSport ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary border-border/50 text-muted-foreground hover:text-foreground'
            )}
          >
            Todos ({totalLive})
          </button>
          {liveSports.map((sport) => (
            <button
              key={sport.id}
              onClick={() => setActiveSport(sport.id === activeSport ? null : sport.id)}
              className={cn(
                'flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
                activeSport === sport.id ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary border-border/50 text-muted-foreground hover:text-foreground'
              )}
            >
              {sport.icon} {sport.name} ({sport.liveCount})
            </button>
          ))}
        </div>
      </div>

      {/* Live Events */}
      <motion.div layout className="px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((event) =>
          getPressureForEvent(event.id) ? (
            <GamePressureCard key={event.id} event={event} />
          ) : (
            <LiveSnapshotCard key={event.id} event={event} />
          )
        )}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            <Zap className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Nenhum evento ao vivo neste esporte agora</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
