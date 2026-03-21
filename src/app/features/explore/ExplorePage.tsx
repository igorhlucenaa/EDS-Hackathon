import { mockSports, mockLeagues } from '@/app/data/mocks/sports';
import { mockUpcomingEvents, mockLiveEvents } from '@/app/data/mocks/events';
import { EventCard } from '@/app/shared/ui/EventCard';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Search, X } from 'lucide-react';

export default function ExplorePage() {
  const [selectedSport, setSelectedSport] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const allEvents = [...mockLiveEvents, ...mockUpcomingEvents];
  const filtered = allEvents.filter((e) => {
    if (selectedSport && e.sportId !== selectedSport) return false;
    if (search) {
      const q = search.toLowerCase();
      return e.home.name.toLowerCase().includes(q) || e.away.name.toLowerCase().includes(q) || e.league.name.toLowerCase().includes(q);
    }
    return true;
  });

  const sportLeagues = selectedSport ? mockLeagues.filter(l => l.sportId === selectedSport) : mockLeagues.filter(l => l.isFeatured);

  return (
    <div className="space-y-4 py-4">
      <div className="px-4">
        <h1 className="text-xl font-display font-bold mb-3">Explorar</h1>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar times, ligas, eventos..."
            className="w-full bg-secondary border border-border/50 rounded-xl pl-9 pr-9 py-2.5 text-sm outline-none focus:border-primary/50 transition-colors placeholder:text-muted-foreground"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* Sport Chips */}
      <div className="px-4">
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
          <button
            onClick={() => setSelectedSport(null)}
            className={cn('flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors', !selectedSport ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary border-border/50 text-muted-foreground')}
          >
            Todos
          </button>
          {mockSports.map((sport) => (
            <button
              key={sport.id}
              onClick={() => setSelectedSport(sport.id === selectedSport ? null : sport.id)}
              className={cn('flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors', selectedSport === sport.id ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary border-border/50 text-muted-foreground')}
            >
              {sport.icon} {sport.name}
            </button>
          ))}
        </div>
      </div>

      {/* Popular Leagues */}
      {!search && (
        <div className="px-4">
          <h2 className="text-sm font-display font-bold mb-2">Ligas Populares</h2>
          <div className="flex gap-2 overflow-x-auto -mx-4 px-4 pb-1 scrollbar-hide">
            {sportLeagues.slice(0, 6).map((league) => (
              <button key={league.id} className="flex-shrink-0 bg-card border border-border/50 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors">
                {league.countryCode === 'BR' ? '🇧🇷' : league.countryCode === 'GB' ? '🇬🇧' : league.countryCode === 'ES' ? '🇪🇸' : '🌍'} {league.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Events */}
      <div className="px-4">
        <h2 className="text-sm font-display font-bold mb-2">
          {search ? `Resultados (${filtered.length})` : 'Eventos'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Nenhum evento encontrado</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
