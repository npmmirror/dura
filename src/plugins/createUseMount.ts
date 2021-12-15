import { Api } from '../types';
import { useLayoutEffect, useRef } from 'react';
export function createUseMount(api: Api) {
  const { has, del, add, refresh } = api.storeManager;
  return function useMount() {
    const ref = useRef<(() => void) | undefined>(undefined);

    ref.current = () => has() && void (del(), refresh());

    !has() && (add(), refresh());

    useLayoutEffect(() => ref.current, [ref]);
  };
}
