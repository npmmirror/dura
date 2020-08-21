import faker from 'faker';
import { times } from 'lodash';
import { defineStore } from '../util/defineStore';

faker.locale = 'zh_CN';

const users = times(4000).map((n) => ({
  id: n,
  name: `${faker.name.firstName()}${faker.name.lastName()}`,
  city: faker.address.city(),
  streetAddress: faker.address.streetAddress(),
}));

export default defineStore({
  namespace: 'user' as const,
  state: {
    users,
    oriName: 'default',
    isShow: false,
  },
  reducers: {
    onChangeName(state, { payload: { id, name } }) {
      state.users[id].name = name;
    },
    onChangeStreetAddress(state, { payload: { id, streetAddress } }) {
      state.users[id].streetAddress = streetAddress;
    },
    onChangeOriName(state) {
      state.oriName = String(Math.random());
    },
    onChangeIsShow(state) {
      state.isShow = !state.isShow;
    },
  },
  effects: {
    async onAsyncQuery(getState) {
      console.log(getState());
    },
  },
});
