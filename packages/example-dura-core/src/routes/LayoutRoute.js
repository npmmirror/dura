import React, {Component} from 'react';
import {HashRouter, Route, Switch, Link} from "react-router-dom";
import UserRoute from './UserRoute'
import OrderRoute from "./OrderRoute"
import UserDetailRoute from "./UserDetailRoute"
import UserModel from "../models/UserModel"

class LayoutRoute extends Component {
    render() {
        return (
            <div>
                <HashRouter>
                    <div>
                        <ul>
                            <li>
                                <Link to="/user/again">再来一个user</Link>
                            </li>
                            <li>
                                <Link to="/user">user</Link>
                            </li>
                            <li>
                                <Link to="/user/detail">/user/detail</Link>
                            </li>
                            <li>
                                <Link to="/order">order</Link>
                            </li>
                        </ul>
                        <Switch>
                            <Route path="/user/again" exact render={() => {
                                this.props?.duraCorePro.clear().refresh(() => this.props?.duraCorePro.addModel(UserModel).refresh())

                                return (<UserRoute/>)
                            }}/>
                            <Route path="/user" exact render={() => {
                                this.props?.duraCorePro.clear().addModel(require('../models/UserModel').default).refresh()
                                return (<UserRoute/>)
                            }}/>
                            <Route path="/user/detail" exact render={() => {
                                this.props?.duraCorePro.clear().addModel(require('../models/UserModel').default).refresh()
                                return (<UserDetailRoute/>)
                            }}/>
                            <Route path="/order" exact render={() => {
                                this.props?.duraCorePro.clear().addModel(require('../models/OrderModel').default).refresh()
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
