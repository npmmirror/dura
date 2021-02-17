import { configuration } from '@dura/react';
import { Action } from 'redux';

const create = configuration();

const { createSlice } = create();
interface PayloadMetaAction<P, M> {
  type?: string;
  payload?: P;
  meta?: M;
}
export const a = createSlice({
  namespace: 'user',
  initialState: {
    name: '',
  },
  reducers: {
    changeName(state, action: PayloadMetaAction<{ name: string }, {}>) {
      console.log('changeName');
      state.name = 'xx';

      return state;
    },
    changeAge(state) {},
  },
});
