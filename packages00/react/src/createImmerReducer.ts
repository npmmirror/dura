import type { Action } from 'redux';
import { CreateSliceOptions, ReducersMap } from './types';
import { produce } from 'immer';
export function createImmerReducer<
  S,
  A extends Action,
  M extends ReducersMap<S, A>
>(options: CreateSliceOptions<S, A, M>) {
  const { initialState = {}, reducers = {} } = options;
  return function (state = initialState, action) {
    const [, $name] = action.type.split('/');
    return produce(state, (draft) => {
      reducers[$name]?.(draft as any, action);
    });
  };
}
