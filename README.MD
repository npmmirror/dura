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

## 快速上手

```shell
  npm i @dura/plus -S
```

```ts
import React from "react";
import { create, PlusDuraStore, PlusRootState } from "@dura/plus";
import { EffectAPI } from "@dura/async";
import { render } from "react-dom";
import { connect } from "react-redux";

const countState = {
  count: 0
};

type OnChangeCountAction = {
  payload: {
    nextCount: number;
  };
};

type onAsyncChangeCountAction = {
  payload: {
    nextCount: number;
  };
  meta: {
    loading: boolean;
  };
};

const countModel = {
  state: countState,
  reducers: {
    onChangeCount(state: typeof countState, action: OnChangeCountAction) {
      return { ...state, count: action.payload.nextCount };
    }
  },
  effects: {
    async onAsyncChangeCount(action: onAsyncChangeCountAction, effectApi: EffectAPI) {
      await effectApi.delay(1000);
      reducerRunner.count.onChangeCount(action.payload);
    }
  }
};

const rootModel = {
  count: countModel
};

const store = create(rootModel) as PlusDuraStore<typeof rootModel>;

const { reducerRunner, effectRunner } = store;

type RootState = PlusRootState<typeof rootModel>;

function mapState(state: RootState) {
  return {
    count: state.count.count,
    loading: state.loading.count.onAsyncChangeCount
  };
}

class App extends React.Component {
  props: Partial<ReturnType<typeof mapState>>;

  render() {
    return (
      <div>
        <h1>{this.props.count}</h1>
        <h2>loading:{this.props.loading}</h2>
        <button onClick={() => effectRunner.count.onAsyncChangeCount({ nextCount: 12 }, { loading: true })} />
      </div>
    );
  }
}

const AppContainer = connect(mapState)(App);

render(<AppContainer />, document.querySelector("#app"));
```

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

## 版本更新日志

- **【2019.02.06】** 1.0.0 主体功能上线
- **【2019.02.06】** 1.0.1 修复关于 State 类型系统不支持 boolean 的问题 [511492c](https://github.com/CN-YUANYU/dura/commit/511492c1a17cc0688af62a09f3f154c7d17a3366)
- **【2019.02.06】** 1.0.2 修复关于 Selector 类型系统不正确 的问题 [e41f5f2](https://github.com/CN-YUANYU/dura/commit/e41f5f2c6f709410c1a0687857b903ac1b190e51)
- **【2019.02.09】** 1.0.3

  - [@dura/plus](https://github.com/CN-YUANYU/dura/tree/master/packages/dura-plus) 中移除了 selector 方案 [f249a6a](https://github.com/CN-YUANYU/dura/commit/f249a6ac6165954808199fe047cd0e93e48d16c8)
    考虑到其实集成 selector 方案并没有太大的意义，反而会增加新手对于 dura 的理解成本，所以决定将该方案从[@dura/plus](https://github.com/CN-YUANYU/dura/tree/master/packages/dura-plus)中进行移除，后续其实也不推荐使用 [@dura/selectors](https://github.com/CN-YUANYU/dura/tree/master/packages/dura-selectors) 插件，并且该插件将不会提供版本迭代维护，建议直接使用 [reselect](https://github.com/reduxjs/reselect)

- **【2019.02.11】** 1.1.0 新功能上线 [6202efb](https://github.com/CN-YUANYU/dura/commit/6202efb332ea5b605a57214051c948235f7c5f9e) [1b0fb00](https://github.com/CN-YUANYU/dura/commit/1b0fb0054bd5a79999afade6a7546ffc9d1e059c)
  - 解耦 compose
  - 支持外部传入 compose 用以覆盖 [redux](https://github.com/reduxjs/redux) compose
  - 支持外部传入 createStore 用以覆盖 [redux](https://github.com/reduxjs/redux) createStore
  - 为了尽可能的自由度，移除 [@dura/plus](https://github.com/CN-YUANYU/dura/tree/master/packages/dura-plus) 中默认装载的 [@dura/immer](https://github.com/CN-YUANYU/dura/tree/master/packages/dura-immer)
- **【2019.02.11】** 1.1.1 放宽 reducer 的类型校验[7cb21af](https://github.com/CN-YUANYU/dura/commit/7cb21af7ba75a4ce0cbc3edea0c916d8811092ff)
- **【2019.02.11】** 1.1.2 发布卡住了更新内容同 1.1.1
- **【2019.02.11】** 1.1.3 发布卡住了更新内容同 1.1.1
- **【2019.02.12】** 1.2.0 更精准、友好的 reducer、effect 调用提示 [7c9c54e](https://github.com/CN-YUANYU/dura/commit/7c9c54e3d31a8ab9a553ad68f11b1a3dcb840ef8)

## 技术支持

![kavLv9.jpg](https://s2.ax1x.com/2019/02/11/kavLv9.jpg)
