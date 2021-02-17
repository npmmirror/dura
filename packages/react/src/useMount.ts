import { useEffect } from 'react';
import { usePersistFn } from './usePersistFn';
export function useMount(fn: () => void) {
  const fnPersist = usePersistFn(fn);
  useEffect(() => void fnPersist(), [fnPersist]);
}
