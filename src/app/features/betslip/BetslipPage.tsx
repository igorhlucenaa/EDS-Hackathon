import { BetslipCopilot } from '@/app/premium/copilot/BetslipCopilot';
import { useBetslipStore } from '@/app/state/betslipStore';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ArrowLeft, Trash2, X, AlertTriangle, Share2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function BetslipPage() {
  const navigate = useNavigate();
  const { selections, stake, mode, removeSelection, clearSelections, setStake, setMode, totalOdds, potentialReturn } = useBetslipStore();
  const [confirmClear, setConfirmClear] = useState(false);

  const handlePlaceBet = () => {
    toast.success('Aposta realizada com sucesso!', { description: `R$${stake.toFixed(2)} → Retorno potencial: R$${potentialReturn().toFixed(2)}` });
    clearSelections();
    navigate('/bets');
  };

  if (selections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
          <span className="text-2xl">🎫</span>
        </div>
        <h2 className="text-lg font-display font-bold mb-1">Cupom Vazio</h2>
        <p className="text-sm text-muted-foreground mb-4">Selecione odds para adicionar ao seu cupom</p>
        <button onClick={() => navigate('/')} className="text-sm text-primary font-medium hover:underline">Explorar Eventos →</button>
      </div>
    );
  }

  return (
    <div className="space-y-4 py-4 pb-[22rem]">
      {/* Header */}
      <div className="px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="p-1.5 rounded-lg hover:bg-secondary"><ArrowLeft className="w-4 h-4" /></button>
          <h1 className="text-lg font-display font-bold">Cupom</h1>
          <span className="text-xs text-muted-foreground">({selections.length} {selections.length === 1 ? 'seleção' : 'seleções'})</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground"><Share2 className="w-4 h-4" /></button>
          <button onClick={() => setConfirmClear(true)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="px-4">
        <div className="flex gap-1 bg-secondary rounded-lg p-0.5">
          {(['simple', 'advanced'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={cn('flex-1 py-1.5 rounded-md text-xs font-medium transition-colors', mode === m ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground')}
            >
              {m === 'simple' ? 'Simples' : 'Avançado'}
            </button>
          ))}
        </div>
      </div>

      {/* Selections */}
      <div className="px-4 space-y-2">
        <AnimatePresence>
          {selections.map((sel) => (
            <motion.div
              key={sel.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20, height: 0 }}
              className="bg-card border border-border/50 rounded-xl p-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-muted-foreground truncate">{sel.event.home.name} vs {sel.event.away.name}</div>
                  <div className="text-sm font-medium mt-0.5">{sel.outcomeName}</div>
                  <div className="text-[10px] text-muted-foreground">{sel.marketName}</div>
                </div>
                <div className="flex items-center gap-2 ml-2">
                  <span className={cn(
                    'text-sm font-bold tabular-nums',
                    sel.previousOdds && sel.odds > sel.previousOdds && 'odds-up',
                    sel.previousOdds && sel.odds < sel.previousOdds && 'odds-down',
                  )}>
                    {sel.odds.toFixed(2)}
                  </span>
                  <button onClick={() => removeSelection(sel.id)} className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <BetslipCopilot />

      {/* Stake & Summary — Fixed Bottom */}
      <div className="fixed bottom-16 left-0 right-0 z-30 glass-surface border-t border-border/50 p-4 space-y-3">
        {/* Stake Input */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-muted-foreground">Valor:</label>
          <div className="flex-1 flex items-center gap-1 bg-secondary rounded-lg px-3 py-2">
            <span className="text-xs text-muted-foreground">R$</span>
            <input
              type="number"
              value={stake}
              onChange={(e) => setStake(Number(e.target.value))}
              className="flex-1 bg-transparent text-sm font-semibold outline-none tabular-nums"
              min={1}
            />
          </div>
          {[10, 25, 50, 100].map((v) => (
            <button key={v} onClick={() => setStake(v)} className={cn('text-[10px] px-2 py-1 rounded-md border transition-colors', stake === v ? 'bg-primary text-primary-foreground border-primary' : 'border-border/50 text-muted-foreground hover:text-foreground')}>
              {v}
            </button>
          ))}
        </div>

        {/* Summary */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-muted-foreground">Odds Total</div>
            <div className="text-sm font-bold tabular-nums">{totalOdds().toFixed(2)}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Retorno Potencial</div>
            <div className="text-lg font-display font-bold text-primary tabular-nums">R${potentialReturn().toFixed(2)}</div>
          </div>
        </div>

        {/* Place Bet */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handlePlaceBet}
          className="w-full bg-primary text-primary-foreground rounded-xl py-3 text-sm font-bold font-display hover:bg-primary/90 transition-colors"
        >
          Fazer Aposta — R${stake.toFixed(2)}
        </motion.button>
      </div>

      {/* Confirm Clear Dialog */}
      {confirmClear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm px-4" onClick={() => setConfirmClear(false)}>
          <div className="bg-card border border-border rounded-2xl p-5 w-full max-w-xs space-y-3" onClick={(e) => e.stopPropagation()}>
            <AlertTriangle className="w-8 h-8 text-warning mx-auto" />
            <p className="text-sm text-center font-medium">Limpar todas as seleções?</p>
            <div className="flex gap-2">
              <button onClick={() => setConfirmClear(false)} className="flex-1 py-2 text-sm rounded-lg border border-border text-muted-foreground">Cancelar</button>
              <button onClick={() => { clearSelections(); setConfirmClear(false); }} className="flex-1 py-2 text-sm rounded-lg bg-destructive text-destructive-foreground font-medium">Limpar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
