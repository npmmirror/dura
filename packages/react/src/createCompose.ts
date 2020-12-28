import { compose } from 'redux';
export const createCompose = (name: string) =>
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        name,
        trace: true,
      })
    : compose;
