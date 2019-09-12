import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RootState, actionCreator } from '@store';
import Item from './components/Item';
import { Button } from 'antd';
import { createSelector } from 'reselect';

const mapState = function(state: RootState) {
  return {
    helloName: state.hello.name,
    articleIdListString: state.hello.articleList.map(n => n.id).join(',')
  };
};

const mapDispatch = function(dispatch) {
  return {
    onChangeName() {
      dispatch(actionCreator.hello.onChangeName({ nextName: '李四' }));
    },
    onChangeItem() {
      dispatch(actionCreator.hello.onChangeItem({ id: 1, title: '测试标题' }));
    }
  };
};

type Props = Partial<ReturnType<typeof mapState>> &
  Partial<ReturnType<typeof mapDispatch>>;

class Home extends Component<Props> {
  render() {
    console.log('render home index', this.props.articleIdListString);

    return (
      <div>
        <h1>hello{this.props.helloName}</h1>
        <Button onClick={this.props.onChangeName}>变换姓名</Button>
        <Button type='primary' onClick={this.props.onChangeItem}>
          更改列表item
        </Button>
        {(this.props.articleIdListString.split(',') || []).map(id => (
          <Item key={id} id={id} />
        ))}
      </div>
    );
  }
}

const HomeContainer = connect(
  mapState,
  mapDispatch
)(Home);

export default HomeContainer;
