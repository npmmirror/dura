import React, { memo } from 'react';
import { store } from '../store';
import { Button, message } from 'antd';
import Item from './Item';
import { useVirtualList } from '@umijs/hooks';

const index = 2;
function useBlock1() {
  const actions = store.useActions();
  const onClick = React.useCallback(() => {
    actions.user.onChangeName({ id: index, name: 'xx' + Math.random() });
  }, []);
  return { onClick, index };
}

export default memo(function Block1(props) {
  const { onClick, index } = useBlock1();

  const users = store.useStore().user.users;

  const actions = store.useActions();

  const { list, containerProps, wrapperProps, scrollTo } = useVirtualList(
    users,
    { overscan: 100, itemHeight: 10 },
  );
  console.log('block1');

  return (
    <div
      id="ss"
      style={{
        border: '1px solid gray',
        padding: '10px',
        float: 'left',
        width: 500,
      }}
    >
      <h1>我是区块一</h1>
      <Button type="primary" onClick={onClick} shape="round">
        {`修改第${index + 1}位用户的姓名`}
      </Button>
      <Button
        type="primary"
        onClick={() => {
          actions.user.onToggle();
        }}
        shape="round"
      >
        切换block3
      </Button>
      <input
        id="test"
        onKeyDown={(e) => {
          console.log('onKeyDown', e);
        }}
        onEnded={() => {
          console.log('onEnded');
        }}
      />
      <div {...containerProps} style={{ height: '300px', overflow: 'auto' }}>
        <div {...wrapperProps}>
          {list.map((item: any) => {
            return <Item id={item.data.id} key={item.data.id} />;
            // return <Item item={item} key={item.id} />;
            // return (
            //   <div key={item?.id}>
            //     <span>{item.id}：</span>
            //     <span>{item?.name}</span>
            //     <span style={{ color: '#999', marginLeft: 20 }}>{item?.city}</span>
            //     <span style={{ color: '#333' }}>{`${item?.streetAddress}`}</span>
            //   </div>
            // );
          })}
        </div>
      </div>
    </div>
  );
});
