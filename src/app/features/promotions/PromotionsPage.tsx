import { mockPromotions } from '@/app/data/mocks/user';
import { cn } from '@/lib/utils';
import { Gift, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const catLabel: Record<string, string> = {
  welcome: 'Boas-vindas',
  sports: 'Esportes',
  live: 'Ao vivo',
  cashback: 'Cashback',
  special: 'Especial',
};

export default function PromotionsPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-4 py-4 pb-24">
      <div className="px-4">
        <div className="flex items-center gap-2 mb-1">
          <Gift className="w-5 h-5 text-primary" />
          <h1 className="text-xl font-display font-bold">Promoções</h1>
        </div>
        <p className="text-xs text-muted-foreground">Regras claras, benefícios objetivos — sem ruído.</p>
      </div>

      <div className="px-4 space-y-3">
        {mockPromotions.map((p) => (
          <div
            key={p.id}
            className="rounded-2xl border border-border/50 bg-gradient-to-br from-primary/10 via-card to-card p-4 space-y-2"
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary">{catLabel[p.category] ?? p.category}</span>
            <h2 className="text-base font-display font-bold">{p.title}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{p.description}</p>
            <p className="text-[10px] text-muted-foreground">
              Válido até {new Date(p.expiresAt).toLocaleDateString('pt-BR')}
            </p>
            <button
              type="button"
              onClick={() => navigate('/wallet/deposit')}
              className={cn(
                'inline-flex items-center gap-1 text-sm font-semibold text-primary'
              )}
            >
              {p.ctaText} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
