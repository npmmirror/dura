class PluginHandler {

    plugins = [];

    constructor() {
    }


    addPlugin(plugin) {
        this.plugins.push(plugin)
    }

    getOnReducerEventFun() {
        return this.plugins.filter(plugin => plugin.onReducer).map(plugin => plugin.onReducer);
    }

    getOnEffectEventFun() {
        return this.plugins.filter(plugin => plugin.onEffect).map(plugin => plugin.onEffect);
    }

    getOnStateChangeEventFun() {
        return this.plugins.filter(plugin => plugin.onStateChange).map(plugin => plugin.onStateChange)
    }

    getOnAction() {
        return this.plugins.filter(plugin => plugin.onAction).map(plugin => plugin.onAction)
    }

}

export default PluginHandler