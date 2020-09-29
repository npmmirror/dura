import { chain } from 'lodash';
import React, { memo } from 'react';
import { store } from '../store';

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

// export default defineComponent(function Item(props) {
//   const { item } = props;
//   console.log('item', props);
//   return (
//     <div>
//       <span>{item.id}：</span>
//       <span>{item?.name}</span>
//       <span style={{ color: '#999', marginLeft: 20 }}>{item?.city}</span>
//       <span style={{ color: '#333' }}>{`${item?.streetAddress}`}</span>
//     </div>
//   );
// });

export default function Item(props) {
  const state = store.useStore();

  const item = state.user.users.find((n) => n.id === props.id);
  console.log('Item');
  return (
    <div key={item?.id}>
      <span>{item?.id}：</span>
      <span>{item?.name}</span>
      <span style={{ color: '#999', marginLeft: 20 }}>{item?.city}</span>
      <span style={{ color: '#333' }}>{`${item?.streetAddress}`}</span>
    </div>
  );
}

// export default operator
//   .defineStoreName('itemStore')
//   .defineComponent<{ id: number }>((props) => {
//     const {
//       id,
//       itemStore: {
//         user: { users },
//       },
//     } = props;
//     const item = users.find((n) => n.id === id);
//     // console.log('item');
//     return (
//       <div key={item?.id}>
//         <span>{item?.id}：</span>
//         <span>{item?.name}</span>
//         <span style={{ color: '#999', marginLeft: 20 }}>{item?.city}</span>
//         <span style={{ color: '#333' }}>{`${item?.streetAddress}`}</span>
//       </div>
//     );
//   });
