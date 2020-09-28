import { defineStoreSlice, Action } from '@dura/react';
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
    async onAsyncQuery(action: Action<{ name: string }>) {},
  },
});

export default user;
