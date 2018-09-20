import React from "react";
import {render} from "react-dom";
import {Provider} from "react-redux";
import {HashRouter, Route, Switch, Link} from "react-router-dom";
import {createDuraCorePro} from "dura-core-pro"
import {persistStore} from "redux-persist";
import persist from 'dura-plugin-persist'

const modelA = {
    namespace: "am",
    initialState: {
        name: "a"
    }
}

const duraCorePro = createDuraCorePro({
    initialModels:[modelA],

})

persistStore(duraCorePro.reduxStore)


render(
    <Provider store={duraCorePro.reduxStore}>
        <h1>hello</h1>
    </Provider>,
    document.querySelector("#root")
);
