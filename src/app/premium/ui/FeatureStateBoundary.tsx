import { ReactNode } from 'react';
import type { PremiumLoadState } from '@/app/premium/types';
import { Button } from '@/components/ui/button';
import { AlertCircle, Inbox, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  state: PremiumLoadState;
  loading: ReactNode;
  empty?: ReactNode;
  error?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function FeatureStateBoundary({ state, loading, empty, error, children, className }: Props) {
  if (state === 'loading' || state === 'idle') {
    return <div className={cn(className)}>{loading}</div>;
  }
  if (state === 'error') {
    return <div className={cn(className)}>{error}</div>;
  }
  if (state === 'empty') {
    return <div className={cn(className)}>{empty}</div>;
  }
  return <div className={cn(className)}>{children}</div>;
}

export function PremiumErrorInline({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 flex items-start gap-3">
      <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">Algo deu errado</p>
        <p className="text-xs text-muted-foreground mt-0.5">{message}</p>
        <Button variant="outline" size="sm" className="mt-2 h-8 text-xs" onClick={onRetry}>
          Tentar de novo
        </Button>
      </div>
    </div>
  );
}

export function PremiumEmptyInline({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-xl border border-border/50 bg-secondary/30 px-4 py-8 text-center">
      <Inbox className="w-8 h-8 mx-auto text-muted-foreground/50 mb-2" />
      <p className="text-sm font-medium font-display">{title}</p>
      <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">{description}</p>
    </div>
  );
}

export function PremiumLoadingBlock({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2 animate-pulse">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-16 rounded-xl bg-secondary/80" />
      ))}
    </div>
  );
}

export function PremiumSpinnerLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground py-6 justify-center">
      <Loader2 className="w-4 h-4 animate-spin text-primary" />
      {label}
    </div>
  );
}
