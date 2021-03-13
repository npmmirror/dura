/// <reference types="lodash" />
interface UseDebounceFnOptions {
  /** 指定在延迟开始前调用。 */
  leading?: boolean;
  /** 指定在延迟结束后调用。 */
  trailing?: boolean;
  maxWait?: number;
}
export declare function useDebounceFn<T extends (...args: any) => any>(
  fn: T,
  wait: number,
  options?: UseDebounceFnOptions,
): import('lodash').DebouncedFunc<T>;
export {};
