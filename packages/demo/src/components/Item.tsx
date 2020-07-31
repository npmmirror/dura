import React from 'react';
import { defineComponent, store } from '../store';

export default defineComponent((props) => {
  const { item } = props;
  console.log('item');
  return (
    <div key={item?.id}>
      <span>{item.id}：</span>
      <span>{item?.name}</span>
      <span style={{ color: '#999', marginLeft: 20 }}>{item?.city}</span>
    </div>
  );
});
