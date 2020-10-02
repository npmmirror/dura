---
title: defineStoreSlice
group:
  title: defineStoreSlice
  order: 3
---

# defineStoreSlice

```typescript
defineStoreSlice( store : StoreSlice );
```

该函数用于定义一个 Store 片段

## 参数

- StoreSlice

## 返回值

无

## 代码示例

```typescript
const user = defineStoreSlice({
  namespace: 'user',
  state: {
    /** 姓名 */
    name: '张三',
  },
  reducers: {
    onChangeName(state, action: Action<{ name: string }>) {
      state.name = action.payload.name;
    },
  },
  effects: {
    async onAsyncQuery(action: Action<{ name: string }>) {
      name = action.payload.name;
    },
  },
});
```
