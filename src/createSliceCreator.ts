import {
  FluxAction,
  ReducersMapObjectOfSlice,
  UseOptions,
  UseMountOptions,
  SliceOptions,
  UseStateOptions,
} from './types';
import merge from 'lodash.merge';
import get from 'lodash.get';
import { produce } from 'immer';
import { useRef, useLayoutEffect, useState as _useState } from 'react';
import {
  compose,
  combineReducers,
  Action,
  AnyAction,
  Reducer,
  Store,
} from 'redux';
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

function createImmerReducer<S>(initialState: S, reducers: any) {
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
    const transformFn = compose(execute, options?.transform as any);
    return options?.transform ? transformFn : execute;
  };
}

function createUseState(namespace: string, reduxStore: Store) {
  return function useState(options?: UseStateOptions) {
    const update = useUpdate();
    const $namespace = [namespace, options?.id].filter((x) => !!x).join('.');

    const proxyRef = useRef(undefined);
    const originalRef = useRef(undefined);
    const cacheRef = useMemoized(() => new Map());

    originalRef.current = reduxStore.getState()[$namespace];
    proxyRef.current = createProxy(
      reduxStore.getState()[$namespace] ?? {},
      cacheRef,
    );

    useLayoutEffect(() => {
      return reduxStore.subscribe(() => {
        const current = reduxStore.getState()[$namespace];
        let isUpdate = false;
        for (const [key] of cacheRef) {
          if (get(current, key) !== get(originalRef.current, key)) {
            isUpdate = true;
            break;
          }
        }
        if (isUpdate) {
          cacheRef.clear();
          originalRef.current = reduxStore.getState()[$namespace];
          proxyRef.current = createProxy(
            reduxStore.getState()[$namespace] ?? {},
            cacheRef,
          );
          update();
        }
      });
    }, [reduxStore.getState, $namespace]);
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
  return function useMount(options?: UseMountOptions) {
    const ref = useRef<(() => void) | undefined>(undefined);
    const $namespace = [namespace, options?.id].filter((x) => !!x).join('.');
    if (!reducersCache[$namespace]) {
      reducersCache[$namespace] = immerReducer;
      reduxStore.replaceReducer(
        compose(reducer, combineReducers(reducersCache)),
      );
    }

    function unmount() {
      if (reducersCache[$namespace]) {
        delete reducersCache[$namespace];
        reduxStore.replaceReducer(
          compose(reducer, combineReducers(reducersCache)),
        );
      }
    }

    ref.current = unmount;

    useLayoutEffect(() => ref.current, [ref]);
  };
}
