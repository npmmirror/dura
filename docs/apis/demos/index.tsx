import React, { useEffect, useState } from 'react';
import { Button, Switch, Input } from 'antd';
import { SwitchChangeEventHandler } from 'antd/lib/switch';
import { user } from './store';
import UseOnChange from './useOnChange';
import UseCustomerChange from './UseCustomerChange';
import Item from './Item';
import Selector from './Selector';
import { hello as helloStore } from './store';

/**
 * debug: true
 */
export default function () {
  helloStore.useMount();
  const state = helloStore.useState();

  state.user.name;
  // user.useMount();

  const use = helloStore.useOnChangeName({
    transform: (e) => [e.target.value],
  });

  return (
    <div>
      <Input onChange={use} />
      {/* <UseOnChange />
      <UseCustomerChange />
      <Item /> */}
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
