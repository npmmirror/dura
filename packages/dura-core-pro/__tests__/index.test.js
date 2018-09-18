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
                * onChangeName(a, action) {
                    console.log(a)
                    yield new Promise(
                        (resolve) =>{
                            setTimeout(() => {
                                resolve()
                            },500)
                        }
                    )
                    yield a.put({
                        type: 'default/reducers/onChangeName',
                        payload: action?.payload
                    })
                }
            }
        }, default2Model = {
            namespace: 'default2',
            initialState: {
                name: '张三2'
            }
        };

        const duraCorePro = createDuraCorePro({
            initialModels: [defaultModel],
            plugins: [DuraImmer, DuraStatus]
        })

        console.log(duraCorePro.reduxStore.getState())

        duraCorePro.reduxStore.dispatch({
            type: 'default/effects/onChangeName',
            payload: {
                name: '李四'
            }
        })

        setTimeout(() => console.log(duraCorePro.reduxStore.getState()),300 )

        console.log(duraCorePro.reduxStore.getState())

        setTimeout(() => {
            console.log(duraCorePro.reduxStore.getState())
            done()
        },1000 )

    })
})