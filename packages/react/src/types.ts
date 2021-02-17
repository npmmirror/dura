import type { Action } from 'redux';
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
export interface ReducersMap<S, A extends Partial<Action>> {
  $SET_STATE?: (state: S, action: A) => void;
  [name: string]: (state: S, action: A) => void;
}

export interface UseOptions<T extends (...args: any[]) => any = undefined> {
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

export interface InitialState {}

export type Reducers<M, S> = {
  [P in keyof M]: M[P] extends (...args: infer A) => Promise<void>
    ? (this: { methods: M } & { state: S }, payload: A[0]) => Promise<void>
    : M[P];
};

export interface CommitParameter<S> {
  (preState: S): void;
}

export type Return<S, M> = {
  [P in keyof M]: M[P] extends (...args: infer A) => any
    ? {
        use: <T extends (...args: any[]) => any = (action: A[1]) => void>(
          options: UseOptions<T>,
        ) => { run: T };
        run: (action: A[1]) => void;
      }
    : M[P];
} & { useMount: () => void; $commit: (fn: CommitParameter<S>) => void };
