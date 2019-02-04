import React, { Component } from "react";
import { render } from "react-dom";
import { Provider, connect } from "react-redux";
import { store, RootState, reducerRunner } from "@store";
import { Button } from "antd";

function mapState(state: RootState) {
  return {
    count: state.count.count
  };
}

function mapDispatch() {
  return {
    plusCount() {
      reducerRunner.count.onPlusCount();
    }
  };
}

class CountContainer extends Component {
  props: Partial<ReturnType<typeof mapState>> & Partial<ReturnType<typeof mapDispatch>>;

  render() {
    return (
      <div>
        <h1>{this.props.count}</h1>
        <Button type="primary" onClick={this.props.plusCount}>
          增加
        </Button>
      </div>
    );
  }
}

const Page = connect(
  mapState,
  mapDispatch
)(CountContainer);

render(
  <Provider store={store}>
    <Page />
  </Provider>,
  document.querySelector("#root")
);
