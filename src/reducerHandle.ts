import { Store } from 'redux';
import { merge, upperFirst, isArray } from 'lodash-es';
import { usePersistFn } from '@onecocjs/use';
import { resolveOnChange, createAction } from './internal';
import { ReducerBase, AnyFunction } from './types';

export interface UseOptions<T extends AnyFunction> {
  transform: T;
}

function createHooks(type: string, reduxStore: Store) {
  return function hooks<T extends AnyFunction>(options: UseOptions<T>) {
    return usePersistFn((...args: never[]) => {
      const value = resolveOnChange(options?.transform, ...args);
      const action = isArray(value)
        ? createAction(type, ...value)
        : createAction(type, value);
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
