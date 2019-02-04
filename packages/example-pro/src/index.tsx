import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import UserContainer from "./container/UserContainer";

render(
  <div>
    <Provider store={store}>
      <UserContainer />
    </Provider>
  </div>,
  document.querySelector("#root")
);
