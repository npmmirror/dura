import { defineRollupConfigura } from '@dura/lub';

export default defineRollupConfigura({
  name: 'duraReact',
  external: ['react', 'immer', 'redux'],
});
