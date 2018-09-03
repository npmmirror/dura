import produce from 'immer'

export default {
    namespace: '@@duraImmer',
    onReducer: function (reducer) {

        return function (state, action) {

            return produce(state, function (draft) {
                return reducer(draft, action)
            })

        }

    }
}