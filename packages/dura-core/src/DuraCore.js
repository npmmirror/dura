import {createStore, applyMiddleware, compose} from 'redux';
import createSagaMiddleware from "redux-saga";
import PluginHandler from './PluginHandler'
import ModelHandler from './ModelHandler'
import invariant from "invariant";

function createDuraCore() {

    const pluginHandler = new PluginHandler();

    const modelHandler = new ModelHandler({
        pluginHandler
    });

    const duraCore = {
        _reduxStore: undefined,
        _reduxSaga: undefined,
        _namespaces: {},
        addModel: addModel,
        delModel: delModel,
        addPlugin: addPlugin,
        start: start,
        restart: restart
    }

    return duraCore;

    function validate(target) {
        const {namespace} = target
        //必须有namespace
        invariant(namespace, `namespace should be defined`)
        //必须是string类型
        invariant(typeof namespace === 'string', `namespace should be string`)
        //必须唯一
        invariant(
            !duraCore._namespaces[namespace],
            `namespace should be unique , the repeated namespace is ${namespace}`
        )
    }

    function addPlugin(...plugins) {
        plugins.forEach(plugin => {
            validate(plugin)
            duraCore._namespaces[plugin.namespace] = plugin
            pluginHandler.addPlugin(plugin)
        })
    }

    function addModel(...models) {
        models.forEach(model => {
            validate(model)
            duraCore._namespaces[model.namespace] = model
            modelHandler.addModel(model)
        })
    }

    function delModel(...namespaces) {
        namespaces.forEach(namespace => {
            delete duraCore._namespaces[namespace]
            modelHandler.delModel(namespace)
        });
    }

    function start() {
        const composeEnhancers = window["__REDUX_DEVTOOLS_EXTENSION_COMPOSE__"] || compose;
        duraCore._reduxSaga = createSagaMiddleware();
        duraCore._reduxStore = createStore(
            modelHandler.getCombineReducers(),
            composeEnhancers(applyMiddleware(duraCore._reduxSaga))
        )
        const onStateChangeEventFuns = pluginHandler.getOnStateChangeEventFun();
        for (const fun of onStateChangeEventFuns) {
            duraCore._reduxStore.subscribe(() => {
                fun(duraCore._reduxStore.getState())
            })
        }
        duraCore._reduxSaga.run(modelHandler.getCombineEffects())
    }

    function restart() {
        const {_reduxStore, _reduxSaga} = duraCore
        _reduxStore.dispatch({type: '@@dura/cancel'})
        _reduxStore.dispatch({type: '@@duraCore/reducers/onChangeState'})
        _reduxStore.replaceReducer(modelHandler.getCombineReducers());
        _reduxSaga.run(modelHandler.getCombineEffects())
    }

}

export {
    createDuraCore
}