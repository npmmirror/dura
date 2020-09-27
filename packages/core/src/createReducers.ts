import {
  keys,
  createProxy,
  DURA_PATCHES_SYMBOL,
  defineHiddenConstantProperty,
} from '@dura/utils';
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

    keys(store.watchs ?? {}).forEach((x) => {
      let watch = store.watchs[x];
      if (!watch) {
        return;
      }
      const patches: Map<string, number> = watch[DURA_PATCHES_SYMBOL];
      const isFirstInvoke = stringPatches.length === 0;
      const deps = new Map<string, number>();
      const proxy = createProxy(nextState, deps, store.namespace);

      if (typeof watch === 'function') {
        if (
          !isFirstInvoke &&
          (stringPatches.some((n: string) => patches.has(n)) ||
            patches.size === 0)
        ) {
          watch(proxy);
          defineHiddenConstantProperty(watch, DURA_PATCHES_SYMBOL, deps);
        }
      }
    });

    return nextState;
  };
}
