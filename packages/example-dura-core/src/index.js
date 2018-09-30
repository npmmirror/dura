import React from "react";
import {render} from "react-dom";
import {Provider, connect} from "react-redux";
import {HashRouter, Route, Switch, Link} from "react-router-dom";
import {createDuraCorePro} from "../../dura-core-pro/src"
import {persistStore, persistReducer} from "redux-persist";
import storage from 'redux-persist/lib/storage'
import LayoutRoute from './routes/LayoutRoute'


console.log(
    require('./models/UserModel').default
)

const duraCorePro = createDuraCorePro({
    models:[require('./models/UserModel').default]
})

duraCorePro
    .addModel(require('./models/UserModel').default)
    .addModel(require('./models/OrderModel').default)
    .refresh();

render(
    <Provider store={duraCorePro.reduxStore}>
        <LayoutRoute/>
    </Provider>,
    document.querySelector("#root")
);
