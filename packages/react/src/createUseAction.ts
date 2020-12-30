import { useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Func,
  UseActionOptions,
  UseActionBasicOptions,
  UseActionDebounceOptions,
  UseActionThrottleOptions,
  UseActionPollingIntervalOptions,
  UseActionRefreshOnWindowFocusOptions,
} from './@types';
import debounce from 'lodash.debounce';
import throttle from 'lodash.throttle';

export function createUseAction<D extends Func>(run: D) {
  function useAction(): [D];

  function useAction(options: UseActionDebounceOptions<any>): [any];

  function useAction(options: UseActionThrottleOptions<any>): [any];

  function useAction(options: UseActionPollingIntervalOptions<any>): [any];

  function useAction(options: UseActionRefreshOnWindowFocusOptions<any>): [any];

  function useAction(options?: UseActionOptions<any>) {
    const ref = useRef({
      transform: undefined,
      dispatch: undefined,
    });
    ref.current.transform = options.transform;
    ref.current.dispatch = run;

    const transformFn = useMemo(
      () => (...args) =>
        ref.current.dispatch(...ref.current?.transform?.(...args)),
      [ref],
    );

    const debounceFn = useMemo(() => {
      const { wait = 500, ...args } = options?.debounce ?? {};
      const debounced = debounce(
        options?.transform ? transformFn : ref.current.dispatch,
        wait,
        args,
      );
      return (...args) => (args?.[0]?.persist?.(), debounced(...args));
    }, [ref]);

    const throttleFn = useMemo(() => {
      const { wait = 500, ...args } = options?.throttle ?? {};
      const throttled = throttle(
        options?.transform ? transformFn : ref.current.dispatch,
        wait,
        args,
      );
      return (...args) => (args?.[0]?.persist?.(), throttled(...args));
    }, [transformFn]);

    const finish = options?.debounce
      ? debounceFn
      : options?.throttle
      ? throttleFn
      : options?.transform
      ? transformFn
      : ref.current.dispatch;

    const sideRun = useCallback(() => {
      if (document.visibilityState === 'visible') {
        finish(...(options?.refreshOnWindowFocus?.transform?.() ?? []));
      }
    }, []);

    useEffect(
      () =>
        void options?.immediate &&
        finish(...(options?.immediate?.transform?.() ?? [])),
      [],
    );

    useEffect(() => {
      if (options?.refreshOnWindowFocus) {
        window.addEventListener('visibilitychange', sideRun);
        window.addEventListener('focus', sideRun);
        return () => {
          window.removeEventListener('visibilitychange', sideRun);
          window.removeEventListener('focus', sideRun);
        };
      }
    }, []);

    return [finish];
  }
  return useAction;
}
