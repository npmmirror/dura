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

In fact, at the earliest time, we did not use redux, but followed the [**flux architecture**](https://github.com/facebook/flux) and developed a set of state machine, this set of state When we first used the machine, it was based on the page level. When multiple pages need to share state changes, we usually adopt the **message bus** method for synchronization scheduling.

In the beginning, there was no problem. However, as the complexity of the business is getting higher and higher, usually the pure front end may need to span more than a dozen pages to complete a complete business. In this case, we need to go back and forth between a dozen different pages through the **message bus** To synchronize the latest status information.
And in this business scenario, there may be other business modules that carry part of the state information and jump directly to a certain page in the middle of our current business module. Those days were a disaster for us, so we started switching to redux and developed dura based on redux to make redux easier to use.

At the beginning, we fully agreed with the theory of redux's store singularity. However, with the advent of micro-frontends, we found that if we still insist on **single-rooted**, then we will sacrifice our type system based on typescript to a large extent. In actual business scenarios, there is usually only one business field. Only the state in the internal state will have a precise scheduling association, so we proposed multiple stores. We believe that the store in an application should not be completely single-rooted, usually it should be **single-rooted** in a certain business field. , And how to reasonably divide **business areas** will be a science. It is recommended to go for appropriate reference to understand **【DDD Domain Driven Design】**

# Why do I need watch in the state machine?

In most of the time, we can implement some functions of watch through useEffect inside the react component, so why do we rely on the decision to implement a set inside the state machine? Because in many cases, all I want to do is to listen to a state change and do something, which may not be related to any component. If you put such logic into the state machine, it will inevitably greatly increase the mental cost of subsequent maintenance.
