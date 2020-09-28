import {
  keys,
  createProxy,
  DURA_PATCHES_SYMBOL,
  defineHiddenConstantProperty,
} from '@dura/utils';
import invariant from 'invariant';

export function createWatch(store, nextState, state, stringPatches) {
  keys(store.watchs).forEach((x) => {
    let watch = store.watchs[x];

    invariant(typeof watch === 'object', 'watch value must be object');

    const patches: Map<string, number> = watch[DURA_PATCHES_SYMBOL];
    const firstInvoke = stringPatches.length === 0 && patches.size === 0;
    const deps = new Map<string, number>();
    const proxy = createProxy(nextState, deps, store.namespace);
    watch.dep(proxy);

    defineHiddenConstantProperty(watch, DURA_PATCHES_SYMBOL, deps);
    if (watch.immediate && firstInvoke) {
      watch.handler(proxy);
      return;
    }

    if (stringPatches.some((n: string) => patches.has(n))) {
      watch.handler(proxy);
      return;
    }
  });
}
