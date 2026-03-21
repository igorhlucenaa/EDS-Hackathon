import type { BetSelection } from '@/app/data/models/types';
import type { CopilotDependency, CopilotIncompatibility, CopilotRiskTone } from '@/app/premium/types';

export interface CopilotAnalysis {
  riskTone: CopilotRiskTone;
  riskCopy: string;
  dependencies: CopilotDependency[];
  incompatibilities: CopilotIncompatibility[];
  oddsFlash: { selectionId: string; message: string }[];
  stakeHint: string;
}

const eventCounts = (selections: BetSelection[]) => {
  const map = new Map<string, number>();
  selections.forEach((s) => map.set(s.eventId, (map.get(s.eventId) ?? 0) + 1));
  return map;
};

export function analyzeBetslip(selections: BetSelection[]): CopilotAnalysis {
  const n = selections.length;
  const totalOdds = n === 0 ? 0 : selections.reduce((a, s) => a * s.odds, 1);

  let riskTone: CopilotRiskTone = 'moderate';
  let riskCopy = 'Exposição dentro do esperado para o seu perfil.';
  if (n <= 1) {
    riskTone = 'low';
    riskCopy = 'Aposta simples — risco concentrado em um único resultado.';
  } else if (totalOdds > 25) {
    riskTone = 'high';
    riskCopy = 'Múltipla agressiva: pequenas mudanças nas odds alteram muito o retorno.';
  } else if (totalOdds > 8) {
    riskTone = 'elevated';
    riskCopy = 'Combinação com volatilidade moderada — monitore odds ao vivo.';
  }

  const counts = eventCounts(selections);
  const dependencies: CopilotDependency[] = [];
  counts.forEach((c, eventId) => {
    if (c > 1) {
      dependencies.push({
        id: `dep-${eventId}`,
        message: 'Duas seleções no mesmo jogo podem ser correlacionadas — o resultado de uma influencia a outra.',
        severity: 'warning',
      });
    }
  });
  if (n >= 3) {
    dependencies.push({
      id: 'dep-chain',
      message: 'Cada perna depende da anterior na múltipla — um empate já altera tudo.',
      severity: 'info',
    });
  }

  const incompatibilities: CopilotIncompatibility[] = [];
  const byEvent = new Map<string, BetSelection[]>();
  selections.forEach((s) => {
    const arr = byEvent.get(s.eventId) ?? [];
    arr.push(s);
    byEvent.set(s.eventId, arr);
  });
  byEvent.forEach((arr, eventId) => {
    if (arr.length < 2) return;
    const markets = new Set(arr.map((a) => a.marketId));
    if (markets.size < arr.length) {
      incompatibilities.push({
        id: `inc-${eventId}`,
        message: 'Mercados repetidos no mesmo evento podem conflitar em regras da casa.',
      });
    }
  });

  const oddsFlash = selections
    .filter((s) => s.previousOdds != null && s.previousOdds !== s.odds)
    .map((s) => ({
      selectionId: s.id,
      message:
        s.odds > (s.previousOdds ?? 0)
          ? `Odds subiram para ${s.odds.toFixed(2)} — melhor retorno.`
          : `Odds caíram para ${s.odds.toFixed(2)} — confirme antes de enviar.`,
    }));

  const stakeHint =
    riskTone === 'high'
      ? 'Sugestão: stake menor ou remova uma perna de maior variância.'
      : riskTone === 'elevated'
        ? 'Sugestão: mantenha stake confortável para acompanhar ao vivo.'
        : 'Sugestão: stake alinhado ao seu limite diário.';

  return { riskTone, riskCopy, dependencies, incompatibilities, oddsFlash, stakeHint };
}
