import {
  createStore as createStoreOfRedux,
  combineReducers,
  Store,
  applyMiddleware,
  StoreEnhancer,
  PreloadedState,
  CombinedState,
  Reducer,
  AnyAction,
} from 'redux';
import invariant from 'invariant';

interface Model<S> {
  namespace: string;
  state: S;
  reducers: (state: S, action: AnyAction) => S;
}

export function createStore<S>(...models: Model<S>[]) {
  let reducers = {};
  let reduxStore: Store;

  addReducer(...models);

  function addReducer<S>(...models: Model<S>[]) {
    let index = -1;
    while (++index < models.length) {
      const model = models[index];
      invariant(!model?.namespace, 'model must exist namespace!');
      invariant(!(model.namespace in reducers), 'model already exists!');
      reducers[model.namespace] = model.reducers;
    }
  }

  function use<S>(...models: Model<S>[]) {
    addReducer(...models);
    reduxStore.replaceReducer(combineReducers(reducers));
  }

  function unUse(...namespaces: string[]) {
    invariant(!reduxStore, 'store has not been initialized!');
    let index = -1;
    while (++index < namespaces.length) {
      const namespace = namespaces[index];
      delete reducers[namespace];
    }
    reduxStore.replaceReducer(combineReducers(reducers));
  }

  function run() {
    reduxStore = createStoreOfRedux(combineReducers(reducers));
    return {
      reduxStore,
      unUse,
      use,
    };
  }

  return {
    run,
  };
}
