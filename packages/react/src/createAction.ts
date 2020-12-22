import { Store } from 'redux';
import { useCallback, useRef } from 'react';

export const createAction = <F extends Function>(
  name: string,
  store: Store,
  fn: F,
) => <P, M>(payload: P, meta: M) =>
  store.dispatch({
    type: `${name}/${fn.name}`,
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
