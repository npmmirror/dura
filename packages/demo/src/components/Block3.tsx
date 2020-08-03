import React from 'react';
import { Button } from 'antd';
import { store, defineComponent } from '../store';
import faker from 'faker';

function useBlock3() {
  const onClick = React.useCallback(
    () =>
      store.dispatch({
        type: 'user/onChangeOriName',
      }),
    [],
  );

  const changeShow = React.useCallback(() => {
    store.dispatch({ type: 'user/onChangeIsShow' });
  }, []);

  return { onClick, changeShow };
}

export default defineComponent(function Block3(props) {
  const { users, isShow } = props.store?.user;
  const { onClick, changeShow } = useBlock3();

  return (
    <div
      style={{
        border: '1px solid gray',
        padding: '10px',
        float: 'left',
        width: 400,
      }}
    >
      <h1>我是区块三</h1>
      <h2>我没有使用任何状态</h2>
      {isShow ? (
        <div>
          <span style={{ color: 'red' }}>
            我出现来,我这里取的值与区块二一致
          </span>
          <p>
            <span
              style={{ color: '#333' }}
            >{`${users?.[8]?.id}： ${users?.[8]?.streetAddress}`}</span>
          </p>
        </div>
      ) : null}
      <div>
        <Button type="primary" onClick={changeShow} shape="round">
          显示红字
        </Button>
        <Button type="primary" onClick={onClick} shape="round">
          去修改一个没有任何组件依赖的状态
        </Button>
      </div>
    </div>
  );
});
