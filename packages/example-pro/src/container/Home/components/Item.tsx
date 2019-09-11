import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RootState } from '@store';

const mapState = function(state: RootState) {
  return {
    helloName: state.hello.name
  };
};

class Item extends Component<Partial<ReturnType<typeof mapState>>> {
  render() {
    console.log('item render');
    return (
      <div>
        <h2>hello:</h2>
      </div>
    );
  }
}

const ItemContainer = connect(
  mapState,
  function() {
    return {};
  }
)(Item);

export default ItemContainer;
