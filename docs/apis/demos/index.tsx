import { ChangeEvent, UIEventHandler, UIEvent } from 'react';
import { Input } from 'antd';
import { user } from './store';
/**
 * debug: true
 */
export default function() {
  user.useMount({
    id: 1,
  });
  const state = user.useState({
    id: 1,
  });
  const changeName = user.onChangeName.use({
    // transform: (e: ChangeEvent<HTMLInputElement>) => ({
    //   newName: e.target.name,
    // }),
  });
  return (
    <>
      <h1>{state.name}</h1>
      <div
        style={{ overflow: 'scroll', height: 300 }}
        onScroll={(e: UIEvent<HTMLDivElement, ChangeEvent>) => {
          console.log(e.target.scrollTop);
          changeName({ newName: e.target.scrollTop });
        }}
      >
        {/* <Input placeholder="请输入用户名" onChange={changeName} /> */}
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
