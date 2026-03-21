import { Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function IntentExploreEntry() {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate('/intencoes')}
      className="w-full rounded-2xl border border-primary/25 bg-gradient-to-r from-primary/15 via-card to-card px-4 py-3 flex items-center justify-between gap-3 text-left hover:border-primary/40 transition-colors"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="rounded-xl bg-primary/20 p-2 text-primary">
          <Compass className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-display font-bold">Explorar por intenção</p>
          <p className="text-[11px] text-muted-foreground truncate">Odds altas, rápidas, ao vivo — escolha o objetivo.</p>
        </div>
      </div>
      <span className="text-xs font-semibold text-primary shrink-0">Abrir</span>
    </button>
  );
}
