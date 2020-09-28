import { defineStoreSlice, Action } from '@dura/react';
import { globalStore } from './store';

const deloy = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const user = defineStoreSlice({
  namespace: 'user',
  state: {
    /** 姓名 */
    name: '张三',
  },
  reducers: {
    onChangeName(state, action: Action<{ name: string }>) {
      state.name = action.payload.name;
    },
  },
  effects: {
    async onAsyncQuery(action: Action<{ name: string }>) {
      await deloy(500);
      globalStore.actions.user.onChangeName({ ...action.payload });
    },
  },
});

export default user;
