import { configura } from '@dura/react';
import user from './user.model';

const createStore = configura();

const store = createStore(user);

export { store };
