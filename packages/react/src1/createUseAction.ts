import { useEffect, useRef, useMemo } from 'react';
import { Func, UseActionBasicOptions } from './@types';

import { useTransform } from './hooks/useTransform';
import { useDebounceFn } from './hooks/useDebounceFn';
import { usePersistFn } from './hooks/usePersistFn';
import { compose } from 'redux';

interface UsePollingIntervalOptions {
  ms?: number;
  pollingWhenHidden?: boolean;
  args?: {
    payload?: {};
    meta?: {};
  };
}

function usePollingInterval(
  fn: any,
  options: UsePollingIntervalOptions = undefined,
) {
  const ref = useRef<UsePollingIntervalOptions | undefined>(undefined);
  ref.current = options;
  useEffect(() => {
    const timerId = setInterval(() => {
      if (
        ref.current &&
        document.visibilityState === 'visible' &&
        document.hasFocus()
      ) {
        fn(ref?.current?.args?.payload, ref?.current?.args?.meta);
      }
    }, ref?.current?.ms ?? 1000);
    return function () {
      clearInterval(timerId);
    };
  }, [ref]);
}

interface UseImmediateOptions {
  args?: {
    payload?: {};
    meta?: {};
  };
}

function useImmediate(fn: any, options: UseImmediateOptions) {
  const ref = useRef<UseImmediateOptions | undefined>(undefined);
  ref.current = options;
  useEffect(() => {
    if (ref.current) {
      fn(ref.current?.args?.payload, ref.current?.args?.meta);
    }
  }, [ref]);
}

interface UseRefreshOnWindowFocusOptions {
  args?: {
    payload?: {};
    meta?: {};
  };
}

function useRefreshOnWindowFocus(
  fn: any,
  options: UseRefreshOnWindowFocusOptions,
) {
  const ref = useRef<UseRefreshOnWindowFocusOptions | undefined>(undefined);
  ref.current = options;
  useEffect(() => {
    function listener() {
      if (ref.current && document.visibilityState === 'visible') {
        fn(ref.current?.args?.payload, ref.current?.args?.meta);
      }
    }
    window.addEventListener('visibilitychange', listener);
    window.addEventListener('focus', listener);
    return function () {
      window.removeEventListener('visibilitychange', listener);
      window.removeEventListener('focus', listener);
    };
  }, [ref]);
}

export function createUseAction<D extends Func>(run: D) {
  function useAction<T extends (...args: any[]) => any = undefined>(
    options?: UseActionBasicOptions<T>,
  ): T extends undefined ? { run: D } : { run: T } {
    const noop = () => ({
      payload: undefined,
      meta: undefined,
    });

    const transformFn = useTransform(run, {
      transformArgs: options?.transformArgs as any,
    });

    const debounced = useDebounceFn(
      ({ payload, meta }) => {
        run(payload, meta);
      },
      options?.performance?.wait ?? 500,
      options?.performance,
    );

    const debounceFn = usePersistFn(
      compose(debounced, options?.transformArgs ?? noop),
    );

    const throttled = useDebounceFn(
      ({ payload, meta }) => {
        run(payload, meta);
      },
      options?.performance?.wait ?? 500,
      { ...options?.performance, maxWait: options?.performance?.wait ?? 500 },
    );

    const throttleFn = usePersistFn(
      compose(throttled, options?.transformArgs ?? noop),
    );

    useImmediate(run, options?.immediate as any);

    usePollingInterval(run, options?.pollingInterval);

    useRefreshOnWindowFocus(run, options?.refreshOnWindowFocus as any);

    const finish =
      options?.performance?.action === 'debounce'
        ? debounceFn
        : options?.performance?.action === 'throttle'
        ? throttleFn
        : options?.transformArgs
        ? transformFn
        : run;

    return { run: finish } as any;
  }
  return useAction;
}
