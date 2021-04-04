import { Store } from 'redux';
import { resolveOnChange } from './internal';
import { usePersistFn } from '@onecocjs/use';
import { ON_CHANGE_STATE } from './const';

export interface UseBindOptions<T extends (...args: unknown[]) => unknown> {
  transform?: T | string | number;
}

export function createUseOnChange(namespace: string, reduxStore: Store) {
  return function useChange<T extends (...args: any[]) => any>(
    path: string,
    optionsUseBind: UseBindOptions<T>,
  ) {
    return usePersistFn((...args: unknown[]) => {
      const value = resolveOnChange(optionsUseBind?.transform, ...args);
      const action = {
        type: `${namespace}/${ON_CHANGE_STATE}`,
        payload: [path, value],
      };
      reduxStore.dispatch(action as never);
    });
  };
}
