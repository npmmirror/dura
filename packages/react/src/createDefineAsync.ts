import { Store } from 'redux';
import { Effect, SliceStorage } from './@types';
import { createAction } from './createAction';
import { createUseAsyncAction } from './createUseAsyncAction';
import { createEffectName } from './createNamed';

export function createDefineAsync(
  name: string,
  store: Store,
  sliceStorage: SliceStorage,
) {
  let count = 0;
  return function defineAsync<
    P,
    M,
    E extends Effect<P, M & { loading?: boolean }>
  >(fn: E) {
    const funcName = createEffectName(fn.name, count);
    sliceStorage.effects[funcName] = fn;
    const run = createAction<P, M>(name, store, funcName);
    const useAsyncAction = createUseAsyncAction(name, funcName, store, run);
    return {
      run,
      useAsyncAction,
    };
  };
}
