import React, { useEffect, useState, useRef } from 'react';
import {
  createEventTransform,
  createValueTransform,
  createNoopTransform,
} from '@dura/react';
import { Button, Input, Form, InputNumber } from 'antd';
import { Func } from '@dura/react';
import { useBindState } from './store';

import { useMount, useState as useSliceStore, xx2, xx, asy } from './store';
function A<T extends Func = undefined>(name: {
  k?: T;
}): T extends undefined ? 1 : 2 {
  return null as any;
}
const res = A({});

function App() {
  const state = useSliceStore();

  // asy.run();
  // asy.use({
  // immediate: {
  //   args: ['xx111'],
  // },
  // pollingInterval: {
  //   args: ['hello' + Math.random()],
  //   ms: 1000,
  // },
  // refreshOnWindowFocus: {
  //   args: ['hello' + Math.random()],
  // },
  // });

  const f = createEventTransform('name');
  // const xxAction = xx.use({
  //   transformArgs: createEventTransform('name'),
  //   immediate: {
  //     payload: { name: 'test' },
  //   },
  //   performance: {
  //     action: 'throttle',
  //     wait: 800,
  //     leading: false,
  //   },
  //   pollingInterval: {
  //     ms: 1000,
  //     payload: { name: 'x' + Math.random() },
  //     meta: {},
  //   },
  // });

  const r = asy.use({
    // transformArgs: () => ['hello' + Math.random()],
    immediate: {
      args: ['hello'],
    },
    performance: {
      action: 'throttle',
      wait: 1000,
    },
    // pollingInterval: {
    //   ms: 1000,
    //   args: ['hello' + Math.random()],
    // },
    // refreshOnWindowFocus: {
    //   args: ['hello' + Math.random()],
    // },
  });

  return (
    <>
      <Button
        onClick={() => {
          document.querySelector('#testss').focus();
        }}
      >
        xxxx
      </Button>
      <div
        id="testss"
        style={{ border: '1px solid gray' }}
        tabIndex={1}
        onFocus={() => {
          console.log('xxx-onFocus');
        }}
      >
        <Button onClick={() => r('xx')}>xxx</Button>
        {/* <Input {...options('user.name')} style={{ width: 300 }} /> */}
        {/* <Input onChange={xxAction.run} style={{ width: 300 }} /> */}

        {/* <Button onClick={xxAge.run}>A</Button> */}
        {/* <Button
        loading={asyAction.loading}
        onClick={() => asyAction.run({ name: 'async' + Math.random() })}
      >
        async
      </Button> */}
        <h1>xx</h1>
        <h1>name:{state?.name}</h1>
        <h1>{state.user.name}</h1>
      </div>
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

export default function () {
  useMount();

  const [state, updateState] = useState(1);
  // const { run, loading } = asy.useAction({
  //   transform: () => ['xx'],
  //   immediate: {},
  //   loading: {
  //     key: 'xxp',
  //   },
  // });

  return (
    <>
      <div style={{ width: 300, height: 300, border: '1px solid gray' }}>
        <Button type="primary" onClick={() => updateState(state === 0 ? 1 : 0)}>
          xx
        </Button>
      </div>
      {/* <Button loading={loading} onClick={() => run('xx')}>
        llllll
      </Button> */}
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
