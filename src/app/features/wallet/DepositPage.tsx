import { depositPresets, mockPaymentMethods, walletLimits } from '@/app/data/mocks/wallet';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function DepositPage() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState(50);
  const [method, setMethod] = useState(mockPaymentMethods[0].id);

  const submit = () => {
    if (amount < walletLimits.minDeposit) {
      toast.error('Valor abaixo do mínimo');
      return;
    }
    toast.success('Depósito iniciado', {
      description: `PIX de R$${amount.toFixed(2)} — confirme no app do banco.`,
    });
    navigate('/wallet');
  };

  return (
    <div className="space-y-5 py-4 pb-24">
      <div className="px-4 flex items-center gap-2">
        <button type="button" onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-secondary">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-lg font-display font-bold">Depositar</h1>
      </div>

      <div className="px-4 space-y-2">
        <p className="text-xs text-muted-foreground">Método</p>
        <div className="flex flex-col gap-2">
          {mockPaymentMethods.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMethod(m.id)}
              className={cn(
                'rounded-xl border px-4 py-3 text-left text-sm',
                method === m.id ? 'border-primary bg-primary/10' : 'border-border/50 bg-card'
              )}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 space-y-2">
        <p className="text-xs text-muted-foreground">Valor (R$)</p>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full bg-secondary border border-border/50 rounded-xl px-4 py-3 text-lg font-bold tabular-nums outline-none focus:border-primary/50"
        />
        <div className="flex flex-wrap gap-2">
          {depositPresets.map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setAmount(v)}
              className={cn(
                'rounded-lg border px-3 py-1.5 text-xs font-medium',
                amount === v ? 'border-primary bg-primary/15 text-primary' : 'border-border/50'
              )}
            >
              R${v}
            </button>
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground">
          Mín. R${walletLimits.minDeposit} · Máx. R${walletLimits.maxDeposit.toLocaleString('pt-BR')}
        </p>
      </div>

      <div className="px-4">
        <button
          type="button"
          onClick={submit}
          className="w-full bg-primary text-primary-foreground rounded-xl py-3.5 text-sm font-bold"
        >
          Continuar com PIX
        </button>
      </div>
    </div>
  );
}
