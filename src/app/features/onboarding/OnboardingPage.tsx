import { mockSports } from '@/app/data/mocks/sports';
import { useAuthStore } from '@/app/state/authStore';
import { useUserStore } from '@/app/state/userStore';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const complete = useAuthStore((s) => s.completeOnboarding);
  const setMode = useUserStore((s) => s.setExperienceMode);
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<string[]>(['football']);

  const togglePick = (id: string) => {
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  };

  const finish = () => {
    useUserStore.setState({ favoriteSports: picked });
    complete();
    navigate('/');
  };

  return (
    <div className="min-h-[75vh] px-4 py-8 pb-28 flex flex-col max-w-lg mx-auto">
      <div className="flex gap-1 mb-6">
        {[0, 1, 2].map((i) => (
          <div key={i} className={cn('h-1 flex-1 rounded-full', i <= step ? 'bg-primary' : 'bg-secondary')} />
        ))}
      </div>

      {step === 0 && (
        <div className="space-y-4">
          <h1 className="text-2xl font-display font-bold">Quais esportes você mais acompanha?</h1>
          <p className="text-sm text-muted-foreground">Personalizamos a home sem poluir.</p>
          <div className="flex flex-wrap gap-2">
            {mockSports.slice(0, 8).map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => togglePick(s.id)}
                className={cn(
                  'rounded-full border px-4 py-2 text-sm',
                  picked.includes(s.id) ? 'border-primary bg-primary/15 text-primary' : 'border-border/50'
                )}
              >
                {s.icon} {s.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <h1 className="text-2xl font-display font-bold">Como você prefere apostar?</h1>
          <p className="text-sm text-muted-foreground">Você pode mudar depois em Preferências.</p>
          <div className="grid gap-2">
            <button
              type="button"
              onClick={() => setMode('beginner')}
              className="rounded-xl border border-border/50 bg-card p-4 text-left hover:border-primary/30"
            >
              <p className="font-semibold">Iniciante</p>
              <p className="text-xs text-muted-foreground mt-1">Mais explicações e guias nos mercados.</p>
            </button>
            <button
              type="button"
              onClick={() => setMode('pro')}
              className="rounded-xl border border-border/50 bg-card p-4 text-left hover:border-primary/30"
            >
              <p className="font-semibold">Pro</p>
              <p className="text-xs text-muted-foreground mt-1">Mais densidade e velocidade.</p>
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <h1 className="text-2xl font-display font-bold">Tudo pronto</h1>
          <p className="text-sm text-muted-foreground">
            Atalhos para Ao Vivo, Explorar e Cupom estão na barra inferior. Boa sorte — com responsabilidade.
          </p>
        </div>
      )}

      <div className="mt-auto flex gap-2 pt-8">
        {step > 0 && (
          <Button type="button" variant="outline" className="flex-1" onClick={() => setStep((s) => s - 1)}>
            Voltar
          </Button>
        )}
        {step < 2 ? (
          <Button type="button" className="flex-1" onClick={() => setStep((s) => s + 1)}>
            Continuar
          </Button>
        ) : (
          <Button type="button" className="flex-1" onClick={finish}>
            Ir para a Home
          </Button>
        )}
      </div>
    </div>
  );
}
