import type { SportEvent, Market } from '../types';
import { mockLeagues } from './sports';

const getLeague = (id: string) => mockLeagues.find((l) => l.id === id)!;

const mainMarket = (homeOdds: number, drawOdds: number, awayOdds: number): Market => ({
  id: `m-${Math.random().toString(36).slice(2, 8)}`,
  name: 'Resultado Final',
  slug: 'resultado-final',
  category: 'Principal',
  explanation: 'Aposte em qual time vai vencer a partida ou se será empate.',
  outcomes: [
    { id: `o-h-${Math.random().toString(36).slice(2, 8)}`, name: 'Casa', odds: homeOdds, isLocked: false },
    { id: `o-d-${Math.random().toString(36).slice(2, 8)}`, name: 'Empate', odds: drawOdds, isLocked: false },
    { id: `o-a-${Math.random().toString(36).slice(2, 8)}`, name: 'Fora', odds: awayOdds, isLocked: false },
  ],
  isSuspended: false,
  isFeatured: true,
});

const overUnderMarket = (line: number, overOdds: number, underOdds: number): Market => ({
  id: `m-ou-${Math.random().toString(36).slice(2, 8)}`,
  name: `Mais/Menos ${line} Gols`,
  slug: 'mais-menos-gols',
  category: 'Gols',
  explanation: `Aposte se a partida terá mais ou menos de ${line} gols no total.`,
  outcomes: [
    { id: `o-over-${Math.random().toString(36).slice(2, 8)}`, name: `Mais de ${line}`, odds: overOdds, isLocked: false },
    { id: `o-under-${Math.random().toString(36).slice(2, 8)}`, name: `Menos de ${line}`, odds: underOdds, isLocked: false },
  ],
  isSuspended: false,
  isFeatured: false,
});

const bttsMarket = (yesOdds: number, noOdds: number): Market => ({
  id: `m-btts-${Math.random().toString(36).slice(2, 8)}`,
  name: 'Ambos Marcam',
  slug: 'ambos-marcam',
  category: 'Gols',
  explanation: 'Aposte se ambos os times vão marcar pelo menos um gol cada.',
  outcomes: [
    { id: `o-yes-${Math.random().toString(36).slice(2, 8)}`, name: 'Sim', odds: yesOdds, isLocked: false },
    { id: `o-no-${Math.random().toString(36).slice(2, 8)}`, name: 'Não', odds: noOdds, isLocked: false },
  ],
  isSuspended: false,
  isFeatured: false,
});

export const mockLiveEvents: SportEvent[] = [
  {
    id: 'ev-live-1',
    sportId: 'football',
    leagueId: 'brasileirao-a',
    league: getLeague('brasileirao-a'),
    home: { id: 't-fla', name: 'Flamengo', shortName: 'FLA' },
    away: { id: 't-pal', name: 'Palmeiras', shortName: 'PAL' },
    status: { type: 'live', clock: "67'", period: '2º Tempo', score: { home: 2, away: 1 }, momentum: 'home' },
    startTime: new Date(Date.now() - 67 * 60000).toISOString(),
    markets: [mainMarket(1.45, 4.5, 6.0), overUnderMarket(2.5, 1.55, 2.4), bttsMarket(1.35, 3.1)],
    isFeatured: true,
    viewerCount: 45230,
  },
  {
    id: 'ev-live-2',
    sportId: 'football',
    leagueId: 'premier-league',
    league: getLeague('premier-league'),
    home: { id: 't-ars', name: 'Arsenal', shortName: 'ARS' },
    away: { id: 't-mci', name: 'Manchester City', shortName: 'MCI' },
    status: { type: 'live', clock: "34'", period: '1º Tempo', score: { home: 0, away: 0 }, momentum: 'away' },
    startTime: new Date(Date.now() - 34 * 60000).toISOString(),
    markets: [mainMarket(2.8, 3.2, 2.5), overUnderMarket(2.5, 1.9, 1.9), bttsMarket(1.75, 2.05)],
    isFeatured: true,
    viewerCount: 128400,
  },
  {
    id: 'ev-live-3',
    sportId: 'football',
    leagueId: 'la-liga',
    league: getLeague('la-liga'),
    home: { id: 't-rma', name: 'Real Madrid', shortName: 'RMA' },
    away: { id: 't-bar', name: 'Barcelona', shortName: 'BAR' },
    status: { type: 'live', clock: "78'", period: '2º Tempo', score: { home: 3, away: 2 }, momentum: 'home' },
    startTime: new Date(Date.now() - 78 * 60000).toISOString(),
    markets: [mainMarket(1.3, 5.5, 8.0), overUnderMarket(4.5, 1.7, 2.1), bttsMarket(1.12, 6.0)],
    isFeatured: true,
    viewerCount: 312000,
  },
  {
    id: 'ev-live-4',
    sportId: 'basketball',
    leagueId: 'nba',
    league: getLeague('nba'),
    home: { id: 't-lal', name: 'LA Lakers', shortName: 'LAL' },
    away: { id: 't-gsw', name: 'Golden State Warriors', shortName: 'GSW' },
    status: { type: 'live', clock: 'Q3 4:23', period: '3º Quarto', score: { home: 78, away: 82 }, momentum: 'away' },
    startTime: new Date(Date.now() - 90 * 60000).toISOString(),
    markets: [{
      id: 'm-bb-1', name: 'Vencedor', slug: 'vencedor', category: 'Principal',
      explanation: 'Aposte em qual time vai vencer a partida.',
      outcomes: [
        { id: 'o-lal', name: 'LA Lakers', odds: 2.1, isLocked: false },
        { id: 'o-gsw', name: 'Golden State', odds: 1.75, isLocked: false },
      ],
      isSuspended: false, isFeatured: true,
    }],
    isFeatured: true,
    viewerCount: 89000,
  },
  {
    id: 'ev-live-5',
    sportId: 'tennis',
    leagueId: 'atp',
    league: getLeague('atp'),
    home: { id: 't-djok', name: 'N. Djokovic', shortName: 'DJO' },
    away: { id: 't-alca', name: 'C. Alcaraz', shortName: 'ALC' },
    status: { type: 'live', clock: '2º Set', period: 'Set 2', score: { home: 1, away: 0 }, momentum: 'neutral' },
    startTime: new Date(Date.now() - 55 * 60000).toISOString(),
    markets: [{
      id: 'm-ten-1', name: 'Vencedor', slug: 'vencedor', category: 'Principal',
      explanation: 'Aposte em qual jogador vai vencer a partida.',
      outcomes: [
        { id: 'o-djo', name: 'Djokovic', odds: 1.65, previousOdds: 1.72, isLocked: false },
        { id: 'o-alc', name: 'Alcaraz', odds: 2.25, previousOdds: 2.15, isLocked: false },
      ],
      isSuspended: false, isFeatured: true,
    }],
    isFeatured: false,
    viewerCount: 67000,
  },
];

export const mockUpcomingEvents: SportEvent[] = [
  {
    id: 'ev-up-1',
    sportId: 'football',
    leagueId: 'brasileirao-a',
    league: getLeague('brasileirao-a'),
    home: { id: 't-cor', name: 'Corinthians', shortName: 'COR' },
    away: { id: 't-sao', name: 'São Paulo', shortName: 'SAO' },
    status: { type: 'pre_match' },
    startTime: new Date(Date.now() + 45 * 60000).toISOString(),
    markets: [mainMarket(2.3, 3.1, 3.2), overUnderMarket(2.5, 2.0, 1.8), bttsMarket(1.85, 1.95)],
    isFeatured: true,
  },
  {
    id: 'ev-up-2',
    sportId: 'football',
    leagueId: 'champions-league',
    league: getLeague('champions-league'),
    home: { id: 't-bay', name: 'Bayern München', shortName: 'BAY' },
    away: { id: 't-psg', name: 'Paris Saint-Germain', shortName: 'PSG' },
    status: { type: 'pre_match' },
    startTime: new Date(Date.now() + 120 * 60000).toISOString(),
    markets: [mainMarket(1.9, 3.5, 3.8), overUnderMarket(2.5, 1.65, 2.2), bttsMarket(1.6, 2.3)],
    isFeatured: true,
  },
  {
    id: 'ev-up-3',
    sportId: 'football',
    leagueId: 'libertadores',
    league: getLeague('libertadores'),
    home: { id: 't-riv', name: 'River Plate', shortName: 'RIV' },
    away: { id: 't-fla2', name: 'Flamengo', shortName: 'FLA' },
    status: { type: 'pre_match' },
    startTime: new Date(Date.now() + 180 * 60000).toISOString(),
    markets: [mainMarket(2.5, 3.0, 2.9), overUnderMarket(2.5, 1.85, 1.95), bttsMarket(1.72, 2.1)],
    isFeatured: true,
  },
  {
    id: 'ev-up-4',
    sportId: 'football',
    leagueId: 'brasileirao-a',
    league: getLeague('brasileirao-a'),
    home: { id: 't-gre', name: 'Grêmio', shortName: 'GRE' },
    away: { id: 't-int', name: 'Internacional', shortName: 'INT' },
    status: { type: 'pre_match' },
    startTime: new Date(Date.now() + 300 * 60000).toISOString(),
    markets: [mainMarket(2.4, 3.2, 2.95), overUnderMarket(2.5, 1.95, 1.85), bttsMarket(1.8, 2.0)],
    isFeatured: false,
  },
  {
    id: 'ev-up-5',
    sportId: 'mma',
    leagueId: 'ufc',
    league: getLeague('ufc'),
    home: { id: 't-fighter1', name: 'A. Pereira', shortName: 'PER' },
    away: { id: 't-fighter2', name: 'I. Adesanya', shortName: 'ADE' },
    status: { type: 'pre_match' },
    startTime: new Date(Date.now() + 1440 * 60000).toISOString(),
    markets: [{
      id: 'm-ufc-1', name: 'Vencedor', slug: 'vencedor', category: 'Principal',
      explanation: 'Aposte em qual lutador vai vencer a luta.',
      outcomes: [
        { id: 'o-per', name: 'Pereira', odds: 1.55, isLocked: false },
        { id: 'o-ade', name: 'Adesanya', odds: 2.45, isLocked: false },
      ],
      isSuspended: false, isFeatured: true,
    }],
    isFeatured: true,
  },
];

export function pickHeroLiveEvent(events: SportEvent[]): SportEvent | undefined {
  const live = events.filter((e) => e.status.type === 'live');
  if (live.length === 0) return undefined;
  return [...live].sort((a, b) => (b.viewerCount ?? 0) - (a.viewerCount ?? 0))[0];
}
