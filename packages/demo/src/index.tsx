import React from "react";
import { render } from "react-dom";
import { combineReducers } from "redux";
import { connect, Provider } from "react-redux";
import produce, {
  createDraft,
  finishDraft,
  applyPatches,
  enablePatches,
  produceWithPatches,
  current,
  original,
  setAutoFreeze
} from "immer";
import {  StoreCreatorFactory } from "./util";
import { createAppCreator, createProxy } from "./util/createApp";
setAutoFreeze(false)
enablePatches();

const createApp = createAppCreator();

const app = createApp();

app.use(
  {
    namespace: "demo" as const,
    state: {
      users: [{ name: "张三", age: 12 }],
      name: "demo",
      age: 1,
    },
    reducers: {
      changeName(state, action) {
        state.users[0].name = "李四";

      },
      changeAge(state, action) {
        state.users[0].age = state.users[0].age + 1;

      },
    },
    effects: {
      async change(storeState,commit) {

      },
    },
  },
  {
    namespace: "user" as const,
    state: {
      name: "张三",
    },
    reducers: {
      changeName(state, action) {

      },
    },
    effects: {},
  }
);
const { defineContainer, defineComponent, store } = app.run();

const s = {
  namespace:'sss',
  state:{
    hello:'hello'
  },
  reducers:{
    changeHello(state){
      state.hello = 'world'
    }
  },
  effects:{}
}

const Item = defineComponent((props) => {
  console.log("我是上面的组件，我用到了name", props.store);

  return (
    <div>
      <h1>{props.store.sss?.hello}</h1>
      <h1>{props.store.demo.users[0].name}</h1>
      <button
        onClick={() => {
          store.dispatch({
            type: "demo/changeName",
            name: "李四",
          });
          app.use(s)
          store.dispatch({
            type: "sss/changeHello",
          });
        }}
      >
        改姓名
      </button>
      <button onClick={() => {
        app.unUse(s.namespace)
      }}>减去</button>
      <button onClick={() => {
        app.use(s)
      }}>减去2</button>
      <button
        onClick={() => {
          store.dispatch({
            type: "demo/changeAge",
          });
        }}
      >
        改年龄
      </button>
    </div>
  );
});

const Item1 = defineComponent((props) => {
  console.log("我是下面的组件，我用到了age", props);
  return (
    <div>
      {/* <h1>{props.store.demo.users[0].age}</h1> */}
      <h1>{props.store.demo.users[0].age}</h1>
      <button
        onClick={() => {
          store.dispatch({
            type: "demo/changeName",
            name: "李四",
          });
        }}
      >
        改姓名
      </button>
      <button
        onClick={() => {
          store.dispatch({
            type: "demo/changeAge",
          });
        }}
      >
        改年龄
      </button>
      <button
        onClick={() => {
          store.dispatch({
            type: "demo/change",
            name: "李四",
          });
        }}
      >
        effect
      </button>
    </div>
  );
});

const App = defineContainer(() => {
  return (
    <div>
      <Item />
      <Item1 />
    </div>
  );
});

if (document.querySelector("#app")) {
  render(<App />, document?.querySelector?.("#app"));
}
 