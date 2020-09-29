---
title: Thinking
group:
  title: Preface
  order: 2
---

# The miserable mapStateToProps

In our work in the past, although dura provides a lot of type inference, it still can't escape a lot of **boilerplate code**. Let's look at the following example:

<code src="../../../example/mapStateToProps.tsx" inline />
Of course, we can understand the importance of avoiding meaningless rendering, and we also understand [react-redux](https://react-redux.js.org/) internally used [shallowEqual](https://github.com/ reduxjs/react-redux/blob/58ae5edee510a2f2f3bc577f55057fe9142f2976/src/utils/shallowEqual.js). However, targeting such boilerplate code still suffers from torture in our long-term work. We are trying to solve this problem.

Fortunately, ES6 provides us with [Proxy](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy), which allows us to hijack the object **get** Accessor, so we will proxy the global and complete state information directly to the component, and hijack all the access paths of the component to the proxy object. When the global state changes every time, we use [immer](https://immerjs.github.io/immer/docs/introduction) to get the modified attribute path and the access path collected by each component before this To compare, if there is an intersection, decide to render the component.

# Store's singularity

Sometimes we are thinking about whether we really have to guarantee the single root of the store in an application. From our actual experience, if our business areas are well divided, perhaps we don’t necessarily need to guarantee **Store's single roots**.

And if we can appropriately sacrifice the single root nature of **Store, it will bring great convenience to **multiple copies\*\* scenarios.
