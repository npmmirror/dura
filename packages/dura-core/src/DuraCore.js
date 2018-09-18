import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import { getCombineReducers, getCombineEffects } from "./ModelHandler";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

export default function({ models, middleware = [], enhancers = [] }) {
  const duraCore = {
    dispatch: undefined,
    getState: undefined,
    subscribe: undefined,
    replaceModel: replaceModel
  };

  //redux-dev-tools enhancers
  const composeEnhancers =
    window["__REDUX_DEVTOOLS_EXTENSION_COMPOSE__"] || compose;

  //create redux-saga middleware
  const reduxSaga = createSagaMiddleware();

  //create redux store
  const reduxStore = createStore(
    persistReducer({ key: "@@dura", storage }, getCombineReducers(models)),
    composeEnhancers(applyMiddleware(reduxSaga, ...middleware), ...enhancers)
  );

  //run redux-saga
  reduxSaga.run(getCombineEffects(models));

  duraCore.dispatch = reduxStore.dispatch;
  duraCore.getState = reduxStore.getState;
  duraCore.subscribe = reduxStore.subscribe;
  duraCore.reduxStore = reduxStore;

  function replaceModel(nextModels) {
    reduxStore.dispatch({ type: "@@dura/cancel" });
    reduxStore.replaceReducer(getCombineReducers(nextModels));
    reduxSaga.run(getCombineEffects(nextModels));
    reduxStore.dispatch({ type: "@@duraCore/reducers/onChangeCount" });
  }

  return duraCore;
}
