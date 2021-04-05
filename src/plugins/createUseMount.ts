import { useRef, useLayoutEffect } from 'react';
import { Action, AnyAction } from 'redux';
import { Context } from '../types';

export function createUseMount<S, A extends Action = AnyAction>({
  has,
  del,
  add,
  refresh,
}: Context<S, A>) {
  return function useMount() {
    const ref = useRef<(() => void) | undefined>(undefined);

    ref.current = () => has() && void (del(), refresh());

    !has() && (add(), refresh());

    useLayoutEffect(() => ref.current, [ref]);
  };
}
