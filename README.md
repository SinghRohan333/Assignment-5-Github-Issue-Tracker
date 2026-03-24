# 📝 JavaScript Questions & Answers

---

### 1️⃣ What is the difference between var, let, and const?

So basically all three are used to declare variables in JavaScript but they behave differently.

`var` is the old way of doing it. The problem with var is something called "hoisting" — it gets moved to the top of its scope even before the code runs. Also var is function-scoped, not block-scoped, which means if you declare it inside an if block, it can still be accessed outside of it. This caused a lot of bugs back in the day. 😬

`let` was introduced in ES6 and it's block-scoped. So if you declare a variable with let inside a loop or if block, it stays inside that block. It can also be reassigned later which is useful. ✅

`const` is also block-scoped like let, but the difference is you can't reassign it after declaring. So if you know a value won't change, use const. One thing to note though — if it's an object or array, you can still modify the contents, you just can't point the variable to a completely new object. 🔒

In modern code, most people just use const by default and only use let when they actually need to reassign something. var is mostly avoided now.

---

### 2️⃣ What is the spread operator (...)?

The spread operator is the three dots `...` in JavaScript. It basically spreads out the elements of an array or the properties of an object. 🌀

For arrays, instead of doing stuff like concat to merge two arrays, you can just do:

```js
const merged = [...arr1, ...arr2];
```

For objects, it's great for copying or merging:

```js
const newObj = { ...oldObj, newKey: "value" };
```

This makes a shallow copy of oldObj and adds a new property to it. Without spread you'd have to use Object.assign which is more verbose.

It's also used in function calls when you want to pass array items as individual arguments. Really useful and cleaner than the old ways. 🙌

---

### 3️⃣ What is the difference between map(), filter(), and forEach()?

All three loop over arrays but they serve different purposes. 🔄

`forEach()` just runs a function for each element. It doesn't return anything — it's basically just doing some action on each item, like logging them or updating something outside the loop. You can't chain it or use the result directly.

`map()` also loops through each element but it transforms them and returns a new array. So if you have an array of numbers and want to double them all, map is perfect. The original array stays unchanged and you get a brand new one back. 🗺️

`filter()` goes through each element and keeps only the ones that pass a condition. It also returns a new array. So if you want only the open issues from a list, you'd use filter with a condition like `issue.status === "open"`. 🔍

Quick summary:
- 🔁 `forEach` → just do something, no return value
- 🔄 `map` → transform each item, returns new array
- 🧹 `filter` → keep items that match a condition, returns new array

---

### 4️⃣ What is an arrow function?

Arrow functions are a shorter way to write functions in JavaScript, introduced in ES6. ⚡

Normal function:
```js
function add(a, b) {
  return a + b;
}
```

Arrow function:
```js
const add = (a, b) => a + b;
```

Much cleaner right? If the function body is just one expression, you don't even need the curly braces or the return keyword. 😎

But arrow functions aren't just about looks — they also handle `this` differently. Regular functions have their own `this` context which can cause confusion. Arrow functions don't have their own `this`, they just use the `this` from wherever they were defined. This is actually really helpful inside callbacks and event listeners. 👍

---

### 5️⃣ What are template literals?

Template literals are a way to create strings in JavaScript using backticks instead of quotes. The main advantage is you can embed variables and expressions directly inside the string using `${}` syntax. 🧵

Old way:
```js
const msg = "Hello " + name + ", you have " + count + " messages.";
```

With template literals:
```js
const msg = `Hello ${name}, you have ${count} messages.`;
```

Way more readable! ✨ You can also write multi-line strings without using `\n`:

```js
const html = `
  <div>
    <p>${title}</p>
  </div>
`;
```

This is super useful when building HTML strings dynamically in JavaScript, which is exactly what I did in this project when generating the issue cards. 🚀
