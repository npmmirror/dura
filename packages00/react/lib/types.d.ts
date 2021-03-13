export declare type AnyFunction = (...args: any[]) => any;
export declare type Action<P = any, M = any> = {
  type: string;
  payload?: P;
  meta?: M;
};
export interface STORAGE {
  current: {
    reducerMap: {};
  };
}
export interface CreateSliceOptions<
  S,
  A extends Action,
  M extends ReducersMap<S, A>
> {
  namespace: string;
  initialState?: S;
  reducers?: M;
}
export interface ReducersMap<S, A extends Action> {
  [name: string]: (state: S, action: A) => void;
}
export interface UseOptions<T extends (...args: any[]) => any> {
  transform?: T;
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
export interface InitialState {}
export declare type Return<S, M> = {
  [P in keyof M]: M[P] extends (state: S, action: Action<infer P>) => any
    ? {
        use: Use<P>;
        run: (action: P) => void;
      }
    : M[P];
} & {
  useMount: () => void;
};
export declare type Use<P> = <
  T extends (...args: any[]) => any = (payload: P) => void
>(
  options: UseOptions<T>,
) => {
  run: (...args: Parameters<T>) => void;
};
export declare type UseAsync<R extends (...args: any[]) => any> = <
  T extends (...args: any[]) => any = R
>(
  options: UseOptions<T>,
) => {
  run: (...args: Parameters<T>) => void;
};
