import React from 'react';
import { store } from '../store';

export default function () {
  const state = store.useStore();
  const actions = store.useActions();
  return (
    <>
      <h1>{state.user.oriName}</h1>
      <button onClick={actions.user.onChangeName}>xx</button>
    </>
  );
}
