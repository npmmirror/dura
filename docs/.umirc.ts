import { defineConfig } from 'dumi';

export default defineConfig({
  title: 'duraStat',
  description: '为typescript而生基于redux的前端数据流管理方案',
  mode: 'site',
  menus: {
    // 需要自定义侧边菜单的路径，没有配置的路径还是会使用自动生成的配置
    '/guide': [
      {
        title: '菜单项',
        path: '菜单路由（可选）',
        children: [
          // 菜单子项（可选）
          'guide/index.md', // 对应的 Markdown 文件，路径是相对于 resolve.includes 目录识别的
        ],
      },
    ],
  // more config: https://d.umijs.org/config
});
