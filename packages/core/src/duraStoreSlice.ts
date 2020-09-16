import { defineStoreSlice } from './defineStoreSlice';

export default defineStoreSlice({
  namespace: '@@DURA',
  state: {
    REFRESH: 0,
  },
  reducers: {
    UPDATE(state, { payload: { REFRESH } }) {
      state.REFRESH = REFRESH + Math.random();
      return state;
    },
  },
  effects: {},
});
