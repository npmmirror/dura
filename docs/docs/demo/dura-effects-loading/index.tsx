/**
 * title: effect 功能演示
 * desc: 这里展示的是effect相关功能演示
 */

import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Button } from 'antd';
import { next, globalStore } from './store';

const App = () => {
  const state = globalStore.useStore();
  const actions = globalStore.actions;
  const onClick = React.useCallback(() => {
    actions.user.onAsyncQuery(
      { name: `张三${Math.random()}` },
      { loading: true },
    );
  }, []);
  return (
    <>
      <h1>姓名：{state.user.name}</h1>
      <Button
        type="primary"
        loading={state['DURA'].LOADING.user.onAsyncQuery}
        onClick={onClick}
      >
        修改
      </Button>
    </>
  );
};

export default App;
