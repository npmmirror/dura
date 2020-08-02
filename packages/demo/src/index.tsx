import React from 'react';
import { render } from 'react-dom';
import faker from 'faker';
import { Button, Card } from 'antd';
import { store, defineContainer, defineComponent } from './store';
import Block1 from './components/Block1';
import Block2 from './components/Block2';
import Block3 from './components/Block3';

const App = defineContainer(() => {
  console.log('app');
  return (
    <div style={{ margin: '0px auto' }}>
      <Block1 />
      <Block2 />
      <Block3 />
    </div>
  );
});

if (document.querySelector('#app')) {
  render(<App />, document?.querySelector?.('#app'));
}

// interface StoreObject<T> {
//   [name: string]: any;
// }
// interface Store {
//   state: StoreObject<any>;
//   reducers: StoreObject<(state: any, action: any) => void>;
//   effects: StoreObject<() => Promise<void>>;
// }

// function defineStore<S>(store: {
//   state: S;
//   reducers: {
//     [name: string]: (
//       state: S,
//       action: { type: string; payload: any; meta: any; error: any },
//     ) => void;
//   };
//   effects: {
//     [name: string]: () => Promise<void> | void;
//   };
// }): null;

// function defineStore(store) {
//   console.log(store);
//   return null;
// }

// defineStore({
//   state: { name: '' },
//   reducers: {
//     changeName(state, action) {
//       state.name = '';
//     },
//   },
//   effects: {
//     onAsync(state, getState) {},
//   },
//   watches: {},
//   computed: {},
// });
