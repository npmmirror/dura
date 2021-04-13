import React, { useState } from 'react';
import { Button, Switch } from 'antd';
import { SwitchChangeEventHandler } from 'antd/lib/switch';
import { user } from './store';
import UseOnChange from './useOnChange';
import UseCustomerChange from './UseCustomerChange';
import Item from './Item';
import Selector from './Selector';

/**
 * debug: true
 */
export default function () {
  user.useMount();

  return (
    <div>
      <UseOnChange />
      <UseCustomerChange />
      <Item />
      {/* <Selector /> */}
      {/* <Switch
        onChange={user.useSetter<SwitchChangeEventHandler>('visable', {
          transform: 0,
        })}
        onClick={(e, _2) => {
          console.log(e, _2.target);
        }}
      /> */}
    </div>
  );
}
