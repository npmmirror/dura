import { createStore, combineReducers, compose, applyMiddleware, ReducersMapObject } from "redux";
import { handleActions, createAction } from "redux-actions";
import { Model, Config, ModelMap, Store, Plugin, OnModelFunc } from "@dura/types";
import _ from "lodash";

/**
 * 提取reducers
 * @param name
 * @param model
 */
function extractReducers<S>(name: string, model: Model<S>): ReducersMapObject {
  const { reducers } = model;
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
 * 提取effects
 * @param name
 * @param model
 */
function extractEffects(name: string, model: Model<any>) {
  const { effects } = model;
  return _.keys(effects)
    .map((effectName: string) => ({ [`${name}/${effectName}`]: effects[effectName] }))
    .reduce(_.merge, {});
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(() => resolve(), ms));
}

function getAsyncMiddleware(rootModel: ModelMap) {
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

function recursiveOnModel(modelName: string, model: Model<any>, onModelList: OnModelFunc[]) {
  if (onModelList && onModelList.length === 0) {
    return { [modelName]: model };
  }
  const nextModel = onModelList.shift()(model);

  return recursiveOnModel(modelName, nextModel, onModelList);
}

/**
 * 创建store
 * @param config
 */
function create<C extends Config>(config: C): Store<C["initialModel"], C["plugins"]> {
  const { initialModel, initialState, middlewares = [], plugins = {} } = _.cloneDeep(config);

  const berforeOnModelFuncModelMap = _.keys(initialModel)
    .map((modelName: string) =>
      recursiveOnModel(
        modelName,
        initialModel[modelName],
        _.values(plugins)
          .filter((value: Plugin) => value.onModel)
          .map((value: Plugin) => value.onModel)
          .slice()
      )
    )
    .reduce(_.merge, {});

  const initialAndPluginModelMap = _.merge(
    berforeOnModelFuncModelMap,
    _.values(plugins)
      .filter((value: Plugin) => value.extraModels)
      .map((value: Plugin) => value.extraModels)
      .reduce(_.merge, {})
  );

  const initialAndPluginModdlewares = _.merge(
    middlewares,
    _.values(plugins)
      .filter((value: Plugin) => value.middlewares)
      .map((value: Plugin) => value.middlewares)
      .reduce(_.merge, [])
  );

  //聚合reducers
  const rootReducers = Object.keys(initialAndPluginModelMap)
    .map((name: string) => extractReducers(name, initialAndPluginModelMap[name]))
    .reduce((prev, next) => ({ ...prev, ...next }), {});

  //获取外部传入的 compose
  const composeEnhancers = config.compose || compose;

  //store增强器
  const storeEnhancer = composeEnhancers(
    applyMiddleware(...initialAndPluginModdlewares, getAsyncMiddleware(initialAndPluginModelMap))
  );

  //获取外部传入的 createStore
  const _createStore = config.createStore || createStore;

  //创建redux-store
  const reduxStore = initialState
    ? _createStore(combineReducers(rootReducers), initialState, storeEnhancer)
    : _createStore(combineReducers(rootReducers), storeEnhancer);

  return { ...reduxStore, actionCreator: extractActions(initialAndPluginModelMap) };
}

function extractActions<RM extends ModelMap>(models: RM) {
  return _.keys(models)
    .map((name: string) => extractAction(name, models[name]))
    .reduce(_.merge, {});
}

function extractAction(name: string, model: Model<any>) {
  const { reducers, effects } = _.cloneDeep(model);
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
