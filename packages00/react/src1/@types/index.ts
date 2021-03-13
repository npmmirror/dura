import { ReducersMapObject } from 'redux';
export type PlainObject = { [name: string]: any };
export type AddPrefix<Prefix, Keys> = Prefix extends ''
  ? Keys
  : `${Prefix & string}.${Keys & string}`;
export type DeepState<State, Prefix> = {
  [K in keyof State]: State[K] extends PlainObject
    ? DeepState<State[K], AddPrefix<Prefix, K>>
    : AddPrefix<Prefix, K>;
}[keyof State];
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

export interface UseActionBasicOptions<
  T extends (...args: any[]) => any = undefined
> {
  transformArgs?: T;
  immediate?: {
    payload?: {};
    meta?: {};
  };
  performance?: {
    action: 'debounce' | 'throttle';
    wait?: number;
    leading?: boolean;
  };
  refreshOnWindowFocus?: {
    payload?: {};
    meta?: {};
  };
  pollingInterval?: {
    ms?: number;
    pollingWhenHidden?: boolean;
    payload?: {};
    meta?: {};
  };
}

export interface UseActionOptions<T extends (...args: any[]) => any = undefined>
  extends UseActionBasicOptions<T> {}

export interface UseAsyncActionBasicOptions<
  T extends (...args: any[]) => any = undefined
> extends UseActionBasicOptions<T> {
  loading?: {
    delay?: number;
    key?: string | number;
  };
}

export type UseAsyncActionReturn<R> = [R, { loading: boolean }];
