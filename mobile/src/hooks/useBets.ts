import React from 'react';
import { useApi } from './useApi';

/**
 * Dados de aposta
 */
export interface Bet {
  id: string;
  fixtureId: string | number;
  fixture: string; // "Team A vs Team B"
  outcomes: BetOutcome[];
  totalStake: number;
  potentialWin: number;
  totalOdds: number;
  status: 'pending' | 'won' | 'lost' | 'cancelled';
  createdAt: string;
  settledAt?: string;
}

export interface BetOutcome {
  id: string;
  marketId: string;
  marketType: string;
  selection: string;
  odds: number;
}

export interface BetRequest {
  fixtureId: string | number;
  outcomes: Array<{
    outcomeId: string;
    marketId: string;
    odds: number;
  }>;
  stake: number;
}

export interface BetResponse {
  success: boolean;
  betId: string;
  bet: Bet;
  message?: string;
}

/**
 * Hook para simular uma aposta
 */
export function usePlaceBet() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const [lastBet, setLastBet] = React.useState<Bet | null>(null);

  const placeBet = React.useCallback(async (betRequest: BetRequest): Promise<Bet | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('http://localhost:3001/api/user/sportsBet/info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(betRequest),
      });

      if (!response.ok) {
        throw new Error(`Failed to place bet: ${response.statusText}`);
      }

      const data: BetResponse = await response.json();

      if (data.success && data.bet) {
        setLastBet(data.bet);
        return data.bet;
      } else {
        throw new Error(data.message || 'Failed to place bet');
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      console.error('❌ Erro ao colocar aposta:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    placeBet,
    loading,
    error,
    lastBet,
  };
}

/**
 * Hook para buscar histórico de apostas
 */
export function useBetHistory(
  limit: number = 20,
  offset: number = 0
) {
  const [bets, setBets] = React.useState<Bet[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  const fetchBets = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Simular dados de histórico de apostas
      // Em produção, isso viria do servidor
      const mockBets: Bet[] = [
        {
          id: '1',
          fixtureId: '1001',
          fixture: 'Arsenal vs Manchester City',
          outcomes: [
            {
              id: 'out-1',
              marketId: 'market-1',
              marketType: 'Match Result',
              selection: 'Home Win',
              odds: 2.5,
            },
          ],
          totalStake: 100,
          potentialWin: 250,
          totalOdds: 2.5,
          status: 'won',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          settledAt: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: '2',
          fixtureId: '1002',
          fixture: 'Liverpool vs Chelsea',
          outcomes: [
            {
              id: 'out-2',
              marketId: 'market-2',
              marketType: 'Over/Under 2.5',
              selection: 'Over 2.5',
              odds: 1.8,
            },
          ],
          totalStake: 50,
          potentialWin: 90,
          totalOdds: 1.8,
          status: 'lost',
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          settledAt: new Date(Date.now() - 86400000).toISOString(),
        },
      ];

      setBets(mockBets);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      console.error('❌ Erro ao buscar histórico:', error);
    } finally {
      setLoading(false);
    }
  }, [limit, offset]);

  React.useEffect(() => {
    fetchBets();
  }, [fetchBets]);

  return {
    bets,
    loading,
    error,
    refetch: fetchBets,
  };
}

/**
 * Hook para calcular retorno de aposta
 */
export function useBetCalculator() {
  const calculatePotentialWin = React.useCallback(
    (outcomes: Array<{ odds: number }>, stake: number): number => {
      if (outcomes.length === 0 || stake <= 0) return 0;
      const totalOdds = outcomes.reduce((acc, outcome) => acc * outcome.odds, 1);
      return stake * totalOdds;
    },
    []
  );

  const calculateTotalOdds = React.useCallback(
    (outcomes: Array<{ odds: number }>): number => {
      if (outcomes.length === 0) return 0;
      return outcomes.reduce((acc, outcome) => acc * outcome.odds, 1);
    },
    []
  );

  const parseOdds = React.useCallback((odds: string | number): number => {
    const parsed = typeof odds === 'string' ? parseFloat(odds) : odds;
    return isNaN(parsed) ? 0 : parsed;
  }, []);

  return {
    calculatePotentialWin,
    calculateTotalOdds,
    parseOdds,
  };
}
