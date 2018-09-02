import {combineReducers} from 'redux'
import {handleActions} from 'redux-actions'
import {recursiveEnhanceFun} from 'dura-util'
import * as reduxSagaEffects from "redux-saga/effects";

class ModelHandler {

    models = [];

    pluginHandler = undefined;

    constructor({pluginHandler}) {
        this.pluginHandler = pluginHandler;
    }

    addModel(model) {
        this.models.push(this._additionalNamespacePrefix(model))
    }

    delModel(namespace) {
        this.models = this.models.filter((model) => model.namespace !== namespace)
    }

    getCombineReducers() {
        return combineReducers(
            this._getModels().map(
                ({namespace, reducers = {}, initialState = {}}) =>
                    ({[namespace]: handleActions(this._applyOnReducerEvent(Object.keys(reducers), reducers, {}), initialState)})
            ).reduce(this._reduce, {})
        )
    }

    getCombineEffects() {
        const effects = this._getModels().map(({effects}) => effects).reduce((prev, next) => ({...prev, ...next}), {})
        return this._getRootSaga.bind(this, effects)
    }

    _getModels() {
        const duraModel = {
            namespace: '@@duraCore',
            initialState: {
                count: 0
            },
            reducers: {
                onChangeState(state) {
                    return ({...state, count: state.count + 1});
                }
            }
        }
        return [this._additionalNamespacePrefix(duraModel)].concat(this.models)
    }

    * _mapGenerateSaga(effects) {
        const effectKs = Object.keys(effects);
        for (const name of effectKs) {
            const effect = this._packEffect(name, effects[name]);
            const watcher = this._getWatcher(effect);
            yield reduxSagaEffects.fork(watcher)
        }
    }

    * _getRootSaga(effects) {
        const rootTask = yield reduxSagaEffects.fork(this._mapGenerateSaga.bind(this, effects))
        yield reduxSagaEffects.fork(function* () {
            yield reduxSagaEffects.take(`@@dura/cancel`)
            yield reduxSagaEffects.cancel(rootTask)
        })
    }

    _packEffect(name, effect) {
        const defaultType = 'takeEvery';
        const newEffect = {
            name: name,
            saga: undefined,
            type: defaultType,
            ms: 100
        }
        const onEffectEventFuns = this.pluginHandler.getOnEffectEventFun();
        if (!Array.isArray(effect)) {
            newEffect.saga = recursiveEnhanceFun(onEffectEventFuns, effect);
        } else {
            const [saga, conf] = effect;
            if (!typeof  conf) {
                newEffect.type = defaultType;
            } else if (typeof conf === 'string') {
                newEffect.type = conf;
            } else if (typeof conf === 'object') {
                newEffect.type = conf?.type || defaultType;
            } else {
                newEffect.type = defaultType;
            }
            newEffect.saga = recursiveEnhanceFun(onEffectEventFuns, saga);
        }
        return newEffect;
    }

    _getWatcher(effect) {
        const {name, saga, type, ms} = effect;
        switch (type) {
            case 'takeLatest':
                return function* (...args) {
                    yield reduxSagaEffects.takeLatest(name, saga, reduxSagaEffects, args);
                }
            case 'takeLeading':
                return function* (...args) {
                    yield reduxSagaEffects.takeLeading(name, saga, reduxSagaEffects, args);
                }
            case 'throttle':
                return function* (...args) {
                    yield reduxSagaEffects.throttle(ms, name, saga, reduxSagaEffects, args);
                }
            default:
                return function* (...args) {
                    yield reduxSagaEffects.takeEvery(name, saga, reduxSagaEffects, args);
                }
        }
    }

    _applyOnReducerEvent(reducerKeys, reducers, nextReducers) {
        const first = reducerKeys.shift();
        if (first) {
            return this._applyOnReducerEvent(reducerKeys, reducers, {
                ...nextReducers,
                [first]: recursiveEnhanceFun(this.pluginHandler.getOnReducerEventFun(), reducers[first])
            })
        }
        return nextReducers
    }

    _additionalNamespacePrefix(model) {
        const {namespace, reducers = {}, effects = {}, initialState = {}} = model
        const [newReducers, newEffects] = [
            this._rename(namespace, reducers, 'reducers'),
            this._rename(namespace, effects, 'effects')
        ]
        return ({
            namespace, initialState, reducers: newReducers, effects: newEffects
        })
    }

    _reduce(prev, next) {
        return ({...prev, ...next})
    }

    _rename(namespace, argObj, type) {
        return Object.keys(argObj).map((key) => ({[`${namespace}/${type}/${key}`]: argObj[key]})).reduce(this._reduce, {})
    }

}

export default ModelHandler