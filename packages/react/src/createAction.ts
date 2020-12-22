import { Store } from 'redux';
import { useCallback } from 'react';

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

export const createUseAction = (run: Function) => (transform?: Function) => {
  const fn = useCallback((e) => run(transform?.(e)), [transform]);
  return typeof transform === 'function' ? fn : run;
};
