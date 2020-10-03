---
title: Pure-Function
group:
  title: Graph
  order: 3
---

![](https://p0.ssl.qhimg.com/dr/450__/t017fa00ab267bf25bd.jpg)

Image: Pure — carnagenyc (CC-BY-NC 2.0)

Pure functions are essential for functional programming, reliable concurrency, and React + Redux applications. But what exactly does a pure function mean?

We intend to answer this question with a free course in ["Eric Elliott teaches you JavaScript"](https://ericelliottjs.com/):

[What is a pure function instructional video by Eric Elliott](https://player.vimeo.com/video/160326750)

To figure out what a pure function is, it is best to study the function in depth. There are several different ways to study functions, which will make functional programming easier to understand.

# What is a function?

A function is a process that accepts some input and produces some output. These inputs are called parameters, and the output is called the return value. Functions can have the following purposes:

- Mapping: Generate some output based on the given input. The function maps input values to output values.
- Procedure: Functions can be called to perform a series of steps. This series of steps is called a process, and programming in this style is called procedural programming.
- I/O: Some functions are used to communicate with other parts of the system, such as screen, storage, system log or network.

# Mapping

Pure functions are all about mapping. The function maps input parameters to return values, that is, for each set of inputs, there is an output. A function will accept input and return the corresponding output.

Math.max() accepts numbers as parameters and returns the largest number:

```js
Math.max(2, 8, 5); // 8
```

In this example, 2, 8, and 5 are all parameters, and they are the values passed into the function.

Math.max() is a function that accepts any number of parameters and returns the maximum parameter value. In this example, the largest number we pass in is 8, and it is the number returned.

Functions are very important in calculations and mathematics. They help us process data in useful ways. A good programmer will give a function a descriptive name, so that when we look at the code, we can understand what the function does based on the function name.

There are also functions in mathematics, and functions in mathematics are very similar to functions in JavaScript. You may have seen functions in algebra. They look like this:

```js
f(x) = 2x
```

It means that a function called f is declared, which accepts a parameter called x and then multiplies x by 2.

To use this function, you only need to provide a value for x:

```js
f(2);
```

In algebra, this is the same as writing like this:

```js
4;
```

Therefore, wherever f(2) appears, 4 can be used instead.

Now, we convert the function to JavaScript:

```js
const double = x => x * 2;
```

You can use console.log() to check the output of this function:

```js
console.log(double(5)); // 10
```

Remember I said that in math functions, you can replace f(2) with 4? In JavaScript, it is the JavaScript engine that replaces double(5) with the answer 10.

So, console.log( double(5) ); and console.log(10); are the same.

This is true because double() is a pure function. However, if double() has side effects, such as saving the value to disk or outputting a log to the console, replacing double(5) with 10 will change the meaning of the function.

If you want referential transparency, you need to use pure functions.

# Pure-Function

A pure function is a function that satisfies the following conditions:

- The same input will always return the same output.
- No side effects.
- Does not depend on the external state.

        If you call a function, but don't use its return value, the function still makes sense, then it is undoubtedly an impure function. For pure functions, that is a no-op.

I recommend using pure functions. In other words, if it is feasible to use pure functions to achieve program requirements, then pure functions should be used instead of other options. A pure function takes some input and returns some output based on that input. They are the simplest reusable code building blocks in the program. In computer science, perhaps the most important design principle is the KISS principle (Keep It Simple, Stupid). I like to keep it simple. Pure functions are kept concise in the most possible way.

Pure functions have many good features, and they form the basis of functional programming. Pure functions are completely independent of external state, and because of this, they are immune to all types of errors that must be handled in the case of shared mutable state. The independent nature of pure functions also makes them the best candidates for parallel processing across multiple CPUs and across the entire distributed computing cluster, which makes them indispensable for many types of scientific and resource-intensive computing tasks.

Pure functions are also super independent-it is easy to move, refactor, and reorganize in the code, making the program more flexible and more adaptable to future changes.

# The trouble with shared state

A few years ago, I was developing an application. This application allows users to query the musician's database and load the artist's music playlist into a web player. When the user types in the query conditions, Google Instant will be launched and the search results will be displayed instantly. AJAX-based auto-completion is suddenly all the rage.

The only problem is that the user's typing speed is often faster than the response returned by the API autocomplete query, which leads to some strange bugs. It triggers a race condition, and updated suggestions are replaced by outdated suggestions.

Why does this happen? This is because every time the AJAX success handler is accessed, the list of suggestions displayed to the user is directly updated. The slowest AJAX request will always win the user's attention by blindly replacing the results, even when the replaced results may be updated.

To solve this problem, I created a suggestion manager-a unique source of real data-to manage the status of query suggestions. It knows that the current AJAX request has not yet been completed. When the user types something new, the outstanding AJAX request will be cancelled before the new request is issued, so that only one response handler can trigger the UI state update at a time.

All types of asynchronous operations or concurrency may cause similar race conditions. If the output depends on an uncontrollable sequence of events (such as network, device delay, user input, randomness, etc.), then race conditions will occur. In fact, if you are using a shared state, and the state depends on the order that will change according to uncertain factors, then in reality, the output is impossible to predict, that is, it is impossible to test correctly and fully understand. As Martin Odersky (the inventor of Scala) said:

        Non-determinism = parallel processing + variable state

In computing, the certainty of the program is usually the attribute we want. Maybe you think that since JS runs in a single thread, it should be immune to parallel processing, so it should be no problem with program determinism. However, as the AJAX example shows, a single-threaded JS engine does not mean that there is no concurrency. On the contrary, there are many sources of concurrency in JavaScript. API I/O, event listeners, web workers, iframes, and timeout all introduce uncertainty in the program. And these combined with shared state, you get a bunch of bugs.

Pure functions can help you avoid these types of bugs.

# Given the same input, always return the same output

With the double() function, you can replace function calls with results, and the program will treat them as the same thing. That is to say, in the program, no matter what the context is, no matter how many times or when you call, double(5) will always mean the same thing as 10.

But this does not apply to all functions. Some functions produce results that depend on information rather than the parameters passed in.

Consider the following example:

```js
Math.random(); // => 0.4011148700956255
Math.random(); // => 0.8533405303023756
Math.random(); // => 0.3550692005082965
```

Even if no parameters are passed to the function call, the output produced will be different, which means that Math.random() is an impure function.

Each time Math.random() is executed, a new random number between 0 and 1 will be generated, so obviously, you can't just replace it with 0.4011148700956255 without changing the meaning of the program.

If so, it produces the same result every time. When we ask the computer to generate a random number, it usually means that what we want is a different result from the number we got last time. What is the point if the same number is printed on each side of the dice?

Sometimes we want the computer to give the current time. Here we don’t need to go into the working mechanism of the time function, just copy the following code:

```js
const time = () => new Date().toLocaleTimeString();
time(); // => "5:15:45 PM"
```

What happens if you replace the time() function call with the current time?

Will always output the same time, the time when the function call was replaced. In other words, it will only produce the correct output once a day, and it will only run the program at the moment the function is replaced.

So obviously, the time() and double() functions are not the same.

**A function is a pure function only when it gives the same output and always produces the same output.** You may remember this rule from algebra class: the same input value will always map to the same output value. However, multiple input values can also be mapped to the same output value. For example, the following functions are pure functions:

```js
const highpass = (cutoff, value) => value >= cutoff;
```

The same input value will always be mapped to the same output value:

```js
highpass(5, 5); // => true
highpass(5, 5); // => true
highpass(5, 5); // => true
```

Multiple input values may map to the same output value:

```js
highpass(5, 123); // true
highpass(5, 6); // true
highpass(5, 18); // true

highpass(5, 1); // false
highpass(5, 3); // false
highpass(5, 4); // false
```

# Pure functions do not produce side effects

A pure function does not produce side effects, which means that it cannot change any external state.

# Immutability

JavaScript parameters are passed by reference, that is, if a function wants to modify an object parameter or an attribute on an array parameter, it will modify the state that can be accessed outside the function. Pure functions cannot modify the external state.

Consider the following addToCart() function, which is an impure function that modifies the state:

```js
// Impure addToCart modify an existing shopping cart
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

By passing in a shopping cart, the items added to the cart, and the number of items, the function works. Then the function returns the same shopping cart with the products added to it.

The problem is that we just modified some shared state. Other functions may depend on the state of the shopping cart object before the addToCart() function is called, and now we have modified this shared state. If we modify the order for which the function has been called, we have to worry about what it will do to the program logic. Kind of influence. Refactoring the code will cause bugs to appear, which will mess up the order and make customers unhappy.

Now consider the following version:

```js
// Pure function addToCart() returns a new shopping cart without modifying the original shopping cart
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

In this example, there is an array nested in an object, which is why I do a deep copy. This is more complicated than the state you will often deal with. In most cases, you can break it into smaller pieces.

For example, Redux will let you combine reducers instead of processing the entire application state in each reducer. The result of this is that you don't have to create a deep copy of the entire application state every time you only want to update a small part. Instead, use non-destructive array methods or Object.assign() to update a small part of the application state.

[Excerpt from: [Zhongcheng Translation] Conquering JavaScript Interview: What is a pure function?](https://zcfy.cc/article/master-the-javascript-interview-what-is-a-pure-function-2186.html)
