import {combineReducers} from "redux";
import {handleActions} from "redux-actions";
import ActionTypes from './ActionTypes'
import defaultModel from './DefaultModel'
import * as reduxSagaEffects from "redux-saga/effects";


const rename = (namespace, argObj, type) =>
    Object.keys(argObj)
        .map(key => ({[`${namespace}/${type}/${key}`]: argObj[key]}))
        .reduce(reduce, {});

const reduce = (prev, next) => ({...prev, ...next});

const additionalNamespacePrefix = model => {
    const {namespace, reducers = {}, effects = {}, initialState = {}} = model;
    return {
        namespace,
        initialState,
        reducers: rename(namespace, reducers, "reducers"),
        effects: rename(namespace, effects, "effects")
    };
};

const mapModelToCombineReducers = ({namespace, reducers, initialState}) => ({
    [namespace]: handleActions(reducers, initialState)
});

const getWatcher = effect => {
    const {name, saga, type, ms} = effect;
    switch (type) {
        case "takeLatest":
            return function* (...args) {
                yield reduxSagaEffects.takeLatest(
                    name,
                    saga,
                    reduxSagaEffects,
                    ...args
                );
            };
        case "takeLeading":
            return function* (...args) {
                yield reduxSagaEffects.takeLeading(
                    name,
                    saga,
                    reduxSagaEffects,
                    ...args
                );
            };
        case "throttle":
            return function* (...args) {
                yield reduxSagaEffects.throttle(
                    ms,
                    name,
                    saga,
                    reduxSagaEffects,
                    ...args
                );
            };
        default:
            return function* (...args) {
                yield reduxSagaEffects.takeEvery(name, saga, reduxSagaEffects, ...args);
            };
    }
};

const enhanceEffect = (name, effect) => {
    const defaultType = "takeEvery";
    const newEffect = {
        name: name,
        saga: effect,
        type: defaultType,
        ms: 100
    };
    if (Array.isArray(effect)) {
        const [one, two] = effect;
        newEffect.saga = one;
        if (typeof two === "string") {
            newEffect.type = two;
        } else if (typeof two === "object") {
            newEffect.type = two?.type || defaultType;
            if (two?.type === "throttle") {
                newEffect.ms = two?.ms;
            }
        } else {
            newEffect.type = defaultType;
        }
    }
    return newEffect;
};

const mapGenerateSaga = function* (effects) {
    const effectKs = Object.keys(effects);
    for (const name of effectKs) {
        const effect = enhanceEffect(name, effects[name]);
        const watcher = getWatcher(effect);
        yield reduxSagaEffects.fork(watcher);
    }
};

const getRootSaga = function* (effects) {
    const rootTask = yield reduxSagaEffects.fork(
        mapGenerateSaga.bind(this, effects)
    );
    yield reduxSagaEffects.fork(function* () {
        yield reduxSagaEffects.take(ActionTypes.CANCEL);
        yield reduxSagaEffects.cancel(rootTask);
    });
};

const enhanceModels = models =>
    [defaultModel].concat(models).map(m => additionalNamespacePrefix(m));

const getCombineReducers = (models = []) =>
    combineReducers(
        enhanceModels(models)
            .map(mapModelToCombineReducers)
            .reduce(reduce, {})
    );

const getCombineEffects = models =>
    getRootSaga.bind(
        this,
        enhanceModels(models)
            .map(({effects}) => effects)
            .reduce(reduce, {})
    );

export {getCombineReducers, getCombineEffects};
