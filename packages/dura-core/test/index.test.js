import {createDuraCore} from '../src/index'

describe('demo', () => {

    it('should ', function () {
        const duraCore = createDuraCore();
        duraCore.addModel({
            namespace: "user",
            initialState: {
                name: "张三"
            },
            reducers: {
                s() {
                    console.log("ss")
                },
                a(state) {
                    console.log("aa")
                    return state
                }
            },
            effects: {
                * j() {
                    console.log("jj")
                },
                * k() {
                    console.log("kk")
                },
                o: [function* (a, b) {
                    console.log('oo')
                }, {type: 'throttle', ms: 50}]
            }
        }, {
            namespace: "23",
            initialState: {
                name: "张泗"
            },
            reducers: {
                b() {
                    console.log("bb")
                },
                d() {
                    console.log("dd")
                }
            },
            effects: {}
        })


        const loadingPlugin = {
            namespace: 'loading',
            onEffect: function (effect, model) {
                return function* (...args) {
                    console.log("loading effect start")
                    yield effect(...args)
                    console.log("loading effect end")
                }
            },
            onReducer:function (reducer) {
                return function (state, action) {
                    console.log("loading reducer start")
                    const result = reducer(state , action)
                    console.log("loading reducer end")
                    return result
                }
            }

        }

        duraCore.addPlugin(loadingPlugin)

        duraCore.start()
        duraCore._reduxStore.dispatch({type: 'user/a'})
        duraCore._reduxStore.dispatch({type: 'user/o', payload: {name: "里斯"}})
        duraCore._reduxStore.dispatch({type: 'user/o'})
        duraCore._reduxStore.dispatch({type: 'user/o'})
    });

})