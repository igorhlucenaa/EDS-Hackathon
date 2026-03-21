import { mockTransactions, mockUser } from '@/app/data/mocks/user';
import { cn } from '@/lib/utils';
import { ArrowLeft, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function WalletPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 py-4 pb-24">
      <div className="px-4 flex items-center gap-2">
        <button type="button" onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-secondary">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-primary" />
          <h1 className="text-xl font-display font-bold">Carteira</h1>
        </div>
      </div>

      <div className="px-4">
        <div className="rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/15 to-card p-5">
          <p className="text-xs text-muted-foreground mb-1">Saldo disponível</p>
          <p className="text-3xl font-display font-bold tabular-nums">R${mockUser.balance.toFixed(2)}</p>
          {mockUser.bonusBalance > 0 && (
            <p className="text-sm text-primary mt-2">Bônus: R${mockUser.bonusBalance.toFixed(2)}</p>
          )}
          <div className="flex gap-2 mt-4">
            <button
              type="button"
              onClick={() => navigate('/wallet/deposit')}
              className="flex-1 bg-primary text-primary-foreground rounded-xl py-3 text-sm font-bold"
            >
              Depositar
            </button>
            <button
              type="button"
              onClick={() => navigate('/wallet/withdraw')}
              className="flex-1 bg-secondary border border-border/50 rounded-xl py-3 text-sm font-semibold"
            >
              Sacar
            </button>
          </div>
        </div>
      </div>

      <div className="px-4">
        <h2 className="text-sm font-display font-bold mb-2">Histórico</h2>
        <div className="rounded-2xl border border-border/50 bg-card divide-y divide-border/40">
          {mockTransactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between px-3 py-3">
              <div>
                <p className="text-sm font-medium">{tx.description}</p>
                <p className="text-[10px] text-muted-foreground">
                  {new Date(tx.createdAt).toLocaleString('pt-BR')} ·{' '}
                  <span
                    className={cn(
                      tx.status === 'completed' && 'text-primary',
                      tx.status === 'pending' && 'text-warning',
                      tx.status === 'failed' && 'text-destructive'
                    )}
                  >
                    {tx.status === 'completed' ? 'Concluído' : tx.status === 'pending' ? 'Pendente' : 'Falhou'}
                  </span>
                </p>
              </div>
              <span className={cn('text-sm font-semibold tabular-nums', tx.amount > 0 ? 'text-primary' : '')}>
                {tx.amount > 0 ? '+' : ''}R${Math.abs(tx.amount).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
