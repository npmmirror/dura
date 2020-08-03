import React from 'react';
import { defineComponent, store } from '../store';
import { Button, notification } from 'antd';
import Item from './Item';

function useBlock1() {
  React.useEffect(() => {
    notification.info({ message: '区块一被渲染', duration: 1.8 });
  });
  const index = 99;

  const onClick = React.useCallback(() => {
    store.dispatch({
      type: 'user/onChangeName',
      payload: {
        id: index,
        name: 'xx' + Math.random(),
      },
    });
  }, []);
  return { onClick, index };
}

export default defineComponent((props) => {
  const { users } = props.store.user;
  const { onClick, index } = useBlock1();
  console.log(props);

  return (
    <div
      style={{
        border: '1px solid gray',
        padding: '10px',
        float: 'left',
        width: 500,
      }}
    >
      <h1>我是区块一</h1>
      {users.map((item: any) => {
        // return <Item id={item.id} key={item.id} />;
        return <Item item={item} key={item.id} />;
        // return (
        //   <div key={item?.id}>
        //     <span>{item.id}：</span>
        //     <span>{item?.name}</span>
        //     <span style={{ color: '#999', marginLeft: 20 }}>{item?.city}</span>
        //   </div>
        // );
      })}
      <Button type="primary" onClick={onClick} shape="round">
        {`修改第${index + 1}位用户的姓名`}
      </Button>
    </div>
  );
});
