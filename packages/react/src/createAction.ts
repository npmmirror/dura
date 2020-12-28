import { Store } from 'redux';
import { useCallback, useRef } from 'react';

export const createAction = (name: string, store: Store, fnName: string) => <
  P,
  M
>(
  payload: P,
  meta: M,
) =>
  store.dispatch({
    type: `${name}/${fnName}`,
    payload,
    meta,
  });

export const createUseAction = (run: Function) => <
  F extends (...args: any) => []
>(
  transform?: F,
) => {
  const transformRef = useRef<F | undefined>(undefined);
  transformRef.current = transform;
  const fn = useCallback(
    <T>(...args: T[]) => run(...transformRef.current?.(...args)),
    [transformRef],
  );
  return typeof transform === 'function' ? fn : run;
};
