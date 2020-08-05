import faker from 'faker';
import { times } from 'lodash';

faker.locale = 'zh_CN';

const users = times(10).map((n) => ({
  id: n,
  name: `${faker.name.firstName()}${faker.name.lastName()}`,
  city: faker.address.city(),
  streetAddress: faker.address.streetAddress(),
}));

export default {
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
      state.oriName = Math.random();
    },
    onChangeIsShow(state) {
      state.isShow = !state.isShow;
    },
  },
  effects: {
    onAsyncQuery(getState) {
      console.log(getState());
    },
  },
};
