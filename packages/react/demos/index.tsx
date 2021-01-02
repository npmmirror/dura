import React, { useEffect, useState } from 'react';
import {
  createEventTransform,
  createValueTransform,
  createNoopTransform,
} from '@dura/react';
import { Button, Input, Form } from 'antd';
import { Func } from '@dura/react';

// const a: AAA<() => void> = null;

// a({
//   immediate: {},
//   debounce: {},
// });

import { useMount, useState as useSliceStore, xx2, asy, xx } from './store';
function A<T extends Func = undefined>(name: {
  k?: T;
}): T extends undefined ? 1 : 2 {
  return null as any;
}
const res = A({});

function App() {
  const state = useSliceStore();

  const xxAge = xx2.useAction({
    transform: createNoopTransform(),
  });

  const xxAction = xx.useAction({
    transform: createEventTransform('name'),
    performance: {
      action: 'debounce',
      wait: 800,
      leading: false,
    },
  });

  const asyAction = asy.useAsyncAction({
    transform: createValueTransform(),
    immediate: {
      args: [{ orderId: 'xx' + Math.random() }, undefined],
    },
    loading: {
      key: 1,
    },
  });

  // asy.useAsyncAction({
  //   pollingInterval: {
  //     pollingWhenHidden: false,
  //     ms: 1000,
  //     transform: () => [{ orderId: 'xx' + Math.random() }, undefined] as any,
  //   },
  // });

  return (
    <>
      <Input onChange={xxAction.run} width={300} />

      <Button onClick={xxAge.run}>A</Button>
      <Button
        loading={asyAction.loading}
        onClick={() => asyAction.run({ name: 'async' + Math.random() })}
      >
        async
      </Button>
      <h1>xx</h1>
      <h1>name:{state?.name}</h1>
    </>
  );
}

function H() {
  const state = useSliceStore();

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
