import { configura } from '@dura/react';
import user from './user.model';

const createStore = configura();

const next = createStore(user as any);

const globalStore = next();

export { next, globalStore };
