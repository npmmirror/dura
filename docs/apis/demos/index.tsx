import { ChangeEvent, UIEventHandler, UIEvent } from 'react';
import { Input } from 'antd';
import { user } from './store';
/**
 * debug: true
 */
export default function () {
  user.useMount({
    id: 1,
  });
  const state = user.useState({
    id: 1,
  });
  const changeName = user.onChangeName.use({
    id: 1,
    transform: (e: ChangeEvent<HTMLInputElement>) => ({
      newName: e.target.value,
    }),
  });

  const changeName1 = user.onChangeName.use({
    id: 1,
    transform: (e: ChangeEvent<HTMLInputElement>) => ({
      newName: e.target.scrollTop,
    }),
  });

  return (
    <>
      <h1>{state.name}</h1>
      <Input
        placeholder="请输入用户名"
        onChange={changeName}
        value={state.name}
      />
      <div style={{ overflow: 'scroll', height: 300 }} onScroll={changeName1}>
        <h1>hello</h1>
        <h1>hello</h1>
        <h1>hello</h1>
        <h1>hello</h1>
        <h1>hello</h1>
        <h1>hello</h1>
        <h1>hello</h1>
        <h1>hello</h1>
        <h1>hello</h1>
        <h1>hello</h1>
        <h1>hello</h1>
      </div>
    </>
  );
}
