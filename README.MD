# dura

[![Build Status](https://travis-ci.org/CN-YUANYU/dura.svg?branch=master)](https://travis-ci.org/CN-YUANYU/dura)
[![Coverage Status](https://img.shields.io/coveralls/CN-YUANYU/dura.svg?style=flat)](https://coveralls.io/github/CN-YUANYU/dura)
[![NPM version](https://img.shields.io/npm/v/@dura/plus.svg?style=flat)](https://www.npmjs.com/settings/dura/packages)
[![NPM downloads](http://img.shields.io/npm/dm/@dura/core.svg?style=flat)](https://www.npmjs.com/package/@dura/plus)
[![TypeScript](https://badges.frapsoft.com/typescript/version/typescript-next.svg?v=101)](https://github.com/ellerbrock/typescript-badges/)
[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=103)](https://opensource.org/licenses/mit-license.php)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)

基于 [redux](https://github.com/reduxjs/redux) 插件化、可拔插 的前端数据流管理框架 (灵感来源于 [dva](https://github.com/dvajs/dva) 、 [mirror](https://github.com/mirrorjs/mirror) 和 [rematch](https://github.com/rematch/rematch) ) 。 专为 [typescript](https://github.com/Microsoft/TypeScript) 而生

遵循[Semantic Versioning 2.0.0](https://semver.org/lang/zh-CN/) 语义化版本规范。

---

## 模块介绍

- [@dura/core](https://github.com/CN-YUANYU/dura/tree/v2.x/packages/dura-core) 内核库，不建议玩家直接引用
- [@dura/plus](https://github.com/CN-YUANYU/dura/tree/v2.x/packages/dura-plus) 主体功能库
- [@dura/loading](https://github.com/CN-YUANYU/dura/tree/v2.x/packages/dura-loading) 自动 loading 插件
- [@dura/immer](https://github.com/CN-YUANYU/dura/tree/v2.x/packages/dura-immer) immer 插件库

## 例子

- [example-pro](https://github.com/CN-YUANYU/dura/tree/master/example/example-pro) 演示了 dura 全家桶的使用方式
- [example-rn](https://github.com/CN-YUANYU/dura/tree/master/example/examplern) react-native 的一个简单 demo
- [example-tarojs](https://github.com/CN-YUANYU/dura/tree/master/example/example-tarojs) 配合 [tarojs](https://github.com/NervJS/taro) 开发微信小程序

**征集更过的基于 dura 的项目案例， 可直接提供在 issue 当中**

## 记录

2.0.0 开发过程中遭遇一些技术障碍，解决方案如下，分享出来

```typescript
type RequiredKnownKeys<T> = { [K in keyof T]: {} extends Pick<T, K> ? never : K } extends { [_ in keyof T]: infer U }
  ? ({} extends U ? never : U)
  : never;

type OptionalKnownKeys<T> = {
  [K in keyof T]: string extends K ? never : number extends K ? never : {} extends Pick<T, K> ? K : never
} extends { [_ in keyof T]: infer U }
  ? ({} extends U ? never : U)
  : never;

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;

type Prepend<P, T> = T extends any
  ? ((x: P, ...rest: T) => void) extends ((...rest: infer R) => void)
    ? R
    : never
  : never;

type Path<T> = T extends { readonly _: unique symbol }
  ? never
  : T extends any[]
  ? never
  : { [P in keyof T]: (Prepend<P, T[P] extends {} ? Path<T[P]> : never>) | [P, T[P]] }[keyof T];

function read<T extends { name: string }, P extends Path<T>>(targetObject: T, path: P) {
  console.log(targetObject);
  console.log(path);
}

read({ address: { name: "ss" }, name: "dd" }, ["address", undefined]);
```

## 技术支持

![kavLv9.jpg](https://s2.ax1x.com/2019/02/11/kavLv9.jpg)
