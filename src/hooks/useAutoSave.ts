import { useEffect, useRef, useCallback, useState } from 'react';
import { savePortfolioData, type SaveStatus } from './useApi';

const DEBOUNCE_MS = 1200;

export function useAutoSave(data: unknown, enabled: boolean) {
  const [status, setStatus] = useState<SaveStatus>('idle');
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previousDataRef = useRef<string>('');

  const save = useCallback(async (payload: unknown) => {
    setStatus('saving');
    const result = await savePortfolioData(payload);
    if (result.success) {
      setStatus('saved');
      setLastSavedAt(new Date());
      // Revert to idle after 3s
      setTimeout(() => setStatus('idle'), 3000);
    } else {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const serialized = JSON.stringify(data);

    // Skip if data hasn't actually changed
    if (serialized === previousDataRef.current) return;
    previousDataRef.current = serialized;

    // Clear existing debounce
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      save(data);
    }, DEBOUNCE_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [data, enabled, save]);

  return { status, lastSavedAt };
}

