import { mockBets } from '@/app/data/mocks/user';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ClipboardList } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type TabKey = 'open' | 'live' | 'settled';

export default function BetsPage() {
  const [tab, setTab] = useState<TabKey>('open');
  const navigate = useNavigate();

  const openBets = mockBets.filter(b => b.status === 'open' || b.status === 'cashout_available');
  const liveBets = mockBets.filter(b => b.status === 'live');
  const settledBets = mockBets.filter(b => b.status === 'won' || b.status === 'lost' || b.status === 'cashed_out');

  const betsMap: Record<TabKey, typeof mockBets> = { open: openBets, live: liveBets, settled: settledBets };
  const currentBets = betsMap[tab];

  return (
    <div className="space-y-4 py-4">
      <div className="px-4">
        <div className="flex items-center gap-2 mb-1">
          <ClipboardList className="w-5 h-5 text-primary" />
          <h1 className="text-xl font-display font-bold">Minhas Apostas</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4">
        <div className="flex gap-1 bg-secondary rounded-lg p-0.5">
          {([
            { key: 'open' as TabKey, label: 'Abertas', count: openBets.length },
            { key: 'live' as TabKey, label: 'Ao Vivo', count: liveBets.length },
            { key: 'settled' as TabKey, label: 'Finalizadas', count: settledBets.length },
          ]).map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={cn('flex-1 py-2 rounded-md text-xs font-medium transition-colors', tab === key ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground')}
            >
              {label} {count > 0 && <span className="ml-0.5 text-[10px]">({count})</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Bets List */}
      <div className="px-4 space-y-2">
        {currentBets.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <ClipboardList className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Nenhuma aposta {tab === 'open' ? 'aberta' : tab === 'live' ? 'ao vivo' : 'finalizada'}</p>
          </div>
        ) : (
          currentBets.map((bet) => (
            <motion.div
              key={bet.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border/50 rounded-xl p-3 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full', {
                  'bg-primary/10 text-primary': bet.status === 'open',
                  'bg-live-pulse/20 text-live-pulse': bet.status === 'live',
                  'bg-success/10 text-success': bet.status === 'won',
                  'bg-destructive/10 text-destructive': bet.status === 'lost',
                  'bg-warning/10 text-warning': bet.status === 'cashout_available' || bet.status === 'cashed_out',
                })}>
                  {bet.status === 'open' && '⏳ Aberta'}
                  {bet.status === 'live' && '🔴 Ao Vivo'}
                  {bet.status === 'won' && '✅ Ganha'}
                  {bet.status === 'lost' && '❌ Perdida'}
                  {bet.status === 'cashout_available' && '💰 Cash Out'}
                  {bet.status === 'cashed_out' && '💰 Resgatada'}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {bet.betType === 'accumulator' ? 'Acumulada' : 'Simples'}
                </span>
              </div>

              {bet.selections.map((sel) => (
                <div key={sel.id} className="flex items-center justify-between text-xs">
                  <div className="flex-1 min-w-0">
                    <div className="text-muted-foreground truncate">{sel.event.home.shortName} vs {sel.event.away.shortName}</div>
                    <div className="font-medium">{sel.outcomeName} <span className="text-muted-foreground">— {sel.marketName}</span></div>
                  </div>
                  <span className="font-semibold tabular-nums ml-2">{sel.odds.toFixed(2)}</span>
                </div>
              ))}

              <div className="flex items-center justify-between pt-2 border-t border-border/30">
                <span className="text-xs text-muted-foreground">Stake: R${bet.stake.toFixed(2)}</span>
                <span className={cn('text-sm font-semibold tabular-nums', bet.status === 'won' ? 'text-success' : 'text-foreground')}>
                  {bet.status === 'won' ? `+R$${bet.potentialReturn.toFixed(2)}` : `R$${bet.potentialReturn.toFixed(2)}`}
                </span>
              </div>

              {bet.cashoutValue && bet.status !== 'cashed_out' && (
                <button className="w-full py-2 text-xs font-semibold text-warning bg-warning/10 rounded-lg hover:bg-warning/20 transition-colors">
                  Cash Out: R${bet.cashoutValue.toFixed(2)}
                </button>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
