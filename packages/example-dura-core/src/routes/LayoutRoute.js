import React, {Component} from 'react';
import {HashRouter, Route, Switch, Link} from "react-router-dom";
import UserRoute from './UserRoute'
import OrderRoute from "./OrderRoute"

class LayoutRoute extends Component {
    render() {
        return (
            <div>
                <HashRouter>
                    <div>
                        <ul>
                            <li>
                                <Link to="/user">user11</Link>
                            </li>
                            <li>
                                <Link to="/order">order</Link>
                            </li>
                        </ul>
                        <Switch>
                            <Route path="/user" exact render={() => {
                                this.props?.duraCorePro.clear().refresh().addModel(require('../models/UserModel').default).refresh()
                                return (<UserRoute/>)
                            }}/>
                            <Route path="/order" exact render={() => {
                                this.props?.duraCorePro.clear().refresh().addModel(require('../models/OrderModel').default).refresh()
                                return (
                                    <OrderRoute/>
                                )
                            }}/>
                        </Switch>
                    </div>
                </HashRouter>
            </div>
        );
    }
}


export default LayoutRoute;
