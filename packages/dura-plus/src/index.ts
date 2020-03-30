import { create as _create } from "@dura/core";
import {
  Config,
  Store,
  PluginMap,
  ModelMap,
  UnionToIntersection
} from "@dura/types";
import {
  compose,
  bindActionCreators,
  applyMiddleware,
  combineReducers
} from "redux";

function recursiveWrapModel(name, model, wrapModelList) {
  if (wrapModelList && wrapModelList.length === 0) {
    return model;
  }
  const nextModel = wrapModelList.shift()(name, model);
  return recursiveWrapModel(name, nextModel, wrapModelList);
}

function getExtraModelMap(pluginMap: PluginMap = {}) {
  return Object.values(pluginMap)
    .filter(plugin => plugin.extraModel)
    .map(plugin => plugin.extraModel)
    .reduce((prev, next) => ({ ...prev, ...next }), {});
}

function create<C extends Config, P extends PluginMap>(
  config: C,
  pluginMap?: P
): Store<C["initialModel"] & UnionToIntersection<P[keyof P]["extraModel"]>> {
  //clone
  const {
    initialModel,
    initialState,
    middlewares,
    extraReducers = {},
    error = () => false
  } = config;

  const wrapModelList = Object.values(pluginMap ?? {})
    .filter(p => p.wrapModel)
    .map(p => p.wrapModel);

  const extraModelMap: ModelMap = getExtraModelMap(pluginMap);

  const initialModelMap = Object.entries({ ...initialModel, ...extraModelMap })
    .map(([name, model]) => {
      const newModel = recursiveWrapModel(name, model, [...wrapModelList]);
      return {
        [name]: newModel
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
    error: error
  }) as Store<
    C["initialModel"] & UnionToIntersection<P[keyof P]["extraModel"]>
  >;
}

export {
  create,
  compose,
  bindActionCreators,
  applyMiddleware,
  combineReducers
};

export * from "@dura/types";
