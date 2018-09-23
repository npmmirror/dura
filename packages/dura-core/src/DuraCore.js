import {createStore, applyMiddleware, compose} from "redux";
import createSagaMiddleware from "redux-saga";
import {getCombineReducers, getCombineEffects} from "./ModelHandler";

const defaultOps = {
    models: [],
    middleware: [],
    enhancers: [],
    initialState: {}
};

export default function (ops = defaultOps) {
    const {models = [], middleware = [], enhancers = [], initialState = {}} = ops;

    const duraCore = {
        dispatch: undefined,
        getState: undefined,
        subscribe: undefined,
        reduxStore: undefined,
        replaceModel: replaceModel
    };

    //redux-dev-tools enhancers
    const composeEnhancers =
        window["__REDUX_DEVTOOLS_EXTENSION_COMPOSE__"] || compose;

    //create redux-saga middleware
    const reduxSaga = createSagaMiddleware();

    //create redux store
    const reduxStore = createStore(
        getCombineReducers(models),
        initialState,
        composeEnhancers(applyMiddleware(reduxSaga, ...middleware), ...enhancers)
    );

    //run redux-saga
    reduxSaga.run(getCombineEffects(models));

    duraCore.reduxStore = reduxStore;

    function replaceModel(nextModels = []) {
        reduxStore.dispatch({type: "@@dura/cancel"});
        reduxStore.replaceReducer(getCombineReducers(nextModels));
        reduxSaga.run(getCombineEffects(nextModels));
        reduxStore.dispatch({type: "@@duraCore/reducers/onChangeCount"});
        return duraCore;
    }

    return duraCore;
}
