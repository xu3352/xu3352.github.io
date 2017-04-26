---
layout: post
title: "Alfred md5加密 Workflows 插件"
date: '2017-01-15 17:49:31'
categories: tools alfred
tags: alfred
---

> Alfred md5加密 Workflows 插件

# 关键代码
```python
import hashlib
import sys

# remove \
query = "{query}".replace("\ ", " ")

## python2 md5
# result = hashlib.md5().update(query).hexdigest()

# python3 md5
result = hashlib.md5(query.encode("utf8")).hexdigest()

# output
sys.stdout.write(result)
```

# 注意事项
- 如果```{query}```里有空格，会被加上转译的斜杠，需要处理一下     
- 最开始直接用 ```print m2.hexdigest()``` 输出结果，不过最后会有一个换行；最后换成 ```sys.stdout.write``` 就没问题了
- 通知和剪贴板是必须的😆

![效果图](http://on6gnkbff.bkt.clouddn.com/20170419134521_alfred-md5-workflows.png)

下载资源：
[md5.alfredworkflow.zip](http://on6gnkbff.bkt.clouddn.com/20170419134522_Md5.alfredworkflow.zip)   
[Alfred 3.1.1 Mac破解版](http://www.sdifenzhou.com/alfred311.html)

参考：
[python3 convert String to MD5](http://stackoverflow.com/questions/13259691/convert-string-to-md5)

