import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Text } from "react-native";
import { RootState, actionCreator } from "../store";
import { Flex, Button } from "@ant-design/react-native";
import { NavigationInjectedProps } from "react-navigation";

function mapState(state: RootState) {
  return {
    name: state.user.name,
    loading: state.loading.user.onAsyncChangeName
  };
}

function mapDispatch(dispatch) {
  return {
    onAsyncChangeName() {
      dispatch(actionCreator.user.onAsyncChangeName({ newName: "async异步张三" }, { loading: true }));
    },
    onChangeName() {
      dispatch(actionCreator.user.onChangeName({ newName: "同步张三" }));
    }
  };
}

class UserContainer extends Component {
  props: Partial<ReturnType<typeof mapState>> & Partial<ReturnType<typeof mapDispatch>> & NavigationInjectedProps;

  render() {
    return (
      <View style={{ flex: 1, paddingTop: 84, backgroundColor: "#fff" }}>
        <Flex>
          <Flex.Item>
            <Text style={{ fontSize: 24 }}>原始数据：</Text>
          </Flex.Item>
          <Flex.Item>
            <Text style={{ fontSize: 18, color: "red" }}>{this.props.name}</Text>
          </Flex.Item>
        </Flex>
      </View>
    );
  }
}

export default connect(
  mapState,
  mapDispatch
)(UserContainer);
