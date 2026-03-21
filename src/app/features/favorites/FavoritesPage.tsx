import { mockLiveEvents, mockUpcomingEvents } from '@/app/data/mocks/events';
import { mockLeagues, mockSports } from '@/app/data/mocks/sports';
import { EventCard } from '@/app/shared/ui/EventCard';
import { LiveSnapshotCard } from '@/app/shared/ui/LiveSnapshotCard';
import { useUserStore } from '@/app/state/userStore';
import { cn } from '@/lib/utils';
import { Heart, Star } from 'lucide-react';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

export default function FavoritesPage() {
  const navigate = useNavigate();
  const favSports = useUserStore((s) => s.favoriteSports);
  const favLeagues = useUserStore((s) => s.favoriteLeagues);
  const favTeams = useUserStore((s) => s.favoriteTeams);
  const toggleSport = useUserStore((s) => s.toggleFavoriteSport);
  const toggleLeague = useUserStore((s) => s.toggleFavoriteLeague);

  const liveFavorites = useMemo(() => {
    return mockLiveEvents.filter(
      (e) => favTeams.includes(e.home.id) || favTeams.includes(e.away.id) || favLeagues.includes(e.leagueId)
    );
  }, [favTeams, favLeagues]);

  const soonFavorites = useMemo(() => {
    return mockUpcomingEvents.filter(
      (e) => favTeams.includes(e.home.id) || favTeams.includes(e.away.id) || favLeagues.includes(e.leagueId)
    );
  }, [favTeams, favLeagues]);

  return (
    <div className="space-y-6 py-4 pb-24">
      <div className="px-4">
        <div className="flex items-center gap-2 mb-1">
          <Heart className="w-5 h-5 text-primary fill-primary/30" />
          <h1 className="text-xl font-display font-bold">Favoritos</h1>
        </div>
        <p className="text-xs text-muted-foreground">Feed ao vivo e próximos jogos dos seus times e ligas.</p>
      </div>

      <section className="px-4">
        <h2 className="text-sm font-display font-bold mb-2 flex items-center gap-1">
          <Star className="w-4 h-4 text-warning" /> Ao vivo — seus favoritos
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {liveFavorites.length ? (
            liveFavorites.map((e) => <LiveSnapshotCard key={e.id} event={e} />)
          ) : (
            <p className="text-sm text-muted-foreground col-span-full">Nenhum jogo ao vivo dos favoritos agora.</p>
          )}
        </div>
      </section>

      <section className="px-4">
        <h2 className="text-sm font-display font-bold mb-2">Começando em breve</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {soonFavorites.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
          {soonFavorites.length === 0 && (
            <p className="text-sm text-muted-foreground col-span-full">Sem partidas próximas dos favoritos.</p>
          )}
        </div>
      </section>

      <section className="px-4">
        <h2 className="text-sm font-display font-bold mb-2">Gerir favoritos</h2>
        <div className="rounded-2xl border border-border/50 bg-card divide-y divide-border/40">
          <p className="px-3 py-2 text-[10px] font-semibold text-muted-foreground uppercase">Esportes</p>
          {mockSports.slice(0, 6).map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => toggleSport(s.id)}
              className={cn(
                'w-full flex items-center justify-between px-3 py-2.5 text-sm',
                favSports.includes(s.id) && 'bg-primary/5'
              )}
            >
              <span>
                {s.icon} {s.name}
              </span>
              <span className="text-xs text-primary">{favSports.includes(s.id) ? 'Seguindo' : 'Seguir'}</span>
            </button>
          ))}
        </div>
        <div className="rounded-2xl border border-border/50 bg-card divide-y divide-border/40 mt-3">
          <p className="px-3 py-2 text-[10px] font-semibold text-muted-foreground uppercase">Ligas</p>
          {mockLeagues.filter((l) => l.isFeatured).map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => toggleLeague(l.id)}
              className={cn(
                'w-full flex items-center justify-between px-3 py-2.5 text-sm',
                favLeagues.includes(l.id) && 'bg-primary/5'
              )}
            >
              <span className="truncate">{l.name}</span>
              <span className="text-xs text-primary shrink-0">{favLeagues.includes(l.id) ? 'Seguindo' : 'Seguir'}</span>
            </button>
          ))}
        </div>
      </section>

      <div className="px-4">
        <button
          type="button"
          onClick={() => navigate('/explore')}
          className="w-full py-3 rounded-xl border border-primary/30 text-primary text-sm font-semibold"
        >
          Explorar mais eventos
        </button>
      </div>
    </div>
  );
}
