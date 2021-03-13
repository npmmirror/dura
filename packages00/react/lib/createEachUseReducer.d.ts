import type { AnyFunction, UseOptions } from './types';
export declare const createUseReducer: <F extends AnyFunction>(
  run: F,
) => <T extends AnyFunction>(
  useOptions: UseOptions<T>,
) => {
  run: any;
};
