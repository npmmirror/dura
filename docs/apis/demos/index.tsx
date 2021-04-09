import React, {
  ChangeEvent,
  UIEventHandler,
  UIEvent,
  ReactHTMLElement,
  useEffect,
  useState,
  memo,
} from 'react';
import { Input, Checkbox, DatePicker, Button } from 'antd';
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

  return (
    <div>
      <TextArea onChange={_1} value={state.name} />
      <UseOnChange />
      <UseCustomerChange />
      <Item />
      <Selector />
      <Button onClick={show} />
      {times(10).map((x) => {
        const [state1, setState] = useState(false);
        console.log('item-render');

        useEffect(() => {
          console.log('useEffect');
          return () => {
            console.log('unmount');
          };
        }, []);
        return (
          <div key={++x}>
            <Item />
            <Button
              onClick={() => {
                setState(!state1);
              }}
            >
              click me
            </Button>
          </div>
        );
      })}
    </div>
  );
}
