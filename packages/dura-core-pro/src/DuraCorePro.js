import {createDuraCore} from "dura-core";
import {recursiveEnhanceFun, objectReduce} from 'dura-util'

const defaultOps = {
    middleware: [],
    enhancers: [],
    plugins: [],
    initialState: {}
};

const enhanceReducer = function (reducers, onReducers) {
    return Object.keys(reducers).map(
        (key) => ({[key]: recursiveEnhanceFun(onReducers, reducers[key])})
    ).reduce(objectReduce, {})
}

const enhanceEffect = function (effects, onEffects) {
    return Object.keys(effects).map(
        (key) => ({[key]: recursiveEnhanceFun(onEffects, effects[key], key)})
    ).reduce(objectReduce, {})
}

const enhanceModels = function (duraCorePro) {

    const {plugins} = duraCorePro

    const onReducers = plugins.filter(({onReducer}) => onReducer).map(({onReducer}) => onReducer)
    const onEffects = plugins.filter(({onEffect}) => onEffect).map(({onEffect}) => onEffect)

    return mergeModels(duraCorePro).map(function ({namespace, initialState = {}, reducers = {}, effects = {}}) {
        return ({
            namespace,
            initialState,
            reducers: enhanceReducer(reducers, onReducers),
            effects: enhanceEffect(effects, onEffects)
        })
    })
}

const mergeModels = function (duraCorePro) {
    const {plugins, models} = duraCorePro
    return models.concat(plugins)
}

export default function (ops = defaultOps) {

    const duraCorePro = {
        plugins: ops.plugins || [],
        middleware: ops.middleware || [],
        enhancers: ops.enhancers || [],
        models: [],
        addModel, delModel, clear, refresh
    };

    const duraCore = createDuraCore({
        models: enhanceModels(duraCorePro),
        initialState: ops.initialState,
        middleware: duraCorePro.middleware,
        enhancers: duraCorePro.enhancers
    });

    duraCorePro.reduxStore = duraCore.reduxStore

    function addModel(...models) {
        duraCorePro.models = duraCorePro.models.concat(models)
        return duraCorePro
    }

    function delModel(namespace) {
        duraCorePro.models = duraCorePro.models.filter((m) => m.namespace !== namespace)
        return duraCorePro
    }

    function clear() {
        duraCorePro.models = []
        return duraCorePro
    }

    function refresh() {
        duraCore.replaceModel(enhanceModels(duraCorePro))
        return duraCorePro
    }

    return duraCorePro;
}
