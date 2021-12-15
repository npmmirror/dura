import { enablePatches, setAutoFreeze } from 'immer';

setAutoFreeze(false);
enablePatches();

export { configure } from './configure';
export * from './types';
