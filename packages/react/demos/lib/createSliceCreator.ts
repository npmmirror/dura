import merge from 'lodash.merge';
import { useRef, useLayoutEffect, useState as _useState } from 'react';
import { compose, combineReducers } from 'redux';
import { createImmerReducer } from './createImmerReducer';
import { useDebounceFn } from './useDebounceFn';
import type {
  FluxAction,
  ReducersMapObjectOfSlice,
  UseOptions,
  SliceOptions,
} from './types';
import type { Action, AnyAction, Reducer, Store } from 'redux';

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

    // hooks use
    function useMount() {
      const mountRef = useRef(mount);
      const unmountRef = useRef(unmount);

      function mount() {
        if (!reducersCache[namespace]) {
          reducersCache[namespace] = createImmerReducer(options);
          reduxStore.replaceReducer(
            compose(reducer, combineReducers(reducersCache)),
          );
        }
      }

      function unmount() {
        if (reducersCache[namespace]) {
          delete reducersCache[namespace];
          reduxStore.replaceReducer(
            compose(reducer, combineReducers(reducersCache)),
          );
        }
      }

      mountRef.current = mount;
      unmountRef.current = unmount;

      useLayoutEffect(() => (mountRef.current(), unmountRef.current), [
        mountRef,
        unmountRef,
      ]);
    }

    function useState() {
      const [state, setState] = _useState(reduxStore.getState()[namespace]);
      useLayoutEffect(() => {
        setState(reduxStore.getState()[namespace]);
        return reduxStore.subscribe(() => {
          setState(reduxStore.getState()[namespace]);
        });
      }, [reduxStore.subscribe]);
      return state;
    }

    const mapToDispatch = (name: string) => {
      function execute(payload: any) {
        reduxStore.dispatch({
          type: [namespace, name].join('/'),
          payload,
        } as any);
      }

      // hooks use
      function use<T extends (...args: any[]) => any>(options?: UseOptions<T>) {
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
      }
      return { [name]: { use } };
    };

    return Object.keys(reducers)
      .map(mapToDispatch)
      .reduce(merge, { useMount, useState });
  };
}
