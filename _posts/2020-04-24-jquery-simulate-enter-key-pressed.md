---
layout: post
title: "jQuery如何模拟一个正常的回车事件"
keywords: "jquery,javascript,event"
description: "如何模拟一个正常的回车事件"
tagline: ""
date: '2020-04-24 16:30:43 +0800'
category: javascript
tags: javascript jquery
---
> {{ page.description }}


# 回车事件

`回车` 事件很常见, 不过大部分都是用来监听用户按下 `回车` 按钮用的; 不过模拟一个正常用户的 `回车` 事件却很少用到

用纯JS的方式简单封装一下:

```js
jQuery.fn.enter = function(text) {
    var ke = new KeyboardEvent("keydown", {
        bubbles: true, cancelable: true, keyCode: 13
    });
    this[0].dispatchEvent(ke);
}
```

---
参考：
- [jquery (or pure js) simulate enter key pressed for testing](https://stackoverflow.com/questions/3276794/jquery-or-pure-js-simulate-enter-key-pressed-for-testing){:target='blank'}

