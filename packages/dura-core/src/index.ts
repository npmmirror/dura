import { createStore, combineReducers, compose, applyMiddleware, Dispatch } from "redux";
import { handleActions, createAction } from "redux-actions";
import clone from "clone";
import { Model, Plugin, Config, DuraStore, RootModel, ActionCreator } from "@dura/types";

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

function createEffectsMiddleware(allModel, plugins: Array<Plugin>) {
  //聚合effects
  const rootEffects = Object.keys(allModel)
    .map((name: string) => extractEffects(name, allModel[name]))
    .reduce((prev, next) => ({ ...prev, ...next }), {});

  const intercepts = plugins.filter(p => p.intercept).map(p => p.intercept);

  const delay = (ms: number) => new Promise(resolve => setTimeout(() => resolve(), ms));

  return store => next => async action => {
    if (typeof rootEffects[action.type] === "function") {
      const dispatch = store.dispatch;
      const select = fn => fn(clone(store.getState()));
      //前置拦截器
      intercepts.filter(i => i.pre(action)).forEach(i => i.before(action, store.dispatch));
      //执行effect
      await rootEffects[action.type]({
        dispatch,
        select,
        delay,
        action
      });
      //后置拦截器
      intercepts.filter(i => i.pre(action)).forEach(i => i.after(action, store.dispatch));
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
function onWrapModel(plugins: Array<Plugin<any>>, name: string, model: Model<any>): RootModel {
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

function onModel(config: Config): RootModel {
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

function create(config: Config): DuraStore {
  const { initialState, plugins = [] } = config;

  const allModel = onModel(config);

  const allModelKeys = Object.keys(allModel);

  //聚合reducers
  const rootReducers = allModelKeys
    .map((name: string) => extractReducers(name, allModel[name]))
    .reduce((prev, next) => ({ ...prev, ...next }), {});

  //创建effects的中间件
  const effectMiddleware = createEffectsMiddleware(allModel, plugins);

  //store增强器
  const storeEnhancer = compose(applyMiddleware(effectMiddleware));

  //创建redux-store
  const reduxStore = (initialState
    ? createStore(combineReducers(rootReducers), initialState, storeEnhancer)
    : createStore(combineReducers(rootReducers), storeEnhancer)) as DuraStore;
  return reduxStore;
}

function createModelAction(name: string, model: Model) {
  const { reducers = {}, effects = {} } = model;
  const reducerKeys = Object.keys(reducers);
  const effectKeys = Object.keys(effects);
  const merge = (prev, next) => ({ ...prev, ...next });

  const createActionMap = (key: string) => ({
    [key]: (payload: any, meta: any) =>
      createAction(`${name}/${key}`, payload => payload, (payload, meta) => meta)(payload, meta)
  });

  const action = [...reducerKeys, ...effectKeys].map(createActionMap).reduce(merge, {});
  return { [name]: action };
}

function createActionCreator(models: RootModel) {
  const merge = (prev, next) => ({ ...prev, ...next });
  return Object.keys(models)
    .map((name: string) => createModelAction(name, models[name]))
    .reduce(merge, {});
}

export { create, createActionCreator };
