import React, { Component } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Provider, connect } from 'react-redux';
import { store, RootState, actionCreator } from './store';
import LoginContainer from './container/LoginContainer';
import UserContainer from './container/UserContainer';
import { createStackNavigator, createDrawerNavigator } from 'react-navigation';
import {
  TextareaItem,
  Modal,
  List,
  Tabs,
  Flex,
  Button,
  Drawer,
  WhiteSpace
} from '@ant-design/react-native';
import ActionButton from 'react-native-action-button';

const AppContainer = createStackNavigator({
  Home: {
    screen: LoginContainer,
    navigationOptions: () => ({ title: '登陆' })
  },
  User: {
    screen: UserContainer,
    navigationOptions: s => {
      return {
        title: '用户',
        headerLeft: (
          <TouchableOpacity
            onPress={() => {
              s.navigation.goBack();
            }}
          >
            <Text>返回</Text>
          </TouchableOpacity>
        )
      };
    }
  }
});

const C = connect(
  function(state: RootState) {
    return {
      isShowDraw: state.user.isShowDraw
    };
  },
  function(dispatch) {
    return {
      onChangeIsShowDraw() {
        dispatch(actionCreator.user.onChangeIsShowDraw({ isShowDraw: false }));
      }
    };
  }
)(function(props: any) {
  const sidebar = (
    <View>
      <Text>hello</Text>
    </View>
  );
  return (
    <Drawer
      drawerWidth={200}
      sidebar={sidebar}
      position='left'
      open={props.isShowDraw}
      onOpenChange={status => {
        if (!status) {
          props.onChangeIsShowDraw({ isShowDraw: false });
        }
      }}
      drawerBackgroundColor='#ccc'
    >
      <AppContainer />
    </Drawer>
  );
});

class App extends Component {
  drawer: any;
  render() {
    return (
      <Provider store={store}>
        <C />
      </Provider>
    );
  }
}

// console.log("App", App);

export default App;
