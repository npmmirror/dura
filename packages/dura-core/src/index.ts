import { createStore, combineReducers, compose, applyMiddleware } from "redux";
import { handleActions, createAction } from "redux-actions";
import clone from "clone";
import { Model, Plugin, Config, DuraStore } from "@dura/types";

/**
 * 提取reducers
 * @param name
 * @param model
 */
function extractReducers(name: string, model: Model<any>) {
  const reducers = model.reducers || {};
  const reducerKeys = Object.keys(reducers);
  const nextReducer = reducerKeys
    .map((reducerName: string) => ({ [`${name}/${reducerName}`]: reducers[reducerName] }))
    .reduce((prev, next) => ({ ...prev, ...next }), {});
  return { [name]: handleActions(nextReducer, model.state) };
}

/**
 * 提取effects
 * @param name
 * @param model
 */
function extractEffects(name: string, model: Model<any>) {
  const effects = model.effects || {};
  const effectKeys = Object.keys(effects);
  const nextEffects = effectKeys
    .map((effectName: string) => ({ [`${name}/${effectName}`]: effects[effectName] }))
    .reduce((prev, next) => ({ ...prev, ...next }), {});
  return nextEffects;
}

/**
 * 提取action creator
 * @param name
 * @param model
 */
function extractActionCreator(name: string, model: Model<any>) {
  const { reducers = {}, effects = {} } = model;
  const reducerKeys = Object.keys(reducers);
  const effectKeys = Object.keys(effects);
  const action = reducerKeys
    .concat(effectKeys)
    .map((key: string) => ({
      [key]: (payload, meta) =>
        createAction(`${name}/${key}`, payload => payload, (payload, meta) => meta)(payload, meta)
    }))
    .reduce((prev, next) => ({ ...prev, ...next }), {});
  return function(dispatch: any) {
    dispatch[name] = Object.keys(action)
      .map((key: string) => ({
        [key]: (payload: any, meta: any) => dispatch(action[key](payload, meta))
      }))
      .reduce((prev, next) => ({ ...prev, ...next }), {});
  };
}

function createEffectsMiddleware(allModel, plugins: Array<Plugin<any>>, warpDispatchFuncs) {
  //聚合effects
  const rootEffects = Object.keys(allModel)
    .map((name: string) => extractEffects(name, allModel[name]))
    .reduce((prev, next) => ({ ...prev, ...next }), {});

  const intercepts = plugins.filter(p => p.intercept).map(p => p.intercept);

  return store => next => async action => {
    //新的dispatch
    function dispatch(action) {
      return store.dispatch(action);
    }
    //绑定action
    warpDispatchFuncs.forEach(fn => fn(dispatch));

    if (typeof rootEffects[action.type] === "function") {
      //前置拦截器
      intercepts.filter(i => i.pre(action)).forEach(i => i.before(action, dispatch));
      //执行effect
      await rootEffects[action.type]({
        dispatch: dispatch,
        getState: () => clone(store.getState()),
        action
      });
      //后置拦截器
      intercepts.filter(i => i.pre(action)).forEach(i => i.after(action, dispatch));
    }
    return next(action);
  };
}

/**
 * 包装原始model
 * @param plugins
 * @param name
 * @param model
 */
function onWrapModel(plugins: Array<Plugin<any>>, name: string, model: Model<any>) {
  if (plugins && plugins.length === 0) {
    return { [name]: model };
  }
  const firstPlugin = plugins.shift();
  const nextModel = firstPlugin.wrapModel.call(name, model);
  return onWrapModel(plugins, name, nextModel);
}

/**
 * 获取插件里面的model
 * @param plugins
 */
function getPluginModel(plugins: Array<Plugin<any>>) {
  return plugins
    .map(({ name, model }: Plugin<any>) => ({ [name]: model }))
    .reduce((prev, next) => ({ ...prev, ...next }), {});
}

function onModel(config: Config): DuraStore<any, any> {
  const { initialModel = {}, plugins = [] } = config;
  //追加插件model
  const pluginModel = getPluginModel(plugins.filter(p => p.model));

  //全部的model
  const models = { ...initialModel, ...pluginModel };

  const modelKeys = Object.keys(models);

  //包装已有的model
  return modelKeys
    .map((name: string) => onWrapModel(plugins.filter(p => p.wrapModel), name, models[name]))
    .reduce((prev, next) => ({ ...prev, ...next }), {});
}

function create(config: Config) {
  const { initialState = {}, plugins = [] } = config;

  const allModel = onModel(config);

  const allModelKeys = Object.keys(allModel);

  const warpDispatchFuncs = Object.keys(allModel).map((name: string) => extractActionCreator(name, allModel[name]));

  //聚合reducers
  const rootReducers = allModelKeys
    .map((name: string) => extractReducers(name, allModel[name]))
    .reduce((prev, next) => ({ ...prev, ...next }), {});

  //创建effects的中间件
  const effectMiddleware = createEffectsMiddleware(allModel, plugins, warpDispatchFuncs);

  //store增强器
  const storeEnhancer = compose(applyMiddleware(effectMiddleware));

  //创建redux-store
  const reduxStore = createStore(combineReducers(rootReducers), initialState, storeEnhancer) as DuraStore<any, any>;

  warpDispatchFuncs.forEach(fn => fn(reduxStore.dispatch));

  return reduxStore;
}

export { create };
