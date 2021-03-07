import { useImmediate } from './useImmediate';
import { usePollingInterval } from './usePollingInterval';
import { useRefreshOnWindowFocus } from './useRefreshOnWindowFocus';
import { AnyFunction } from './types';

export interface UseImmediateOptions {
  args?: any[];
}

export interface UsePerformanceOptions {
  action: 'debounce' | 'throttle';
  wait?: number;
  leading?: boolean;
}

export interface UseRefreshOnWindowFocusOption extends UseImmediateOptions {}

export interface UsePollingIntervalOptions extends UseImmediateOptions {
  ms?: number;
  pollingWhenHidden?: boolean;
}

export interface UseAsyncOptions<T> {
  transform?: T;
  immediate?: UseImmediateOptions;
  performance?: UsePerformanceOptions;
  refreshOnWindowFocus?: UseRefreshOnWindowFocusOption;
  pollingInterval?: UsePollingIntervalOptions;
}

export function useAsync<
  F extends AnyFunction,
  T extends (...args: any[]) => any = F
>(fn: F, options: UseAsyncOptions<T>) {
  useAutomaticHooks(fn, options);
}

function useAutomaticHooks<
  F extends AnyFunction,
  T extends (...args: any[]) => any = F
>(fn: F, options: UseAsyncOptions<T>) {
  useImmediate(() => {
    const args = options?.immediate?.args ?? [];
    fn(...args);
  }, options?.immediate);
  usePollingInterval(() => {
    const args = options?.pollingInterval?.args ?? [];
    fn(...args);
  }, options?.pollingInterval);
  useRefreshOnWindowFocus(() => {
    const args = options?.refreshOnWindowFocus?.args ?? [];
    fn(...args);
  }, options?.refreshOnWindowFocus);
}
