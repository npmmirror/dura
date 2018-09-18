import {createDuraCore} from "dura-core";

const defaultOps = {
    initialModels: [],
    middleware: [],
    enhancers: [],
    plugins: []
};

export default function (ops = defaultOps) {

    const duraCorePro = {
        plugins: ops.plugins || [],
        initialModels: ops.initialModels || [],
        models: [],
        addModel, delModel, clear, destroy, refresh
    };

    const duraCore = createDuraCore({
        models: duraCorePro.initialModels.concat(duraCorePro.models).concat(duraCorePro.plugins)
    });

    console.log(duraCore)

    duraCorePro.getState = duraCore.getState

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
