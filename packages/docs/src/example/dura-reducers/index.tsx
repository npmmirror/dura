import React, { useState, useEffect, useLayoutEffect } from 'react';
import { render } from 'react-dom';
import { Button } from 'antd';
import { store } from './store';

type a = {};

const App = () => {
  const state = store.useStore();
  const actions = store.actions;
  const onClick = React.useCallback(() => {
    actions.user.onChangeName({ name: `张三${Math.random()}` });
  }, []);
  return (
    <>
      <h1>姓名：{state.user.name}</h1>
      <Button type="primary" onClick={onClick}>
        修改
      </Button>
    </>
  );
};

export default App;
