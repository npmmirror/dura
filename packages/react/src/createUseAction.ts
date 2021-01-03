import { useEffect, useRef, useMemo } from 'react';
import { Func, UseActionBasicOptions } from './@types';
import debounce from 'lodash.debounce';
import throttle from 'lodash.throttle';

export function createUseAction<D extends Func>(run: D) {
  function useAction<T = undefined>(
    options?: UseActionBasicOptions<T>,
  ): T extends undefined ? { run: D } : { run: T } {
    const ref = useRef({
      transform: undefined,
      dispatch: undefined,
    });
    ref.current.transform = options?.transform;
    ref.current.dispatch = run;

    const transformFn = useMemo(
      () => (...args) =>
        ref.current.dispatch(...ref.current?.transform?.(...args)),
      [ref],
    );

    const debounceFn = useMemo(() => {
      const { wait = 500, ...args } = options?.performance ?? {};
      const debounced = debounce(
        options?.transform ? transformFn : ref.current.dispatch,
        wait,
        args,
      );
      return (...args) => (args?.[0]?.persist?.(), debounced(...args));
    }, [ref]);

    const throttleFn = useMemo(() => {
      const { wait = 500, ...args } = options?.performance ?? {};
      const throttled = throttle(
        options?.transform ? transformFn : ref.current.dispatch,
        wait,
        args,
      );
      return (...args) => (args?.[0]?.persist?.(), throttled(...args));
    }, [transformFn]);

    // 立即执行
    useEffect(
      () =>
        void (
          options?.immediate &&
          ref.current.dispatch(...(options?.immediate?.args ?? []))
        ),
      [],
    );

    // 聚焦执行
    useEffect(() => {
      if (options?.refreshOnWindowFocus) {
        options?.refreshOnWindowFocus?.leading &&
          ref.current.dispatch(...(options?.refreshOnWindowFocus?.args ?? []));

        const listener = () =>
          document.visibilityState === 'visible' &&
          ref.current.dispatch(...(options?.refreshOnWindowFocus?.args ?? []));
        window.addEventListener('visibilitychange', listener);
        window.addEventListener('focus', listener);
        return () => {
          window.removeEventListener('visibilitychange', listener);
          window.removeEventListener('focus', listener);
        };
      }
    }, []);

    // 轮询
    useEffect(() => {
      if (options?.pollingInterval) {
        options?.pollingInterval?.leading &&
          ref.current.dispatch(...(options?.pollingInterval?.args ?? []));
        let timerId = setInterval(() => {
          options?.pollingInterval?.pollingWhenHidden
            ? ref.current.dispatch(...(options?.pollingInterval?.args ?? []))
            : document.visibilityState === 'visible' &&
              document.hasFocus() &&
              ref.current.dispatch(...(options?.pollingInterval?.args ?? []));
        }, options?.pollingInterval?.ms ?? 1000);
        return () => clearInterval(timerId);
      }
    }, []);

    const finish =
      options?.performance?.action === 'debounce'
        ? debounceFn
        : options?.performance?.action === 'throttle'
        ? throttleFn
        : options?.transform
        ? transformFn
        : ref.current.dispatch;

    return { run: finish } as any;
  }
  return useAction;
}
