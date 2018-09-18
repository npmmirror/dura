export default {
    namespace: '@@duraStatus',
    initialState: {},
    reducers: {
        onChangeStatus(state, {payload}) {
            return {...state, ...payload}
        }
    },
    onEffect: function (effect, name) {
        return function* (reduxEffect, action) {
            yield reduxEffect.put({
                type: '@@duraStatus/reducers/onChangeStatus',
                payload: {
                    [name]: true
                }
            })
            yield effect(reduxEffect, action)
            yield reduxEffect.put({
                type: '@@duraStatus/reducers/onChangeStatus',
                payload: {
                    [name]: false
                }
            })
        }
    }
}