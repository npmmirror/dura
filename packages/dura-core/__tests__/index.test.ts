import { createStore } from "../src/index";
const userModel = {
  namespace: "user",
  state: {
    name: "张三",
  },
  reducers: {
    onChangeName(state, action) {
      return { ...state, name: action.payload.name };
    },
  },
};

describe("", function () {
  const store = createStore([userModel]);

  console.log(store.getState());
  store.dispatch({ type: "user/onChangeName", payload: { name: "xx" } });
  console.log(store.getState());
});
