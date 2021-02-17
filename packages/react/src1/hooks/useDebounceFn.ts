import { useRef } from 'react';
import { debounce } from 'lodash';
import { useMemoized } from './useMemoized';

interface UseDebounceFnOptions {
  /** 指定在延迟开始前调用。 */
  leading?: boolean;
  /** 指定在延迟结束后调用。 */
  trailing?: boolean;

  maxWait?: number;
}

export function useDebounceFn<T extends (...args: any) => any>(
  fn: T,
  wait: number,
  options?: UseDebounceFnOptions,
) {
  const fnRef = useRef<T>(fn);
  fnRef.current = fn;
  return useMemoized(
    () =>
      debounce<T>(
        ((...args) => {
          return fnRef.current(...args);
        }) as T,
        wait,
        options,
      ),
    [],
  );
}
