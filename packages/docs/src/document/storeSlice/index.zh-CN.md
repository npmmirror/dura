---
title: StoreSlice
group:
  title: StoreSlice
  order: 2
---

# StoreSlice

一个 **StoreSlice** 定义了一个 **状态片段** ， 通常我们希望用户按照严格的 **业务领域** 或 **页面级别** 来进行适当的划分，当然这里的意思并不是说一个页面是有一个状态片段，实际上一个页面也可以根据实际的情况进行适当的拆分。

## 代码示例

一个标准的 **状态片段** 应该如下结构

```typescript
const user = defineStoreSlice({
  namespace: 'user',
  state: {
    name: 'default',
    age: 12,
  },
  reducers: {
    onChangeName(state, action: Action<{ name: string }>) {
      state.name = action.payload.name;
    },
    onChangeAge(state, action: Action<{ newAge: number }>) {
      state.age = action.payload.newAge;
    },
  },
  effects: {
    async asyncChangeName(action: Action<{ name: string }>) {
      store.actions.user.onChangeName(action.payload);
    },
  },
  watchs: {
    a: {
      dep: state => [state.name],
      handler: async state => {
        store.actions.user.onChangeAge({ newAge: 12 });
      },
      immediate: true,
    },
  },
});
```

## namespace

表示一个命名空间，在一个 Store 内应该保证唯一

## reducers

这里指的其实就是 redux 的 reducer ， 差异在于，这里因为被我们使用 immer 包装过， 因此并不需要返回值。

## effects

通常，这里我们描述一些副作用函数，在大多数的场景下， 这里都是频繁的与服务端的交互行为。注意这里的函数必须被 **async** 装饰

## watchs

### 参数

- dep **(必须)** 依赖项，该函数实际依然的字段，这是一个函数，函数返回一个数组
- handler **(必须)** 业务处理函数，当 dep 匹配上之后，就会执行该函数
- immediate **(可选)** 是否首次执行，默认值为 false
