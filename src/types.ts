import { Store, Action, AnyAction } from 'redux';
/**
 * 清除数组的第一个元素
 */
export type ShiftAction<T extends any[]> = ((...args: T) => any) extends (
  arg1: any,
  ...rest: infer R
) => any
  ? R
  : never;

/**
 * 任意函数
 */
export type AnyFunction = (...args: any[]) => any;

/**
 * reducer
 */
export type ReducerBase<S = any> = Record<
  string,
  (state: S, ...args: never[]) => any
>;

export interface DefineLeafFnOptions<S, R> {
  namespace: string;
  initialState: S;
  reducers?: R;
}

export interface HooksOptions<T> {
  transform?: T;
}

export type Hooks<PF extends AnyFunction> = <T>(
  options: HooksOptions<T>,
) => T extends AnyFunction
  ? (...args: Parameters<T>) => void
  : (...args: ShiftAction<Parameters<PF>>) => void;

/**
 * 转换hooks
 */
export type ResolveHooks<R extends ReducerBase> = {
  [K in keyof R & string as `use${Capitalize<K>}`]: Hooks<R[K]>;
};
/**
 * 转换普通的fn
 */
export type ResolveFn<R extends ReducerBase> = {
  [K in keyof R]: (...args: ShiftAction<Parameters<R[K]>>) => void;
};

type PathKeys<T> = object extends T
  ? string
  : T extends readonly any[]
  ? Extract<keyof T, `${number}`> | SubKeys<T, Extract<keyof T, `${number}`>>
  : T extends object
  ? Extract<keyof T, string> | SubKeys<T, Extract<keyof T, string>>
  : never;
type SubKeys<T, K extends string> = K extends keyof T
  ? `${K}.${PathKeys<T[K]>}`
  : never;

export type Selector<S = any, R = any> = (state: S) => R;

export type ResolveSysFn<S> = {
  useMount: () => void;
  useState: <R>(selector?: Selector<S, R> | boolean) => S;
  useSetter: <T>(
    path: PathKeys<S>,
    options?: {
      transform?:
        | T
        | number
        | 'text'
        | 'textarea'
        | 'date'
        | 'datetime-local'
        | 'email'
        | 'month'
        | 'number'
        | 'password'
        | 'range'
        | 'search'
        | 'tel'
        | 'time'
        | 'url'
        | 'week'
        | 'datetime'
        | 'checkbox'
        | 'radio';
    },
  ) => T;
};
/**
 * 合并
 */
export type DefineLeafFnResult<S, R extends ReducerBase> = ResolveHooks<R> &
  ResolveFn<R> &
  ResolveSysFn<S>;

export type DefineLeafFn = <S, R extends ReducerBase<S>>(
  options: DefineLeafFnOptions<S, R>,
) => DefineLeafFnResult<S, R>;

export type CreateContextFn = (namespace: string) => Context;

export type Context = {
  namespace: string;
  has(): boolean;
  del(): void;
  add(): void;
  refresh(): void;
  reduxStore: Store<any, any>;
};
