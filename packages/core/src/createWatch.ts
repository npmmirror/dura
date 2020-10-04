import { keys, createProxy, DURA_PATCHES_SYMBOL } from '@dura/utils';
import invariant from 'invariant';

export function createWatch(store, nextState, state, stringPatches) {
  keys(store.watchs).forEach((x) => {
    let watch = store.watchs[x];

    invariant(typeof watch === 'object', 'watch value must be object');

    const patches: Map<string, number> = watch[DURA_PATCHES_SYMBOL];
    const proxy = createProxy(
      nextState,
      new Map<string, number>(),
      store.namespace,
    );

    if (stringPatches.some((n: string) => patches.has(n))) {
      watch.handler(proxy);
      return;
    }
  });
}
