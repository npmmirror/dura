import React, { useState, useEffect, useLayoutEffect } from 'react';
import { render } from 'react-dom';
import { Button } from 'antd';
import Block1 from './components/Block1';
import Block2 from './components/Block2';
import Block3 from './components/Block3';
import { store } from './store';

const App = () => {
  const state = store.useStore();
  return (
    <div style={{ margin: '0px auto', height: 550, border: '1px solid gray' }}>
      {/* <Block1 /> */}
      <Block2 />
      {/* {state.user.isShowBlock3 ? <Block3 /> : null} */}
      {/* <Block3 /> */}
    </div>
  );
};

if (document.querySelector('#app')) {
  render(<App />, document?.querySelector?.('#app'));
}
