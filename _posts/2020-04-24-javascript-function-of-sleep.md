---
layout: post
title: "JavaScript如何优雅的实现Sleep"
keywords: "javascript,sleep"
description: "JavaScript 如何优雅的实现 `sleep`"
tagline: ""
date: '2020-04-24 16:52:31 +0800'
category: javascript
tags: javascript sleep
---
> {{ page.description }}

# sleep

想要暂停一小会儿, 又不想嵌套一堆 `setTimeout`

直接贴人家的代码:
```js
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function demo() {
  console.log('Taking a break...');
  await sleep(2000);
  console.log('Two seconds later, showing sleep in a loop...');

  // Sleep in loop
  for (let i = 0; i < 5; i++) {
    if (i === 3)
      await sleep(2000);
    console.log(i);
  }
}

demo();
```

**注意事项**:
1. 方法名需要加上: `async` 关键词
2. 方法内部需要以: `await sleep(2000)` 方式调用

---
参考：
- [What is the JavaScript version of sleep()?](https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep){:target='blank'}
- [JavaScript Promise 对象](https://www.runoob.com/w3cnote/javascript-promise-object.html){:target='blank'}
- [js 箭头函数 lambda](https://www.liaoxuefeng.com/wiki/1022910821149312/1031549578462080){:target='blank'}
- [理解 JavaScript 的 async/await](https://segmentfault.com/a/1190000007535316)

