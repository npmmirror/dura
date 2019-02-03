# dura

[![Build Status](https://travis-ci.org/CN-YUANYU/dura.svg?branch=master)](https://travis-ci.org/CN-YUANYU/dura)
[![Coverage Status](https://img.shields.io/coveralls/CN-YUANYU/dura.svg?style=flat)](https://coveralls.io/github/CN-YUANYU/dura)
[![NPM version](https://img.shields.io/npm/v/@dura/core.svg?style=flat)](https://www.npmjs.com/settings/dura/packages)
[![NPM downloads](http://img.shields.io/npm/dm/@dura/core.svg?style=flat)](https://npmjs.org/package/dva)
[![TypeScript](https://badges.frapsoft.com/typescript/version/typescript-next.svg?v=101)](https://github.com/ellerbrock/typescript-badges/)
[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=103)](https://opensource.org/licenses/mit-license.php)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)

基于 [redux](https://github.com/reduxjs/redux) 插件化、可拔插 的前端数据流管理框架 (灵感来源于 [dva](https://github.com/dvajs/dva) 、 [mirror](https://github.com/mirrorjs/mirror) 和 [rematch](https://github.com/rematch/rematch) ) 。 专为 [typescript](https://github.com/Microsoft/TypeScript) 而生

---

## 为什么会有 dura ?

在业务开发当中，我尝试过很多流行的前端数据流的管理方案，例如：[dva](https://github.com/dvajs/dva) 、 [mirror](https://github.com/mirrorjs/mirror) 和 [rematch](https://github.com/rematch/rematch) ，但是实际的使用效果并不如意 。

### dva

- 重构火葬场，难以安心的删除 effect、reducer、state，因为担心未知的引用
- 使用的时候需要频繁的在多个文件之间来回切换，以明确 action 的 type 和 state 的取值
- redux-saga 高昂的上手成本已经远远大于它能带来的收益

### mirror

- 这哥们直接强绑了 [react-router](https://github.com/ReactTraining/react-router) ，我们有 [react-native](https://github.com/facebook/react-native) 的项目
- store 直接挂在了全局的 windows 下面 , 其实上很多时候我们可能需要多个 store 并存的

### rematch

- 对于 [typescript](https://github.com/Microsoft/TypeScript) 的支持还不错，但是不够精细
- 很多官方插件 没有 [typescript](https://github.com/Microsoft/TypeScript) 的类型系统
- 对于 reducer、effect 的参数提示完全没有
- api 的设计并不是很喜欢，有些时候用起来觉得很奇怪

## dura 拥有哪些能力？

- ❓ **提示系统**：强大到你怀疑人生的提示系统、你只需要不停的的鼠标点下去就好。
- 🔥 **逃离重构火葬场**：项目重构时，代码想删就删，不用去担心未知的引用。
- 🔌 **插件机制**：基本上能够兼容整个 redux 生态中的常用库。
- 💰 ** 上手成本**：如果你掌握上面任何一个框架，那么对你来说 dura 几乎零成本

## 为什么 dura 不提供动态 model 的能力？

因为动态 model 会破坏 dura 的提示系统，让提示不再精确， 或者说需要人为的去控制一些因素才能达到精确的提示，所以暂时不考虑支持动态 model，其实也可以通过包管理的方案来进行替代

## 文档

//TODO

### 官方插件

- [dura-async](https://github.com/CN-YUANYU/dura/tree/master/packages/dura-async) 异步请求处理方案
- [dura-async-loading](https://github.com/CN-YUANYU/dura/tree/master/packages/dura-async-loading) 依赖 [dura-async](https://github.com/CN-YUANYU/dura/tree/master/packages/dura-async) 主要实现 auto-loading
- [dura-immer](https://github.com/CN-YUANYU/dura/tree/master/packages/dura-immer) 支持 [immer](https://github.com/mweststrate/immer)
- [dura-selectors](https://github.com/CN-YUANYU/dura/tree/master/packages/dura-selectors) 支持 [reselect](https://github.com/reduxjs/reselect)

## 例子

- [example-count](https://github.com/CN-YUANYU/dura/tree/master/example/example-count) 一个最简单的计数器 demo，没有使用任何插件
- [example-pro](https://github.com/CN-YUANYU/dura/tree/master/example/example-pro) 演示了 dura 全家桶的使用方式
- [examplern](https://github.com/CN-YUANYU/dura/tree/master/example/examplern) react-native 的一个简单 demo

**征集更过的基于 dura 的项目案例， 可直接提供在 issue 当中**

## 一个简单的教程

//TODO
