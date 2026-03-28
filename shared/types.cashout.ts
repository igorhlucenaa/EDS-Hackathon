// ===== Cashout Feature Types =====

export type CashoutStatus =
  | 'available'
  | 'rising'
  | 'fluctuating'
  | 'unavailable';

export type CashoutType = 'full' | 'partial';

export interface CashoutOffer {
  betId: string;
  status: CashoutStatus;
  availableAmount: number;
  originalStake: number;
  potentialReturn: number;
  message?: string;
  updatedAt: string;
}

export interface CashoutPreview {
  betId: string;
  type: CashoutType;
  selectedPercentage: number;
  cashoutAmount: number;
  remainingAmountInPlay: number;
  remainingPotentialReturn: number;
  message: string;
}

export interface CashoutExecutionResult {
  success: boolean;
  type: CashoutType;
  amountCredited: number;
  remainingAmountInPlay: number;
  remainingPotentialReturn: number;
  message: string;
  timestamp: string;
  newBalance?: number;
}

export interface PartialCashoutRecord {
  percentage: number;
  amount: number;
  timestamp: string;
}

// Extended UserBet with cashout details
export interface OpenBet {
  id: string;
  selections: Array<{
    id: string;
    eventId: string;
    eventName: string;
    marketName: string;
    outcomeName: string;
    odds: number;
    leagueName?: string;
    homeTeam?: string;
    awayTeam?: string;
    score?: { home: number; away: number };
    minute?: number;
  }>;
  stake: number;
  potentialReturn: number;
  status: 'open' | 'live' | 'cashout_available' | 'cashed_out' | 'partial_cashout';
  placedAt: string;
  betType: 'single' | 'accumulator';
  // Cashout specific fields
  cashoutOffer?: CashoutOffer;
  partialCashouts?: PartialCashoutRecord[];
  remainingExposure?: number; // Amount still in play after partial cashout
  cashedOutAmount?: number; // Total amount already cashed out
}

export interface CashoutHistoryItem {
  id: string;
  betId: string;
  type: CashoutType;
  amount: number;
  timestamp: string;
  betDescription: string;
}

// API Response types
export interface OpenBetsResponse {
  bets: OpenBet[];
  totalCount: number;
  totalStaked: number;
  totalCashoutAvailable: number;
}

export interface CashoutPreviewRequest {
  betId: string;
  type: CashoutType;
  percentage?: number;
}

export interface CashoutExecuteRequest {
  betId: string;
  type: CashoutType;
  percentage?: number;
}
