import { produce } from 'immer';
export function createImmerReducer(options) {
  const { initialState = {}, reducers = {} } = options;
  return function (state = initialState, action) {
    const [, $name] = action.type.split('/');
    return produce(state, (draft) => {
      reducers[$name]?.(draft as any, action);
    });
  };
}
