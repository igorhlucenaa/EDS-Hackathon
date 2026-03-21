import { searchEverything, type SearchResult } from '@/app/data/mocks/search';
import { useSearchHistoryStore } from '@/app/state/searchHistoryStore';
import { cn } from '@/lib/utils';
import { ArrowLeft, Search, X, Clock } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function GlobalSearchPage() {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const recent = useSearchHistoryStore((s) => s.recentQueries);
  const pushQuery = useSearchHistoryStore((s) => s.pushQuery);
  const clearRecent = useSearchHistoryStore((s) => s.clear);

  const results = useMemo(() => searchEverything(q), [q]);

  const open = (r: SearchResult) => {
    pushQuery(r.title.replace(/^[^\s]+\s/, ''));
    navigate(r.href);
  };

  return (
    <div className="space-y-4 py-4 pb-24">
      <div className="px-4 flex items-center gap-2">
        <button type="button" onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-secondary">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-lg font-display font-bold">Busca</h1>
      </div>

      <div className="px-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Esportes, ligas, times, eventos..."
            className="w-full bg-secondary border border-border/50 rounded-xl pl-9 pr-9 py-3 text-sm outline-none focus:border-primary/50"
          />
          {q && (
            <button type="button" onClick={() => setQ('')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>
        <p className="text-[10px] text-muted-foreground mt-2">Busca unificada — resultados de mocks consistentes com o catálogo.</p>
      </div>

      {!q && recent.length > 0 && (
        <div className="px-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Recentes</span>
            <button type="button" onClick={clearRecent} className="text-[10px] text-primary">
              Limpar
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {recent.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setQ(r)}
                className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1.5 text-xs border border-border/50"
              >
                <Clock className="w-3 h-3" /> {r}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="px-4 space-y-2">
        {(q ? results : []).map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => open(r)}
            className={cn(
              'w-full text-left rounded-xl border border-border/50 bg-card p-3 hover:border-primary/30 transition-colors',
              r.type === 'event' && 'border-primary/20'
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{r.title}</p>
                <p className="text-[10px] text-muted-foreground">{r.subtitle}</p>
              </div>
              <span className="text-[10px] uppercase font-semibold text-primary shrink-0">{r.type}</span>
            </div>
          </button>
        ))}
        {q && results.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">Nenhum resultado</p>}
      </div>
    </div>
  );
}
