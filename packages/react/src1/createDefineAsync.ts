import { useEffect, useRef } from 'react';
import { compose, Store } from 'redux';
import { UseAsyncActionBasicOptions, SliceStorage } from './@types';
import {
  ACTION_TYPE_SEP,
  UPDATE_LOADING_REDUCER_NAME,
  STATE_LOADING_MAPPING_KEY,
} from './createNamed';
import { useUpdate } from './hooks/useUpdate';
import { useTransform } from './hooks/useTransform';
import { useDebounceFn } from './hooks/useDebounceFn';
import { usePersistFn } from './hooks/usePersistFn';
import { useImmediate } from './hooks/useImmediate';
import { usePollingInterval } from './hooks/usePollingInterval';
import { useRefreshOnWindowFocus } from './hooks/useRefreshOnWindowFocus';

export interface UseAsyncOptions<
  DISPATCHER extends (...args: any) => any,
  TRANSFORM_ARGS extends (...args: any[]) => any
> {
  transformArgs?: TRANSFORM_ARGS;
  immediate?: {
    args: Parameters<DISPATCHER>;
  };
  performance?: {
    action: 'debounce' | 'throttle';
    wait?: number;
    leading?: boolean;
  };
  refreshOnWindowFocus?: {
    args?: Parameters<DISPATCHER>;
  };
  pollingInterval?: {
    ms?: number;
    pollingWhenHidden?: boolean;
    args?: Parameters<DISPATCHER>;
  };
  loading?: {
    delay?: number;
    key?: string | number;
  };
  skeleton?: {
    delay?: number;
    key?: string | number;
  };
}

function createLoadingActionFactory(
  namespace: string,
  functionName: string,
  loadingKey: string | number,
) {
  return function createLoadingAction(value: boolean) {
    return {
      type: `${namespace}${ACTION_TYPE_SEP}${UPDATE_LOADING_REDUCER_NAME}`,
      payload: {
        key: `${functionName}.${loadingKey ?? 'default'}`,
        val: value,
      },
    };
  };
}

function createUseAction<T extends Function>(
  namespace: string,
  functionName: string,
  store: Store,
  fn: T,
) {
  return function useAsyncAction<T extends (...args: any[]) => any = undefined>(
    options?: any,
  ) {
    // useImmediatelyInvoked(
    //   () => store.dispatch(fn(options?.immediate?.args)),
    //   options,
    // );

    // const run = useManualInvoked(
    //   () => store.dispatch(fn(options?.transformArgs)),
    //   options,
    // );

    useImmediate(() => {
      store.dispatch(fn(...options.immediate.args));
    }, options.immediate);

    usePollingInterval(() => {
      store.dispatch(fn(...options.pollingInterval.args));
    }, options.pollingInterval);

    useRefreshOnWindowFocus(() => {
      store.dispatch(fn(...options.refreshOnWindowFocus.args));
    }, options.refreshOnWindowFocus);

    const loadingRef = useRef<boolean>(false);
    const funcRef = useRef<T>(fn as any);
    const forceUpdate = useUpdate();
    if (options?.loading) {
      const wrapLoading = usePersistFn(<T>(...args: T[]) => {
        const action = async function (...reduxArgs) {
          const _thunkAction = fn(...args);
          const createLoadingAction = createLoadingActionFactory(
            namespace,
            functionName,
            options?.loading?.key,
          );
          store.dispatch(createLoadingAction(true));
          await _thunkAction(...reduxArgs);
          store.dispatch(createLoadingAction(false));
        };
        store.dispatch(action as any);
      });
      funcRef.current = wrapLoading as any;
    }
    useEffect(() => {
      return store.subscribe(() => {
        const loading =
          store.getState()?.[namespace]?.[STATE_LOADING_MAPPING_KEY]?.[
            functionName
          ]?.[options?.loading?.key ?? 'default'] ?? false;
        if (loading !== loadingRef.current) {
          loadingRef.current = loading;
          forceUpdate();
        }
      });
    }, []);
    return {
      run: funcRef.current,
      loading: loadingRef.current,
    };
  };
}

export function createDefineAsync(
  name: string,
  store: Store,
  sliceStorage: SliceStorage,
) {
  return function defineAsync<T extends (...args: any[]) => any>(
    funcName: string,
    fn: T,
  ) {
    sliceStorage.effects[funcName] = 1 as any;
    function dispatcher(...args: Parameters<T>) {
      return store.dispatch(fn(...args) as any);
    }
    // const use = createUseAction(name, funcName, store, fn);

    function use<P extends (...args: any[]) => any>(
      options: UseAsyncOptions<T, P> = {},
    ) {
      const { immediate, pollingInterval, refreshOnWindowFocus } = options;
      useImmediate(() => {
        dispatcher(...immediate?.args);
      }, immediate);

      usePollingInterval(() => {
        dispatcher(...pollingInterval?.args);
      }, pollingInterval);

      useRefreshOnWindowFocus(() => {
        dispatcher(...refreshOnWindowFocus?.args);
      }, refreshOnWindowFocus);

      const wait = options?.performance?.wait ?? 500;

      // const transform = useTransform(dispatcher, {
      //   transformArgs: options.transformArgs,
      // });

      const transform = usePersistFn((...args) => {
        const p = options?.transformArgs(...args);
        dispatcher(...p);
      });

      const $debounced = useDebounceFn(dispatcher, wait, options?.performance);
      const debounced = usePersistFn(
        options?.transformArgs
          ? (...args) => {
              const p = options?.transformArgs(...args);
              $debounced(...p);
            } //compose($debounced, options?.transformArgs)
          : $debounced,
      );

      const $throttled = useDebounceFn(dispatcher, wait, {
        ...options?.performance,
        maxWait: wait,
      });
      const throttled = usePersistFn(
        options?.transformArgs
          ? (...args) => {
              const p = options?.transformArgs(...args);
              $throttled(...p);
            } //compose($throttled, options?.transformArgs)
          : $throttled,
      );
      return options?.performance?.action === 'debounce'
        ? debounced
        : options?.performance?.action === 'throttle'
        ? throttled
        : options?.transformArgs
        ? transform
        : dispatcher;
    }

    // function use(options: UseAsyncActionBasicOptions) {
    //   useImmediatelyInvoked(runAction, options);
    //   const run = useManualInvoked(runAction, options);
    // }

    return { run: dispatcher, use };
  };
}
