import { defineRollupConfigura } from '@dura/lub';

export default defineRollupConfigura({
  name: 'duraCore',
  external: [
    'redux',
    'immer',
    'invariant',
    '@dura/utils',
    '@dura/async',
    '@dura/types',
    '@dura/lub',
  ],
});
