import { useEffect, useRef, useState } from 'react';

interface UseAutoSaveOptions<T = unknown> {
  data: T;
  onSave: (data: T) => Promise<void> | void;
  delay?: number; // milliseconds to wait after last change before saving
  enabled?: boolean;
}

interface UseAutoSaveReturn {
  isSaving: boolean;
  lastSaved: Date | null;
  error: string | null;
  manualSave: () => Promise<void>;
}

export function useAutoSave<T = unknown>({
  data,
  onSave,
  delay = 2000, // 2 seconds default
  enabled = true
}: UseAutoSaveOptions<T>): UseAutoSaveReturn {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const lastDataRef = useRef<string | undefined>(undefined);
  const isInitialRender = useRef(true);

  useEffect(() => {
    if (!enabled) return;

    // Skip auto-save on initial render
    if (isInitialRender.current) {
      isInitialRender.current = false;
      lastDataRef.current = JSON.stringify(data);
      return;
    }

    const currentDataString = JSON.stringify(data);
    
    // Only trigger auto-save if data actually changed
    if (currentDataString === lastDataRef.current) {
      return;
    }

    lastDataRef.current = currentDataString;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for auto-save
    timeoutRef.current = setTimeout(async () => {
      try {
        setIsSaving(true);
        setError(null);
        await onSave(data);
        setLastSaved(new Date());
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to save');
      } finally {
        setIsSaving(false);
      }
    }, delay);

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, onSave, delay, enabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const manualSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      await onSave(data);
      setLastSaved(new Date());
      // Update the reference to prevent triggering auto-save
      lastDataRef.current = JSON.stringify(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isSaving,
    lastSaved,
    error,
    manualSave
  };
}