import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text } from 'react-native';
import { actionCreator } from '../store';
import { Flex, Button } from '@ant-design/react-native';
import { TextareaItem, Modal, Provider } from '@ant-design/react-native';
function mapState(state) {
    return {
        name: state.user.name,
        loading: state.loading.user.onAsyncChangeName,
        context: state.user.context,
        isShow: state.user.isShow
    };
}
function mapDispatch(dispatch) {
    return {
        onAsyncChangeName() {
            dispatch(actionCreator.user.onAsyncChangeName({ newName: 'async异步张三3' }, { loading: true }));
        },
        onChangeName() {
            dispatch(actionCreator.user.onChangeName({ newName: '同步张三' }));
        },
        pushUserPage(navigation) {
            dispatch(actionCreator.router.pushUserPage({ navigation }));
        },
        onChangeContext(newContext) {
            dispatch(actionCreator.user.onChangeContext({ newContext }));
        },
        onHide() {
            dispatch(actionCreator.user.onChangeIsShow({ nextIsShow: false }));
        }
    };
}
class LoginContainer extends Component {
    render() {
        const footerButtons = [
            { text: 'Cancel', onPress: this.props.onHide },
            { text: 'Ok', onPress: () => console.log('ok') }
        ];
        return (<Provider>
        <View style={{ flex: 1, paddingTop: 84, backgroundColor: '#fff' }}>
          <Modal title='Title' transparent onClose={this.props.onHide} maskClosable visible={this.props.isShow} closable footer={footerButtons}>
            <View style={{ paddingVertical: 20 }}>
              <Text style={{ textAlign: 'center' }}>Content...</Text>
              <Text style={{ textAlign: 'center' }}>Content...</Text>
            </View>
            <Button type='primary' onPress={this.props.onHide}>
              close modal
            </Button>
          </Modal>

          <Flex>
            <Flex.Item>
              <Text style={{ fontSize: 24 }}>原始数据：</Text>
            </Flex.Item>
            <Flex.Item>
              <Text style={{ fontSize: 18, color: 'red' }}>
                {this.props.name}
              </Text>
            </Flex.Item>
          </Flex>

          <View style={{ height: 80 }}/>
          <Flex>
            <Flex.Item style={{ paddingLeft: 10, paddingRight: 10 }}>
              <Button size='large' type='primary' onPress={this.props.onAsyncChangeName} loading={this.props.loading}>
                异步修改
              </Button>
            </Flex.Item>

            <Flex.Item style={{ paddingLeft: 10, paddingRight: 10 }}>
              <Button size='large' onPress={() => {
            this.props.onChangeName();
            this.props.pushUserPage(this.props.navigation);
            // this.props.navigation.replace("User");
        }}>
                同步修改
              </Button>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item style={{ paddingLeft: 10, paddingRight: 10 }}>
              <TextareaItem value={this.props.context} rows={4} onChangeText={this.props.onChangeContext} placeholder='固定行数'/>
            </Flex.Item>
          </Flex>
        </View>
      </Provider>);
    }
}
export default connect(mapState, mapDispatch)(LoginContainer);
