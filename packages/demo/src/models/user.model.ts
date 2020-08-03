import faker from 'faker';
import { times } from 'lodash';

faker.locale = 'zh_CN';

const users = times(100).map((n) => ({
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
    onChangeName(state, action) {
      state.users[action.payload.id].name = action.payload.name;
    },
    onChangeStreetAddress(state, action) {
      state.users[action.payload.id].streetAddress =
        action.payload.streetAddress;
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
