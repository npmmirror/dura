import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { HashRouter, Route, Switch, Link } from "react-router-dom";
import { createDuraCore } from "dura-core";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

const modelA = {
    namespace: "am",
    initialState: {
      name: "a"
    }
  },
  modelB = {
    namespace: "bm",
    initialState: {
      name: "b"
    }
  },
  modelC = {
    namespace: "cm",
    initialState: {
      name: "c"
    }
  };

const duraStore = createDuraCore({
  models: [modelA, modelB, modelC]
});

const result = persistStore(duraStore, {}, function() {
  console.log("finally");
});

console.log(duraStore.getState());

class A extends React.Component {
  componentWillMount() {}

  componentWillUnmount() {}

  render() {
    return <h1>A</h1>;
  }
}

class B extends React.Component {
  componentWillMount() {
    console.log(duraStore._reduxStore.getState());
  }

  componentWillUnmount() {}

  render() {
    return <h1>B</h1>;
  }
}

class C extends React.Component {
  componentWillMount() {
    console.log(duraStore._reduxStore.getState());
  }

  componentWillUnmount() {}

  render() {
    return <h1>C</h1>;
  }
}

function X(props) {
  console.log(props);
  return (
    <div>
      <Route exact path={`${props.match.url}/b`} component={B} />
      <Route exact path={`${props.match.url}/c`} component={C} />
    </div>
  );
}

render(
  <Provider store={duraStore}>
    <HashRouter>
      <div>
        <ul>
          <li>
            <Link to="/a">A</Link>
          </li>
          <li>
            <Link to="/x/b">B</Link>
          </li>
          <li>
            <Link to="/x/c">C</Link>
          </li>
        </ul>
        <Switch>
          <Route exact path="/a" component={A} />
          <Route path="/x" component={X} />
        </Switch>
      </div>
    </HashRouter>
  </Provider>,
  document.querySelector("#root")
);
