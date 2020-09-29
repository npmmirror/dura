import React, { useEffect, useState, useLayoutEffect, memo } from 'react';
import { Button } from 'antd';
import { store } from '../store';

// operator.use();
export default memo(function Block3(props) {
  const {
    user: { users, isShow },
  } = store.useStore();

  const actions = store.useActions();

  const { onClick, changeShow } = useBlock3();

  console.log('block3');

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
        <Button type="primary" onClick={() => false} shape="round">
          A
        </Button>
      </div>
    </div>
  );
});

function useBlock3() {
  const actions = store.useActions();

  const onClick = React.useCallback(() => {
    actions.user.onChangeOriName();
  }, []);

  const changeShow = React.useCallback(() => actions.user.onChangeIsShow(), []);

  return { onClick, changeShow };
}
