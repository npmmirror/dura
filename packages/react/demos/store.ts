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
  store: reduxStore,
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

const constant = {
  CHANGE_NAME: 'CHANGE_NAME',
  CHANGE_AGE: 'CHANGE_AGE',
  ASYNV_XX: 'ASYNV_XX',
};

export const xx = defineReducer(
  constant.CHANGE_NAME,
  (state, action: Action<{ name: string }, { testMeta: number }>) => {
    console.log('CHANGE_NAME');

    state.name = action.payload.name;
  },
);

export const xx2 = defineReducer(
  constant.CHANGE_AGE,
  (state) => void (state.age = 33 + Math.random()),
);

export const asy = defineAsync(
  constant.ASYNV_XX,
  (name: string) => async (dispatch) => {
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('xx->', name);

    xx.run({ name });
    // console.log('hello async', getState());
    // xx2.run();
  },
);
