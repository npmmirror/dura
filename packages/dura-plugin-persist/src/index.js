import {persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
    key: '@@dura',
    storage,
}

export default {
    namespace: '@@duraPersist',
    onReducer: function (reducer) {
        return persistReducer(persistConfig, reducer)
    }
}