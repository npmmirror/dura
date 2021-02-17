import React from 'react';
import { a } from './test.store';
import { Button } from 'antd';
export default function () {
  a.useMount();
  const { run } = a.changeName.use({
    // transformArgs: () => ({}),
    immediate: {},
    performance: {
      action: 'throttle',
      wait: 1000,
    },
  });

  a.changeName.run({ payload: { name: 'x' }, meta: {} });
  return (
    <div>
      <h1>hello world</h1>
      <Button onClick={() => run(1, 2)}>点击</Button>
      <Button
        onClick={() =>
          a.$commit((state) => {
            state.name = 'xxx';
          })
        }
      >
        commit
      </Button>
    </div>
  );
}
