import { configura, Action } from '@dura/react';
const createStore = configura();

const store = createStore();

export const {
  defineReducer,
  useMount,
  useState,
  useBindState,
  defineAsync,
  getState,
} = store.createSlice<{
  name: string | undefined;
  age: number | undefined;
  user: {
    name: string | undefined;
  };
}>('xxx', {
  name: 'xx',
  age: 12,
  user: {
    name: 'xx',
  },
  // users: [],
});

export const xx = defineReducer(
  'changeName',
  (state, action: Action<{ name: string }>) => {
    state.name = action.payload.name;
  },
);

export const xx2 = defineReducer(
  'changeAge',
  (state) => void (state.age = 33 + Math.random()),
);

export const asy = defineAsync(
  'asyncChange',
  async (action: Action<{ name?: string }>) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    xx.run({ name: action.payload?.name });
    console.log('hello async', getState());
    xx2.run();
  },
);
