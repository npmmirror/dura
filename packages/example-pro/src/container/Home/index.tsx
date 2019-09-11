import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RootState, actionCreator } from '@store';
import Item from './components/Item';
import { Button } from 'antd';

const mapState = function(state: RootState) {
  return {
    helloName: state.hello.name
  };
};

const mapDispatch = function(dispatch) {
  return {
    onChangeName() {
      dispatch(actionCreator.hello.onChangeName({ nextName: '李四' }));
    }
  };
};

type Props = Partial<ReturnType<typeof mapState>> &
  Partial<ReturnType<typeof mapDispatch>>;

class Home extends Component<Props> {
  render() {
    console.log('render home index');

    return (
      <div>
        <h1>hello{this.props.helloName}</h1>
        <Button onClick={this.props.onChangeName}>变换姓名</Button>
        <Item />
      </div>
    );
  }
}

const HomeContainer = connect(
  mapState,
  mapDispatch
)(Home);

export default HomeContainer;
