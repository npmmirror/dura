import { createStore, compose } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { create, FluxAction } from '../../../src';
console.log(window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__']);

const composeEnhancers = (window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] ||
  compose) as typeof compose;

const dura = create();

const store = createStore(state => state, composeEnhancers(dura));

export const user = store.createSlice({
  namespace: 'user',
  initialState: {
    name: '张三',
  },
  reducers: {
    onChangeName(state, action: FluxAction<{ newName: string }>) {
      state.name = action.payload.newName;
    },
  },
});
