import { mockLiveEvents, mockUpcomingEvents } from '@/app/data/mocks/events';
import { mockLeagues, mockSports } from '@/app/data/mocks/sports';
import { EventCard } from '@/app/shared/ui/EventCard';
import { LiveSnapshotCard } from '@/app/shared/ui/LiveSnapshotCard';
import { ArrowLeft } from 'lucide-react';
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function LeaguePage() {
  const { leagueId } = useParams();
  const navigate = useNavigate();
  const league = mockLeagues.find((l) => l.id === leagueId);
  const sport = league ? mockSports.find((s) => s.id === league.sportId) : undefined;

  const live = useMemo(() => mockLiveEvents.filter((e) => e.leagueId === leagueId), [leagueId]);
  const upcoming = useMemo(() => mockUpcomingEvents.filter((e) => e.leagueId === leagueId), [leagueId]);

  if (!league) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <p>Competição não encontrada</p>
        <button type="button" className="text-primary mt-2" onClick={() => navigate('/explore')}>
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5 py-4 pb-24">
      <div className="px-4 flex items-start gap-2">
        <button type="button" onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-secondary mt-0.5">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{sport?.icon} {sport?.name}</p>
          <h1 className="text-xl font-display font-bold">{league.name}</h1>
          <p className="text-xs text-muted-foreground">{league.country}</p>
        </div>
      </div>

      {live.length > 0 && (
        <section className="px-4">
          <h2 className="text-sm font-display font-bold mb-2">Ao vivo</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {live.map((e) => (
              <LiveSnapshotCard key={e.id} event={e} />
            ))}
          </div>
        </section>
      )}

      <section className="px-4">
        <h2 className="text-sm font-display font-bold mb-2">Próximos jogos</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {upcoming.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
          {upcoming.length === 0 && live.length === 0 && (
            <p className="text-sm text-muted-foreground">Nenhum evento listado para esta liga.</p>
          )}
        </div>
      </section>
    </div>
  );
}
