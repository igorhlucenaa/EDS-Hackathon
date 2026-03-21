import { useCallback, useEffect, useRef, useState } from 'react';
import type { PremiumLoadState } from '@/app/premium/types';

interface Options {
  latencyMs?: number;
  fail?: boolean;
}

export function useSimulatedFetch<T>(loader: () => Promise<T>, options: Options = {}) {
  const { latencyMs = 700, fail = false } = options;
  const [state, setState] = useState<PremiumLoadState>('idle');
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const loaderRef = useRef(loader);
  loaderRef.current = loader;

  const run = useCallback(async () => {
    setState('loading');
    setError(null);
    try {
      await new Promise((r) => setTimeout(r, latencyMs));
      if (fail || (typeof window !== 'undefined' && window.location.search.includes('premiumError=1'))) {
        throw new Error('Não foi possível atualizar agora.');
      }
      const result = await loaderRef.current();
      setData(result);
      setState('success');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro desconhecido');
      setState('error');
    }
  }, [fail, latencyMs]);

  useEffect(() => {
    run();
  }, [run]);

  return { state, data, error, retry: run };
}
