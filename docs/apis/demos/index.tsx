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
    transform: (e: ChangeEvent<HTMLInputElement>) => {
      console.log(e);

      return {
        newName: e.target.value,
      };
    },
  });

  const setName = user.useChange('name', {
    id: 1,
    transform: 1,
  });

  const setName1 = user.useChange('name', {
    id: 1,
  });

  return (
    <>
      <Input type="email" onChange={setName} />
      <Checkbox onChange={setName1} />
      <DatePicker format="YYYY-MM-DD" onChange={setName} />
      <input required type="checkbox" onChange={setName1} />
      <h1>{state.name}</h1>
      <Input
        placeholder="请输入用户名"
        onChange={changeName}
        value={state.name}
      />
      <div style={{ overflow: 'scroll', height: 300 }}>
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
