import produce from 'immer'

export default {
    namespace: '@@duraImmerPlugin',
    onReducer: function (reducer) {

        return function (state, action) {

            return produce(state, function (draft) {
                reducer(draft, action)
            })

        }

    }
}