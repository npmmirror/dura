import { Store } from 'redux';
import { Reducer, ReducerAction, SliceStorage, UseFn } from './@types';
import { createAction, createUseAction } from './createAction';

export function createDefineReducer<S>(
  name: string,
  store: Store,
  sliceStorage: SliceStorage,
) {
  let index = 0;
  return function defineReducer<P, M, F extends Reducer<S, P, M>>(
    fn: F,
  ): {
    run: ReducerAction<P, M>;
    useAction: UseFn<ReducerAction<P, M>>;
  } {
    const fnName =
      fn.name || `@@DURA.REDUCER.${(index = (index + 1) % 1_000_000)}`;
    sliceStorage.reducers[fnName] = fn;
    const run = createAction(name, store, fnName) as any;
    const useAction = createUseAction(run) as any;
    return {
      run,
      useAction,
    };
  };
}
