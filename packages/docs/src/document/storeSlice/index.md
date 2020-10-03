---
title: StoreSlice
group:
  title: StoreSlice
  order: 2
---

# StoreSlice

A **StoreSlice** defines a **status segment**, usually we want users to be appropriately divided according to the strict **business area** or **page level**. Of course, the meaning here is not one The page has a status fragment, in fact, a page can also be appropriately split according to the actual situation.

## Code example

A standard **status fragment** should have the following structure

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

Represents a namespace and should be unique within a Store

## reducers

This is actually the reducer of redux. The difference is that because we have used immer to wrap it, there is no need to return a value.

## effects

Generally, here we describe some side-effect functions. In most scenarios, there are frequent interactions with the server. Note that the function here must be decorated by **async**

## watchs

### parameter

- dep **(require)** Dependency, the actual field of the function, this is a function, the function returns an array
- handler **(require)** Business processing function, when dep is matched, the function will be executed
- immediate **(optional)** Whether to execute for the first time, the default value is false
