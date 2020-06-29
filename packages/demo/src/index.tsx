import React from "react";
import { render } from "react-dom";
import { createStore, combineReducers } from "redux";
import { connect, Provider } from "react-redux";

function demo(state = { name: "张三" }) {
  return state;
}

const defineStore = (store: any) => {
  return {
    [store.namespace]: function (state = store.state, action: any) {
      return store.methods[action.type.split("/")[1]]?.(state, action) ?? state;
    },
  };
};

const storeA = defineStore({
  namespace: "demo" as const,
  state: {
    name: "张三",
  },
  methods: {
    hello(state) {
      return { ...state, name: "李四" };
    },
  },
});

const store = createStore(combineReducers(storeA));

const Item = (props: any) => {
  return (
    <div>
      <h1>{props?.name}</h1>
      <button onClick={props.change}>点击</button>
    </div>
  );
};

const mapStateToProps = (state: any) => ({ name: state?.demo?.name });

const mapDispatchToProps = (dispatch) => ({
  change: () => dispatch({ type: "demo/hello" }),
});

const ConnectItem = connect(mapStateToProps, mapDispatchToProps)(Item);

const App = () => {
  return (
    <Provider store={store}>
      <ConnectItem />
    </Provider>
  );
};

if (document.querySelector("#app")) {
  render(<App />, document?.querySelector?.("#app"));
}
