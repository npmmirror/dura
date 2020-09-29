import faker from 'faker';
import { times } from 'lodash';
import { defineStoreSlice } from '@dura/react';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

faker.locale = 'zh_CN';

const users = times(500).map((n) => ({
  id: n,
  name: `${faker.name.firstName()}${faker.name.lastName()}`,
  city: faker.address.city(),
  streetAddress: faker.address.streetAddress(),
}));

const user = defineStoreSlice({
  namespace: 'user',
  state: {
    users,
    /** 原始姓名 */
    oriName: 'default',
    isShow: false,
    isShowBlock3: true,
  },
  reducers: {
    onToggle(state) {
      state.isShowBlock3 = !state.isShowBlock3;
    },
    /** 更改姓名 */
    onChangeName(state, action) {
      state.users[action.payload.id].name = action.payload?.name;
      return state;
    },
    onChangeStreetAddress(state, action) {
      state.users[action.payload.id].streetAddress =
        action.payload.streetAddress;
    },
    /** xxxx */
    onChangeOriName(state, action) {
      state.oriName = String(Math.random());
      return state;
    },
    onChangeIsShow(state) {
      state.isShow = !state.isShow;
    },
  },
  effects: {
    async onAsyncQuery() {
      console.log('onAsyncQuery-start');

      await delay(2000);
      console.log('onAsyncQuery-end');
      // commit((state) => {
      //   state.loading = true;
      //   state.users[0].address[1].city = '南京';
      // });
    },
  },
});

export default user;
