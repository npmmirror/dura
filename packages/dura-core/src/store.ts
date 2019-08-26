import { createStore, combineReducers } from 'redux';

import cloneDeep from 'lodash/cloneDeep';

import merge from 'lodash/merge';

/**
 * 创建store
 * @param config
 */
function create(options) {
  const { models } = cloneDeep(options);

  const reducers = models
    .map(model => {
      const nameForModel = model.name();
      return {
        [nameForModel]: function(state = model.state(), action) {
          const { type, payload = {}, meta = {} } = action;
          const [namespace, reducerName] = type.split('/');
          if (nameForModel !== namespace) {
            return state;
          }
          const reducer = model.reducers()[reducerName];
          if (reducer) {
            return reducer(state, payload, meta);
          }
          return state;
        }
      };
    })
    .reduce(merge, {});

  console.log(reducers);

  const reduxStore = createStore(combineReducers(reducers));

  return reduxStore;

  // //聚合reducers
  // const modelReducers = Object.keys(initialModel)
  //   .map((name: string) => extractReducers(name, initialModel[name]))
  //   .reduce((prev, next) => ({ ...prev, ...next }), {});

  // const rootReducers: ReducersMapObject<any> = { ...modelReducers, ...extraReducers };

  // //获取外部传入的 compose
  // const composeEnhancers = config.compose || compose;

  // //store增强器
  // const storeEnhancer = composeEnhancers(applyMiddleware(...middlewares, getAsyncMiddleware(initialModel)));

  // //获取外部传入的 createStore
  // const _createStore = config.createStore || createStore;

  // //创建redux-store
  // const reduxStore = initialState
  //   ? _createStore(combineReducers(rootReducers), initialState, storeEnhancer)
  //   : _createStore(combineReducers(rootReducers), storeEnhancer);

  // return { ...reduxStore, actionCreator: extractActions(initialModel) };
}

export { create };
