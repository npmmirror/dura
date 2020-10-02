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

该方法用于配置 **store** 的创建函数 ， 例如集中化的配置 相关的中间件、增强器等。

## 参数

- options **(可选)** 配置信息
  - enhancers **(可选)** redux 增强器
  - middlewares **(可选)** redux 中间件
  - compose **(可选)**
  - preloadedState **(可选)** 初始化 State

## 返回值

返回一个函数，用于创建 Store

## 代码示例

```shell
import { configura } from '@dura/react';
import user from './user.model';

const createStore = configura();

const store = createStore(user);

export { store };
```
