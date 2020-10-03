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

This function is used to define a Store fragment

## parameter

- StoreSlice

## return

无

## Code example

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
