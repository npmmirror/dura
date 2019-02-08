# dura

[![Build Status](https://travis-ci.org/CN-YUANYU/dura.svg?branch=master)](https://travis-ci.org/CN-YUANYU/dura)
[![Coverage Status](https://img.shields.io/coveralls/CN-YUANYU/dura.svg?style=flat)](https://coveralls.io/github/CN-YUANYU/dura)
[![NPM version](https://img.shields.io/npm/v/@dura/plus.svg?style=flat)](https://www.npmjs.com/settings/dura/packages)
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

## 为什么 不支持动态 model ？

因为动态 model 会破坏 dura 的提示系统，让提示不再精确， 或者说需要人为的去控制一些因素才能达到精确的提示，所以暂时不考虑支持动态 model，其实也可以通过包管理的方案来进行替代

---

## 文档

### 概念

#### runner

runner 我将它称之为 **执行者** ， 一般主要用来执行相关的 Action ， 当然也有可能用来干其他的事情 ， 比如执行 reselect 。所有的 runner 统一从 duraStore 中获取 ， 如下：

```TypeScript
//创建duraStore
export const duraStore = create({
  initialModel,
  plugins: [createAsyncPlugin(), createLoadingPlugin(initialModel), createImmerPlugin(), createSelectorsPlugin()]
}) as DuraStore<RootModel> & AsyncDuraStore<RootModel> & SelectorsDuraStore<RootModel>;

// 主要用来执行 reducer
const reducerRunner = duraStore.reducerRunner;

// 主要用来执行 effect
const effectRunner = duraStore.effectRunner;


// 主要用来执行 selector
const selectorRunner = duraStore.selectorRunner;

```

- [@dura/core](https://github.com/CN-YUANYU/dura/tree/master/packages/dura-core) 包含 **reducerRunner** ，主要用来 执行 reducer
- [@dura/async](https://github.com/CN-YUANYU/dura/tree/master/packages/dura-async) 包含 **effectRunner** ，主要用来执行 effect
- [@dura/selectors](https://github.com/CN-YUANYU/dura/tree/master/packages/dura-selectors) 包含 **selectorRunner** ， 主要用来执行 [reselect](https://github.com/reduxjs/reselect)

#### DuraStore 类型系统

默认情况下 [@dura/core](https://github.com/CN-YUANYU/dura/tree/master/packages/dura-core) 包含有一个默认的类型系统

```typescript
type DuraStore<RM extends RootModel = any, ExtensionState = any> = Store<ExtractRootState<RM> & ExtensionState
```

该类型系统会指明 DuraStore 的标准结构 ， **RootModel** 指的是你传入的 initialModel 的具体类型 ， 我们可以通过 **typeof** 直接进行获取 ， 传入 initialModel 的具体类型 的目的是为了让你 在得到 store 之后使用 getState() 函数之后能够获得连续性的提示。

我们注意到 该类型系统中还有一个类型 叫做 **ExtensionState** ， 这是作为补充使用， 早某些场景下（参照 [@dura/async-loading](https://github.com/CN-YUANYU/dura/tree/master/packages/dura-async-loading) 插件的实现）, 我们实际的 rootState 不仅仅只包含我们的业务 model 中的 state ，在这种场景下，我们需要对 类型系统进行补充，这个时候我们则需要用到 **ExtensionState** , 例：

```typescript
const initialModel = {
  /**
   * 用户模块
   */
  user: UserModel
};

export type RootModel = typeof initialModel;

const duraStore = create({
  initialModel,
  plugins: [createAsyncPlugin(), createLoadingPlugin(initialModel), createImmerPlugin(), createSelectorsPlugin()]
}) as DuraStore<RootModel> & AsyncDuraStore<RootModel> & SelectorsDuraStore<RootModel>;

// 由于上面as了 DuraStore 类型系统 ， 所以此处有提示 , 可以持续的 点 下去
duraStore.getState().user.name;

//此处是loading插件提供的一个内置model ， 并不在我们的业务model 中 ，
//是由于 AsyncDuraStore<RootModel> 类型系统所以依然能够给出一个比较良好的提示信息
duraStore.getState().loading.onAsyncChangeName;
```

#### ExtractRootState 类型系统

由 [@dura/core](https://github.com/CN-YUANYU/dura/tree/master/packages/dura-core) 提供

```typescript
type ExtractRootState<M extends RootModel>
```

该类型系统主要用来通过你的 rootModel 解构出 rootState 的类型路径， 使用案例：

```typescript
type RootState = ExtractRootState<RootModel>;

function mapStateToProps(state: RootState) {
  return {
    name: state.user.name //此处会有比较良好的提示哦
  };
}
```

#### ExtractReducersRunner 类型系统

功能与 **ExtractRootState** 相似， 区别在于 **ExtractReducersRunner** 提取的是 reducer 的信息

### Api

#### create( config:Config ) : DuraStore

创建 DuraStore 的核心方法 , 参数如下

- 【**必传**】initialModel 所有需要载入的 model
- 【**可选**】initialState 对应 [redux](https://github.com/reduxjs/redux) 的 initialState
- 【**可选**】middlewares 额外的中间件 ，与 [redux](https://github.com/reduxjs/redux) 用法相同
- 【**可选**】plugins 插件列表

```typescript
const store = create({
  initialModel: {
    user: {
      state: {},
      reducers: {}
    }
  }
}) as DuraStore<RootModel>;
```

#### reducers 规范

为了让 ts 能够有比较友好的提示信息，我们将 reducers 设计成两层函数的结构， 也就是高阶，如下所示：

```typescript
const userModel = {
  state: {
    name: "默认"
  },
  reducers: {
    //第一层 ， 这里的参数表示外部在调用你的时候需要传入的
    // 第一个参数一般为 action 的payload
    // 第二个参数一般为 action 的meta
    onChangeName(payload: { newName: string }) {
      //第二层 ， 这里的参数是dura注入进来的，一般指的是当前model 的state
      return function(state: State): State {
        return { ...state, name: payload.newName };
      };
    }
  }
};
```

#### reducerRunner

当我们成功创建一个 duraStore 之后， 在 duraStore 中会自动挂载一个 reducerRunner 对象，我们可以将这个对象导出，在其他地方引用，该对象就是你需要针对 reducer 发起 Action 的时候用到的 ， 具体用法这里就不做说明了， ts 的提示系统会告诉你怎么做

### 官方插件

- [@dura/plus](https://github.com/CN-YUANYU/dura/tree/master/packages/dura-plus) 整合全家桶之后的包，免配置
- [@dura/async](https://github.com/CN-YUANYU/dura/tree/master/packages/dura-async) 异步请求处理方案
- [@dura/async-loading](https://github.com/CN-YUANYU/dura/tree/master/packages/dura-async-loading) 依赖 [dura-async](https://github.com/CN-YUANYU/dura/tree/master/packages/dura-async) 主要实现 auto-loading
- [@dura/immer](https://github.com/CN-YUANYU/dura/tree/master/packages/dura-immer) 支持 [immer](https://github.com/mweststrate/immer)
- [@dura/selectors](https://github.com/CN-YUANYU/dura/tree/master/packages/dura-selectors) 支持 [reselect](https://github.com/reduxjs/reselect) , 暂时不推荐使用 **（停止维护）**

## 例子

- [example-count](https://github.com/CN-YUANYU/dura/tree/master/example/example-count) 一个最简单的计数器 demo，没有使用任何插件
- [example-pro](https://github.com/CN-YUANYU/dura/tree/master/example/example-pro) 演示了 dura 全家桶的使用方式
- [example-rn](https://github.com/CN-YUANYU/dura/tree/master/example/examplern) react-native 的一个简单 demo
- [example-tarojs](https://github.com/CN-YUANYU/dura/tree/master/example/example-tarojs) 配合 [tarojs](https://github.com/NervJS/taro) 开发微信小程序

**征集更过的基于 dura 的项目案例， 可直接提供在 issue 当中**

## 一个简单的教程

为了让大家尽可能的简单一些上手，我们提供了一个整合了所有官方插件以及类型系统的库 [@dura/plus](https://github.com/CN-YUANYU/dura/tree/master/packages/dura-plus)（其实类型系统的配置对于新手来说还是具备一定的复杂度的）,下面通过 jest 单元测试展示一个简单的 demo 教程

```typescript
it("简单的测试", function(done) {
  const initialState = {
    name: undefined as string,
    sex: undefined as "男" | "女",
    age: undefined as number
  };

  type State = typeof initialState;

  const UserModel = {
    state: initialState,
    reducers: {
      onChangeName(payload: { name: string }) {
        return function(state: State) {
          state.name = payload.name;
          return state;
        };
      }
    },
    effects: {
      onAsyncChangeName(payload: { name: string }, meta?: LoadingMeta) {
        return async function(effectApi: EffectAPI<RootState>) {
          await effectApi.delay(1000);
          await effectRunner.address.onAsyncChangeCity({ city: "南京" });
          reducerRunner.user.onChangeName(payload);
        };
      }
    }
  };

  const initialAddressState = {
    detailName: undefined as string,
    city: undefined as string
  };

  type AddressState = typeof initialAddressState;

  const AddresModel = {
    state: initialAddressState,
    reducers: {
      onChangeCity(payload: { city: string }) {
        return function(state: AddressState) {
          state.city = payload.city;
          return state;
        };
      }
    },
    effects: {
      onAsyncChangeCity(payload: { city: string }) {
        return async function(effectApi: EffectAPI<RootState>) {
          await effectApi.delay(1000);
          reducerRunner.address.onChangeCity(payload);
        };
      }
    }
  };

  const initialModel = {
    user: UserModel,
    address: AddresModel
  };

  type RootState = PlusRootState<typeof initialModel>;

  const store = createDura(initialModel, {}) as PlusDuraStore<typeof initialModel>;

  const { reducerRunner, effectRunner } = store;

  effectRunner.user.onAsyncChangeName({ name: "张三" }, { loading: true });

  expect(store.getState().loading.user.onAsyncChangeName).toEqual(true);

  setTimeout(() => {
    expect(store.getState().loading.user.onAsyncChangeName).toEqual(false);
    expect(store.getState().user.name).toEqual("张三");
    expect(store.getState().address.city).toEqual("南京");
    done();
  }, 3000);
});
```

## 版本更新日志

- **【2019.02.06】** 1.0.0 主体功能上线
- **【2019.02.06】** 1.0.1 修复关于 State 类型系统不支持 boolean 的问题 [511492c](https://github.com/CN-YUANYU/dura/commit/511492c1a17cc0688af62a09f3f154c7d17a3366)
- **【2019.02.06】** 1.0.2 修复关于 Selector 类型系统不正确 的问题 [e41f5f2](https://github.com/CN-YUANYU/dura/commit/e41f5f2c6f709410c1a0687857b903ac1b190e51)
- **【2019.02.09】** 1.0.3 [@dura/plus](https://github.com/CN-YUANYU/dura/tree/master/packages/dura-plus) 中移除了 selector 方案 [f249a6a](https://github.com/CN-YUANYU/dura/commit/f249a6ac6165954808199fe047cd0e93e48d16c8)

  考虑到其实集成 selector 方案并没有太大的意义，反而会增加新手对于 dura 的理解成本，所以决定将该方案从[@dura/plus](https://github.com/CN-YUANYU/dura/tree/master/packages/dura-plus)中进行移除，后续其实也不推荐使用 [@dura/selectors](https://github.com/CN-YUANYU/dura/tree/master/packages/dura-selectors) 插件，并且该插件将不会提供版本迭代维护，建议直接使用 [reselect](https://github.com/reduxjs/reselect)
