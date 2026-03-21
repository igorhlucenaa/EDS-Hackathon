// ===== Core Entities =====

export interface Sport {
  id: string;
  name: string;
  slug: string;
  icon: string;
  eventCount: number;
  liveCount: number;
}

export interface League {
  id: string;
  name: string;
  slug: string;
  sportId: string;
  country: string;
  countryCode: string;
  logo?: string;
  isFeatured: boolean;
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  logo?: string;
}

export interface EventStatus {
  type: 'pre_match' | 'live' | 'finished' | 'suspended' | 'cancelled';
  clock?: string;
  period?: string;
  score?: { home: number; away: number };
  momentum?: 'home' | 'away' | 'neutral';
}

export interface SportEvent {
  id: string;
  sportId: string;
  leagueId: string;
  league: League;
  home: Team;
  away: Team;
  status: EventStatus;
  startTime: string;
  markets: Market[];
  featuredMarket?: Market;
  isFeatured: boolean;
  viewerCount?: number;
}

export interface MarketOutcome {
  id: string;
  name: string;
  odds: number;
  previousOdds?: number;
  isLocked: boolean;
}

export interface Market {
  id: string;
  name: string;
  slug: string;
  category: string;
  explanation?: string;
  outcomes: MarketOutcome[];
  isSuspended: boolean;
  isFeatured: boolean;
}

// ===== Betslip =====

export interface BetSelection {
  id: string;
  eventId: string;
  event: SportEvent;
  marketId: string;
  marketName: string;
  outcomeId: string;
  outcomeName: string;
  odds: number;
  previousOdds?: number;
}

export type BetslipMode = 'simple' | 'advanced';
export type BetType = 'single' | 'accumulator';

export interface BetslipState {
  selections: BetSelection[];
  stake: number;
  mode: BetslipMode;
  betType: BetType;
}

// ===== User & Account =====

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  balance: number;
  bonusBalance: number;
  currency: string;
  experienceMode: 'beginner' | 'pro';
  favoriteSports: string[];
  favoriteLeagues: string[];
  favoriteTeams: string[];
}

export interface UserBet {
  id: string;
  selections: BetSelection[];
  stake: number;
  potentialReturn: number;
  status: 'open' | 'live' | 'won' | 'lost' | 'cashout_available' | 'cashed_out';
  cashoutValue?: number;
  placedAt: string;
  settledAt?: string;
  betType: BetType;
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'bet' | 'win' | 'cashout' | 'bonus';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  description: string;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  image: string;
  category: 'welcome' | 'sports' | 'live' | 'cashback' | 'special';
  expiresAt: string;
  ctaText: string;
  isActive: boolean;
}

export interface Notification {
  id: string;
  type: 'bet_result' | 'odds_change' | 'event_start' | 'promotion' | 'cashout';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}
