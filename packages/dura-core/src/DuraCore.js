import {createStore, applyMiddleware, compose , combineReducers} from "redux";
import createSagaMiddleware from "redux-saga";
import {getCombineReducers, getCombineEffects} from "./ModelHandler";
import ActionTypes from './ActionTypes'

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
        function (state, action) {
            if (action?.type === ActionTypes.CANCEL) {
                return undefined
            }
            return getCombineReducers(models)(state,action);
        }, initialState,
        composeEnhancers(applyMiddleware(reduxSaga, ...middleware), ...enhancers)
    );

    //run redux-saga
    reduxSaga.run(getCombineEffects(models));


    duraCore.reduxStore = reduxStore;

    function replaceModel(...nextModels) {
        reduxStore.dispatch({type: ActionTypes.CANCEL});
        reduxStore.replaceReducer(function (state, action) {
            if (action?.type === ActionTypes.CANCEL) {
                return undefined
            }
            return getCombineReducers(nextModels)(state,action);
        });
        reduxSaga.run(getCombineEffects(nextModels));
        reduxStore.dispatch({type: ActionTypes.PLUS_COUNT});
        return duraCore;
    }

    return duraCore;
}
