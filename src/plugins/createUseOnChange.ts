import { Action, AnyAction } from 'redux';
import { resolveOnChange } from '../internal';
import { usePersistFn } from '@onecocjs/use';
import { Context } from '../types';
import { ON_CHANGE_STATE } from '../const';

export interface UseBindOptions<T extends (...args: unknown[]) => unknown> {
  transform?: T | string | number;
}

export function createUseOnChange<
  S extends Record<string, any>,
  A extends Action = AnyAction
>({ namespace, reduxStore }: Context<S, A>) {
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
