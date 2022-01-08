---
layout: post
title: "浏览器自带的语音合成API"
keywords: "api speech-synthesis"
description: "The Speech Synthesis API is an awesome tool provided by modern browsers."
tagline: ""
date: '2022-01-08 14:38:01 +0800'
category: javascript
tags: javascript speech-synthesis-api
---
> {{ page.description }}

# 语音合成API

现代浏览器都支持

![desc](https://flaviocopes.com/speech-synthesis-api/caniuse.png){:width="100%"}

# 上手
直接使用即可
```javascript
// 直接使用
speechSynthesis.speak(new SpeechSynthesisUtterance('Hey'))

// 简单封装一下
function speak(str) {
    if (!str) return;
    str = str.replace(/<[^>]+>/g, "");
    var utter = new window.SpeechSynthesisUtterance(str);
    utter.lang = 'zh-cn';
    utter.volume = 1;
    utter.rate = 1.4;
    utter.pitch = 2;
    speechSynthesis.speak(utter)
}
```

---
参考：
- [语音合成API](https://blog.csdn.net/cuk0051/article/details/108340730){:target='blank'}
- [The Speech Synthesis API](https://flaviocopes.com/speech-synthesis-api/){:target='blank'}
