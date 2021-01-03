import { useState, useEffect, useRef } from 'react';
import { Store } from 'redux';
import { createProxy } from '@onecocjs/snake';
import { DURA_SYMBOL } from './symbol';

export function createUseState<S>(name: string, store: Store) {
  return function useSliceStore() {
    const [count, update] = useState(0);
    const deps = useRef<Map<string, number>>(new Map<string, number>());
    const storeProxyRef = useRef<S>(
      createProxy(store.getState()[name], deps.current),
    );
    const storeOriginalRef = useRef<S>(store.getState()[name]);
    useEffect(() => {
      return store.subscribe(() => {
        const originalStore = store.getState()[name];
        if (!originalStore) {
          update(count + 1);
          return;
        }
        const proxyStore = createProxy(originalStore, deps.current);
        const memo = deepEqualProxyStore(proxyStore, deps.current);
        if (!memo) {
          storeProxyRef.current = proxyStore;
          storeOriginalRef.current = originalStore;
          deps.current.clear();
          update(count + 1);
        }
      });
    }, [count]);
    return storeProxyRef.current;
  };
}

function deepEqualProxyStore<P, D extends Map<string, number>>(
  nextPropsStore: P,
  deps: D,
) {
  const patches = (nextPropsStore as any)[DURA_SYMBOL];
  if (patches?.length > 0) {
    return !patches.some((n: string) => {
      const iterator = Array.from(deps.keys());
      return iterator.some((k: string) => k.startsWith(n));
    });
  }
  return true;
}
