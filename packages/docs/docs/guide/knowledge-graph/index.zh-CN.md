---
title: 纯函数
group:
  title: 知识图谱
  order: 3
---

![](https://p0.ssl.qhimg.com/dr/450__/t017fa00ab267bf25bd.jpg)

图像: Pure — carnagenyc (CC-BY-NC 2.0)

对于函数式编程、可靠的并发以及 React + Redux 应用程序等用途来说，纯函数是必不可少的。不过，纯函数到底是什么意思呢？

我们打算用 [“Eric Elliott 教你学 JavaScript”](https://ericelliottjs.com/) 中的一个免费课程来回答此问题：

[Eric Elliott 的什么是纯函数教学视频](https://player.vimeo.com/video/160326750)

要搞定什么是纯函数，最好是先深入研究一下函数。有几种不同的方式可以用来研究函数，这样会让函数式编程更容易理解。

# 什么是函数？

函数是接受一些输入，并产生一些输出的过程。这些输入称为参数，输出称为返回值。函数可以有如下用途：

- 映射：基于给定的输入产生一些输出。函数将输入值映射到输出值。
- 过程：函数可以被调用，来执行一系列步骤。这一系列步骤被称为过程，以这种风格编程被称为过程式编程（procedural programming）。
- I/O：有些函数是用来与系统的其它部分进行通讯，比如屏幕、存储、系统日志或者网络。

# 映射

纯函数都是关于映射。函数将输入参数映射到返回值，也就是说，对于每套输入，都存在一个输出。一个函数会接受输入，并返回相对应的输出。

Math.max() 接受数字为参数，并返回最大的数：

```js
Math.max(2, 8, 5); // 8
```

在本例中，2、8 和 5 都是参数，它们是传进函数的值。

Math.max() 是一个接受任意多个参数，并返回最大参数值的函数。本例中我们传进来的最大数是 8，而它就是被返回的数。

函数在计算和数学中相当重要，它们帮助我们以有用的方式处理数据。好的程序员会给函数一个可描述性的名字，这样当我们看代码时，根据函数名就可以理解函数要做什么。

数学中也有函数，数学中的函数与 JavaScript 中的函数很像。你可能已经在代数中看到过函数。它们看起来是这样的：

```js
f(x) = 2x
```

意思是声明了一个称为 f 的函数，该函数接受一个称为 x 的参数，然后用 2 乘以 x。

要使用这个函数，只需要为 x 提供一个值：

```js
f(2);
```

在代数中，这和像这样写是一样的：

```js
4;
```

所以，凡是 f(2) 出现的地方都可以用 4 来替代。

现在，我们把该函数转换为 JavaScript：

```js
const double = x => x * 2;
```

可以用 console.log() 来检查该函数的输出：

```js
console.log(double(5)); // 10
```

还记得我说过在数学函数中，你可以用 4 来替换 f(2) 吧？在 JavaScript 中，是 JavaScript 引擎将 double(5) 用答案 10 来替换。

所以，console.log( double(5) ); 与 console.log(10); 是一样的。

这之所以是对的，是因为 double() 是一个纯函数。但是，如果 double() 有副作用，比如要将值保存到磁盘，或者输出日志到控制台，只用 10 替换 double(5) 就改变了函数的含义了。

如果想引用透明，就需要用纯函数。

# 纯函数

纯函数是满足如下条件的函数：

- 相同输入总是会返回相同的输出。
- 不产生副作用。
- 不依赖于外部状态。

        如果调用一个函数，但是不使用其返回值，这个函数还意义，那么它毫无疑问是一个非纯函数。对于纯函数，那就是一个空操作。

我推荐选用纯函数。就是说，如果使用纯函数实现程序需求是可行的，就应该使用纯函数，而不是其它选项。纯函数接受一些输入，并且基于该输入返回一些输出。它们是程序中最简单的可重用代码构建块。在计算机科学中，也许最重要的设计原则就是 KISS 原则（保持简洁，Keep It Simple, Stupid）。我喜欢保持简洁。纯函数是以最可能的方式保持简洁。

纯函数有很多不错的特性，它构成了函数式编程的基础。纯函数完全独立于外部状态，正因为如此，它们对于共享可变状态情况下必须处理的所有错误类型都是免疫的。纯函数的独立性质，也让其成为跨多 CPU 以及跨整个分布式计算集群并行处理的最佳候选人，这让它们对很多类型的科学和资源密集型计算任务成了必不可少的。

纯函数也是超级独立的 - 它容易在代码中移动、重构、重新组织，让程序更灵活，更适应将来的改变。

# 共享状态的麻烦

几年前，我正开发一个应用。这个应用允许用户查询音乐家的数据库，并将该艺术家的音乐播放列表加载到一个网页播放器中。用户键入查询条件时，会启动 Google Instant，即时显示搜索结果。基于 AJAX 的自动完成突然风靡一时。

唯一的问题是，用户打字的速度经常比 API 自动完成查询返回的响应要快一些，这就导致了一些奇怪的 bug。它会触发竞态条件（Race condition），更新的建议会被过时的建议替换。

为什么会发生这种事情呢？这是因为每次访问 AJAX 成功处理程序时，都会直接更新显示给用户的建议列表。最慢的 AJAX 请求通过盲目地替换结果，总是会赢得用户的注意力，即使这些被替换的结果可能更新时也是如此。

为解决这个问题，我创建了一个建议管理器 - 一个唯一的真实数据来源 - 来管理查询建议的状态。它知道当前还未完成的 AJAX 请求，当用户键入一些新东西时，在新请求发出之前，未完成的 AJAX 请求会被取消，这样一次就只有一个响应处理程序能触发 UI 状态更新。

所有类型的异步操作或者并发都可能会导致类似的竞态条件。如果输出取决于不可控制的事件顺序（比如网络、设备延迟、用户输入、随机性等），那么竞态条件就会发生。实际上，如果你正使用共享的状态，而该状态依赖于会根据不确定性因素而变化的顺序，那么实际上，输出是不可能预测的，也就是说，不可能正确测试和完全理解。正如 Martin Odersky（Scala 的发明人）所说：

        非确定性 = 并行处理 + 可变状态

在计算中，程序的确定性通常是我们想要的属性。也许你认为既然 JS 是运行在单线程中，那么它对并行处理的问题应该免疫的，所以对于程序确定性应该是没问题的。但是，正如 AJAX 示例所展示的那样，单线程 JS 引擎并不意味着没有并发。相反，在 JavaScript 中有很多并发的来源。API I/O、事件监听器、Web Worker、iframe 以及 timeout 都会在程序中引入不确定性。而这些与共享状态结合在一起，就会得到一堆 bug。

纯函数可以帮助你避免这些类型的 bug。

# 给出相同输入，总是返回相同的输出

用 double() 函数，你可以用结果来替换函数调用，而程序会把它们当作是一码事。也就是说，在程序中，不管上下文是什么，不管你调用多少次，或者什么时候调用， double(5) 会总是与 10 表示同样的事。

但是这并不适用于所有函数。有些函数产生的结果依赖于信息，而不是传进来的参数。

考虑如下示例：

```js
Math.random(); // => 0.4011148700956255
Math.random(); // => 0.8533405303023756
Math.random(); // => 0.3550692005082965
```

即使没有给函数调用传递任何参数，产生的输出也都不相同，也就是说 Math.random() 是非纯函数。

每次执行 Math.random()，都会生成一个 0 到 1 之间的新随机数，所以很显然，你没法只用 0.4011148700956255 来替换它，而不改变程序的含义。

如果是这样，每次都生成相同的结果。当我们要求计算机生成一个随机数时，通常意味着我们想要的是一个与最后一次得到的数不同的结果。如果骰子的每一边印的都是相同的数字有什么意义呢？

有时我们要让计算机给出当前时间。这里我们不用深入研究时间函数的工作机制，只复制下面这段代码：

```js
const time = () => new Date().toLocaleTimeString();
time(); // => "5:15:45 PM"
```

如果用当前时间替换 time() 函数调用，会发生什么？

会总是输出相同的时间，即函数调用被替换的时间。也就是说，它每天只有一次会产生正确的输出，而且只有在函数被替换那一刻运行程序才会。

所以很显然，time() 与 double() 函数不一样。

**一个函数只有在给出相同输出，总是产生相同输出的时候，才是纯函数。** 你可能还记得代数课中的这条规则：相同输入值会总是映射到相同的输出值。不过，多个输入值也可以映射到同一个输出值。例如，如下的函数是纯函数：

```js
const highpass = (cutoff, value) => value >= cutoff;
```

相同的输入值总会映射到相同的输出值：

```js
highpass(5, 5); // => true
highpass(5, 5); // => true
highpass(5, 5); // => true
```

多个输入值可能会映射到相同的输出值：

```js
highpass(5, 123); // true
highpass(5, 6); // true
highpass(5, 18); // true

highpass(5, 1); // false
highpass(5, 3); // false
highpass(5, 4); // false
```

# 纯函数不产生副作用

纯函数不产生副作用，就是说它不能改变任何外部状态。

# 不可变性

JavaScript 参数是按引用传递，就是说，如果函数要修改一个对象参数或者数组参数上的属性，那么它就会修改在函数外部可以访问的状态。纯函数不能修改外部状态。

考虑如下 addToCart() 函数，该函数是一个非纯函数，会修改状态：

```js
// 非纯的 addToCart 修改已有的购物车
const addToCart = (cart, item, quantity) => {
  cart.items.push({
    item,
    quantity,
  });
  return cart;
};

test('addToCart()', assert => {
  const msg = 'addToCart() should add a new item to the cart.';
  const originalCart = {
    items: [],
  };
  const cart = addToCart(
    originalCart,
    {
      name: 'Digital SLR Camera',
      price: '1495',
    },
    1,
  );

  const expected = 1; // num items in cart
  const actual = cart.items.length;

  assert.equal(actual, expected, msg);

  assert.deepEqual(originalCart, cart, 'mutates original cart.');
  assert.end();
});
```

通过传进一个购物车、添加到购物车的商品、以及商品数量，函数就起作用了。然后函数返回同一个购物车，购物车带有添加给它的商品。

问题是，我们刚修改了一些共享的状态。其它函数可能依赖于 addToCart() 函数被调用之前该购物车对象的状态，而现在我们已经修改了这个共享的状态，如果修改函数已经被调用的订单，就不得不担心它会对程序逻辑产生什么样的影响了。重构该代码会导致 bug 出现，从而把订单搞砸了，让客户不高兴。

现在考虑如下版本：

```js
// 纯函数 addToCart() 返回一个新购物车，不会修改原始购物车
const addToCart = (cart, item, quantity) => {
  const newCart = lodash.cloneDeep(cart);

  newCart.items.push({
    item,
    quantity,
  });
  return newCart;
};

test('addToCart()', assert => {
  const msg = 'addToCart() should add a new item to the cart.';
  const originalCart = {
    items: [],
  };

  // deep-freeze on npm
  // throws an error if original is mutated
  deepFreeze(originalCart);

  const cart = addToCart(
    originalCart,
    {
      name: 'Digital SLR Camera',
      price: '1495',
    },
    1,
  );

  const expected = 1; // num items in cart
  const actual = cart.items.length;

  assert.equal(actual, expected, msg);

  assert.notDeepEqual(originalCart, cart, 'should not mutate original cart.');
  assert.end();
});
```

在本例中，有一个数组嵌套在一个对象中，这是为什么我要做深拷贝的原因。这比你经常会处理的状态更复杂。大多数情况下，你可以将其分解成更小的块。

例如，Redux 会让你组合 reducer，而不是在每个 reducer 中处理整个应用程序状态。这样做的结果是，你不必在每次只想更新一小部分时，为整个应用程序状态创建一个深拷贝。而是用非破坏性的数组方法或者 Object.assign()，来更新应用状态的一小部分。

[摘自:【众成翻译】征服 JavaScript 面试：什么是纯函数？](https://zcfy.cc/article/master-the-javascript-interview-what-is-a-pure-function-2186.html)
