import React, {
  ChangeEvent,
  UIEventHandler,
  UIEvent,
  ReactHTMLElement,
  useEffect,
  useState,
  memo,
} from 'react';
import { Input, Checkbox, Button, Switch } from 'antd';
import { SwitchChangeEventHandler } from 'antd/lib/switch';
import { user } from './store';
import UseOnChange from './useOnChange';
import UseCustomerChange from './UseCustomerChange';
import Item from './Item';
import Selector from './Selector';
import { times } from 'lodash-es';

const { TextArea } = Input;

/**
 * debug: true
 */
export default function () {
  user.useMount();

  const _1 = user.useOnChangeName({
    transform: (e: React.ChangeEvent<HTMLTextAreaElement>) => e.target.value,
  });
  const state = user.useState();

  const show = user.useOnShow({});
  console.log('main render');
  const [count, setCount] = useState(5);

  return (
    <div>
      {/* <TextArea onChange={_1} value={state.name} /> */}
      <UseOnChange />
      <UseCustomerChange />
      <Item />
      <Selector />
      <Switch
        onChange={user.useSetter<SwitchChangeEventHandler>('visable', {
          transform: 0,
        })}
        onClick={(e, _2) => {
          console.log(e, _2.target);
        }}
      />
      <Button
        onClick={(e) => {
          setCount(10);
        }}
      >
        改变数量
      </Button>
    </div>
  );
}
