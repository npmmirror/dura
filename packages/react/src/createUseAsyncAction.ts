import { Store } from 'redux';
import { useEffect, useState } from 'react';
import {
  Func,
  UseAsyncActionOptions,
  UseAsyncActionBasicOptions,
  UseAsyncActionDebounceOptions,
  UseAsyncActionThrottleOptions,
  UseAsyncActionPollingIntervalOptions,
  UseAsyncActionRefreshOnWindowFocusOptions,
  UseAsyncActionReturn,
} from './@types';
import { createUseAction } from './createUseAction';

export function createUseAsyncAction<D extends Func>(
  namespace: string,
  funcName: string,
  store: Store,
  run: D,
) {
  function useAsyncAction(): UseAsyncActionReturn<D>;

  function useAsyncAction(
    options: UseAsyncActionDebounceOptions<any>,
  ): UseAsyncActionReturn<any>;

  function useAsyncAction(
    options: UseAsyncActionThrottleOptions<any>,
  ): UseAsyncActionReturn<any>;

  function useAsyncAction(
    options: UseAsyncActionPollingIntervalOptions<any>,
  ): UseAsyncActionReturn<any>;

  function useAsyncAction(
    options: UseAsyncActionRefreshOnWindowFocusOptions<any>,
  ): UseAsyncActionReturn<any>;

  function useAsyncAction(options?: UseAsyncActionOptions<any>) {
    const [loading, updateLoading] = useState<boolean>(false);
    const [finish] = options?.loading
      ? createUseAction((payload, meta) =>
          run(payload, { ...meta, loading: options.loading }),
        )(options)
      : createUseAction(run)(options);
    useEffect(() => {
      return store.subscribe(() => {
        const loading = store.getState()[namespace]['@@DURA.LOADING'][funcName][
          options?.loading?.key ?? 'default'
        ];
        updateLoading(loading);
      });
    }, []);
    return [finish, { loading }];
  }
  return useAsyncAction;
}
