import React, { useState } from 'react';
import { createEventTransform, createNoopTransform } from '@dura/react';
import { Button, Input } from 'antd';

import { useMount, useSliceStore, xx2, asy, xx } from './store';

function App() {
  const state = useSliceStore();

  const xxAge = xx2.useAction({
    // transform: createNoopTransform(),
  });

  const changeName = xx.useAction({
    transform: createEventTransform('name'),
  });

  // xx2.useAction({
  //   transform: {},
  //   loading: false,
  //   immediate: {
  //     args: [],
  //   },
  // });

  return (
    <>
      <Input onChange={changeName} width={300} />
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
const randomString = () =>
  Math.random().toString(36).substring(7).split('').join('.');
export default function () {
  useMount();
  const [state, updateState] = useState(0);
  const set = new Set();
  for (let index = 0; index < 10000; index++) {
    set.add(randomString() + '.' + randomString());
  }
  console.log(set.size);

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
