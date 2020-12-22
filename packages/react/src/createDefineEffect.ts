import { Store } from 'redux';
import { Effect, SliceStorage, ReducerAction, UseFn } from './@types';
import { createAction, createUseAction } from './createAction';

export function createDefineEffect(
  name: string,
  store: Store,
  sliceStorage: SliceStorage,
) {
  return function defineEffect<P, M, E extends Effect<P, M>>(
    effectFn: E,
  ): {
    run: ReducerAction<P, M>;
    useAction: UseFn<ReducerAction<P, M>>;
  } {
    sliceStorage.effects[effectFn.name] = effectFn;
    const run = createAction(name, store, effectFn) as any;
    const useAction = createUseAction(run) as any;
    return {
      run,
      useAction,
    };
  };
}
