import { ChangeEvent, UIEventHandler, UIEvent } from 'react';
import { Input, Checkbox, DatePicker } from 'antd';
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
  const changeName = user.useOnChangeName({
    id: 1,
    transform: (e: ChangeEvent<HTMLInputElement>) => ({
      newName: e.target.value,
    }),
  });

  const changeName1 = user.useOnChangeName({
    id: 1,
    transform: (e: ChangeEvent<HTMLInputElement>) => ({
      newName: e.target.scrollTop,
    }),
  });

  const setName = user.useSetState('name', {
    id: 1,
    transform: 'html',
  });

  return (
    <>
      <Input type="email" onChange={setName} />
      <Checkbox onChange={setName} />
      <DatePicker
        onChange={(e) => {
          setName(e);
        }}
      />

      <input
        required
        type="text"
        onChange={(e) => {
          console.log(e.target.value);
        }}
      />
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
