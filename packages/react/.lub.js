export default {
  name: 'duraReact',
  globals: {
    isPlainObject: 'lodash.isplainobject',
  },
  external: ['lodash.isplainobject', 'react', '@dura/core', '@dura/utils'],
};
