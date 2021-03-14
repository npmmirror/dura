import { Action } from 'redux';

export interface FluxAction<P extends {} = {}, M extends {} = {}>
  extends Action<any> {
  payload?: P;
  meta?: M;
}

export type ImmerReducer<S = any, A extends FluxAction = FluxAction> = (
  state: S,
  action: A,
) => void;

export type ReducersMapObjectOfSlice<
  S = any,
  A extends FluxAction = FluxAction
> = {
  [name: string]: ImmerReducer<S, A>;
};

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
}

export interface SliceOptions<NAME_SPACE extends string, STATE, REDUCERS> {
  namespace: NAME_SPACE;
  initialState: STATE;
  reducers?: REDUCERS;
}

export type CreateSlice = <
  NAME_SPACE extends string,
  S,
  REDUCER_ACTION extends FluxAction,
  REDUCERS = ReducersMapObjectOfSlice<S, REDUCER_ACTION>
>(
  options: SliceOptions<NAME_SPACE, S, REDUCERS>,
) => {
  [K in keyof REDUCERS]: {
    use: <T extends (...args: any[]) => any = undefined>(
      options?: UseOptions<T>,
    ) => T extends undefined
      ? REDUCERS[K] extends (state: S, action: FluxAction<infer P>) => void
        ? (payload: P) => void
        : never
      : (...args: Parameters<T>) => void;
  };
} & { useMount: () => void; useState: () => S };
