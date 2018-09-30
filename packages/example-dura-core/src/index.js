import React from "react";
import {render} from "react-dom";
import {Provider, connect} from "react-redux";
import {HashRouter, Route, Switch, Link} from "react-router-dom";
import {createDuraCorePro} from "../../dura-core-pro/src"
import LayoutRoute from './routes/LayoutRoute'
import UserModel from './models/UserModel'
import OrderModel from './models/OrderModel'

console.log(
    require('./models/UserModel').default
)

const duraCorePro = createDuraCorePro()


render(
    <Provider store={duraCorePro.reduxStore}>
        <LayoutRoute duraCorePro={duraCorePro} />
    </Provider>,
    document.querySelector("#root")
);
