import { Store } from 'redux';
import { Effect, SliceStorage, ReducerAction, UseFn } from './@types';
import { createAction, createUseAction } from './createAction';

export function createDefineEffect(
  name: string,
  store: Store,
  sliceStorage: SliceStorage,
) {
  let index = 0;
  return function defineEffect<P, M, E extends Effect<P, M>>(
    fn: E,
  ): {
    run: ReducerAction<P, M>;
    useAction: UseFn<ReducerAction<P, M>>;
  } {
    const fnName =
      fn.name || `@@DURA.EFFECT.${(index = (index + 1) % 1_000_000)}`;
    sliceStorage.effects[fnName] = fn;
    const run = createAction(name, store, fnName) as any;
    const useAction = createUseAction(run) as any;
    return {
      run,
      useAction,
    };
  };
}
