---
title: 思考
group:
  title: 前言
  order: 2
---

# 苦不堪言的 mapStateToProps

在过去我们的工作中，虽然 dura 提供了大量的类型推导，但是依然逃脱不掉大量的 **样板代码**，让我们看一下下面的例子：

<code src="../../../demo/mapStateToProps.tsx" inline />

当然，我们能够理解规避无意义渲染的重要性，我们也了解 [react-redux](https://react-redux.js.org/) 内部使用的 [shallowEqual](https://github.com/reduxjs/react-redux/blob/58ae5edee510a2f2f3bc577f55057fe9142f2976/src/utils/shallowEqual.js)。但是针对如此的样板代码依然让我们长期的工作中备受折磨。我们试图去解决这个问题。

幸运的是，ES6 为我们提供了 [Proxy](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy) ，让我们得以劫持对象的 **get** 访问器，如此我们将全局完整的 state 信息进行代理之后直接传递给组件，并劫持记录组件对代理对象的所有访问路径。当全局的 state 每一次发生变更之后，我们借助 [immer](https://immerjs.github.io/immer/docs/introduction) 获取到修改的属性路径与在这之前每一个组件收集到的访问路径进行对比，如发现有交集部分，则决定渲染该组件。

# Store 的单根性

有些时候我们在思考，是否真的一定要保证在一个应用全局保证 **Store 的单根性**，从我们实际经验来看，如果我们的业务领域划分的足够的好，或许我们不一定需要保证 **Store 的单根性**。

并且如果我们能够适当的牺牲 **Store 的单根性**，那么将会为 **多副本** 场景带来极大的便利。
