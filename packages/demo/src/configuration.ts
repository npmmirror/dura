import { createAppCreator } from './util/createApp';
import { compose } from 'redux';

const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        name: 'dura4.x-draft',
        trace: true,
      })
    : compose;

export const createApp = createAppCreator([], [composeEnhancers]);
