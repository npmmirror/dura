import { ModelMap, Model, ExtractActions } from "@dura/types";

const merge = (prev, next) => ({ ...prev, ...next });

export default function<RM extends ModelMap>(models: RM): ExtractActions<RM> {
  return Object.keys(models)
    .map((name: string) => extractAction(name, models[name]))
    .reduce(merge, {});
}

function extractAction(name: string, model: Model<any>) {
  const { reducers, effects } = model;
  return {
    [name]: Object.keys(merge(reducers(), effects()))
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
