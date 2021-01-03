import { configura, Action } from '@dura/react';
const createStore = configura();

const store = createStore();

export const {
  defineReducer,
  useMount,
  useState,
  defineAsync,
  getState,
} = store.createSlice('xxx', {
  name: 'xx',
  age: 12,
});

export const xx = defineReducer(function (
  state,
  action: Action<{ name: string }>,
) {
  state.name = action.payload.name;
});

export const xx2 = defineReducer(function changeAge(state) {
  state.age = 33 + Math.random();
});

export const asy = defineAsync(async function asyChange(
  action: Action<{ name: string }>,
) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log('asyChange');

  xx.run({ name: action.payload?.name });
  console.log('hello async', getState());
  xx2.run();
});
