import { defineConfig, utils } from 'dumi';

const version = require('./lerna.json')['version'];

export default defineConfig({
  title: `duraStat ${version}`,
  favicon: 'https://dura.oss-cn-hangzhou.aliyuncs.com/logo.png',
  logo: 'https://dura.oss-cn-hangzhou.aliyuncs.com/logo.png',
  outputPath: 'docs-dist',
  mode: 'site',
  resolve: {
    includes: ['docs', 'packages'],
  },
  dynamicImport: {
    loading: '@/Loading',
  },
  extraBabelPlugins: [
    [
      'babel-plugin-import',
      {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
      },
      'antd',
    ],
  ],
  locales: [
    ['zh-CN', '中文'],
    ['en-US', 'English'],
  ],
  // 多语言配置方式如下
  navs: {
    // 多语言 key 值需与 locales 配置中的 key 一致
    'en-US': [
      null, // null 值代表保留约定式生成的导航，只做增量配置
      {
        title: 'Demo',
        path: 'https://codesandbox.io/s/dura4x-bcme2?file=/src/App.tsx',
      },
      {
        title: 'GitHub',
        path: 'https://github.com/ityuany/dura',
      },
    ],
    'zh-CN': [
      null, // null 值代表保留约定式生成的导航，只做增量配置
      {
        title: '示例',
        path: 'https://codesandbox.io/s/dura4x-bcme2?file=/src/App.tsx',
      },
      {
        title: 'GitHub',
        path: 'https://github.com/ityuany/dura',
      },
    ],
  },
  // more config: https://d.umijs.org/config
  // plugins: ['@umijs/plugin-antd'],
});
