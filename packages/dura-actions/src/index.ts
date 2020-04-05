import { merge, noop } from "@dura/utils";

function createActions(models) {
  return Object.entries(models)
    .map(([k, m]) => extractAction(k, m))
    .reduce(merge, noop());
}

function extractAction(name, model) {
  const { reducers, effects } = model;
  return {
    [name]: Object.keys(merge(reducers(), effects()))
      .map((reducerKey: string) => ({
        [reducerKey]: (payload, meta) => ({
          type: `${name}/${reducerKey}`,
          payload,
          meta,
        }),
      }))
      .reduce(merge, {}),
  };
}

export { createActions };
