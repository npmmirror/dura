import React, { useState } from 'react';
import {
  configura,
  Action,
  createEventTransform,
  createNoopTransform,
} from '@dura/react';
import { Button, Input } from 'antd';

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

const xx = defineReducers(function xx(state, action: Action<{ name: string }>) {
  state.name = action.payload.name;
});

const xx2 = defineReducers(function xx2(state) {
  state.age = 33 + Math.random();
});

const asy = defineSideEffect(async function asy(
  action: Action<{ name: string }>,
) {
  console.log(action.payload);

  xx.run({ name: action.payload.name });
  console.log('hello async', getState());
  xx2.run();
});

function App() {
  useMount();
  const state = useSliceStore();

  const xxAge = xx2.useAction(createNoopTransform());

  const changeName = xx.useAction(createEventTransform('name'));

  return (
    <>
      <Input onChange={changeName} />

      <Button onClick={xxAge}>A</Button>
      <Button onClick={() => asy.run({ name: 'async' })}>async</Button>
      <h1>xx</h1>
      <h1>name:{state?.name}</h1>
    </>
  );
}

function H() {
  const state = useSliceStore();
  console.log('HH');

  return (
    <>
      <h1>age:{state.age}</h1>
    </>
  );
}

export default function () {
  const [state, updateState] = useState(0);
  return (
    <>
      <Button type="primary" onClick={() => updateState(state === 0 ? 1 : 0)}>
        xx
      </Button>
      {state ? (
        <>
          <App />
          <H />
        </>
      ) : null}
      <h1>hello</h1>
    </>
  );
}
