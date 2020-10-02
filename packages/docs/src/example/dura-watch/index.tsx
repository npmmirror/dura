import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Button } from 'antd';
import { store } from './store';
let index = 0;
const App = () => {
  const state = store.useStore([]);

  const actions = store.actions;
  const onClick = React.useCallback(() => {
    actions.user.onChangeName({ name: `张三${++index}` });
  }, []);
  console.log(state);

  return (
    <>
      <h1>姓名：{state.user.name}</h1>
      <Button type="primary" onClick={onClick}>
        修改
      </Button>
      <div>
        <h1>这里是dom操作的区域</h1>
        <span id="test" style={{ color: 'red', fontSize: 16 }}></span>
      </div>
    </>
  );
};

export default App;
