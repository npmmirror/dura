import type { Action, Store } from 'redux';
import type { ReducersMap, CreateSliceOptions, UseOptions } from './types';
import { useImmediate } from './useImmediate';
import { usePollingInterval } from './usePollingInterval';
import { useRefreshOnWindowFocus } from './useRefreshOnWindowFocus';
import { usePersistFn } from './usePersistFn';
import { useDebounceFn } from './useDebounceFn';
import curry from 'lodash.curry';
import { compose } from 'redux';

const automaticHooksNames = [
  'immediate',
  'pollingInterval',
  'refreshOnWindowFocus',
] as const;

const createMeta = (e: typeof automaticHooksNames[number], merge: {}) =>
  automaticHooksNames
    .map((x) => ({ [x]: x === e }))
    .reduce((prev, next) => ({ ...prev, ...next }), merge);

export function createEachUseReducer<
  N extends string,
  S,
  A extends Action,
  M extends ReducersMap<S, A>
>(store: Store<S>, createSliceOptions: CreateSliceOptions<S, A, M>) {
  return function each(name: N) {
    const TYPE = `${createSliceOptions.namespace}/${name}`;
    function execute(type, { payload, meta }) {
      store.dispatch({ type, payload, meta });
    }
    const run = curry(execute)(TYPE);
    function use<T extends (...args: any[]) => any>(useOptions: UseOptions<T>) {
      useAutomaticHooks(run, useOptions);
      return useManualHooks(run, useOptions);
    }
    return { [name]: { use, run } };
  };
}

function useManualHooks<T extends (...args: any[]) => any>(
  run: any,
  useOptions: UseOptions<T>,
) {
  const wait = useOptions?.performance?.wait ?? 500;
  const transform = usePersistFn(compose(run, useOptions?.transformArgs));

  const $debounced = useDebounceFn(run, wait, useOptions?.performance);
  const debounced = usePersistFn(
    useOptions?.transformArgs
      ? compose($debounced, useOptions?.transformArgs)
      : $debounced,
  );
  const $throttled = useDebounceFn(run, wait, {
    ...useOptions?.performance,
    maxWait: wait,
  });
  const throttled = usePersistFn(
    useOptions?.transformArgs
      ? compose($throttled, useOptions?.transformArgs)
      : $throttled,
  );

  return {
    run:
      useOptions?.performance?.action === 'debounce'
        ? debounced
        : useOptions?.performance?.action === 'throttle'
        ? throttled
        : useOptions?.transformArgs
        ? transform
        : run,
  };
}

function useAutomaticHooks<T extends (...args: any[]) => any>(
  run: any,
  options: UseOptions<T>,
) {
  const { immediate, pollingInterval, refreshOnWindowFocus } = options;
  const immediateMeta = createMeta('immediate', immediate?.meta);
  const pollingIntervalMeta = createMeta(
    'pollingInterval',
    pollingInterval?.meta,
  );
  const refreshOnWindowFocusMeta = createMeta(
    'refreshOnWindowFocus',
    refreshOnWindowFocus?.meta,
  );
  const immediateExecute = () =>
    void run({ payload: immediate?.payload, meta: immediateMeta });

  const pollingIntervalExecute = () =>
    void run({ payload: pollingInterval?.payload, meta: pollingIntervalMeta });

  const refreshOnWindowFocusExecute = () =>
    void run({
      payload: refreshOnWindowFocus?.payload,
      meta: refreshOnWindowFocusMeta,
    });

  useImmediate(immediateExecute, immediate);
  usePollingInterval(pollingIntervalExecute, pollingInterval);
  useRefreshOnWindowFocus(refreshOnWindowFocusExecute, refreshOnWindowFocus);
}
