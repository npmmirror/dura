---
title: configura
group:
  title: configura
  order: 1
---

# configura

```typescript
configura(options?:ConfiguraOptions):createStoreFn
```

This method is used to configure the creation function of **store**, such as centralized configuration related middleware, enhancer, etc.

## parameter

- options **(Optional)** Configuration information
  - enhancers **(Optional)** redux enhancer
  - middlewares **(Optional)** redux middleware
  - compose **(Optional)**
  - preloadedState **(Optional)** initial State

## return

Return a function to create a Store

## Code example

```shell
import { configura } from '@dura/react';
import user from './user.model';

const createStore = configura();

const store = createStore(user);

export { store };
```
