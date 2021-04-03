import React from 'react';
import { Input } from 'antd';
import { user } from './store';

export default function useOnChange() {
  const onChangeName = user.useOnChange('name');
  const state = user.useState();
  return (
    <div>
      <h1>演示内置的useOnChange功能</h1>
      <Input
        width={300}
        placeholder="演示内置的useOnChange功能"
        onChange={onChangeName}
        value={state.name}
      />
    </div>
  );
}
