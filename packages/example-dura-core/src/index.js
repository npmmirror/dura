import React from 'react'
import {render} from 'react-dom'
import {createDuraCore} from 'dura-core/lib'
import {HashRouter, Route, Switch, Link} from 'react-router-dom'
import {createStore , combineReducers} from 'redux'

const composeEnhancers = window["__REDUX_DEVTOOLS_EXTENSION_COMPOSE__"] || compose;

function appreducer(state = {name:"hello"}, action) {
    switch (action.type) {
        case 'ADD_TODO':
            return state;
        case 'TOGGLE_TODO':
            return state;
        default:
            return state;
    }
}

function user(state = {name:"user"}, action) {
    switch (action.type) {
        case 'ADD_TODO_USER':
            return state;
        case 'TOGGLE_TODO_USER':
            return state;
        default:
            return state;
    }
}


const store = createStore( combineReducers({appreducer,appreducer}) ,composeEnhancers());
console.log(store.getState())
// store.replaceReducer( combineReducers({user}) )
// console.log(store.getState())
// store.dispatch({type:"@@INIT"})
// console.log(store.getState())
// const user = {
//     namespace:'user'
// }
// const set = new Set();
// set.add(user)
// set.add(user)
// console.log(set)


//
// const duraStore = createDuraCore()
//
// duraStore.start()
//
// const modelA = {
//     namespace: 'am',
//     initialState: {
//         name: 'a'
//     }
// }, modelB = {
//     namespace: 'bm',
//     initialState: {
//         name: 'b'
//     }
// }, modelC = {
//     namespace: 'cm',
//     initialState: {
//         name: 'c'
//     }
// }
//
// class A extends React.Component{
//
//     componentWillMount(){
//         duraStore.addModel(modelA)
//         duraStore.restart();
//         console.log(duraStore._reduxStore.getState())
//     }
//
//     componentWillUnmount(){
//         duraStore.delModel("am")
//     }
//
//     render(){
//         return(
//             <h1>A</h1>
//         )
//     }
//
// }
//
// class B extends React.Component{
//
//     componentWillMount(){
//         duraStore.addModel(modelB)
//         duraStore.restart();
//         console.log(duraStore._reduxStore.getState())
//     }
//
//     componentWillUnmount(){
//         duraStore.delModel("bm")
//     }
//
//     render(){
//         return(
//             <h1>B</h1>
//         )
//     }
//
// }
//
// class C extends React.Component{
//
//     componentWillMount(){
//         duraStore.addModel(modelC)
//         duraStore.restart();
//         console.log(duraStore._reduxStore.getState())
//     }
//
//     componentWillUnmount(){
//         duraStore.delModel("cm")
//     }
//
//     render(){
//         return(
//             <h1>C</h1>
//         )
//     }
//
// }
//
// function X(props) {
//     console.log(props)
//     return (
//         <div>
//             <Route exact path={`${props.match.url}/b`} component={B} />
//             <Route exact path={`${props.match.url}/c`} component={C} />
//         </div>
//     )
// }
//
// render(
//     <HashRouter>
//         <div>
//             <ul>
//                 <li>
//                     <Link to="/a">A</Link>
//                 </li>
//                 <li>
//                     <Link to="/x/b">B</Link>
//                 </li>
//                 <li>
//                     <Link to="/x/c">C</Link>
//                 </li>
//             </ul>
//             <Switch>
//                 <Route exact path="/a" component={A} />
//                 <Route path="/x"  component={X}/>
//             </Switch>
//         </div>
//     </HashRouter>
//     , document.querySelector("#root"))