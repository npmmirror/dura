import { createStore, combineReducers, compose, applyMiddleware, ReducersMapObject } from "redux";
import { Config, Store } from "@dura/types";
import _ from "lodash";
import getAsyncMiddleware from "./async";
import extractActions from "./actions";
import extractReducers from "./reducers";

/**
 * 创建store
 * @param config
 */
function create<C extends Config>(config: C): Store<C["initialModel"]> {
  const { initialModel, initialState, middlewares = [], extraReducers = {} } = _.cloneDeep(config);

  //聚合reducers
  const modelReducers = Object.keys(initialModel)
    .map((name: string) => extractReducers(name, initialModel[name]))
    .reduce((prev, next) => ({ ...prev, ...next }), {});

  const rootReducers: ReducersMapObject<any> = { ...modelReducers, ...extraReducers };

  //获取外部传入的 compose
  const composeEnhancers = config.compose || compose;

  //store增强器
  const storeEnhancer = composeEnhancers(applyMiddleware(...middlewares, getAsyncMiddleware(initialModel)));

  //获取外部传入的 createStore
  const _createStore = config.createStore || createStore;

  //创建redux-store
  const reduxStore = initialState
    ? _createStore(combineReducers(rootReducers), initialState, storeEnhancer)
    : _createStore(combineReducers(rootReducers), storeEnhancer);

  return { ...reduxStore, actionCreator: extractActions(initialModel) };
}

export { create };
