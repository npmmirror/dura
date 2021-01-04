import { Store } from 'redux';
import { Reducer, SliceStorage } from './@types';
import { createAction } from './createAction';
import { createUseAction } from './createUseAction';
import { createReducerName } from './createNamed';

export function createDefineReducer<S>(
  name: string,
  store: Store,
  sliceStorage: SliceStorage,
) {
  return function defineReducer<P, M, F extends Reducer<S, P, M>>(
    funcName: string,
    fn: F,
  ) {
    sliceStorage.reducers[funcName] = fn;
    const run = createAction<P, M>(name, store, funcName);
    const useAction = createUseAction(run);
    return {
      run,
      useAction,
    };
  };
}
