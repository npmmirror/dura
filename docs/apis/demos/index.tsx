import React, {
  ChangeEvent,
  UIEventHandler,
  UIEvent,
  ReactHTMLElement,
} from 'react';
import { Input, Checkbox, DatePicker, Button } from 'antd';
import { user } from './store';
import Item from './Item';
import { times } from 'lodash-es';
/**
 * debug: true
 */
export default function () {
  user.useMount();
  const _ = user.useOnChange('address.name');
  const _1 = user.useOnChangeName({
    transform: (e: React.ChangeEvent<HTMLInputElement>) => e.target.value,
  });
  const state = user.useState();

  return (
    <div>
      useOnChange：
      <Input value={state.address.name} placeholder="广播" onChange={_} />
      useOnChangeName：
      <Input value={state.name} placeholder="广播" onChange={_1} />
      <Button>广播</Button>
      {/* {times(10).map((x) => (
        <Item id={++x} />
      ))} */}
    </div>
  );
}
