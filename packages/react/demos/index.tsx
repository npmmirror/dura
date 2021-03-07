import React, { EventHandler, useEffect, useState } from 'react';
import { a } from './test.store';
import { Button, Input } from 'antd';
import { useAsync } from '@dura/react';

export default function () {
  const [state, setState] = useState(false);

  return (
    <div>
      <Button type="primary" onClick={() => setState(!state)}>
        点击
      </Button>
      <h1>hello world</h1>
      {state ? <Children id={1} /> : null}
      {state ? <Children id={2} /> : null}
      {/* <Input onChange={run} /> */}
    </div>
  );
}

function Children(props: { id: number }) {
  a.useMount();

  const state1 = a.useState();

  const [state, setState] = useState(false);
  const f = a.changeName.use({
    transform: (event: React.ChangeEvent<HTMLInputElement>) => ({
      name: event.target.value,
    }),
    // performance: {
    //   action: 'debounce',
    //   wait: 1000,
    // },
  });

  useEffect(() => {
    console.log('f changed');
  }, [f]);

  return (
    <>
      <h1>
        children{props.id}
        {state1?.name}
      </h1>
      <Input onChange={f} />
      <Button
        onClick={() => {
          setState(!state);
          // f({ name: 'zhangsan' });
        }}
      >
        点击
      </Button>
    </>
  );
}
