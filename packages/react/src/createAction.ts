import { Store } from 'redux';
import { ReducerAction } from './@types';
import { createActionType } from './createNamed';

export function createAction<P, M>(
  name: string,
  store: Store,
  fnName: string,
): ReducerAction<P, M> {
  return function (payload: P, meta: M) {
    return store.dispatch({
      type: createActionType(name, fnName),
      payload,
      meta,
    });
  } as any;
}
