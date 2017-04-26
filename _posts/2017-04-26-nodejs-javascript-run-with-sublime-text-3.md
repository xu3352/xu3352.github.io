---
layout: post
title: "Subline Text 3里运行 javascript"
date: '2017-04-26 16:07:00 +0800'
categories: coding
tags: nodejs javascript
---

> Sublime Text 也可以直接运行 JS 了，每次粘贴到浏览器里运行多麻烦

# 安装 NodeJs
```bash
# 使用 brew 安装，如果没有brew，赶紧安装一个吧
$ brew install node

# 检测是否安装成功
$ npm install -g grunt-cli
```

# Sublime Text 运行环境
```Tools -> Build System -> New Build System...```
保存时取名为 ```node``` 或 ```javascript``` 之类的即可
```
{
  "cmd": ["node", "$file"],
  "selector": "source.js",
  "windows" : {
     "shell": true
  }
}
```

# 测试一段 js 代码
```javascript
function rand(min, max) {
    return Math.floor((Math.random() * max) + min);
}

function genChars(n) {
    var chars = "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var line = "";
    for (var i = 0; i < n; i++) {
        var index = rand(0, chars.length);
        line += chars.substr(index, 1);
    }
    console.log(line);
}

// run
for (var num = 0; num < 10; num++) {
    genChars(40);
}
```
运行：```Cmd + B``` 直接运行就能看到效果了 或者 手动选择 ```Tools -> Build System -> node```

![效果图](http://on6gnkbff.bkt.clouddn.com/20170426083256_nodejs-run-javascript.png)

参考：
- [Run JavaScript code SublimeText](http://stackoverflow.com/questions/38887342/run-javascript-code-sublimetext)
- [Install Node.js and npm using Homebrew on OS X and macOS](https://changelog.com/posts/install-node-js-with-homebrew-on-os-x)

