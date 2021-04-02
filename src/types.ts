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
export type ReducerBase<S> = Record<
  string,
  (state: S, ...args: never[]) => any
>;
