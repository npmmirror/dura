import React, { FC } from 'react';
import { Input } from 'antd';
import { user } from './store';

export default function Item(props: { id: number }) {
  const { useMount, useState, useOnChange } = user.id(props.id);
  console.log(props);

  useMount();
  const onChangeName = useOnChange('name');

  const state = useState();

  return (
    <div>
      <h1>{state.name}</h1>
      <Input
        placeholder="修改用户姓名"
        onChange={onChangeName}
        value={state.name}
      />
    </div>
  );
}
