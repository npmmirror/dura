import { useRef, useLayoutEffect } from 'react';
import { Context } from '../types';

export function createUseMount({ has, del, add, refresh }: Context) {
  return function useMount() {
    const ref = useRef<(() => void) | undefined>(undefined);

    ref.current = () => has() && void (del(), refresh());

    !has() && (add(), refresh());

    useLayoutEffect(() => ref.current, [ref]);
  };
}
