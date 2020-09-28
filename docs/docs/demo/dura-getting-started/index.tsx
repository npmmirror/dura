import React, { useState, useEffect, useLayoutEffect } from 'react';
import { render } from 'react-dom';
import { Button } from 'antd';
import { next, globalStore } from './store';

const App = () => {
  const state = globalStore.useStore();
  return (
    <>
      <h1>{state}</h1>
    </>
  );
};

if (document.querySelector('#app')) {
  render(<App />, document?.querySelector?.('#app'));
}
