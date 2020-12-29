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

export interface UseFn<R> {
  <T = undefined>(options?: CreateUseActionOptions<T>): T extends undefined
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

export interface UseAction<D> {
  (): [D];
  <T extends Func>(options?: {
    transform?: T;
    immediate?: {
      transform?: () => [any, any];
    };
  }): [T];
  <T extends Func>(options?: {
    transform?: T;
    immediate?: {
      transform?: () => [any, any];
    };
    debounce?: {
      wait?: number;
      leading?: boolean;
    };
  }): [T];
  <T extends Func>(options?: {
    transform?: T;
    immediate?: {
      transform?: () => [any, any];
    };
    throttle?: {
      wait?: number;
      leading?: boolean;
    };
  }): [T];
}

export interface UseAsyncAction<D> extends UseAction<D> {
  (): [D, { loading: boolean }];
  <T extends Func>(options?: {
    transform?: T;
    immediate?: {
      transform?: () => [any, any];
    };
    loading?: {
      delay?: number;
    };
  }): [D, { loading: boolean }];
  <T extends Func>(options?: {
    transform?: T;
    immediate?: {
      transform?: () => [any, any];
    };
    loading?: {
      delay?: number;
    };
    debounce?: {
      wait?: number;
      leading?: boolean;
    };
  }): [D, { loading: boolean }];
  <T extends Func>(options?: {
    transform?: T;
    immediate?: {
      transform?: () => [any, any];
    };
    loading?: {
      delay?: number;
    };
    throttle?: {
      wait?: number;
      leading?: boolean;
    };
  }): [D, { loading: boolean }];
}

export interface CreateUseActionOptions<T> {
  transform?: T;
  immediate?: {
    transform: () => [any, any];
  };
  debounce?: {
    wait?: number;
    leading?: boolean;
  };
  throttle?: {
    wait?: number;
    leading?: boolean;
  };
}

export interface CreateUseAsyncActionOptions<T>
  extends CreateUseActionOptions<T> {
  loading?: {
    delay?: number;
  };
}
