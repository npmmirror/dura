import { defineConfig, utils } from 'dumi';

export default defineConfig({
  title: 'dura',
  // base: '/dura/',
  // publicPath: '/dura/',

  favicon: 'https://dura.oss-cn-hangzhou.aliyuncs.com/logo.png',
  logo: 'https://dura.oss-cn-hangzhou.aliyuncs.com/logo.png',
  outputPath: 'docs-dist',
  mode: 'site',
  locales: [
    ['en-US', 'English'],
    ['zh-CN', '中文'],
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
