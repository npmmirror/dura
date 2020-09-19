import { defineRollupConfigura } from '@dura/lub';

export default defineRollupConfigura({
  name: 'duraUtils',
  external: ['lodash.isplainobject'],
  globals: {
    isPlainObject: 'lodash.isplainobject',
  },
});
