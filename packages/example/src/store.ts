import user from './models/user.model';

import { configura } from '@dura/react';

import { compose } from 'redux';

const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        name: 'dura4.x-draft',
        trace: true,
      })
    : compose;

const createStore = configura({
  compose: composeEnhancers,
});

const store = createStore(user);

export { store };
