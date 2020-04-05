import { create as _create } from "@dura/core";

function recursiveWrapModel(name, model, wrapModelList) {
  if (wrapModelList && wrapModelList.length === 0) {
    return model;
  }
  const nextModel = wrapModelList.shift()(name, model);
  return recursiveWrapModel(name, nextModel, wrapModelList);
}

function getExtraModelMap(pluginMap = {}) {
  return Object.values(pluginMap)
    .filter((plugin: any) => plugin.extraModel)
    .map((plugin: any) => plugin.extraModel)
    .reduce((prev, next) => ({ ...prev, ...next }), {});
}

export function create(config, pluginMap = {}) {
  const {
    initialModel,
    initialState,
    middlewares,
    extraReducers = {},
    error = () => false,
  } = config;

  const wrapModelList = Object.values(pluginMap)
    .filter((p: any) => p.wrapModel)
    .map((p: any) => p.wrapModel);

  const extraModelMap = getExtraModelMap(pluginMap);

  const initialModelMap = Object.entries({ ...initialModel, ...extraModelMap })
    .map(([name, model]) => {
      const newModel = recursiveWrapModel(name, model, [...wrapModelList]);
      return {
        [name]: newModel,
      };
    })
    .reduce((prev, next) => ({ ...prev, ...next }), {});

  return _create({
    initialModel: initialModelMap,
    initialState: initialState,
    middlewares: middlewares,
    compose: config.compose,
    createStore: config.createStore,
    extraReducers: extraReducers,
    error: error,
  });
}
