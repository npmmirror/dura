import { useEffect } from 'react';
import { usePersistFn } from './usePersistFn';
import { useMemoized } from './useMemoized';

export interface UsePollingInterval {
  ms?: number;
  pollingWhenHidden?: boolean;
}

export function usePollingInterval(
  fn: () => void,
  options?: UsePollingInterval,
) {
  const $fn = usePersistFn(fn);
  const $options = useMemoized(() => options);

  useEffect(() => {
    let timerId;
    if ($options) {
      const { ms = 500, pollingWhenHidden = false } = $options;
      timerId = setInterval(() => {
        if (pollingWhenHidden) {
          $fn();
        }
        if (
          !pollingWhenHidden &&
          document.visibilityState === 'visible' &&
          document.hasFocus()
        ) {
          $fn();
        }
      }, ms);
    }
    return () => {
      clearInterval(timerId);
    };
  }, [$fn, $options]);
}
