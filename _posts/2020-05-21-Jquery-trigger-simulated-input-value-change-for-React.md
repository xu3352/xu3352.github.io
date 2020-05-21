---
layout: post
title: "React JS文本框模拟输入值更改"
keywords: "javascript;reactjs,vue"
description: "`React JS`(或`Vue`)文本框模拟输入值更改"
tagline: ""
date: '2020-05-21 22:49:01 +0800'
category: javascript
tags: javascript react vue
---
> {{ page.description }}

# 代码

做成 jquery 扩展方法

```js
jQuery.fn.valReact = function(text) {
    if (!this.is(':focus')) this.focus();
    let input = this[0];
    if (!input) return;
    let lastValue = input.value;
    input.value = text;
    let event = new Event('input', { bubbles: true });
    // hack React15
    event.simulated = true;
    // hack React16 内部定义了descriptor拦截value，此处重置状态
    let tracker = input._valueTracker;
    if (tracker) {
      tracker.setValue(lastValue);
    }
    input.dispatchEvent(event);
}
```

使用:
```js
$("#inputId").valReact('hello');
```

---
参考：
- [What is the best way to trigger onchange event in react js](https://stackoverflow.com/questions/23892547/what-is-the-best-way-to-trigger-onchange-event-in-react-js
){:target='blank'}
- [Trigger simulated input value change for React 16](https://github.com/facebook/react/issues/11488){:target='blank'}
