import { Store } from 'redux';
import { useEffect, useState } from 'react';
import { Func, UseAsyncActionBasicOptions } from './@types';
import { createUseAction } from './createUseAction';
import { STATE_LOADING_MAPPING_KEY } from './createNamed';

export function createUseAsyncAction<D extends Func>(
  namespace: string,
  funcName: string,
  store: Store,
  run: D,
) {
  function useAsyncAction<T = undefined>(
    options?: UseAsyncActionBasicOptions<T>,
  ): T extends undefined
    ? { run: D; loading: boolean }
    : { run: T; loading: boolean } {
    const [loading, updateLoading] = useState<boolean>(false);
    const action = createUseAction((payload, meta) =>
      run(payload, { ...meta, loading: options.loading ?? false }),
    )(options);
    useEffect(() => {
      return store.subscribe(() => {
        const loading =
          store.getState()?.[namespace]?.[STATE_LOADING_MAPPING_KEY]?.[
            funcName
          ]?.[options?.loading?.key ?? 'default'] ?? false;
        updateLoading(loading);
      });
    }, []);
    return {
      loading,
      ...action,
    } as any;
  }
  return useAsyncAction;
}
