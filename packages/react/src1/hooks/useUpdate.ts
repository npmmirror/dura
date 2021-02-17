import { useState, useCallback } from 'react';

function useUpdate() {
  const [, setCount] = useState(0);
  return useCallback(() => setCount((count) => (count + 1) % 1_000_000), []);
}

export { useUpdate };
