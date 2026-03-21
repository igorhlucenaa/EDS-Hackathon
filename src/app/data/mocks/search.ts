import { mockLeagues, mockSports } from './sports';
import { mockLiveEvents, mockUpcomingEvents } from './events';
import type { League, Sport } from '@/app/data/models/types';
import type { SportEvent } from '@/app/data/models/types';

export type SearchResultType = 'sport' | 'league' | 'event' | 'team';

export interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle: string;
  href: string;
}

function norm(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '');
}

export function buildSearchIndex(): SearchResult[] {
  const out: SearchResult[] = [];

  mockSports.forEach((s: Sport) => {
    out.push({
      id: `sport-${s.id}`,
      type: 'sport',
      title: `${s.icon} ${s.name}`,
      subtitle: `${s.eventCount} eventos`,
      href: `/sport/${s.id}`,
    });
  });

  mockLeagues.forEach((l: League) => {
    out.push({
      id: `league-${l.id}`,
      type: 'league',
      title: l.name,
      subtitle: `${l.country} · Esporte`,
      href: `/league/${l.id}`,
    });
  });

  [...mockLiveEvents, ...mockUpcomingEvents].forEach((e: SportEvent) => {
    out.push({
      id: `event-${e.id}`,
      type: 'event',
      title: `${e.home.shortName} × ${e.away.shortName}`,
      subtitle: e.league.name,
      href: `/event/${e.id}`,
    });
    out.push({
      id: `team-h-${e.home.id}-${e.id}`,
      type: 'team',
      title: e.home.name,
      subtitle: `vs ${e.away.shortName}`,
      href: `/event/${e.id}`,
    });
  });

  return out;
}

export function searchEverything(query: string, limit = 30): SearchResult[] {
  const q = norm(query);
  if (!q) return [];
  const idx = buildSearchIndex();
  return idx
    .filter((r) => norm(r.title + r.subtitle).includes(q))
    .slice(0, limit);
}
