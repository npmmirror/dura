import React from 'react';
import { render } from 'react-dom';
import produce, { enablePatches, setAutoFreeze } from 'immer';
import u from './models/user.model';
import { useVirtualList } from '@umijs/hooks';
import { createAppCreator } from './util/createApp';
import faker from 'faker';
import { Button, message } from 'antd';
import { composeWithDevTools } from 'redux-devtools-extension';

faker.locale = 'zh_CN';

setAutoFreeze(false);
enablePatches();

const createApp = createAppCreator();

const app = createApp();

app.use(u);
const { defineContainer, defineComponent, store } = app.run();

// const S = defineComponent(props => {

//   const { users} = props.store.user
//   const u = users.find(n => n.id === props?.id)
//   return (
//     <div key={u?.id}>
//       <span>{u?.name}</span>
//       <span style={{color:"#999",marginLeft:20}}>{u?.city}</span>
//     </div>
//   )
// })

const S = defineComponent((props) => {
  return (
    <div key={props?.item?.id}>
      <span>{props?.item?.name}</span>
      <span style={{ color: '#999', marginLeft: 20 }}>{props?.item?.city}</span>
    </div>
  );
});

const Block1 = defineComponent((props) => {
  React.useEffect(() => message.info('区块一被渲染'));

  const { users } = props.store.user;

  const index = 19;

  const onClick = React.useCallback(() => {
    store.dispatch({
      type: 'user/onChangeName',
      payload: {
        id: index,
        name: 'xx' + Math.random(),
      },
    });
  }, []);

  return (
    <div
      style={{
        border: '1px solid gray',
        padding: '10px',
        float: 'left',
        width: 300,
      }}
    >
      <h1>我是区块一</h1>
      {users.map((n: any) => {
        // return (<S item={n} key={n.id} />)
        return (
          <div key={n?.id}>
            <span>{n.id}：</span>
            <span>{n?.name}</span>
            <span style={{ color: '#999', marginLeft: 20 }}>{n?.city}</span>
          </div>
        );
      })}
      <Button type="primary" onClick={onClick}>
        {`修改第${index + 1}位用户的姓名`}
      </Button>
    </div>
  );
});

const Block2 = defineComponent((props) => {
  console.log('我是区块二');

  React.useEffect(() => message.info('区块二被渲染'));
  const index = 18;
  const onClick = React.useCallback(() => {
    store.dispatch({
      type: 'user/onChangeStreetAddress',
      payload: {
        id: index,
        streetAddress: faker.address.streetAddress(),
      },
    });
  }, []);
  const { users } = props.store?.user;
  return (
    <div
      style={{
        border: '1px solid gray',
        padding: '10px',
        float: 'left',
        width: 300,
      }}
    >
      <h1>我是区块二</h1>

      <h2>{`${users?.[18]?.id}： ${users?.[18]?.streetAddress}`}</h2>
      <Button type="primary" onClick={onClick}>
        修改streetAddress
      </Button>
    </div>
  );
});

const Block3 = defineComponent((props) => {
  React.useEffect(() => message.info('区块三被渲染'));
  const { users } = props.store?.user;
  const onClick = React.useCallback(() =>
    store.dispatch({
      type: 'user/onChangeOriName',
    }),
  );
  return (
    <div
      style={{
        border: '1px solid gray',
        padding: '10px',
        float: 'left',
        width: 300,
      }}
    >
      <h1>我是区块三</h1>
      <h2>我没有使用任何状态</h2>
      <Button type="primary" onClick={onClick}>
        去修改一个没有任何组件依赖的状态
      </Button>
    </div>
  );
});

const App = defineContainer(() => {
  console.log('app');
  return (
    <div>
      <Block1 />
      <Block2 />
      <Block3 />
    </div>
  );
});

if (document.querySelector('#app')) {
  render(<App />, document?.querySelector?.('#app'));
}
