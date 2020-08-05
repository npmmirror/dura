import React from 'react';
import { Button, message } from 'antd';
import { store, defineComponent } from '../store';
import faker from 'faker';

function useBlock2() {
  const index = 8;
  const onClick = React.useCallback(() => {
    store.dispatch({
      type: 'user/onChangeStreetAddress',
      payload: {
        id: index,
        streetAddress: faker.address.streetAddress(),
      },
    });
  }, []);
  const onClickAsync = React.useCallback(() => {
    store.dispatch({
      type: 'user/onAsyncQuery',
      payload: {
        id: index,
        streetAddress: faker.address.streetAddress(),
      },
    });
  }, []);
  return { onClick, index, onClickAsync };
}

export default defineComponent(function Block2(props) {
  const { onClick, onClickAsync } = useBlock2();

  const { users } = props.store?.user;

  return (
    <div
      style={{
        border: '1px solid gray',
        padding: '10px',
        float: 'left',
        width: 300,
      }}
    >
      <h1>我是区块二</h1>

      <h2>{`${users?.[8]?.id}： ${users?.[8]?.streetAddress}`}</h2>
      <Button type="primary" onClick={onClick} shape="round">
        修改streetAddress
      </Button>
      <Button type="primary" onClick={onClickAsync} shape="round">
        测试异步
      </Button>
    </div>
  );
});
