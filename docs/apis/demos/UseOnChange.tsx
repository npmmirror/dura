import React from 'react';
import { Input } from 'antd';
import { user } from './store';

export default function useOnChange() {
  const state = user.useState();

  return (
    <div>
      <h1>演示内置的useOnChange功能</h1>
      <Input
        width={300}
        placeholder="演示内置的useOnChange功能"
        onChange={user.useSetter('name')}
        value={state.name}
      />
    </div>
  );
}
