import React from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import LoginContainer from "./container/LoginContainer";

export default function() {
  console.log("store", store);

  return (
    <Provider store={store}>
      <LoginContainer />
    </Provider>
  );
}
