import { ChangeEvent, UIEventHandler, UIEvent } from 'react';
import { Input, Checkbox, DatePicker, Button } from 'antd';
import { user } from './store';
import Item from './Item';
import { times } from 'lodash-es';
/**
 * debug: true
 */
export default function () {
  const _ = user.useChange('name', {
    broadcasting: true,
  });
  return (
    <div>
      <Input placeholder="广播" onChange={_} />
      <Button>广播</Button>
      {times(10).map((x) => (
        <Item id={++x} />
      ))}
    </div>
  );
}
