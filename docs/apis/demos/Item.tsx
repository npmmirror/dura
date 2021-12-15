import React, { FC } from 'react';
import { Input } from 'antd';
import { user } from './store';

export default function Item() {
  const state = user.useState();
  const nameSetter = user.useSetter<React.ChangeEventHandler<HTMLInputElement>>(
    'name',
  );

  return (
    <div>
      <h1>{state.name}</h1>
      <Input
        placeholder="修改用户姓名"
        onChange={nameSetter}
        value={state.name}
      />
    </div>
  );
}
