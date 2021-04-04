import { Input } from 'antd';
import { user } from './store';

export default function Selector() {
  const state = user.useSelector((state) => ({
    name: state.name,
  }));

  return (
    <>
      <h1>演示 selector</h1>
      <Input value={state.name} />
    </>
  );
}
