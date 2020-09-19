import { defineRollupConfigura } from '@dura/lub';

export default defineRollupConfigura({
  name: 'duraAsync',
  external: ['redux', '@dura/utils', '@dura/async', 'invariant', 'immer'],
});
