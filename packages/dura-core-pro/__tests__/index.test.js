import {createDuraCorePro} from '../src/index'
import DuraImmer from 'dura-plugin-immer'
import DuraStatus from 'dura-plugin-status'

describe('dura-core-pro', function () {

    it('dd', function (done) {

        const defaultModel = {
            namespace: 'default',
            initialState: {
                name: '张三'
            },
            reducers: {
                onChangeName(state, action) {
                    console.log(action)
                    state.name = action?.payload?.name
                }
            },
            effects: {
                * onChangeName({put, delay}, action) {
                    yield delay(500)
                    yield put({
                        type: 'default/reducers/onChangeName',
                        payload: action?.payload
                    })
                }
            }
        };


        const duraCorePro = createDuraCorePro({
            plugins: [DuraImmer, DuraStatus]
        })

        duraCorePro.addModel(defaultModel).refresh()

        // console.log(duraCorePro.reduxStore.getState())
        //
        // duraCorePro.reduxStore.dispatch({
        //     type: 'default/effects/onChangeName',
        //     payload: {
        //         name: '李四'
        //     }
        // })
        //
        // console.log(duraCorePro.reduxStore.getState())

        setTimeout(() => {
            console.log(duraCorePro.reduxStore.getState())
            done()
        }, 1000)

    })
})