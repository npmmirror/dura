import React from 'react';
import { InputNumber, InputNumberProps } from 'antd';
import { user } from './store';

export default function useOnChange() {
  const onChangeName = user.useOnChangeAge<
    Pick<InputNumberProps, 'onChange'>['onChange']
  >();
  const state = user.useState();
  return (
    <div>
      <h1>演示自定义reducer 使用 transform</h1>

      <InputNumber
        width={300}
        placeholder="演示自定义reducer 使用 transform"
        onChange={onChangeName}
        value={state.age}
      />
    </div>
  );
}
