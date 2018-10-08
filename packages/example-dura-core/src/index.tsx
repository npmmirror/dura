import React from "react";
import {render} from "react-dom";
import {Provider, connect} from "react-redux";
import {HashRouter, Route, Switch, Link} from "react-router-dom";
import {createDuraCorePro} from "../../dura-core-pro/src"
import LayoutRoute from './routes/LayoutRoute'
import { createLogger } from "redux-logger"


const duraCorePro = createDuraCorePro({
    middleware:[createLogger()]
})


render(
    <Provider store={duraCorePro.reduxStore}>
        <LayoutRoute duraCorePro={duraCorePro} />
    </Provider>,
    document.querySelector("#root")
);
