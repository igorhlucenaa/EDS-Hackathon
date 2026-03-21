import { useUserStore } from '@/app/state/userStore';
import { usePreferencesStore } from '@/app/state/preferencesStore';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PreferencesPage() {
  const navigate = useNavigate();
  const { experienceMode, setExperienceMode } = useUserStore();
  const pushBetResults = usePreferencesStore((s) => s.pushBetResults);
  const pushOddsMoves = usePreferencesStore((s) => s.pushOddsMoves);
  const pushEventStart = usePreferencesStore((s) => s.pushEventStart);
  const emailWeekly = usePreferencesStore((s) => s.emailWeekly);
  const compactOdds = usePreferencesStore((s) => s.compactOdds);
  const updatePrefs = usePreferencesStore((s) => s.updatePrefs);

  const alertValues = {
    pushBetResults,
    pushOddsMoves,
    pushEventStart,
    emailWeekly,
  } as const;

  return (
    <div className="space-y-6 py-4 pb-24">
      <div className="px-4 flex items-center gap-2">
        <button type="button" onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-secondary">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-lg font-display font-bold">Preferências</h1>
      </div>

      <div className="px-4 space-y-4">
        <div className="rounded-2xl border border-border/50 bg-card p-4 space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Experiência</p>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">Modo {experienceMode === 'pro' ? 'Pro' : 'Iniciante'}</p>
              <p className="text-[11px] text-muted-foreground">
                {experienceMode === 'pro' ? 'Mais denso e rápido.' : 'Mais explicações e guias.'}
              </p>
            </div>
            <Switch
              checked={experienceMode === 'pro'}
              onCheckedChange={(c) => setExperienceMode(c ? 'pro' : 'beginner')}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-border/50 bg-card p-4 space-y-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Alertas</p>
          {[
            { key: 'pushBetResults' as const, label: 'Resultados de apostas', desc: 'Quando uma aposta for definida.' },
            { key: 'pushOddsMoves' as const, label: 'Movimento de odds', desc: 'Mudanças relevantes nos seus jogos.' },
            { key: 'pushEventStart' as const, label: 'Início de jogo', desc: 'Lembretes para eventos seguidos.' },
            { key: 'emailWeekly' as const, label: 'Resumo semanal', desc: 'Email com destaques (mock).' },
          ].map((row) => (
            <div key={row.key} className="flex items-center justify-between gap-4">
              <div>
                <Label className="text-sm">{row.label}</Label>
                <p className="text-[11px] text-muted-foreground">{row.desc}</p>
              </div>
              <Switch
                checked={alertValues[row.key]}
                onCheckedChange={(c) => updatePrefs({ [row.key]: c })}
              />
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-border/50 bg-card p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <Label className="text-sm">Odds compactas</Label>
              <p className="text-[11px] text-muted-foreground">Menos altura nas listas de mercados.</p>
            </div>
            <Switch checked={compactOdds} onCheckedChange={(c) => updatePrefs({ compactOdds: c })} />
          </div>
        </div>
      </div>
    </div>
  );
}
