import { Store } from 'redux';
import { useEffect, useState } from 'react';
import { UseAsyncAction, Func, CreateUseAsyncActionOptions } from './@types';
import { createUseAction } from './createUseAction';

export function createUseAsyncAction<D extends any>(
  namespace: string,
  funcName: string,
  store: Store,
  run: D,
): UseAsyncAction<D>;

export function createUseAsyncAction<D extends any>(
  namespace: string,
  funcName: string,
  store: Store,
  run: D,
): UseAsyncAction<D>;

export function createUseAsyncAction<D extends any>(
  namespace: string,
  funcName: string,
  store: Store,
  run: D,
): UseAsyncAction<D>;

export function createUseAsyncAction<D extends any>(
  namespace: string,
  funcName: string,
  store: Store,
  run: D,
): UseAsyncAction<D>;

export function createUseAsyncAction<D extends Func>(
  namespace: string,
  funcName: string,
  store: Store,
  run: D,
) {
  return function useAsyncAction<T extends Func>(
    options?: CreateUseAsyncActionOptions<T>,
  ) {
    const [loading, updateLoading] = useState<boolean>(false);
    const [finish] = options?.loading
      ? createUseAction((payload, meta) =>
          run(payload, { ...meta, loading: options.loading }),
        )(options)
      : createUseAction(run)(options);
    useEffect(() => {
      store.subscribe(() => {
        console.log(store.getState());

        const loading = store.getState()[namespace]['@@DURA.LOADING'][funcName];
        updateLoading(loading);
      });
    }, []);
    return [finish, { loading }];
  };
}
