import { ReducersMapObject } from 'redux';

export interface SliceReducersMapObject {
  [name: string]: Reducer;
}
export interface SliceEffectsMapObject {
  [name: string]: Effect;
}
export interface EffectsMapObject {
  [name: string]: {
    [name: string]: Effect;
  };
}
export interface SliceRefCount {
  [name: string]: number;
}
export interface Action<P = unknown, M = unknown> {
  type: string;
  payload: P;
  meta: M;
}
export interface Effect<P = unknown, M = unknown> {
  (action: Action<P, M>): Promise<void>;
}
export interface Reducer<S = {}, P = unknown, M = unknown> {
  (state: S, action: Action<P, M>): void;
}
export type ReducerAction<P, M> = P extends object
  ? M extends object
    ? (payload: P, meta: M) => void
    : (payload: P) => void
  : () => void;

export interface UseFn<R> {
  <T = undefined>(options: CreateUseActionOptions<T>): T extends undefined
    ? R
    : T;
}

export interface GlobalStorage {
  reducers: ReducersMapObject;
  effects: EffectsMapObject;
  refCount: SliceRefCount;
  coreReducers: ReducersMapObject;
}

export interface SliceStorage {
  reducers: SliceReducersMapObject;
  effects: SliceEffectsMapObject;
}

export interface CreateUseActionOptions<T> {
  transform?: T;
}
