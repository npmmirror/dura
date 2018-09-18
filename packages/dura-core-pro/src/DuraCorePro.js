import {createDuraCore} from "dura-core";
import {recursiveEnhanceFun} from 'dura-util'

const defaultOps = {
    initialModels: [],
    middleware: [],
    enhancers: [],
    plugins: []
};

const enhanceReducer = function (reducers, onReducers) {
    return Object.keys(reducers).map(
        (key) => ({[key]: recursiveEnhanceFun(onReducers, reducers[key])})
    ).reduce((prev, next) => ({...prev, ...next}), {})
}

export default function (ops = defaultOps) {

    const duraCorePro = {
        plugins: ops.plugins || [],
        initialModels: ops.initialModels || [],
        models: [],
        addModel, delModel, clear, destroy, refresh
    };

    const onReducers = duraCorePro.plugins.filter(({onReducer}) => onReducer).map(({onReducer}) => onReducer)

    const duraCore = createDuraCore({
        models: [
            ...duraCorePro.initialModels.concat(duraCorePro.models).concat(duraCorePro.plugins)
        ].map(({namespace, initialState, reducers = {}, effects}) => ({
            namespace, initialState, effects,
            reducers: enhanceReducer(reducers, onReducers)
        }))
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
