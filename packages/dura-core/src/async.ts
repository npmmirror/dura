import { ModelMap, Model } from '@dura/types';
import cloneDeep from 'lodash/cloneDeep';
import { delay } from './util';

export default function getAsyncMiddleware(rootModel: ModelMap, error) {
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
        try {
          effect(action.payload, action.meta);
        } catch (e) {
          error(e);
        }
      }
    }

    return result;
  };
}
