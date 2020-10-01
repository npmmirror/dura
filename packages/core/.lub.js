import { defineRollupConfigura } from '@dura/lub';

export default defineRollupConfigura({
  name: 'duraCore',
  external: [
    'redux',
    'immer',
    '@dura/utils',
    '@dura/async',
    '@dura/types',
    '@dura/lub',
  ],
});
