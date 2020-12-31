import React, { useEffect, useState } from 'react';
import {
  createEventTransform,
  createValueTransform,
  createNoopTransform,
} from '@dura/react';
import { Button, Input, Form } from 'antd';
import {
  UseAsyncActionReturn,
  UseAsyncActionBasicOptions,
  DebounceOptions,
  UseAsyncActionDebounceOptions,
  ThrottleOptions,
  UseAsyncActionThrottleOptions,
  PollingIntervalOptions,
  UseAsyncActionPollingIntervalOptions,
  UseAsyncActionRefreshOnWindowFocusOptions,
} from '@dura/react';

interface AAA<T> {
  (
    options: DebounceOptions | UseAsyncActionBasicOptions<T>,
  ): UseAsyncActionReturn<T>;
  (
    options: ThrottleOptions | UseAsyncActionBasicOptions<T>,
  ): UseAsyncActionReturn<any>;
  (
    options: PollingIntervalOptions | UseAsyncActionBasicOptions<T>,
  ): UseAsyncActionReturn<any>;

  // (options: UseAsyncActionBasicOptions<any>): UseAsyncActionReturn<any>;
  // (): UseAsyncActionReturn<ReducerAction<P_1, M_1>>;
}

const a: AAA<() => void> = null;

a({});

import { useMount, useSliceStore, xx2, asy, xx } from './store';

function App() {
  const state = useSliceStore();

  const [xxAge] = xx2.useAction({
    transform: createNoopTransform(),
  });

  const [changeName] = xx.useAction({
    transform: createEventTransform('name'),
    throttle: {
      wait: 300,
      leading: true,
    },
  });

  const [run, { loading }] = asy.useAsyncAction({
    transform: createValueTransform(),
    loading: {
      // delay: 100,
      key: 1,
    },
  });

  asy.useAsyncAction({
    immediate: {
      transform: () => [{ orderId: 'xx' + Math.random() }, undefined],
    },
    pollingInterval: {
      immediate: true,
    },
  });

  asy.useAsyncAction({});

  const [s] = xx.useAction({
    transform: () => [],
  });

  return (
    <>
      <Input onChange={changeName} width={300} />

      <Button onClick={xxAge}>A</Button>
      <Button
        loading={loading}
        onClick={() => run({ name: 'async' + Math.random() })}
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
