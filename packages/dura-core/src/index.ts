import type {
  PreloadedState,
  StoreEnhancer,
  Action,
  Store,
  Reducer,
} from "redux";
import { createStore as reduxCreateStore, combineReducers } from "redux";
// import invariant from "invariant";
const invariant = require("invariant");

interface Model<S> {
  namespace: string;
  state: S;
  reducers: {
    [name: string]: Reducer<S>;
  };
}

export function createStore<S, A extends Action, Ext, StateExt>(
  models: Model<S>[],
  preloadedState?: PreloadedState<S>,
  enhancer?: StoreEnhancer<Ext>
): Store<S & StateExt, A> & Ext;

export function createStore(models, preloadedState, enhancer) {
  const reducers = {};
  let reduxStore: Store;

  let index = -1;

  while (++index < models.length) {
    const model = models[index];
    invariant(model.namespace, "model must exist namespace!");
    invariant(!(model.namespace in reducers), "model already exists!");
    reducers[model.namespace] = function (state = model.state, action) {
      const [, reducerName] = action.type.split("/");
      return model.reducers[reducerName]?.(state, action) ?? state;
    };
  }
  console.log(reducers);

  reduxStore = reduxCreateStore(
    combineReducers(reducers),
    preloadedState,
    enhancer
  );

  return reduxStore;
}
