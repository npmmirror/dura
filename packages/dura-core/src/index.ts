import { createStore, combineReducers, compose, applyMiddleware, ReducersMapObject } from "redux";
import { handleActions, createAction } from "redux-actions";
import { Model, Config, RootModel, Store, ExtractActions } from "@dura/types";
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
  const { initialModel, initialState, middlewares = [] } = config;

  //聚合reducers
  const rootReducers = Object.keys(initialModel)
    .map((name: string) => extractReducers(name, initialModel[name]))
    .reduce((prev, next) => ({ ...prev, ...next }), {});

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

  return reduxStore;
}

export { create };

export { EffectApi, ExtractRootState } from "@dura/types";
