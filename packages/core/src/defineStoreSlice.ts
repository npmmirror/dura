import type {
  JsonObject,
  ReducersMapOfStoreSlice,
  EffectsMapOfStoreSlice,
  StoreSlice,
} from '@dura/types';
import {
  dispatchDebounce,
  dispatchLoading,
  dispatchThrottle,
  keys,
  merge,
  noop,
  defineHiddenConstantProperty,
  DURA_PATCHES_SYMBOL,
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
        [x]: async (action, reduxStore) => {
          const type = `${store.namespace}/${x}`;
          const fn = async () => await store.effects[x](action);
          if (action.meta?.debounce) {
            await dispatchDebounce(
              cache,
              type,
              action.meta.debounce,
              store.effects[x],
            )(action);
          } else if (action.meta?.throttle) {
            await dispatchThrottle(
              cache,
              type,
              action.meta.throttle,
              store.effects[x],
            )(action);
          } else if (action.meta?.loading) {
            dispatchLoading(reduxStore, type, action.meta.loading, fn);
          } else {
            store.effects[x](action);
          }
        },
      }))
      .reduce(merge, noop()),
    watchs: keys(store.watchs ?? {})
      .map((x) => {
        let fn = store.watchs[x];
        defineHiddenConstantProperty(fn, DURA_PATCHES_SYMBOL, new Map());
        return {
          [x]: fn,
        };
      })
      .reduce(merge, noop()),
  };

  return warpStore as any;
}
