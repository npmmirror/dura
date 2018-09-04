import React from 'react'
import {render} from 'react-dom'
import {createDuraCore} from 'dura-core/lib'
import {HashRouter , Route , Switch,Link} from 'react-router-dom'

const duraStore = createDuraCore()

duraStore.start()

const modelA = {
    namespace:'am',
    initialState:{
        name:'a'
    }
},modelB = {
    namespace:'bm',
    initialState:{
        name:'b'
    }
},modelC = {
    namespace:'cm',
    initialState:{
        name:'c'
    }
}

duraStore.addModel(modelA , modelB , modelC)

duraStore.restart();


function A(){
    return <h1>A</h1>
}

function B(){
    return <h1>B</h1>
}

function C(){
    return <h1>C</h1>
}


render(
    <HashRouter>
        <div>
            <ul>
                <li>
                    <Link to="/a">A</Link>
                </li>
                <li>
                    <Link to="/b">B</Link>
                </li>
                <li>
                    <Link to="/c">C</Link>
                </li>
            </ul>
            <Switch>
                <Route exact path="/a" component={A} />
                <Route exact path="/b" component={B} />
                <Route exact path="/c" component={C} />
            </Switch>
        </div>
    </HashRouter>
    , document.querySelector("#root"))