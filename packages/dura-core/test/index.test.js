import {createDuraCore} from '../src/index'
import produce from 'immer'
import DuraImmer from 'dura-plugin-immer'

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
                a(state , {payload}) {
                    state.name = payload?.name
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
            effects: {
                * k() {
                    console.log("kk")
                },
            }
        })


        const loadingPlugin = {
            namespace: 'loading',
            initialState:{

            },
            reducers:{

            },
            onEffect: function (effect) {
                return function* (...args) {
                    console.log("loading effect start")
                    yield effect(...args)
                    console.log("loading effect end")
                }
            }
        }

        duraCore.addPlugin(loadingPlugin,DuraImmer)


        duraCore.start()

        console.log(duraCore._reduxStore.getState())

        duraCore._reduxStore.dispatch({type: 'user/reducers/a',payload: {name: "里斯"}})

        console.log(duraCore._reduxStore.getState())



        // duraCore._reduxStore.dispatch({type: 'user/effects/o', payload: {name: "里斯"}})
        // duraCore._reduxStore.dispatch({type: 'user/effects/o'})
        // duraCore._reduxStore.dispatch({type: 'user/effects/o'})
    });

})