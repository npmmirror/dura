import type {
  JsonObject,
  ReducersMapOfStoreSlice,
  EffectsMapOfStoreSlice,
  StoreSlice,
} from '@dura/types';

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

export function defineStoreSlice<
  N extends string,
  S extends JsonObject,
  R extends ReducersMapOfStoreSlice<S>,
  E extends EffectsMapOfStoreSlice
>(store: StoreSlice<N, S, R, E>): StoreSlice<N, S, R, E> {
  return store;
}
