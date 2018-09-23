import React from "react";
import {render} from "react-dom";
import {Provider, connect} from "react-redux";
import {HashRouter, Route, Switch, Link} from "react-router-dom";
import {createDuraCorePro} from "dura-core-pro"
import {persistStore, persistReducer} from "redux-persist";
import storage from 'redux-persist/lib/storage'




const modelA = {
    namespace: "am",
    initialState: {
        name: "a"
    },
    reducers: {
        onChangeName(state, {payload}) {
            return ({...state, ...payload})
        }
    }
}, modelB = {
    namespace: 'bm',
    initialState: {
        name: 'b'
    }
}

const persistConfig = {
    key: '@@dura',
    storage,
}

function persist() {
    return createStore => (reducer, initialState, enhancer) => {
        return createStore(persistReducer(persistConfig, reducer), initialState, enhancer)
    }
}

const duraCorePro = createDuraCorePro({
    initialModels: [modelA],
    enhancers: [persist()]
})

duraCorePro.addModel(modelA).refresh()

persistStore(duraCorePro.reduxStore)

const Main = connect(function (state) {

    return ({
        name: state?.am?.name
    })
}, function (dispatch) {
    return ({
        changeName: function () {
            dispatch({
                type: "am/reducers/onChangeName",
                payload: {
                    name: "张三"
                }
            })
        }
    })
})((props) => <div>
    <h1>{props.name}</h1>
    <button onClick={() => {

        console.log(duraCorePro)

        duraCorePro.delModel('am').addModel(modelB).refresh()

        console.log(duraCorePro)

    }}>换model
    </button>
    <button onClick={props.changeName}>换name</button>
</div>)





render(
    <Provider store={duraCorePro.reduxStore}>
        <Main/>
    </Provider>,
    document.querySelector("#root")
);
