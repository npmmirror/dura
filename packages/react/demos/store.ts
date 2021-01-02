import { configura, Action } from '@dura/react';
const createStore = configura();

const store = createStore();

export const {
  defineReducers,
  useMount,
  useState,
  defineSideEffect,
  getState,
} = store.createSlice('xxx', {
  name: 'xx',
  age: 12,
});

export const xx = defineReducers(function (
  state,
  action: Action<{ name: string }>,
) {
  state.name = action.payload.name;
});

export const xx2 = defineReducers(function changeAge(state) {
  state.age = 33 + Math.random();
});

export const asy = defineSideEffect(async function asyChange(
  action: Action<{ name: string }>,
) {
  await new Promise((resolve, reject) => setTimeout(resolve, 1000));
  console.log('asyChange');

  xx.run({ name: action.payload.name });
  console.log('hello async', getState());
  xx2.run();
});
