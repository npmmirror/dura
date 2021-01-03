import { ReducersMapObject } from 'redux';

export type Func = (...args: any[]) => any;
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

export type PayloadAndMeta = any[];

export interface UseActionBasicOptions<T> {
  transform?: T;
  immediate?: {
    args?: [any, any];
  };
  performance?: {
    action: 'debounce' | 'throttle';
    wait?: number;
    leading?: boolean;
  };
  refreshOnWindowFocus?: {
    args?: [any, any];
    leading?: boolean;
  };
  pollingInterval?: {
    ms?: number;
    pollingWhenHidden?: boolean;
    args?: [any, any];
    leading?: boolean;
  };
}

export interface UseActionOptions<T> extends UseActionBasicOptions<T> {}

export interface UseAsyncActionBasicOptions<T>
  extends UseActionBasicOptions<T> {
  loading?: {
    delay?: number;
    key?: string | number;
  };
}

export type UseAsyncActionReturn<R> = [R, { loading: boolean }];
