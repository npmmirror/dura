import { useEffect } from 'react';
import { usePersistFn } from './usePersistFn';
import { useMemoized } from './useMemoized';

export interface UseRefreshOnWindowFocusOptions {}

export function useRefreshOnWindowFocus(
  fn: () => void,
  options?: UseRefreshOnWindowFocusOptions,
) {
  const listener = usePersistFn(() => {
    if (document.visibilityState === 'visible') {
      fn();
    }
  });

  const $options = useMemoized(() => options);

  const on = usePersistFn(() => {
    window.addEventListener('visibilitychange', listener);
    window.addEventListener('focus', listener);
  });

  const off = usePersistFn(() => {
    window.removeEventListener('visibilitychange', listener);
    window.removeEventListener('focus', listener);
  });

  useEffect(() => ($options && on(), off), [on, off, $options]);
}
