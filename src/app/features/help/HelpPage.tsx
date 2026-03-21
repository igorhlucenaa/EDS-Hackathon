import { ArrowLeft, MessageCircle, FileText, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const faqs = [
  { q: 'Como funciona o cash out?', a: 'Encerre a aposta antes do fim e receba um valor proporcional (quando disponível).' },
  { q: 'Quanto tempo demora o saque PIX?', a: 'Em média até 24h úteis após aprovação (mock).' },
  { q: 'Posso mudar o modo Iniciante/Pro?', a: 'Sim, em Preferências ou Conta.' },
];

export default function HelpPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-5 py-4 pb-24">
      <div className="px-4 flex items-center gap-2">
        <button type="button" onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-secondary">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-lg font-display font-bold">Ajuda & Suporte</h1>
      </div>

      <div className="px-4 grid gap-2 sm:grid-cols-3">
        <button
          type="button"
          className="rounded-xl border border-border/50 bg-card p-4 text-left hover:border-primary/30"
        >
          <MessageCircle className="w-5 h-5 text-primary mb-2" />
          <p className="text-sm font-semibold">Chat</p>
          <p className="text-[10px] text-muted-foreground">24/7 (mock)</p>
        </button>
        <button
          type="button"
          className="rounded-xl border border-border/50 bg-card p-4 text-left hover:border-primary/30"
        >
          <FileText className="w-5 h-5 text-primary mb-2" />
          <p className="text-sm font-semibold">Central</p>
          <p className="text-[10px] text-muted-foreground">Artigos</p>
        </button>
        <button
          type="button"
          className="rounded-xl border border-border/50 bg-card p-4 text-left hover:border-primary/30"
        >
          <Shield className="w-5 h-5 text-primary mb-2" />
          <p className="text-sm font-semibold">Jogo responsável</p>
          <p className="text-[10px] text-muted-foreground">Limites</p>
        </button>
      </div>

      <div className="px-4 space-y-3">
        <h2 className="text-sm font-display font-bold">Perguntas frequentes</h2>
        {faqs.map((f) => (
          <div key={f.q} className="rounded-xl border border-border/50 bg-secondary/20 p-3">
            <p className="text-sm font-medium">{f.q}</p>
            <p className="text-xs text-muted-foreground mt-1">{f.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
