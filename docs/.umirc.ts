import { defineConfig } from 'dumi';

export default defineConfig({
  title: 'duraStat',
  description: '为typescript而生基于redux的前端数据流管理方案',
  mode: 'site',
  menus: {
    // 需要自定义侧边菜单的路径，没有配置的路径还是会使用自动生成的配置
    '/guide': [
      {
        title: '指南',
        path: '菜单路由（可选）',
      },
    ],
  },
  // more config: https://d.umijs.org/config
});
