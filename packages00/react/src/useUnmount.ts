import { useEffect } from 'react';
import { usePersistFn } from './usePersistFn';
export function useUnmount(fn: () => void) {
  const fnPersist = usePersistFn(fn);
  useEffect(() => () => void fnPersist(), [fnPersist]);
}
