import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Input } from "antd";
import { RootState, effectRunner, reducerRunner, selectorRunner } from "./store";

function mapState(state: RootState) {
  return {
    name: state.user.name,
    loading: state.loading.user.onAsyncChangeName,
    chinaName: selectorRunner.user.chinaName(state)
  };
}

function mapDispatch() {
  return {
    onAsyncChangeName(newName: string) {
      effectRunner.user.onAsyncChangeName({ newName }, { loading: true });
    },
    onChangeName(newName: string) {
      reducerRunner.user.onChangeName({ newName });
    }
  };
}

class UserContainer extends Component {
  props: Partial<ReturnType<typeof mapState>> & Partial<ReturnType<typeof mapDispatch>>;
  render() {
    return (
      <div>
        <h1>{this.props.name}</h1>
        <h1>{this.props.chinaName}</h1>
        <Input onChange={e => this.props.onChangeName(e.target.value)} />
        <Button
          loading={this.props.loading}
          type="primary"
          onClick={() => this.props.onAsyncChangeName(this.props.name)}>
          提交
        </Button>
      </div>
    );
  }
}

export default connect(
  mapState,
  mapDispatch
)(UserContainer);
