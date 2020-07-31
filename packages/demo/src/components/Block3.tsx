import React from 'react';
import { Button, message } from 'antd';
import { store, defineComponent } from '../store';
import faker from 'faker';

function useBlock3() {
  React.useEffect(() => message.info('区块三被渲染'));
  const onClick = React.useCallback(
    () =>
      store.dispatch({
        type: 'user/onChangeOriName',
      }),
    [],
  );
  return { onClick };
}

export default defineComponent((props) => {
  const { users } = props.store?.user;
  const { onClick } = useBlock3();
  return (
    <div
      style={{
        border: '1px solid gray',
        padding: '10px',
        float: 'left',
        width: 300,
      }}
    >
      <h1>我是区块三</h1>
      <h2>我没有使用任何状态</h2>
      <Button type="primary" onClick={onClick}>
        去修改一个没有任何组件依赖的状态
      </Button>
    </div>
  );
});
