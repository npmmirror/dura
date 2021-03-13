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
export declare function useAsync<
  F extends AnyFunction,
  T extends (...args: any[]) => any = F
>(fn: F, options: UseAsyncOptions<T>): void;
