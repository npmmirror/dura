---
title: 介绍
nav:
  order: 1
  title: 指南
group:
  title: 介绍
  order: 1
---

# 什么是 dura ?

dura，我将它称之为 **嘟啦**，这是一个以 [redux](https://redux.js.org/) 为基石，使用 [typescript](https://www.typescriptlang.org/) 进行开发构建的，将 **90%** 常规业务场景的状态管理简单化的状态机。

dura 诞生于一个纯前端业务代码行数达到 **百万级** 的庞大项目。

自 dura 诞生以来，截止你看到这篇文档时一共发行了 4 个大版本，dura1.x-dura3.x 我一直致力于提供完善的**类型推导**。而 dura4.x，将是一次勇敢的尝试，我试图基于 redux 去实现一套**依赖收集**，从而避免繁琐的**connect**行为，让 dura 更加的智慧。

# 特性

- 🚀 ✅ 完善友好的 [**typescript**](https://www.typescriptlang.org/) 类型推导。
- 💥 ✅ 依赖收集、从此告别 [**mapStateToProps**](https://react-redux.js.org/api/connect)，早点下班。
- 🔨 ✅ 完善的 [**hooks api**](https://reactjs.org/docs/hooks-intro.html) 支持。
- 🗳️ ✅ 对 [**微前端**](https://micro-frontends.org/) 友好。
- 👬 ✅ 支持多个 **Store** 实例。
- 💫 ✅ **super-auto-loading**，支持针对同一个 effect 按照不同的 key 来区分不同的 loading 状态。
- 🚰 ✅ 内置命令式 [**节流**](https://css-tricks.com/debouncing-throttling-explained-examples/) 方案
- 🙈 ✅ 内置命令式 [**防抖**](https://css-tricks.com/debouncing-throttling-explained-examples/) 方案
- 👀 ✅ 内置 **状态监听器**
- 🎮 ❌ 内置 **记忆函数**
- 👩‍❤️‍💋‍👩 ❌ 内置 **双向状态绑定**

# 参与贡献

欢迎加入到 dura 的建设队伍中来，请访问 [issues](https://github.com/ityuany/dura/issues)，提出更多你的想法和建议

[![build](https://img.shields.io/github/workflow/status/ityuany/dura/build?logo=github&style=?style=flat)](https://github.com/ityuany/dura)
[![Coverage Status](https://img.shields.io/coveralls/github/ityuany/dura?logo=coveralls&style=flat)](https://coveralls.io/github/ityuany/dura)
[![NPM VERSION](https://img.shields.io/npm/v/@dura/react.svg?logo=npm&style=flat)](https://www.npmjs.com/package/@dura/react)
[![NPM DOWNLOADS](http://img.shields.io/npm/dm/@dura/react.svg?logo=npm&style=flat)](https://www.npmjs.com/package/@dura/react)
[![LICENSE](https://img.shields.io/npm/l/@dura/react?logo=npm&style=flat)](https://github.com/ityuany/dura)

[![REACT](https://img.shields.io/npm/dependency-version/@dura/react/peer/react?logo=react&style=flat)](https://reactjs.org/)
[![REDUX](https://img.shields.io/npm/dependency-version/@dura/react/peer/redux?logo=redux&style=flat&color=6B49B8)](https://redux.js.org/)
[![IMMER](https://img.shields.io/npm/dependency-version/@dura/react/peer/immer?logo=twoo&logoColor=44B89D&style=flat&color=44B89D)](https://immerjs.github.io/immer/docs/introduction)
[![TYPESCRIPT](https://img.shields.io/github/package-json/dependency-version/ityuany/dura/dev/typescript/master?logo=typescript&style=flat)](https://www.typescriptlang.org/)
