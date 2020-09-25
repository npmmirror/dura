---
title: Introduction
nav:
  order: 1
group:
  title: Introduction
  order: 1
---

# What is dura?

Dura, I call it **嘟啦**，this is a state machine based on [redux](https://redux.js.org/) and developed and constructed using [typescript](https://www.typescriptlang.org/), which simplifies the state management of **90%** of regular business scenarios.

Dura was born in a huge project with a pure front-end business code line reaching **million level**.

Since the birth of dura, as of the time you read this document, a total of 4 major versions have been released, dura1.x-dura3.x I have been committed to providing complete **type inferences**. And dura4.x will be a brave attempt. I try to implement a set of **dependency collection** based on redux, so as to avoid cumbersome **connect** behavior and make dura more intelligent.

# Feature

- 🚀 ✅ Perfect and friendly [**typescript**](https://www.typescriptlang.org/) type inference。
- 💥 ✅ Rely on collection, say goodbye to [**mapStateToProps**](https://react-redux.js.org/api/connect), get off work early.
- 🔨 ✅ Complete [**hooks api**](https://reactjs.org/docs/hooks-intro.html) support.
- 🗳️ ✅ Friendly to [**micro frontends**](https://micro-frontends.org/).
- 👬 ✅ Supports multiple **Store** instances.
- 💫 ✅ **super-auto-loading**, supports different loading states for the same effect according to different keys.
- 🚰 ✅ Built-in imperative [**throttling**](https://css-tricks.com/debouncing-throttling-explained-examples/) scheme
- 🙈 ✅ Built-in imperative [**debouncing**](https://css-tricks.com/debouncing-throttling-explained-examples/) solution
- 👀 ❌ Built-in **Status Listener**
- 🎮 ❌ Built-in **memory function**
- 👩‍❤️‍💋‍👩 ❌ Built-in **two-way state binding**

# Contribution

Welcome to join the dura construction team, please visit [issues](https://github.com/ityuany/dura/issues) to put forward more of your thoughts and suggestions

[![build](https://img.shields.io/github/workflow/status/ityuany/dura/build?logo=github&style=?style=flat)](https://github.com/ityuany/dura)
[![Coverage Status](https://img.shields.io/coveralls/github/ityuany/dura?logo=coveralls&style=flat)](https://coveralls.io/github/ityuany/dura)
[![NPM VERSION](https://img.shields.io/npm/v/@dura/react.svg?logo=npm&style=flat)](https://www.npmjs.com/package/@dura/react)
[![NPM DOWNLOADS](http://img.shields.io/npm/dm/@dura/react.svg?logo=npm&style=flat)](https://www.npmjs.com/package/@dura/react)
[![LICENSE](https://img.shields.io/npm/l/@dura/react?logo=npm&style=flat)](https://github.com/ityuany/dura)

[![REACT](https://img.shields.io/npm/dependency-version/@dura/react/peer/react?logo=react&style=flat)](https://reactjs.org/)
[![REDUX](https://img.shields.io/npm/dependency-version/@dura/react/peer/redux?logo=redux&style=flat&color=6B49B8)](https://redux.js.org/)
[![IMMER](https://img.shields.io/npm/dependency-version/@dura/react/peer/immer?logo=twoo&logoColor=44B89D&style=flat&color=44B89D)](https://immerjs.github.io/immer/docs/introduction)
[![TYPESCRIPT](https://img.shields.io/github/package-json/dependency-version/ityuany/dura/dev/typescript/master?logo=typescript&style=flat)](https://www.typescriptlang.org/)
