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
    transform?: () => [any, any];
  };
}

export interface RefreshOnWindowFocus {
  refreshOnWindowFocus?: {
    leading?: boolean;
    transform?: () => PayloadAndMeta;
  };
}

export interface PollingIntervalOptions {
  pollingInterval?: {
    pollingWhenHidden?: boolean;
    immediate?: boolean;
    transform?: () => [any, any];
  };
}
export interface DebounceOptions {
  debounce?: {
    wait?: number;
    leading?: boolean;
  };
}

export interface ThrottleOptions {
  throttle?: {
    wait?: number;
    leading?: boolean;
  };
}

export interface UseActionDebounceOptions<T>
  extends UseActionBasicOptions<T>,
    DebounceOptions {}

export interface UseActionThrottleOptions<T>
  extends UseActionBasicOptions<T>,
    ThrottleOptions {}

export interface UseActionPollingIntervalOptions<T>
  extends UseActionBasicOptions<T>,
    PollingIntervalOptions {}

export interface UseActionRefreshOnWindowFocusOptions<T>
  extends UseActionBasicOptions<T>,
    RefreshOnWindowFocus {}
export interface UseActionOptions<T>
  extends UseActionBasicOptions<T>,
    DebounceOptions,
    ThrottleOptions,
    PollingIntervalOptions,
    RefreshOnWindowFocus {}

export interface UseAsyncActionBasicOptions<T>
  extends UseActionBasicOptions<T> {
  loading?: {
    delay?: number;
    key?: string | number;
  };
}

export interface UseAsyncActionDebounceOptions<T>
  extends UseAsyncActionBasicOptions<T>,
    DebounceOptions {}

export interface UseAsyncActionThrottleOptions<T>
  extends UseAsyncActionBasicOptions<T>,
    ThrottleOptions {}

export type UseAsyncActionReturn<R> = [R, { loading: boolean }];

export interface UseAsyncActionOptions<T>
  extends UseAsyncActionBasicOptions<T>,
    DebounceOptions,
    ThrottleOptions,
    PollingIntervalOptions,
    RefreshOnWindowFocus {}

export interface UseAsyncActionPollingIntervalOptions<T>
  extends UseAsyncActionBasicOptions<T>,
    PollingIntervalOptions {}

export interface UseAsyncActionRefreshOnWindowFocusOptions<T>
  extends UseAsyncActionBasicOptions<T>,
    RefreshOnWindowFocus {}
