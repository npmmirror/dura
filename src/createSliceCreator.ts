import type {
  FluxAction,
  ReducersMapObjectOfSlice,
  UseOptions,
  SliceOptions,
} from './types';
import type { Action, AnyAction, Reducer, Store } from 'redux';
import merge from 'lodash.merge';
import get from 'lodash.get';
import { produce } from 'immer';
import { useRef, useLayoutEffect, useState as _useState } from 'react';
import { compose, combineReducers } from 'redux';
import { useDebounceFn } from './useDebounceFn';
import { useUpdate } from './useUpdate';
import { createProxy } from './createProxy';
import { useMemoized } from './useMemoized';

export function createSliceCreator<S = any, A extends Action = AnyAction>(
  reducersCache: any,
  reduxStore: Store,
  reducer: Reducer<S, A>,
) {
  return function createSlice<
    NAME_SPACE extends string,
    S,
    REDUCER_ACTION extends FluxAction,
    REDUCERS = ReducersMapObjectOfSlice<S, REDUCER_ACTION>
  >(options: SliceOptions<NAME_SPACE, S, REDUCERS>) {
    const { namespace, initialState, reducers = {} } = options;
    const immerReducer = createImmerReducer(initialState, reducers);
    const useMount = createUseMount(
      namespace,
      reducersCache,
      reduxStore,
      reducer,
      immerReducer,
    );

    const useState = createUseState(namespace, reduxStore);

    const mapToDispatch = (name: string) => {
      function execute(payload: any) {
        reduxStore.dispatch({
          type: [namespace, name].join('/'),
          payload,
        } as any);
      }

      const use = createUse(execute);

      return { [name]: { use } };
    };

    return Object.keys(reducers)
      .map(mapToDispatch)
      .reduce(merge, { useMount, useState });
  };
}

function createImmerReducer<S>(initialState: S, reducers) {
  return function immerReducer(state = initialState, action: FluxAction) {
    const [, $name] = action?.type?.split('/');
    return produce(state, (draft) => {
      reducers[$name]?.(draft, action);
    });
  };
}

function createUse(execute: any) {
  return function use<T extends (...args: any[]) => any>(
    options?: UseOptions<T>,
  ) {
    const wait = options?.performance?.wait ?? 500;
    const throttledOptions = { ...options?.performance, maxWait: wait };
    const $debounced = useDebounceFn(execute, wait, options?.performance);
    const $throttled = useDebounceFn(execute, wait, throttledOptions);
    const transformFn = compose(execute, options?.transform);
    const debounced = options?.transform
      ? compose($debounced, options.transform)
      : $debounced;
    const throttled = options?.transform
      ? compose($throttled, options?.transform)
      : $throttled;
    return options?.performance?.action === 'debounce'
      ? debounced
      : options?.performance?.action === 'throttle'
      ? throttled
      : options?.transform
      ? transformFn
      : execute;
  };
}

function createUseState(namespace: string, reduxStore: Store) {
  return function useState() {
    const update = useUpdate();

    const proxyRef = useRef(undefined);
    const originalRef = useRef(undefined);
    const cacheRef = useMemoized(() => new Map());

    originalRef.current = reduxStore.getState()[namespace];
    proxyRef.current = createProxy(
      reduxStore.getState()[namespace] ?? {},
      cacheRef,
    );

    useLayoutEffect(() => {
      return reduxStore.subscribe(() => {
        const current = reduxStore.getState()[namespace];
        let isUpdate = false;
        for (const [key] of cacheRef) {
          if (get(current, key) !== get(originalRef.current, key)) {
            isUpdate = true;
            break;
          }
        }
        if (isUpdate) {
          cacheRef.clear();
          originalRef.current = reduxStore.getState()[namespace];
          proxyRef.current = createProxy(
            reduxStore.getState()[namespace] ?? {},
            cacheRef,
          );
          update();
        }
      });
    }, [reduxStore.getState, namespace]);
    return proxyRef.current;
  };
}

function createUseMount<S, A extends Action = AnyAction>(
  namespace: string,
  reducersCache: any,
  reduxStore: Store,
  reducer: Reducer<S, A>,
  immerReducer: any,
) {
  return function useMount() {
    const ref = useRef(undefined);

    if (!reducersCache[namespace]) {
      reducersCache[namespace] = immerReducer;
      reduxStore.replaceReducer(
        compose(reducer, combineReducers(reducersCache)),
      );
    }

    function unmount() {
      if (reducersCache[namespace]) {
        delete reducersCache[namespace];
        reduxStore.replaceReducer(
          compose(reducer, combineReducers(reducersCache)),
        );
      }
    }

    ref.current = unmount;

    useLayoutEffect(() => ref.current, [ref]);
  };
}
