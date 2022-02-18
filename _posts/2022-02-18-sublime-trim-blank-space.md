---
layout: post
title: "sublime去掉多余的空白字符"
keywords: "sublime-text,trim,space"
description: "sublime保存时, 自动去掉多余的空白字符"
tagline: ""
date: '2022-02-18 13:46:32 +0800'
category: ide
tags: sublime-text-3
---
> {{ page.description }}

# 首选项设置
把 `trim_trailing_white_space_on_save` 设置为 `true` 即可
```json
    ...
    "translate_tabs_to_spaces": true,
    "trim_trailing_white_space_on_save": true
    ...
```

![](https://img-blog.csdnimg.cn/20200715150523380.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQxOTA4NTIx,size_16,color_FFFFFF,t_70){:width="100%"}

---
参考：
- [保存自动去除行尾空格](https://blog.csdn.net/qq_41908521/article/details/107360927){:target='blank'}

