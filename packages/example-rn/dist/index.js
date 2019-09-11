import React, { Component } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Provider, connect } from 'react-redux';
import { store, actionCreator } from './store';
import LoginContainer from './container/LoginContainer';
import UserContainer from './container/UserContainer';
import { createStackNavigator } from 'react-navigation';
import { Drawer } from '@ant-design/react-native';
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
                headerLeft: (<TouchableOpacity onPress={() => {
                    s.navigation.goBack();
                }}>
            <Text>返回</Text>
          </TouchableOpacity>)
            };
        }
    }
});
const C = connect(function (state) {
    return {
        isShowDraw: state.user.isShowDraw
    };
}, function (dispatch) {
    return {
        onChangeIsShowDraw() {
            dispatch(actionCreator.user.onChangeIsShowDraw({ isShowDraw: false }));
        }
    };
})(function (props) {
    const sidebar = (<View>
      <Text>hello</Text>
    </View>);
    return (<Drawer drawerWidth={200} sidebar={sidebar} position='left' open={props.isShowDraw} onOpenChange={status => {
        if (!status) {
            props.onChangeIsShowDraw({ isShowDraw: false });
        }
    }} drawerBackgroundColor='#ccc'>
      <AppContainer />
    </Drawer>);
});
class App extends Component {
    render() {
        return (<Provider store={store}>
        <C />
      </Provider>);
    }
}
// console.log("App", App);
export default App;
