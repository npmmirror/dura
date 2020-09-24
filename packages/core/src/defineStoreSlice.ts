import type {
  JsonObject,
  ReducersMapOfStoreSlice,
  EffectsMapOfStoreSlice,
  StoreSlice,
  Action,
} from '@dura/types';
import {
  dispatchDebounce,
  dispatchLoading,
  dispatchThrottle,
  keys,
  merge,
  noop,
} from '@dura/utils';
import type { Store as ReduxStore } from 'redux';

export type WrapStoreSlice<N, S, R, E> = {
  namespace: N;
  state: S;
  reducers: {
    [K in keyof R]: R[K] extends (...args: infer PP) => infer RR
      ? (state: S, action: any) => void
      : R[K];
  };
  effects: E;
};

// export function defineStoreSlice<
//   N extends string,
//   S extends JsonObject,
//   R extends ReducersMapOfStoreSlice<S>,
//   E extends EffectsMapOfStoreSlice
// >(store: StoreSlice<N, S, R, E>): StoreSlice<N, S, R, E>;

export function defineStoreSlice<
  N extends string,
  S extends JsonObject,
  R extends ReducersMapOfStoreSlice<S>,
  E extends EffectsMapOfStoreSlice
>(store: StoreSlice<N, S, R, E>): StoreSlice<N, S, R, E> {
  const cache = new Map<string, any>();

  const warpStore = {
    ...store,
    effects: keys(store.effects ?? {})
      .map((x) => ({
        [x]: (action, reduxStore) => {
          const type = `${store.namespace}/${x}`;
          const fn = () => store.effects[x](action);
          if (action.meta?.debounce) {
            dispatchDebounce(cache, type, action.meta.debounce, fn);
          } else if (action.meta?.throttle) {
            dispatchThrottle(cache, type, action.meta.throttle, fn);
          } else if (action.meta?.loading) {
            dispatchLoading(reduxStore, type, action.meta.loading, fn);
          } else {
            store.effects[x](action);
          }
        },
      }))
      .reduce(merge, noop()),
  };

  return warpStore as any;
}
