import {
  createStore,
  combineReducers,
  compose,
  applyMiddleware,
  ReducersMapObject,
} from "redux";
import getAsyncMiddleware from "./async";

import { noop, merge } from "@dura/utils";

/**
 * 创建store
 * @param config
 */
export function create(config) {
  const {
    initialModel,
    initialState,
    middlewares = [],
    extraReducers = {},
    error,
  } = config;

  const convert = ([k, v]) => ({
    [k]: (state = v.state(), { payload, meta, type }) => {
      const nameForReducer = type.split("/")[1];
      try {
        return v.reducers()[nameForReducer]?.(state, payload, meta) ?? state;
      } catch (e) {
        error?.(e);
        return state;
      }
    },
  });

  //聚合reducers
  const modelReducers = Object.entries(initialModel)
    .map(convert)
    .reduce(merge, noop());

  const rootReducers: ReducersMapObject<any> = {
    ...modelReducers,
    ...extraReducers,
  };

  // //获取外部传入的 compose1
  const composeEnhancers = config.compose || compose;

  //store增强器
  const storeEnhancer = composeEnhancers(
    applyMiddleware(...middlewares, getAsyncMiddleware(initialModel, error))
  );

  // //获取外部传入的 createStore
  const _createStore = config.createStore || createStore;

  // //创建redux-store
  const reduxStore = initialState
    ? _createStore(combineReducers(rootReducers), initialState, storeEnhancer)
    : _createStore(combineReducers(rootReducers), storeEnhancer);

  return reduxStore;
}
