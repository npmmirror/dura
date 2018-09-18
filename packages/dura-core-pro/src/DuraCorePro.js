import {createDuraCore} from "dura-core";
import {recursiveEnhanceFun, objectReduce} from 'dura-util'

const defaultOps = {
    initialModels: [],
    middleware: [],
    enhancers: [],
    plugins: []
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
    const {initialModels, plugins, models} = duraCorePro
    return [...initialModels.concat(models).concat(plugins)]
}

export default function (ops = defaultOps) {

    const duraCorePro = {
        plugins: ops.plugins || [],
        initialModels: ops.initialModels || [],
        models: [],
        addModel, delModel, clear, destroy, refresh
    };

    const duraCore = createDuraCore({
        models: enhanceModels(duraCorePro)
    });

    duraCorePro.reduxStore = duraCore.reduxStore

    function addModel(model) {
        duraCorePro.models.push(model)
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

    function destroy() {
        duraCorePro.initialModels = []
        duraCorePro.models = []
        return duraCorePro
    }

    function refresh() {
        duraCore.replaceModel(duraCorePro.initialModels.concat(duraCorePro.models).concat(duraCorePro.plugins))
        return duraCorePro
    }

    return duraCorePro;
}
