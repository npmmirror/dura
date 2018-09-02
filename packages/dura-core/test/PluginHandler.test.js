import PluginHandler from '../src/PluginHandler'


describe('PluginHandler', () => {


    it('add plugin', function () {

        const pluginHandler = new PluginHandler();

        pluginHandler.addPlugin({
            namespace: 'loading'
        }, {
            namespace: 'undo'
        })

        const hasLoadingPlugin = pluginHandler.plugins.some(({namespace}) => namespace === 'loading'),
            hasUndoPlugin = pluginHandler.plugins.some(({namespace}) => namespace === 'undo');


        expect(hasLoadingPlugin).toEqual(true)

        expect(hasUndoPlugin).toEqual(true)

    });

    it('add repeated plugin', function () {

        const pluginHandler = new PluginHandler();

        function addPluginFun() {
            pluginHandler.addPlugin({
                namespace: 'loading'
            }, {
                namespace: 'loading'
            })
        }

        expect(addPluginFun).toThrow(`[dura.core.plugin] namespace should be unique , the repeated namespace is loading`)

    });

    it('getOnReducerEventFun', function () {

        const pluginHandler = new PluginHandler();

        pluginHandler.addPlugin({
            namespace: 'loadingPlugin',
            onReducer: function (reducer) {
                return function (state, action) {
                    reducer(state, action)
                }
            }
        }, {
            namespace: 'undoPlugin',
            onReducer: function (reducer) {
                return function (state, action) {
                    reducer(state, action)
                }
            }
        })

        expect(pluginHandler.getOnReducerEventFun().length).toEqual(2)

    });

    it('getOnEffectEventFun', function () {

        const pluginHandler = new PluginHandler();

        pluginHandler.addPlugin({
            namespace: 'loadingPlugin',
            onEffect: function (effect) {
                return function* (args) {
                    yield effect(args)
                }
            }
        },{
            namespace: 'undoPlugin',
            onReducer: function (reducer) {
                return function (state, action) {
                    reducer(state, action)
                }
            }
        })

        expect(pluginHandler.getOnEffectEventFun().length).toEqual(1)

    });

})