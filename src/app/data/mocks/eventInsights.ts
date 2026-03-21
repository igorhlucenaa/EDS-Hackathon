/** Insights, stats e timeline mock por evento — Match Hub premium */

export interface StatRow {
  label: string;
  home: string | number;
  away: string | number;
}

export interface TimelineItem {
  id: string;
  minute: string;
  text: string;
  side?: 'home' | 'away' | 'neutral';
}

export interface EventInsight {
  headline: string;
  bullets: string[];
}

const defaultStats: StatRow[] = [
  { label: 'Posse', home: '54%', away: '46%' },
  { label: 'Finalizações', home: 12, away: 7 },
  { label: 'Chutes ao gol', home: 5, away: 3 },
  { label: 'Escanteios', home: 6, away: 4 },
];

const defaultTimeline: TimelineItem[] = [
  { id: 't1', minute: "1'", text: 'Apito inicial', side: 'neutral' },
  { id: 't2', minute: "23'", text: 'Cartão amarelo — visitante', side: 'away' },
  { id: 't3', minute: "41'", text: 'Gol — mandante', side: 'home' },
  { id: 't4', minute: "67'", text: 'Substituição dupla — mandante', side: 'home' },
];

const defaultInsight: EventInsight = {
  headline: 'Momento decisivo',
  bullets: [
    'Pressão alta no último terço nos últimos 10 minutos.',
    'Mercado de próximo gol aquecido — linha pode oscilar rápido.',
  ],
};

export function getEventStats(eventId: string): StatRow[] {
  void eventId;
  return defaultStats;
}

export function getEventTimeline(eventId: string): TimelineItem[] {
  void eventId;
  return defaultTimeline;
}

export function getEventInsight(eventId: string): EventInsight {
  void eventId;
  return defaultInsight;
}
