import React from 'react';
import { Input, Button } from 'antd';
import { user } from './store';

export default function useOnChange() {
  const onChangeName = user.useOnChangeName({
    transform: (e: React.ChangeEvent<HTMLInputElement>) => [e.target.value, 12],
  });
  const state = user.useState();
  return (
    <div>
      <h1>演示自定义reducer 使用 transform</h1>
      <Input
        width={300}
        placeholder="演示自定义reducer 使用 transform"
        onChange={onChangeName}
        value={state.name}
      />
      <Button
        type="primary"
        onClick={() => {
          user.onChangeName('按钮点击修改', 22);
        }}
      >
        点击我直接调用
      </Button>
    </div>
  );
}
