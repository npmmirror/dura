import { ChangeEvent } from 'react';
import { Input } from 'antd';
import { user } from './store';
/**
 * debug: true
 */
export default function() {
  user.useMount();
  const changeName = user.onChangeName.use({
    transform: (e: ChangeEvent<HTMLInputElement>) => ({
      newName: e.target.name,
    }),
    performance: {
      action: 'debounce',
    },
  });
  return (
    <>
      <h1>hello</h1>
      <Input placeholder="请输入用户名" onChange={changeName} />
    </>
  );
}
