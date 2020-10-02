import { defineRollupConfigura } from '@dura/lub';

export default defineRollupConfigura({
  name: 'duraReact',
  globals: {
    isPlainObject: 'lodash.isplainobject',
  },
  external: ['react', 'immer', 'redux'],
});
