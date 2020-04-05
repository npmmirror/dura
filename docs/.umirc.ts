import { defineConfig } from 'dumi';

export default defineConfig({
  title: 'dura',
  description: '为typescript而生基于redux的前端数据流管理方案',
  mode: 'site',
  logo: 'https://dura.oss-cn-hangzhou.aliyuncs.com/redux.png',
  favicon: 'https://dura.oss-cn-hangzhou.aliyuncs.com/redux.png',
  navs: [
    null, // null 值代表保留约定式生成的导航，只做增量配置
    {
      title: 'GitHub',
      path: 'https://github.com/ityuany/dura',
    },
  ],
});
