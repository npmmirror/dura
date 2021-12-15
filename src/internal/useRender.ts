import { usePersistFn } from './usePersistFn';
import { useState } from 'react';
export function useRender() {
  const [, setCount] = useState(0);
  return usePersistFn(() => setCount((count) => (count + 1) % 1_000_000));
}
