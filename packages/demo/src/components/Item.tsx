import { chain } from 'lodash';
import React from 'react';
import { defineComponent, store } from '../store';

// export default React.memo((props) => {
//   const { item } = props;
//   console.log('item');
//   return (
//     <div key={item?.id}>
//       <span>{item.id}：</span>
//       <span>{item?.name}</span>
//       <span style={{ color: '#999', marginLeft: 20 }}>{item?.city}</span>
//     </div>
//   );
// });

export default defineComponent(function Item(props) {
  const { item } = props;
  // console.log('item', props);
  return (
    <div>
      <span>{item.id}：</span>
      <span>{item?.name}</span>
      <span style={{ color: '#999', marginLeft: 20 }}>{item?.city}</span>
      <span style={{ color: '#333' }}>{`${item?.streetAddress}`}</span>
    </div>
  );
});

// export default defineComponent((props) => {
//   const {
//     id,
//     store: {
//       user: { users },
//     },
//   } = props;
//   const item = users.find((n) => n.id === id);
//   console.log('item');
//   return (
//     <div key={item?.id}>
//       <span>{item.id}：</span>
//       <span>{item?.name}</span>
//       <span style={{ color: '#999', marginLeft: 20 }}>{item?.city}</span>
//     </div>
//   );
// });
