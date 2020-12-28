import { Store } from 'redux';
import { useCallback, useRef, useMemo } from 'react';
import { CreateUseActionOptions } from './@types';
import debounce from 'lodash.debounce';

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

export const createUseAction = (run: Function) => <T extends Function>(
  options?: CreateUseActionOptions<T>,
) => {
  const transformRef = useRef<T | undefined>(undefined);
  transformRef.current = options.transform;
  const fn = useCallback(
    <T>(...args: T[]) => {
      return run(...transformRef.current?.(...args));
    },
    [transformRef],
  );
  const realFn = typeof options.transform === 'function' ? fn : run;
  return realFn;
};
