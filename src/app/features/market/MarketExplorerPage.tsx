import { mockLiveEvents, mockUpcomingEvents } from '@/app/data/mocks/events';
import type { Market } from '@/app/data/models/types';
import { useBetslipStore } from '@/app/state/betslipStore';
import { quickOddSlotClass } from '@/lib/oddsQuickStyles';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ArrowLeft, Layers } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const categories = ['Principal', 'Gols'] as const;

export default function MarketExplorerPage() {
  const navigate = useNavigate();
  const toggleSelection = useBetslipStore((s) => s.toggleSelection);
  const selections = useBetslipStore((s) => s.selections);
  const [cat, setCat] = useState<string>('Principal');

  const allMarkets: { eventId: string; eventLabel: string; market: Market }[] = useMemo(() => {
    const pool = [...mockLiveEvents, ...mockUpcomingEvents];
    const out: { eventId: string; eventLabel: string; market: Market }[] = [];
    pool.forEach((e) => {
      e.markets.forEach((m) => {
        if (m.category === cat) out.push({ eventId: e.id, eventLabel: `${e.home.shortName}×${e.away.shortName}`, market: m });
      });
    });
    return out.slice(0, 24);
  }, [cat]);

  return (
    <div className="space-y-4 py-4 pb-24">
      <div className="px-4 flex items-center gap-2">
        <button type="button" onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-secondary">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-primary" />
          <h1 className="text-lg font-display font-bold">Explorador de mercados</h1>
        </div>
      </div>

      <div className="px-4 flex gap-2 overflow-x-auto -mx-4 px-4 scrollbar-hide">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCat(c)}
            className={`flex-shrink-0 rounded-full px-4 py-2 text-xs font-medium border ${
              cat === c ? 'bg-primary text-primary-foreground border-primary' : 'border-border/50 bg-secondary/50'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="px-4 space-y-3">
        {allMarkets.map((row, i) => {
          const ev = [...mockLiveEvents, ...mockUpcomingEvents].find((e) => e.id === row.eventId)!;
          return (
            <motion.div
              key={`${row.eventId}-${row.market.id}-${i}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-border/50 bg-card p-3"
            >
              <p className="text-[10px] text-muted-foreground">{row.eventLabel}</p>
              <p className="text-sm font-semibold mb-2">{row.market.name}</p>
              {row.market.explanation && (
                <p className="text-[11px] text-muted-foreground mb-2">{row.market.explanation}</p>
              )}
              <div className="flex gap-1.5 flex-wrap">
                {row.market.outcomes.map((o) => {
                  const isSel = selections.some((sel) => sel.outcomeId === o.id);
                  return (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() =>
                        toggleSelection({
                          id: `${ev.id}-${o.id}`,
                          eventId: ev.id,
                          event: ev,
                          marketId: row.market.id,
                          marketName: row.market.name,
                          outcomeId: o.id,
                          outcomeName: o.name,
                          odds: o.odds,
                        })
                      }
                      className={cn(
                        'rounded-lg px-3 py-1.5 text-xs font-bold tabular-nums',
                        quickOddSlotClass(isSel)
                      )}
                    >
                      {o.name} {o.odds.toFixed(2)}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
        {allMarkets.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">Nenhum mercado nesta categoria.</p>
        )}
      </div>
    </div>
  );
}
