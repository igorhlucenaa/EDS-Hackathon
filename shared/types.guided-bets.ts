// ===== Guided Bet Builder Types =====

export type GuidedBetStrategy =
  | 'conservative'
  | 'balanced'
  | 'aggressive'
  | 'first_bet'
  | 'goals_focused'
  | 'live_focused'
  | 'favorites_combo';

export type GuidedBetRiskLevel = 'low' | 'medium' | 'high';

export interface GuidedBetSelection {
  id: string;
  marketType: string;
  marketName: string;
  label: string;
  outcome: string;
  odds: number;
  isEditable: boolean;
  eventId?: string;
  eventName?: string;
}

export interface GuidedBetSuggestion {
  id: string;
  eventId: string;
  eventName: string;
  title: string;
  subtitle: string;
  strategy: GuidedBetStrategy;
  riskLevel: GuidedBetRiskLevel;
  selections: GuidedBetSelection[];
  totalOdds: number;
  explanation: string;
  tags: string[];
  recommendedForProfile?: 'beginner' | 'casual' | 'engaged';
  potentialReturn?: number;
}

export interface GuidedBetFlowChoice {
  id: string;
  stepId: string;
  question: string;
  description?: string;
  options: GuidedBetOption[];
}

export interface GuidedBetOption {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  value: string;
}

export interface GuidedBetBuilderState {
  currentStep: number;
  choices: Record<string, string>;
  generatedSuggestion: GuidedBetSuggestion | null;
  isGenerating: boolean;
}

export interface EventBetRecommendations {
  eventId: string;
  eventName: string;
  suggestions: GuidedBetSuggestion[];
  guidedQuestions: GuidedBetFlowChoice[];
  generatedSuggestionPreview?: GuidedBetSuggestion;
}

export interface GuidedBetPreview {
  selections: GuidedBetSelection[];
  totalOdds: number;
  riskLevel: GuidedBetRiskLevel;
  explanation: string;
  canEdit: boolean;
}

export interface RecalculateOddsRequest {
  selectionId: string;
  action: 'remove' | 'replace';
  newSelection?: GuidedBetSelection;
}

export interface RecalculateOddsResponse {
  selections: GuidedBetSelection[];
  totalOdds: number;
  riskLevel: GuidedBetRiskLevel;
  explanation: string;
}

// API Request/Response types
export interface GenerateGuidedBetRequest {
  eventId: string;
  choices: Record<string, string>;
}

export interface AddToBetslipRequest {
  suggestionId: string;
  selections: GuidedBetSelection[];
  totalOdds: number;
}

export interface AddToBetslipResponse {
  success: boolean;
  addedCount: number;
  message: string;
}
