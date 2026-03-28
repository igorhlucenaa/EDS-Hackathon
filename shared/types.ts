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

// ===== Gamification & Missions =====

export type UserProfile = 'beginner' | 'casual' | 'engaged' | 'returning';

export type MissionFrequency = 'daily' | 'weekly' | 'special';

export type MissionStatus = 'locked' | 'available' | 'in_progress' | 'completed' | 'claimed';

export type RewardType = 'odds_boost' | 'freebet' | 'badge' | 'special_mission' | 'avatar' | 'level_up' | 'surprise';

export type UserActionType =
  | 'open_app'
  | 'view_match'
  | 'place_bet_single'
  | 'place_bet_multiple'
  | 'place_live_bet'
  | 'visit_live_screen'
  | 'explore_new_market'
  | 'return_next_day'
  | 'complete_profile'
  | 'claim_reward'
  | 'share_bet';

export interface Reward {
  id: string;
  type: RewardType;
  title: string;
  description: string;
  icon: string;
  value?: number;
  expiresAt?: string;
  status: 'locked' | 'available' | 'claimed';
  claimedAt?: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  icon: string;
  frequency: MissionFrequency;
  targetProfile: UserProfile[];
  targetAction: UserActionType;
  targetCount: number;
  currentCount: number;
  status: MissionStatus;
  progress: number;
  rewards: Reward[];
  startsAt: string;
  expiresAt: string;
  completedAt?: string;
  order: number;
}

export interface MissionProgress {
  missionId: string;
  currentCount: number;
  completed: boolean;
  completedAt?: string;
}

export interface UserGamificationState {
  profile: UserProfile;
  level: number;
  currentXp: number;
  nextLevelXp: number;
  streak: number;
  lastActiveAt: string;
  totalMissionsCompleted: number;
  totalRewardsClaimed: number;
  dailyMissions: Mission[];
  weeklyMissions: Mission[];
  specialMissions: Mission[];
  rewards: Reward[];
  completedMissionIds: string[];
  claimedRewardIds: string[];
}

export interface UserActionEvent {
  id: string;
  type: UserActionType;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface MissionSummary {
  dailyMission: Mission | null;
  weeklyMission: Mission | null;
  currentStreak: number;
  level: number;
  xpProgress: number;
  totalXp: number;
  nextLevelXp: number;
  hasAvailableReward: boolean;
  profile: UserProfile;
  totalMissionsCompleted: number;
}

export interface MissionTrail {
  id: string;
  profile: UserProfile;
  title: string;
  description: string;
  missions: Mission[];
  progress: number;
  isUnlocked: boolean;
}

