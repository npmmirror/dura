import { useInterval } from './useInterval';

export interface UsePollingInterval {
  ms?: number;
  pollingWhenHidden?: boolean;
}

export function usePollingInterval(
  fn: () => void,
  options?: UsePollingInterval,
) {
  useInterval(
    () => {
      if (options) {
        const pollingWhenHidden = !!options?.pollingWhenHidden;
        pollingWhenHidden && fn();
        !pollingWhenHidden &&
          document.visibilityState === 'visible' &&
          document.hasFocus() &&
          fn();
      }
    },
    {
      ms: options?.ms,
    },
  );
}
