import type { StoreEnhancer, Middleware, Store as ReduxStore } from 'redux';

export interface Loading {
  status: boolean;
  error: Error;
}

export interface DebounceSettings {
  /** 需要延迟的毫秒数 */
  wait: number;
  /** 指定在延迟开始前调用 */
  leading?: boolean;
  /** 设置 func 允许被延迟的最大值。 */
  maxWait?: number;
  /** 指定在延迟结束后调用 */
  trailing?: boolean;
}

export interface ThrottleSettings {
  /** 需要延迟的毫秒数 */
  wait: number;
  /** 指定在延迟开始前调用 */
  leading?: boolean;
  /** 指定在延迟结束后调用 */
  trailing?: boolean;
}

export interface LoadingSettings {
  customizeId: string | number;
}

export interface ConfiguraOptions {
  enhancers?: StoreEnhancer[];
  middlewares?: Middleware[];
  compose?: any;
  preloadedState?: any;
}

export interface JsonObject<V = any> {
  [name: string]: V;
}

export interface Effect {
  (action: Action): Promise<void>;
}

export interface Reducer<S = JsonObject> {
  (state: S, action: Action): void | S;
}

export interface LoadingMeta {
  loading: boolean | LoadingSettings;
}

export interface DebounceMeta {
  debounce: number | DebounceSettings;
}

export interface ThrottleMeta {
  throttle: number | ThrottleSettings;
}

export type Meta = LoadingMeta | DebounceMeta | ThrottleMeta;

export type Action<P = any> = {
  payload: P;
  meta?: Meta;
};

export type EffectsMapOfStoreSlice = JsonObject<Effect>;

export type ReducersMapOfStoreSlice<S> = JsonObject<Reducer<S>>;

export type EffectsMapOfStore = JsonObject<EffectsMapOfStoreSlice>;

export type ReducersMapOfStore<S> = JsonObject<ReducersMapOfStoreSlice<S>>;

export type StoreSliceMap<
  N extends string,
  S extends JsonObject,
  R extends ReducersMapOfStoreSlice<S>,
  E extends EffectsMapOfStoreSlice
> = JsonObject<StoreSlice<N, S, R, E>>;

export interface StoreSlice<
  N extends string,
  S extends JsonObject,
  R extends ReducersMapOfStoreSlice<S>,
  E extends EffectsMapOfStoreSlice
> {
  namespace: N;
  state: S;
  reducers?: R;
  effects?: E;
  watchs?: {
    [name: string]: {
      dep: (state: S) => any[];
      handler: (state: S) => Promise<void>;
      immediate?: boolean;
    };
  };
  computed?: any;
}

export type ExtractStateByStoreUnion<T> = T extends StoreSlice<
  infer N,
  infer S,
  infer R,
  infer E
>
  ? {
      [K in N]: {
        [SK in keyof S]: S[SK];
      };
    }
  : never;

export type ExtractAction<T> = ExtractActionByReducer<T> &
  ExtractActionByEffect<T>;

export type ExtractActionByReducer<T> = T extends StoreSlice<
  infer N,
  infer S,
  infer R,
  infer E
>
  ? {
      [K in N]: {
        [RK in keyof R]: R[RK] extends (
          state: infer FS,
          action: Action<infer A>,
        ) => any
          ? (payload?: A) => void
          : never;
      };
    }
  : never;

export interface WrapTypesEffect<T> {
  (payload?: T, meta?: LoadingMeta): void;
  (payload?: T, meta?: DebounceMeta): void;
  (payload?: T, meta?: ThrottleMeta): void;
}

export type ExtractActionByEffect<T> = T extends StoreSlice<
  infer N,
  infer S,
  infer R,
  infer E
>
  ? {
      [K in N]: {
        [EK in keyof E]: E[EK] extends (action?: Action<infer A>) => any
          ? WrapTypesEffect<A>
          : never;
      };
    }
  : never;

export type ExtractLoadingTypes<T> = T extends StoreSlice<
  infer N,
  infer S,
  infer R,
  infer E
>
  ? {
      [K in N]: {
        [EK in keyof E]: E[EK] extends (action?: Action<infer A>) => any
          ? { status: boolean; error: Error; customize: JsonObject<Loading> }
          : never;
      };
    }
  : never;

export type UnionToIntersection<T> = (
  T extends any ? (param: T) => any : never
) extends (param: infer P) => any
  ? P
  : never;

export interface UseStoreSliceFn<GS, GA> {
  <
    N extends string,
    S extends JsonObject,
    R extends ReducersMapOfStoreSlice<S>,
    E extends EffectsMapOfStoreSlice,
    STORES extends StoreSlice<N, S, R, E>[],
    NGA = UnionToIntersection<ExtractAction<STORES[number]>>,
    NGS = UnionToIntersection<ExtractStateByStoreUnion<STORES[number]>>
  >(
    ...stores: STORES
  ): CreateStoreReturn<GS & NGS, GA & NGA>;
}

export interface UnUseStoreSliceFn<GS, GA> {
  <
    N extends string,
    S extends JsonObject,
    R extends ReducersMapOfStoreSlice<S>,
    E extends EffectsMapOfStoreSlice,
    STORES extends StoreSlice<N, S, R, E>[]
  >(
    ...stores: STORES
  ): CreateStoreReturn<
    Omit<GS, STORES[number]['namespace']>,
    Omit<GA, STORES[number]['namespace']>
  >;
}

export interface RefreshStoreFn<S, A> {
  (prefix: string): CreateStoreReturn<S, A>;
}

export interface CreateStoreReturn<S, A> extends ReduxStore<S> {
  use: UseStoreSliceFn<S, A>;
  unUse: UnUseStoreSliceFn<S, A>;
  refresh: RefreshStoreFn<S, A>;
  actions: A;
}
