---
title: 介绍
nav:
  order: 1
  title: 指南
---

# 什么是 dura ?

dura，我将它称之为 **嘟啦**，这是一个以 [redux](https://redux.js.org/) 为基石，使用 [typescript](https://www.typescriptlang.org/) 进行开发构建的，将 **90%** 常规业务场景的状态管理简单化的状态机。

dura 诞生于一个纯前端业务代码行数达到 **百万级** 的庞大项目。

自 dura 诞生以来，截止你看到这篇文档时一共发行了 4 个大版本，dura1.x-dura3.x 我一直致力于提供完善的**类型推导**。而 dura4.x，将是一次勇敢的尝试，我试图基于 redux 去实现一套**依赖收集**，从而避免繁琐的**connect**行为，让 dura 更加的智慧。

# 下一代 dura 开发计划（dura4）

- 😺 更加友好的 ts 类型推导
- 😁 完善的依赖收集
- 🚀 完善的 hooks api 支持
- 📱 状态机 watch 机制
- 💻 状态机 computed 机制
- 🧱 对微前端更加友好的支持
- 👬 多 store 的友好支持
- 😮 auto-loaing 全新的设计机制（支持针对同一个 effect 按照不同的 key 来区分 loading 状态 ）
- 🚗 状态机内置可动态配置化的 节流 和 防抖
- 🍳 友善的 bind 机制（类 vue 双向数据绑定）
- 🔧 鲁班 统一打包、测试逻辑
