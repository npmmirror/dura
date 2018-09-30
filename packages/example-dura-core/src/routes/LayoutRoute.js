import React, {Component} from 'react';
import {HashRouter, Route, Switch, Link} from "react-router-dom";

class LayoutRoute extends Component {
    render() {
        return (
            <div>
                <HashRouter>
                   <div>
                       <ul>
                           <li>
                               <Link to="/user">user</Link>
                           </li>
                            <li>
                                <Link to="/order">order</Link>
                            </li>
                       </ul>
                       <Switch>
                           <Route path="/user" exact component={require('./UserRoute').default}/>
                           <Route path="/order" exact component={require('./OrderRoute').default}/>
                       </Switch>
                   </div>
                </HashRouter>
            </div>
        );
    }
}


export default LayoutRoute;
