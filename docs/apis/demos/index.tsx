import React, {
  ChangeEvent,
  UIEventHandler,
  UIEvent,
  ReactHTMLElement,
} from 'react';
import { Input, Checkbox, DatePicker, Button } from 'antd';
import { user } from './store';
import UseOnChange from './useOnChange';
import UseCustomerChange from './UseCustomerChange';
import Item from './Item';
import Selector from './Selector';
const { TextArea } = Input;

/**
 * debug: true
 */
export default function () {
  user.useMount();

  const _1 = user.useOnChangeName({
    transform: (e: React.ChangeEvent<HTMLInputElement>) => e.target.value,
  });
  const state = user.useState();

  return (
    <div>
      <TextArea
        onChange={(e) => {
          console.log(e.target.value);

          console.log(e.target.type);
        }}
      />
      <UseOnChange />
      <UseCustomerChange />
      <Item />
      <Selector />
      {/* {times(10).map((x) => (
        <Item id={++x} />
      ))} */}
    </div>
  );
}
