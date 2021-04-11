import { Input } from 'antd';
import { user } from './store';

export default function Selector() {
  const state = user.useState(false);
  console.log('Selector');

  return (
    <>
      <h1>演示 selector </h1>
      <Input value={state.address.name} />
    </>
  );
}
