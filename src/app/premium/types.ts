import type { BetSelection, SportEvent } from '@/app/data/models/types';

/** Radar de Oportunidade */
export type OpportunityKind =
  | 'starting_soon'
  | 'decisive_moment'
  | 'high_movement'
  | 'favorite_context'
  | 'profile_match';

export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';

export interface OpportunityRadarItem {
  id: string;
  kind: OpportunityKind;
  event: SportEvent;
  sportLabel: string;
  leagueLabel: string;
  statusOrTime: string;
  highlightReason: string;
  urgency: UrgencyLevel;
  movementNote?: string;
  favoriteContext?: string;
  quickMarket: { marketName: string; outcomes: { id: string; name: string; odds: number }[] };
}

/** Pressão do Jogo */
export type GamePhase = 'cold' | 'warming' | 'hot' | 'critical';

export interface GamePressureMetrics {
  eventId: string;
  intensity: number;
  dominance: { side: 'home' | 'away' | 'neutral'; value: number };
  pace: number;
  phase: GamePhase;
  pressureAcceleration: number;
  recentEvents: string[];
  momentSummary: string;
}

/** Explorar por Intenção */
export type UserIntentId =
  | 'quick_bets'
  | 'high_odds'
  | 'safer_options'
  | 'starting_now'
  | 'follow_live'
  | 'build_parlay'
  | 'see_favorites'
  | 'moment_opportunities';

export interface IntentTrail {
  intentId: UserIntentId;
  title: string;
  subtitle: string;
  justification: string;
  eventIds: string[];
}

/** Cupom Co-piloto */
export type CopilotRiskTone = 'low' | 'moderate' | 'elevated' | 'high';

export interface CopilotProfileSuggestion {
  id: 'conservative' | 'balanced' | 'aggressive';
  label: string;
  stakeFactor: number;
  summary: string;
  oddsHint: string;
}

export interface CopilotDependency {
  id: string;
  message: string;
  severity: 'info' | 'warning';
}

export interface CopilotIncompatibility {
  id: string;
  message: string;
}

/** Retomada inteligente */
export interface SavedCouponDraft {
  id: string;
  label: string;
  savedAt: string;
  selectionCount: number;
  totalOdds: number;
  stake: number;
}

export type PremiumLoadState = 'idle' | 'loading' | 'success' | 'empty' | 'error';

export interface ResumeChangeSummary {
  lineMovements: number;
  newFeaturedEvents: number;
  promotionsAdded: number;
}
