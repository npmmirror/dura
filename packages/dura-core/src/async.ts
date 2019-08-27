import { ModelMap, Model } from '@dura/types';
import cloneDeep from 'lodash/cloneDeep';
import { delay } from './util';

export default function getAsyncMiddleware(rootModel: ModelMap) {
  return store => next => action => {
    let result = next(action);

    const [namespace, nameeffect] = action.type.split('/');

    if (rootModel[namespace]) {
      const moduleEffects = rootModel[namespace].effects(
        store.dispatch,
        () => cloneDeep(store.getState()),
        delay
      );

      const effect = moduleEffects[nameeffect];

      if (effect) {
        effect(action.payload, action.meta);
      }
    }

    return result;
  };
}
