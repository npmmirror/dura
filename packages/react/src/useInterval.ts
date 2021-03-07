import { useEffect, useRef } from 'react';
export function useInterval(
  fn: () => void,
  options?: {
    immediate?: boolean;
    ms: number;
  },
) {
  const immediate = !!options?.immediate;
  const fnRef = useRef<() => void>();
  fnRef.current = fn;
  useEffect(() => {
    if (immediate) {
      fnRef.current?.();
    }
    const timer = setInterval(() => {
      fnRef.current?.();
    }, options?.ms ?? 500);
    return () => {
      clearInterval(timer);
    };
  }, [options?.ms]);
}
