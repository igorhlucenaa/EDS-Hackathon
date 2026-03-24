import { useVisitStore } from '@/app/state/visitStore';
import { cn } from '@/lib/utils';
import { Compass, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function HomeWelcomeBanner() {
  const navigate = useNavigate();
  const dismissed = useVisitStore((s) => s.homeWelcomeDismissed);
  const dismiss = useVisitStore((s) => s.dismissHomeWelcome);

  if (dismissed) return null;

  return (
    <section className="px-4">
      <div
        className={cn(
          'rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/15 via-card to-card p-4',
          'shadow-sm shadow-primary/5'
        )}
      >
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-primary/10 p-2 border border-primary/20 shrink-0">
            <Sparkles className="w-5 h-5 text-primary" aria-hidden />
          </div>
          <div className="min-w-0 space-y-1">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">Primeira vez por aqui?</p>
            <h2 className="text-base font-display font-bold leading-tight">Bem-vindo ao Esportes da Sorte</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Explore eventos, monte seu cupom na navegação inferior e use as apostas rápidas quando já souber o que quer.
            </p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              dismiss();
              navigate('/explore');
            }}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground',
              'hover:bg-primary/90 transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'
            )}
          >
            <Compass className="w-3.5 h-3.5 text-primary-foreground" aria-hidden />
            Explorar eventos
          </button>
          <button
            type="button"
            onClick={() => {
              dismiss();
              navigate('/intencoes');
            }}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-xl border border-border bg-secondary/80 px-3 py-2 text-xs font-medium text-foreground',
              'hover:bg-secondary transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'
            )}
          >
            Apostar por intenção
          </button>
          <button
            type="button"
            onClick={dismiss}
            className="inline-flex items-center rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Entendi
          </button>
        </div>
      </div>
    </section>
  );
}
