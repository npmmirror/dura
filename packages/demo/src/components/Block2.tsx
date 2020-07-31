import React from 'react';
import { Button, notification } from 'antd';
import { store, defineComponent } from '../store';
import faker from 'faker';

function useBlock2() {
  React.useEffect(() =>
    notification.info({ message: '区块二被渲染', duration: 1.8 }),
  );
  const index = 18;
  const onClick = React.useCallback(() => {
    store.dispatch({
      type: 'user/onChangeStreetAddress',
      payload: {
        id: index,
        streetAddress: faker.address.streetAddress(),
      },
    });
  }, []);
  return { onClick, index };
}

export default defineComponent((props) => {
  const { onClick } = useBlock2();

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

      <h2>{`${users?.[18]?.id}： ${users?.[18]?.streetAddress}`}</h2>
      <Button type="primary" onClick={onClick}>
        修改streetAddress
      </Button>
    </div>
  );
});
