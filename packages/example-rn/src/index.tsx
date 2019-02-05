import React, { Component } from "react";
import { Text, TouchableOpacity } from "react-native";
import { Provider } from "react-redux";
import { store } from "./store";
import LoginContainer from "./container/LoginContainer";
import UserContainer from "./container/UserContainer";
import { createStackNavigator, createAppContainer } from "react-navigation";

const AppContainer = createAppContainer(
  createStackNavigator({
    Home: { screen: LoginContainer, navigationOptions: () => ({ title: "登陆" }) },
    User: {
      screen: UserContainer,
      navigationOptions: s => {
        return {
          title: "用户",
          headerLeft: (
            <TouchableOpacity
              onPress={() => {
                s.navigation.goBack();
              }}>
              <Text>返回</Text>
            </TouchableOpacity>
          )
        };
      }
    }
  })
);

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <AppContainer />
      </Provider>
    );
  }
}

// console.log("App", App);

export default App;
