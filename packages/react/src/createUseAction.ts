import { useEffect, useRef, useMemo } from 'react';
import { UseAction, Func, CreateUseActionOptions } from './@types';
import debounce from 'lodash.debounce';
import throttle from 'lodash.throttle';
export function createUseAction<D extends any>(run: D): UseAction<D>;

export function createUseAction<D extends any>(run: D): UseAction<D>;

export function createUseAction<D extends any>(run: D): UseAction<D>;

export function createUseAction<D extends any>(run: D): UseAction<D>;

export function createUseAction<D extends Func>(run: D) {
  return function useAction<T extends Func>(
    options?: CreateUseActionOptions<T>,
  ) {
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

    useEffect(
      () =>
        void options?.immediate &&
        finish(...(options?.immediate?.transform?.() ?? [])),
      [],
    );

    return [finish];
  };
}
