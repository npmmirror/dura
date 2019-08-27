import { ModelMap, Model } from '@dura/types';
import keys from 'lodash/keys';
import merge from 'lodash/merge';
import cloneDeep from 'lodash/cloneDeep';

export default function extractActions<RM extends ModelMap>(models: RM) {
  return keys(models)
    .map((name: string) => extractAction(name, models[name]))
    .reduce(merge, {});
}

function extractAction(name: string, model: Model<any>) {
  const { reducers, effects } = cloneDeep(model);
  return {
    [name]: keys(merge(reducers(), effects()))
      .map((reducerKey: string) => ({
        [reducerKey]: (payload, meta) => ({
          type: `${name}/${reducerKey}`,
          payload,
          meta
        })
      }))
      .reduce(merge, {})
  };
}
