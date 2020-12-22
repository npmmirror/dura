import React from 'react';
import { configura } from '../src';
import { AnyAction } from 'redux';
import { Action } from '../src/type';

const createStore = configura();

const store = createStore();

const slice = store.createSlice('xx', { user: { name: 'xx' } });

const changeName = slice.defineReducers(function changeName(
  state,
  action: Action<{ name: string }>,
) {
  state.user.name = 'x';
});

// changeName({ name: 'xx' });

changeName.run({ name: '' });

function App() {
  const c = changeName.use<React.ChangeEvent<HTMLInputElement>>((e) => {
    e.target.value;
  });

  changeName.use('event');
  return (
    <>
      <h1></h1>
      <input
        onChange={(e) => {
          e.target.value;
        }}
      ></input>
    </>
  );
}
