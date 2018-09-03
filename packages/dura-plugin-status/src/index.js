export default {
    namespace: '@@duraStatus',
    initialState: {},
    reducers: {
        onChangeStatus(state, {payload}) {
            return {...state, ...payload}
        }
    },
    onEffect: function (effect, name, {put}) {
        return function* (...args) {
            yield put({
                type: '@@duraStatus/reducers/onChangeStatus',
                payload: {
                    [name]: true
                }
            })
            yield effect(...args)
            yield put({
                type: '@@duraStatus/reducers/onChangeStatus',
                payload: {
                    [name]: false
                }
            })
        }
    }
}