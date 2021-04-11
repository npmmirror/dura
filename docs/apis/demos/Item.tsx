import React, { FC } from 'react';
import { Input } from 'antd';
import { user } from './store';

export default function Item() {
  const state = user.useState();

  return (
    <div>
      <h1>{state.name}</h1>
      <Input
        placeholder="修改用户姓名"
        onChange={user.useSetter<React.ChangeEventHandler<HTMLInputElement>>(
          'age',
        )}
        value={state.age}
      />
    </div>
  );
}
