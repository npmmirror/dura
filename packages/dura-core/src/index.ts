import { createStore, combineReducers, compose, applyMiddleware, ReducersMapObject } from "redux";
import { handleActions, createAction } from "redux-actions";
import { Model, Plugin, Config, RootModel, Store, EffectAPI } from "@dura/types";
import _ from "lodash";

/**
 * 提取reducers
 * @param name
 * @param model
 */
function extractReducers<S>(name: string, model: Model<S>): ReducersMapObject {
  const { reducers = {} } = model;

  return {
    [name]: handleActions(
      _.keys(reducers)
        .map((reducerKey: string) => ({ [`${name}/${reducerKey}`]: reducers[reducerKey] }))
        .reduce(_.merge, {}),
      model.state
    )
  };
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
  const { initialModel, plugins = [] } = config;
  const pluginModel = getPluginModel(plugins);
  return { ...initialModel, ...pluginModel };
}

//包装根model
function wrapRootModel(rootModel: RootModel, plugin: Array<Plugin>) {
  const wrapModelPlugins = plugin.filter(p => p.onWrapModel);
  //包装已有的model
  return Object.keys(rootModel)
    .map((name: string) => wrapModel(wrapModelPlugins.slice(), name, rootModel[name]))
    .reduce((prev, next) => ({ ...prev, ...next }), {});
}

/**
 * 提取effects
 * @param name
 * @param model
 */
function extractEffects(name: string, model: Model<any>) {
  const { effects = {} } = model;
  return _.keys(effects)
    .map((effectName: string) => ({ [`${name}/${effectName}`]: effects[effectName] }))
    .reduce(_.merge, {});
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(() => resolve(), ms));
}

function getAsyncMiddleware(rootModel: RootModel) {
  const rootEffects = _.keys(rootModel)
    .map((name: string) => extractEffects(name, rootModel[name]))
    .reduce(_.merge, {});
  return store => next => async action => {
    let result = next(action);
    if (typeof rootEffects[action.type] === "function") {
      const dispatch = store.dispatch;

      const getState = () => _.cloneDeep(store.getState());
      const select = (_select: (state) => any) => _select(getState());
      //执行effect
      const effect = rootEffects[action.type];
      await effect(
        {
          dispatch,
          select,
          delay
        },
        action
      );
    }
    return result;
  };
}

/**
 * 创建store
 * @param config
 */
function create<C extends Config>(config: C): Store<C["initialModel"]> {
  const { initialState, plugins = [], middlewares = [] } = config;

  //merge plugin 的model
  const rootModel = mergeModel(config);

  //包装model
  const nextRootModel = wrapRootModel(rootModel, plugins);

  //actions
  const actions = extractActions(nextRootModel);

  //聚合reducers
  const rootReducers = Object.keys(nextRootModel)
    .map((name: string) => extractReducers(name, nextRootModel[name]))
    .reduce((prev, next) => ({ ...prev, ...next }), {});

  const pluginMiddlewares = plugins.filter(p => p.onCreateMiddleware).map(p => p.onCreateMiddleware(nextRootModel));

  //获取外部传入的 compose
  const composeEnhancers = config.compose || compose;

  //store增强器
  const storeEnhancer = composeEnhancers(
    applyMiddleware(...pluginMiddlewares, ...middlewares, getAsyncMiddleware(nextRootModel))
  );

  //获取外部传入的 createStore
  const _createStore = config.createStore || createStore;

  //创建redux-store
  const reduxStore = initialState
    ? _createStore(combineReducers(rootReducers), initialState, storeEnhancer)
    : _createStore(combineReducers(rootReducers), storeEnhancer);

  const store = { ...reduxStore, actions: actions };

  plugins.filter(p => p.onStoreCreated).forEach(p => p.onStoreCreated(store, nextRootModel));

  return { ...store };
}

function extractActions<RM extends RootModel>(models: RM) {
  return _.keys(models)
    .map((name: string) => extractAction(name, models[name]))
    .reduce(_.merge, {});
}

function extractAction(name: string, model: Model<any>) {
  const { reducers = {}, effects = {} } = _.cloneDeep(model);
  return {
    [name]: _.keys(_.merge(reducers, effects))
      .map((reducerKey: string) => ({
        [reducerKey]: createAction(`${name}/${reducerKey}`, payload => payload, (payload, meta) => meta)
      }))
      .reduce(_.merge, {})
  };
}

export { create };

export * from "@dura/types";
