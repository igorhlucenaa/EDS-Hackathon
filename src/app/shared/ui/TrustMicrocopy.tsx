import { ShieldCheck } from 'lucide-react';

/** Micro camada de confiança — odds, saldo, status */
export function TrustOddsNote() {
  return (
    <p className="text-[10px] text-muted-foreground flex items-center gap-1">
      <ShieldCheck className="w-3 h-3 text-primary shrink-0" />
      Odds podem mudar até o envio — sempre confirme no cupom.
    </p>
  );
}
