import { Store } from 'redux';
import { Reducer, SliceStorage } from './@types';
import { createActionType } from './createNamed';
import { useTransform } from './hooks/useTransform';
import { useDebounceFn } from './hooks/useDebounceFn';
import { usePersistFn } from './hooks/usePersistFn';
import { compose } from 'redux';
import { useImmediate } from './hooks/useImmediate';
import { usePollingInterval } from './hooks/usePollingInterval';
import { useRefreshOnWindowFocus } from './hooks/useRefreshOnWindowFocus';

export interface UseActionOptions<
  T extends (...args: any[]) => any = undefined
> {
  transformArgs?: T;
  immediate?: {
    payload?: {};
    meta?: {};
  };
  performance?: {
    action: 'debounce' | 'throttle';
    wait?: number;
    leading?: boolean;
  };
  refreshOnWindowFocus?: {
    payload?: {};
    meta?: {};
  };
  pollingInterval?: {
    ms?: number;
    pollingWhenHidden?: boolean;
    payload?: {};
    meta?: {};
  };
}

export function createDefineReducer<S>(
  name: string,
  store: Store,
  sliceStorage: SliceStorage,
) {
  return function defineReducer<P, M, F extends Reducer<S, P, M>>(
    funcName: string,
    fn: F,
  ) {
    sliceStorage.reducers[funcName] = fn;
    const dispatcher = function <Payload, Meta>(
      payload: Payload,
      meta: Meta = undefined,
    ) {
      return store.dispatch({
        type: createActionType(name, funcName),
        payload,
        meta,
      });
    };

    function useManualInvoked<F extends (...args: any[]) => any>(
      options: UseActionOptions<F>,
    ) {
      const wait = options?.performance?.wait ?? 500;
      const transform = useTransform(run, {
        transformArgs: options?.transformArgs,
      });
      const f = ({ payload, meta }) => dispatcher(payload, meta);

      const $debounced = useDebounceFn(f, wait, options?.performance);
      const debounced = usePersistFn(
        options?.transformArgs
          ? compose($debounced, options?.transformArgs)
          : $debounced,
      );
      const $throttled = useDebounceFn(f, wait, {
        ...options?.performance,
        maxWait: wait,
      });
      const throttled = usePersistFn(
        options?.transformArgs
          ? compose($throttled, options?.transformArgs)
          : $throttled,
      );
      return options?.performance?.action === 'debounce'
        ? debounced
        : options?.performance?.action === 'throttle'
        ? throttled
        : options?.transformArgs
        ? transform
        : run;
    }

    function useImmediatelyInvoked<F extends (...args: any[]) => any>(
      options: UseActionOptions<F>,
    ) {
      const { immediate, pollingInterval, refreshOnWindowFocus } = options;

      useImmediate(() => {
        dispatcher(immediate?.payload, {
          ...immediate?.meta,
          immediate: true,
          pollingInterval: false,
          refreshOnWindowFocus: false,
        });
      }, immediate);

      usePollingInterval(() => {
        dispatcher(pollingInterval?.payload, {
          ...pollingInterval?.meta,
          immediate: false,
          pollingInterval: true,
          refreshOnWindowFocus: false,
        });
      }, pollingInterval);

      useRefreshOnWindowFocus(() => {
        dispatcher(refreshOnWindowFocus?.payload, {
          ...refreshOnWindowFocus?.meta,
          immediate: false,
          pollingInterval: false,
          refreshOnWindowFocus: true,
        });
      }, refreshOnWindowFocus);
    }

    function use<F extends (...args: any[]) => any>(
      options: UseActionOptions<F> = {},
    ) {
      useImmediatelyInvoked(options);
      const finish = useManualInvoked(options);
      return { run: finish };
    }
    const run = (payload: P) => dispatcher(payload);
    const meta = (meta: M) => ({
      run: (payload: P) => dispatcher(payload, meta),
    });

    return {
      meta,
      run,
      use,
    };
  };
}
