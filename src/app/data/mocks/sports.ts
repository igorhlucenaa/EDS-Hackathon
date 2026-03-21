import { Sport, League } from '../models/types';

export const mockSports: Sport[] = [
  { id: 'football', name: 'Futebol', slug: 'futebol', icon: '⚽', eventCount: 142, liveCount: 12 },
  { id: 'basketball', name: 'Basquete', slug: 'basquete', icon: '🏀', eventCount: 56, liveCount: 4 },
  { id: 'tennis', name: 'Tênis', slug: 'tenis', icon: '🎾', eventCount: 38, liveCount: 8 },
  { id: 'mma', name: 'MMA', slug: 'mma', icon: '🥊', eventCount: 14, liveCount: 1 },
  { id: 'volleyball', name: 'Vôlei', slug: 'volei', icon: '🏐', eventCount: 22, liveCount: 3 },
  { id: 'esports', name: 'E-Sports', slug: 'esports', icon: '🎮', eventCount: 31, liveCount: 5 },
  { id: 'table-tennis', name: 'Tênis de Mesa', slug: 'tenis-de-mesa', icon: '🏓', eventCount: 18, liveCount: 6 },
  { id: 'baseball', name: 'Beisebol', slug: 'beisebol', icon: '⚾', eventCount: 12, liveCount: 2 },
];

export const mockLeagues: League[] = [
  { id: 'brasileirao-a', name: 'Brasileirão Série A', slug: 'brasileirao-a', sportId: 'football', country: 'Brasil', countryCode: 'BR', isFeatured: true },
  { id: 'premier-league', name: 'Premier League', slug: 'premier-league', sportId: 'football', country: 'Inglaterra', countryCode: 'GB', isFeatured: true },
  { id: 'la-liga', name: 'La Liga', slug: 'la-liga', sportId: 'football', country: 'Espanha', countryCode: 'ES', isFeatured: true },
  { id: 'champions-league', name: 'Champions League', slug: 'champions-league', sportId: 'football', country: 'Europa', countryCode: 'EU', isFeatured: true },
  { id: 'libertadores', name: 'Libertadores', slug: 'libertadores', sportId: 'football', country: 'América do Sul', countryCode: 'SA', isFeatured: true },
  { id: 'nba', name: 'NBA', slug: 'nba', sportId: 'basketball', country: 'EUA', countryCode: 'US', isFeatured: true },
  { id: 'nbb', name: 'NBB', slug: 'nbb', sportId: 'basketball', country: 'Brasil', countryCode: 'BR', isFeatured: false },
  { id: 'ufc', name: 'UFC', slug: 'ufc', sportId: 'mma', country: 'Internacional', countryCode: 'INT', isFeatured: true },
  { id: 'atp', name: 'ATP Tour', slug: 'atp', sportId: 'tennis', country: 'Internacional', countryCode: 'INT', isFeatured: true },
  { id: 'superliga-volei', name: 'Superliga de Vôlei', slug: 'superliga-volei', sportId: 'volleyball', country: 'Brasil', countryCode: 'BR', isFeatured: false },
];
