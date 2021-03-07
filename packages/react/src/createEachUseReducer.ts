import type { Action, Store } from 'redux';
import type { Use, AnyFunction, UseOptions } from './types';
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

export const createUseReducer = <F extends AnyFunction>(run: F) => <
  T extends AnyFunction
>(
  useOptions: UseOptions<T>,
) => (useAutomaticHooks(run, useOptions), useManualHooks(run, useOptions));

function useManualHooks<T extends (...args: any[]) => any>(
  run: any,
  useOptions: UseOptions<T>,
) {
  const wait = useOptions?.performance?.wait ?? 500;
  const transform = usePersistFn(compose(run, useOptions?.transform));

  const $debounced = useDebounceFn(run, wait, useOptions?.performance);
  const debounced = usePersistFn(
    useOptions?.transform
      ? compose($debounced, useOptions?.transform)
      : $debounced,
  );
  const $throttled = useDebounceFn(run, wait, {
    ...useOptions?.performance,
    maxWait: wait,
  });
  const throttled = usePersistFn(
    useOptions?.transform
      ? compose($throttled, useOptions?.transform)
      : $throttled,
  );

  return {
    run:
      useOptions?.performance?.action === 'debounce'
        ? debounced
        : useOptions?.performance?.action === 'throttle'
        ? throttled
        : useOptions?.transform
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
  const immediateExecute = () => void run(immediate?.payload, immediateMeta);

  const pollingIntervalExecute = () =>
    void run(pollingInterval?.payload, pollingIntervalMeta);

  const refreshOnWindowFocusExecute = () =>
    void run(refreshOnWindowFocus?.payload, refreshOnWindowFocusMeta);

  useImmediate(immediateExecute, immediate);
  usePollingInterval(pollingIntervalExecute, pollingInterval);
  useRefreshOnWindowFocus(refreshOnWindowFocusExecute, refreshOnWindowFocus);
}
