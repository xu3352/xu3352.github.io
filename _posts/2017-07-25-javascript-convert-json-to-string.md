---
layout: post
title: "JavaScript Json 和 字符串 互转"
tagline: ""
description: "JavaScript Json 和 字符串 相互转换"
date: '2017-07-25 21:44:11 +0800'
category: javascript
tags: json javascript
---
> {{ page.description }}

# Json 转字符串
```javascript
var obj = JSON.parse('{ "name":"John", "age":30, "city":"New York"}');
console.log( obj );
console.log("name:" + obj.name );
```

# 字符串 转 Json
```javascript
var obj = {name: "John", age: 30, city: "New York"};
console.log( obj );

var jsonStr = JSON.stringify(obj);
console.log( jsonStr );
```

---
参考：
- [JSON.stringify()](https://www.w3schools.com/js/js_json_stringify.asp)
- [JSON.parse()](https://www.w3schools.com/js/js_json_parse.asp)

