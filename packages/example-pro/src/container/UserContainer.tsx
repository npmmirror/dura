import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Input } from "antd";
import { RootState, effectRunner, reducerRunner } from "@store";

function mapState(state: RootState) {
  return {
    name: state.user.name,
    loading: state.loading.user.onAsyncChangeName
  };
}

function mapDispatch(dispatch) {
  return {
    onAsyncChangeName(newName: string) {
      effectRunner.user.onAsyncChangeName({ newName }, { loading: true });

      dispatch(effectRunner.user.onAsyncChangeName({ newName }, { loading: true }));
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
