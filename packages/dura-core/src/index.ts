import { createStore, combineReducers, compose, applyMiddleware, Dispatch } from "redux";
import { handleActions, createAction } from "redux-actions";
import { Model, Plugin, Config, DuraStore, RootModel } from "@dura/types";

/**
 * 提取reducers
 * @param name
 * @param model
 */
function extractReducers(name: string, model: Model<any>) {
  const reducers = model.reducers || {};
  const reducerKeys = Object.keys(reducers);
  const nextReducer = reducerKeys
    .map((reducerName: string) => ({
      [`${name}/${reducerName}`]: (state, action) => reducers[reducerName](action.payload, action.meta)(state)
    }))
    .reduce((prev, next) => ({ ...prev, ...next }), {});
  return { [name]: handleActions(nextReducer, model.state) };
}

/**
 * 包装原始model
 * @param plugins
 * @param name
 * @param model
 */
function wrapModel(plugins: Array<Plugin<any>>, name: string, model: Model<any>): RootModel {
  if (plugins && plugins.length === 0) {
    return { [name]: model };
  }
  const firstPlugin = plugins.shift();
  const nextModel = firstPlugin.onWrapModel(name, model);
  return wrapModel(plugins, name, nextModel);
}

/**
 * 获取插件里面的model
 * @param plugins
 */
function getPluginModel(plugins: Array<Plugin>) {
  return plugins
    .filter(p => p.model)
    .map(({ name, model }: Plugin) => ({
      [name]: model
    }))
    .reduce((prev, next) => ({ ...prev, ...next }), {});
}

//合并所有的model
function mergeModel(config: Config) {
  const { initialModel = {}, plugins = [] } = config;
  const pluginModel = getPluginModel(plugins);
  return { ...initialModel, ...pluginModel };
}

//包装根model
function wrapRootModel(rootModel: RootModel, plugin: Array<Plugin>) {
  const wrapModelPlugins = plugin.filter(p => p.onWrapModel);
  //包装已有的model
  return Object.keys(rootModel)
    .map((name: string) => wrapModel(wrapModelPlugins, name, rootModel[name]))
    .reduce((prev, next) => ({ ...prev, ...next }), {});
}

/**
 * 创建store
 * @param config
 */
function create(config: Config): DuraStore {
  const { initialState, plugins = [] } = config;

  //merge plugin 的model
  const rootModel = mergeModel(config);

  //包装model
  const nextRootModel = wrapRootModel(rootModel, plugins);

  //聚合reducers
  const rootReducers = Object.keys(nextRootModel)
    .map((name: string) => extractReducers(name, nextRootModel[name]))
    .reduce((prev, next) => ({ ...prev, ...next }), {});

  const middlewares = plugins.filter(p => p.onCreateMiddleware).map(p => p.onCreateMiddleware(nextRootModel));

  //store增强器
  const storeEnhancer = compose(applyMiddleware(...middlewares));

  //创建redux-store
  const reduxStore = (initialState
    ? createStore(combineReducers(rootReducers), initialState, storeEnhancer)
    : createStore(combineReducers(rootReducers), storeEnhancer)) as DuraStore;

  const reducerRunner = createReducerRunner(nextRootModel, reduxStore.dispatch);

  plugins.filter(p => p.onStoreCreated).forEach(p => p.onStoreCreated(reduxStore, nextRootModel));

  return { ...reduxStore, reducerRunner };
}

//创建单个model 的action runner
function createModelReducerRunner(name: string, model: Model, dispatch: Dispatch) {
  const { reducers = {} } = model;
  const reducerKeys = Object.keys(reducers);
  const merge = (prev, next) => ({ ...prev, ...next });

  const createActionMap = (key: string) => ({
    [key]: (payload: any, meta: any) =>
      dispatch(createAction(`${name}/${key}`, payload => payload, (payload, meta) => meta)(payload, meta))
  });

  const action = [...reducerKeys].map(createActionMap).reduce(merge, {});
  return { [name]: action };
}

//创建全局的action  runner
function createReducerRunner(models: RootModel, dispatch: Dispatch) {
  const merge = (prev, next) => ({ ...prev, ...next });
  return Object.keys(models)
    .map((name: string) => createModelReducerRunner(name, models[name], dispatch))
    .reduce(merge, {});
}

export { create };
