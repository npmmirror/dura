import { DURA_PATCHES_SYMBOL, defineHiddenConstantProperty } from '@dura/utils';
import { produceWithPatches } from 'immer';
export function createReducers(store) {
  return function (state = store.state, action) {
    const [, reducerName] = action.type.split('/');
    const [nextState, patches] = produceWithPatches(function (draftState) {
      store.reducers[reducerName]?.(draftState, action as any);
    })(state);

    const stringPatches = patches.map(
      ({ path }) => `${store.namespace}.${path.join('.')}`,
    );

    defineHiddenConstantProperty(nextState, DURA_PATCHES_SYMBOL, stringPatches);

    return nextState;
  };
}
