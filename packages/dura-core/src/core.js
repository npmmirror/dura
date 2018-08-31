import {createStore, applyMiddleware, compose, combineReducers} from 'redux';
import createSagaMiddleware from "redux-saga";
import {validateModel} from './validation'
import {handleActions} from 'redux-actions'
import * as reduxSagaEffects from "redux-saga/effects";
import {  } from 'dura-util'

const defaultOptions = {
    initialModel: []
}

const _reduce = (prev, next) => ({...prev, ...next})

function createDuraCore(options = defaultOptions) {

    const newOps = {...defaultOptions, ...options}

    const duraCore = {
        _models: [],
        _plugins: [],
        _initialModel: newOps.initialModel,
        _reduxStore: undefined,
        _reduxSaga: undefined,
        addModel: addModel,
        delModel: delModel,
        addPlugin: addPlugin,
        start: start,
        restart: restart
    }

    return duraCore;


    function addPlugin(...plugins) {
        duraCore._plugins.push(...plugins)
    }

    function addModel(...models) {

        const {_models} = duraCore


        models.forEach(_model => validateModel(_model, _models))

        models.forEach(_model => _models.push(_additionalNamespacePrefix(_model)))

    }

    function delModel(...namespace) {
        console.log("delModel:", namespace)
    }

    function start() {

        duraCore._reduxSaga = createSagaMiddleware();

        duraCore._reduxStore = createStore(
            combineReducers(_handlerReducers()),
            applyMiddleware(duraCore._reduxSaga)
        )

        console.log("start")

        duraCore._reduxSaga.run(_handlerEffects())
    }

    function restart() {
        console.log("restart")
    }

    function _handlerReducers() {

        return duraCore._models
            .map(
                ({namespace, reducers = {}, initialState = {}}) =>
                    ({[namespace]: handleActions(enhanceReducers(reducers, Object.keys(reducers), {}), initialState)}))
            .reduce(_reduce, {});
    }

    function enhanceReducers(reducers, reducerKeys, nextReducers) {

        const first = reducerKeys.shift();

        if (first) {
            return enhanceReducers(reducers, reducerKeys, {
                ...nextReducers,
                [first]: enhance(reducers[first])
            })
        }

        return nextReducers;

    }

    function recursiveFun(funArray, targetFun) {
        const first = funArray.shift();
        if (first){
            return recursiveFun(funArray,first(targetFun))
        }
        return targetFun;
    }

    function enhance(reducer) {

        return compose(..._getPluginOnReducers(),reducer)()

        // return recursiveFun(_getPluginOnReducers() , reducer)
        // const pluginReducers = _getPluginOnReducers();
        // let newReducer = reducer
        // for (const fn of pluginReducers) {
        //     newReducer = fn(reducer)
        // }
        // return newReducer;
    }


    function _getPluginOnReducers() {
        return duraCore._plugins.map(plugin => plugin?.onReducer || (reducer => reducer))
    }

    function _getPluginOnEffects() {
        return duraCore._plugins.map(plugin => plugin?.onEffect || (effect => effect))
    }

    function _additionalNamespacePrefix(model) {

        const {namespace, reducers = {}, effects = {}, initialState = {}} = model

        const _createNewReducerName = (key) => ({[[namespace, key].join("/")]: reducers[key]})
        const _createNewEffectName = (key) => ({[[namespace, key].join("/")]: effects[key]})

        const newReducers = Object.keys(reducers).map(_createNewReducerName).reduce(_reduce, {});

        const newEffects = Object.keys(effects).map(_createNewEffectName).reduce(_reduce, {});

        return ({
            namespace, initialState, reducers: newReducers, effects: newEffects
        })
    }

    function* _handlerModelTask(effects, model) {

        const effectKeys = Object.keys(effects)

        for (let j = 0; j < effectKeys.length; j++) {
            const key = effectKeys[j];
            const val = effects[key];

            let saga = val, conf, type = 'takeEvery';


            if (Array.isArray(val)) {

                saga = val[0]
                conf = val[1]

                if (typeof val[1] === 'string') {
                    type = conf
                } else if (typeof val[1] === 'object') {
                    type = conf.type || 'takeEvery'
                } else {
                    type = 'takeEvery'
                }
            }

            const pluginOnEffects = _getPluginOnEffects()

            for (const fn of pluginOnEffects) {
                saga = fn(saga, model)
            }

            function* watcher() {
                switch (type) {
                    case 'takeLatest':
                        return function* (...args) {
                            yield reduxSagaEffects.takeLatest(key, saga, reduxSagaEffects, args)
                        }
                    case 'takeLeading':
                        return function* (...args) {
                            yield reduxSagaEffects.takeLeading(key, saga, reduxSagaEffects, args)
                        }
                    case 'throttle':
                        return function* (...args) {
                            yield reduxSagaEffects.throttle(conf?.ms || 100, key, saga, reduxSagaEffects, args)
                        }
                    default:
                        return function* (...args) {
                            yield reduxSagaEffects.takeEvery(key, saga, reduxSagaEffects, args)
                        }
                }
            }


            const effectTask = yield reduxSagaEffects.fork(yield watcher());


            yield reduxSagaEffects.fork(function* () {
                yield reduxSagaEffects.take([`@@${key}`, `cancel`].join('/'))
                yield cancel(effectTask)
            })
        }
    }


    function* _handlerGlobalTask() {

        const {_models} = duraCore

        for (let i = 0; i < _models.length; i++) {

            const model = _models[i]

            const {namespace, effects} = model;

            const modelTask = yield reduxSagaEffects.fork(_handlerModelTask.bind(this, effects, model))

            yield reduxSagaEffects.fork(function* () {
                yield reduxSagaEffects.take([`@@${namespace}`, `cancel`].join('/'));
                yield cancel(modelTask)
            })


        }
    }

    function _handlerEffects() {

        return function* () {

            const globalTask = yield reduxSagaEffects.fork(_handlerGlobalTask)

            yield reduxSagaEffects.fork(function* () {
                yield reduxSagaEffects.take([`@@dura`, `cancel`].join(`/`));
                yield cancel(globalTask)
            })
        }
    }

}

export {
    createDuraCore
}