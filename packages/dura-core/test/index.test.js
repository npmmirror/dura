import {createDuraCore} from '../src/index'
import produce from 'immer'

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
            onEffect: function (effect) {
                return function* (...args) {
                    console.log("loading effect start")
                    yield effect(...args)
                    console.log("loading effect end")
                }
            },
            onReducer: function (reducer) {
                return function (state, action) {
                    console.log("loading reducer start")
                    const result = reducer(state, action)
                    console.log("loading reducer end")
                    return result
                }
            },
            onStateChange:function (state) {
                console.log(state)
            }
        }

        const undoPlugin = {
            namespace:'undo',
            onReducer:function (reducer) {
                return function (state, action) {
                    console.log('undo reducer start')
                    const nextState = produce( state , (draft) => {
                        reducer(draft , action)
                    } )
                    console.log('undo reducer end')
                    return nextState
                }
            },
            onEffect: function (effect) {
                return function* (...args) {
                    console.log("undo effect start")
                    yield effect(...args)
                    console.log("undo effect end")
                }
            },
            onStateChange:function (state) {
                // console.log(state)
            },
        }

        duraCore.addPlugin(undoPlugin)

        duraCore.start()

        duraCore._reduxStore.dispatch({type: 'user/reducers/a',payload: {name: "里斯"}})

        console.log(duraCore._reduxStore.getState())



        // duraCore._reduxStore.dispatch({type: 'user/effects/o', payload: {name: "里斯"}})
        // duraCore._reduxStore.dispatch({type: 'user/effects/o'})
        // duraCore._reduxStore.dispatch({type: 'user/effects/o'})
    });

})