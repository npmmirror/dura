import { useRef, useLayoutEffect, useCallback } from 'react';
import { DURA_PATCHES_SYMBOL, createProxy } from '@dura/utils';
import { useUpdate } from './useUpdate';

export function getUseMonitor(key, reduxStore) {
  return function useMonitor(subscribeDeps) {
    const update = useUpdate();
    const deps = useRef<Map<string, number>>(new Map<string, number>());
    const storeProxyRef = useRef(
      createProxy(reduxStore.getState(), deps.current),
    );

    const storeOriginalRef = useRef(reduxStore.getState());

    const subscribe = useCallback(() => {
      const originalStore = reduxStore.getState();

      const proxyStore = createProxy(originalStore, deps.current);
      const memo = deepEqualProxyStore(proxyStore, deps.current, key);

      if (!memo) {
        storeProxyRef.current = proxyStore;
        storeOriginalRef.current = originalStore;
        deps.current.clear();
        update();
      }
    }, []);

    useLayoutEffect(() => reduxStore.subscribe(subscribe), []);

    useLayoutEffect(() => {
      const originalStore = reduxStore.getState();
      storeProxyRef.current = createProxy(originalStore, deps.current);
      storeOriginalRef.current = originalStore;
      deps.current.clear();
      update();
    }, subscribeDeps);
    return storeProxyRef.current;
  };
}

function deepEqualProxyStore<P, D extends Map<string, number>>(
  nextPropsStore: P,
  deps: D,
  key,
) {
  const values = Object.values(nextPropsStore);

  // if (
  //   key &&
  //   nextPropsStore['DURA'][DURA_PATCHES_SYMBOL].includes('DURA.REFRESH') &&
  //   nextPropsStore['DURA']['REFRESH'].startsWith(key)
  // ) {
  //   return false;
  // }

  let index = -1;
  while (++index < values.length) {
    const patches = values[index][DURA_PATCHES_SYMBOL];
    // console.log('patches:', patches);
    // console.log('deps:', deps);
    // console.log('\r\n');
    if (patches?.length > 0) {
      return !patches.some((n: string) => {
        const iterator = Array.from(deps.keys());
        return iterator.some((k: string) => k.startsWith(n));
      });
    }
  }
  return true;
}
