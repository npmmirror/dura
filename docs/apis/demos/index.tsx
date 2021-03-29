import { ChangeEvent, UIEventHandler, UIEvent } from 'react';
import { Input, Checkbox, DatePicker } from 'antd';
import { user } from './store';
/**
 * debug: true
 */
export default function() {
  user.useMount();

  const state = user.useState();
  const changeName = user.useOnChangeName();

  const setName = user.useChange('name', {
    // transform: 1,
  });

  const setName1 = user.useChange('name');

  return (
    <>
      <Input type="email" onChange={setName} />
      <Checkbox onChange={setName1} />
      <DatePicker format="YYYY-MM-DD" onChange={setName} />
      <input required type="checkbox" onChange={setName1} />
      <h1>{state.name}</h1>
      <Input
        placeholder="请输入用户名"
        onChange={e => {
          changeName(e.target.value, 12);
        }}
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
