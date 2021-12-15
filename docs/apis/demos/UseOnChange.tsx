import React from 'react';
import { Input } from 'antd';
import { user } from './store';

export default function useOnChange() {
  const state = user.useState();
  const s = user.useSetter<never>('name');
  return (
    <div>
      <h1>演示内置的useOnChange功能</h1>
      <Input
        width={300}
        placeholder="演示内置的useOnChange功能"
        onChange={s}
        value={state.name}
      />
    </div>
  );
}
