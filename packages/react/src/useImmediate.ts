import { useEffect } from 'react';
import { usePersistFn } from './usePersistFn';
import { useMemoized } from './useMemoized';
export interface UseImmediate {}

export function useImmediate(fn: () => void, options?: UseImmediate) {
  const $fn = usePersistFn(fn);
  const $options = useMemoized(() => options);
  useEffect(() => void ($options && $fn()), [$options]);
}
