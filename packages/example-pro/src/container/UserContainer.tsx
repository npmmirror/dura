import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Input, Tabs } from "antd";
import { actionCreator, RootState } from "@store";
import Hello from "./Hello";
import { compose } from "redux";

function mapState(state: RootState) {
  return {
    name: state.user.name,
    age: state.user.age,
  };
}

function mapDispatch(dispatch) {
  return {
    onAsyncChangeName: compose(dispatch, actionCreator.user.onAsyncChangeName),
  };
}

class UserContainer extends Component {
  props: Partial<ReturnType<typeof mapState>> &
    Partial<ReturnType<typeof mapDispatch>>;
  render() {
    return (
      <div>
        <h1>{this.props.name}</h1>
        <h2>{this.props.age}</h2>
        <Button
          onClick={() =>
            this.props.onAsyncChangeName(
              { newName: "李四" },
              { loading: false }
            )
          }
        >
          修改
        </Button>
        <Hello />
      </div>
    );
  }
}

export default connect(mapState, mapDispatch)(UserContainer);
