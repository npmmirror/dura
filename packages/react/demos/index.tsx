import React, { useState } from 'react';
import { configura } from '@dura/react';
import { Button } from 'antd';
import { AnyAction } from 'redux';

const createStore = configura();

const store = createStore();

const {
  defineReducers,
  useMount,
  useSliceStore,
  defineSideEffect,
  getState,
} = store.createSlice('xxx', {
  name: 'xx',
  age: 12,
});

const xx = defineReducers(function xx(state, action) {
  state.name = action.name;
});

const xx2 = defineReducers(function xx2(state, action) {
  state.age = 33 + Math.random();
});

const asy = defineSideEffect(async function asy() {
  xx({ name: 'xx' });
  console.log('hello async', getState());
  xx2();
});

function App() {
  useMount();
  const state = useSliceStore();
  console.log('App');
  return (
    <>
      <h1>{state?.name}</h1>
      <Button onClick={() => asy()}>async</Button>
      <Button onClick={() => xx2()}>ppp</Button>
      <Button onClick={() => xx({ name: `xx${Math.random()}` })}>A</Button>
    </>
  );
}

function H() {
  const state = useSliceStore();
  console.log('HH');

  return (
    <>
      <h1>{state.age}</h1>
    </>
  );
}

export default function() {
  const [state, updateState] = useState(0);
  return (
    <>
      <Button type="primary" onClick={() => updateState(!state)}>
        xx
      </Button>
      {state ? (
        <>
          <App />
          <App />
          <App />
          <H />
        </>
      ) : null}
      <h1>hello</h1>
    </>
  );
}
