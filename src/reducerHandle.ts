import { Store } from 'redux';
import { merge, upperFirst, isArray } from 'lodash-es';
import { usePersistFn } from '@onecocjs/use';
import { createAction } from './internal';
import { ReducerBase, AnyFunction } from './types';

export interface UseOptions<T extends AnyFunction> {
  transform: T;
}

function createHooks(type: string, reduxStore: Store) {
  return function hooks<T extends AnyFunction>(options: UseOptions<T>) {
    return usePersistFn((...args: never[]) => {
      /**
       * 由于自定义 reducer 通常自己会定义参数类型，
       * 类型系统难以针对 form 表单进行取舍，
       * 因此并不适合使用 resolveOnChange
       */
      const value = options?.transform?.(...args) ?? args;
      const action = createAction(type, value);
      reduxStore.dispatch(action);
    });
  };
}

function createPureFunction(type: string, reduxStore: Store) {
  return function pureFunction(...args: unknown[]) {
    reduxStore.dispatch(createAction(type, ...args));
  };
}

export function reducerHandle(
  namespace: string,
  reduxStore: Store,
  reducers: ReducerBase,
) {
  const mapToUse = (name: string) => {
    const type = `${namespace}/${name}`;
    return {
      [`use${upperFirst(name)}`]: createHooks(type, reduxStore),
      [name]: createPureFunction(type, reduxStore),
    };
  };
  return Object.keys(reducers).map(mapToUse).reduce(merge);
}
