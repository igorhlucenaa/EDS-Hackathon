import { analyzeBetslip } from '@/app/premium/copilot/copilotLogic';
import { mockCopilotProfiles } from '@/app/data/mocks/premium';
import { useBetslipDraftStore } from '@/app/state/betslipDraftStore';
import { useBetslipStore } from '@/app/state/betslipStore';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Bookmark, GitBranch, Info, Share2, ShieldAlert, Sparkles, TrendingDown, TrendingUp } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

export function BetslipCopilot() {
  const selections = useBetslipStore((s) => s.selections);
  const stake = useBetslipStore((s) => s.stake);
  const saveDraft = useBetslipDraftStore((s) => s.saveDraft);
  const [activeProfile, setActiveProfile] = useState<'conservative' | 'balanced' | 'aggressive'>('balanced');

  const analysis = useMemo(() => analyzeBetslip(selections), [selections]);

  const suggestedStake = useMemo(() => {
    const f = mockCopilotProfiles.find((p) => p.id === activeProfile)?.stakeFactor ?? 1;
    return Math.max(1, Math.round(stake * f));
  }, [activeProfile, stake]);

  const shareCupom = async () => {
    const lines = selections.map((s) => `${s.event.home.shortName}×${s.event.away.shortName}: ${s.outcomeName} @${s.odds.toFixed(2)}`);
    const text = `Cupom EDS\n${lines.join('\n')}\nStake sugerido: R$${stake.toFixed(2)}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Meu cupom', text });
      } else {
        await navigator.clipboard.writeText(text);
        toast.success('Cupom copiado', { description: 'Cole onde quiser compartilhar.' });
      }
    } catch {
      await navigator.clipboard.writeText(text);
      toast.success('Cupom copiado');
    }
  };

  const saveRascunho = () => {
    const id = saveDraft(`Rascunho ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`, selections, stake);
    toast.success('Rascunho salvo', { description: 'Você encontra na Retomada inteligente.' });
    return id;
  };

  if (selections.length === 0) return null;

  return (
    <div className="px-4 space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-primary" />
        <h2 className="text-sm font-display font-bold">Cupom Co-piloto</h2>
      </div>

      {/* Análise */}
      <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-primary/10 via-card to-card p-3.5 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Análise do cupom</span>
          <span
            className={cn(
              'text-[10px] font-bold px-2 py-0.5 rounded-full',
              analysis.riskTone === 'high' && 'bg-destructive/15 text-destructive',
              analysis.riskTone === 'elevated' && 'bg-warning/15 text-warning',
              analysis.riskTone === 'moderate' && 'bg-primary/15 text-primary',
              analysis.riskTone === 'low' && 'bg-secondary text-muted-foreground'
            )}
          >
            Risco {analysis.riskTone === 'low' ? 'baixo' : analysis.riskTone === 'moderate' ? 'moderado' : analysis.riskTone === 'elevated' ? 'elevado' : 'alto'}
          </span>
        </div>
        <p className="text-sm leading-snug">{analysis.riskCopy}</p>
        <p className="text-xs text-muted-foreground">{analysis.stakeHint}</p>
      </div>

      {/* Odds flash */}
      <AnimatePresence>
        {analysis.oddsFlash.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-primary/30 bg-primary/5 px-3 py-2.5 space-y-1.5"
          >
            <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
              <TrendingUp className="w-3.5 h-3.5" /> Mudança de odds
            </div>
            {analysis.oddsFlash.map((o) => (
              <p key={o.selectionId} className="text-xs text-muted-foreground flex items-start gap-2">
                {o.message.includes('subiram') ? <TrendingUp className="w-3.5 h-3.5 text-primary shrink-0" /> : <TrendingDown className="w-3.5 h-3.5 text-destructive shrink-0" />}
                {o.message}
              </p>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dependências */}
      {analysis.dependencies.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <GitBranch className="w-3.5 h-3.5" /> Dependências entre seleções
          </div>
          {analysis.dependencies.map((d) => (
            <div
              key={d.id}
              className={cn(
                'rounded-xl border px-3 py-2 text-xs flex gap-2',
                d.severity === 'warning' ? 'border-warning/40 bg-warning/5' : 'border-border/50 bg-secondary/30'
              )}
            >
              <ShieldAlert className={cn('w-3.5 h-3.5 shrink-0 mt-0.5', d.severity === 'warning' ? 'text-warning' : 'text-muted-foreground')} />
              <span>{d.message}</span>
            </div>
          ))}
        </div>
      )}

      {/* Incompatibilidades */}
      {analysis.incompatibilities.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <Info className="w-3.5 h-3.5" /> Possíveis incompatibilidades
          </div>
          {analysis.incompatibilities.map((i) => (
            <div key={i.id} className="rounded-xl border border-destructive/25 bg-destructive/5 px-3 py-2 text-xs text-muted-foreground">
              {i.message}
            </div>
          ))}
        </div>
      )}

      {/* Versões sugeridas */}
      <div className="rounded-2xl border border-border/50 bg-secondary/20 p-3 space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Ajustes sugeridos</p>
        <div className="flex gap-1.5">
          {mockCopilotProfiles.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setActiveProfile(p.id)}
              className={cn(
                'flex-1 rounded-lg py-2 px-1 text-[10px] font-semibold transition-colors border',
                activeProfile === p.id ? 'bg-primary text-primary-foreground border-primary' : 'bg-card/60 border-border/50 text-muted-foreground hover:text-foreground'
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground leading-snug">
          {mockCopilotProfiles.find((p) => p.id === activeProfile)?.summary}{' '}
          <span className="text-foreground font-medium">Stake indicado: R${suggestedStake.toFixed(2)}</span> —{' '}
          {mockCopilotProfiles.find((p) => p.id === activeProfile)?.oddsHint}
        </p>
      </div>

      {/* Ações */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={saveRascunho}
          className="flex-1 h-10 rounded-xl border border-border/60 bg-secondary/40 text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-secondary/70 transition-colors"
        >
          <Bookmark className="w-4 h-4" /> Salvar rascunho
        </button>
        <button
          type="button"
          onClick={shareCupom}
          className="flex-1 h-10 rounded-xl border border-primary/30 bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-primary/15 transition-colors"
        >
          <Share2 className="w-4 h-4" /> Compartilhar
        </button>
      </div>
    </div>
  );
}
