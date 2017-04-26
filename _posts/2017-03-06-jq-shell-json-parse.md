---
layout: post
title: "shell脚本json工具包（jq）"
date: '2017-03-06 22:09:51'
categories: linux jq
tags: jq
---

> 用 curl 返回 json 时，捕捉某一个字段非常方便

# 安装
```bash
#安装
brew install jq
```

# 使用
```bash
#获取 json 对象的 name 的值
curl -s 'https://api.github.com/users/lambda' | jq -r '.name'
```

参考：
- [Parsing JSON with UNIX tools](http://stackoverflow.com/questions/1955505/parsing-json-with-unix-tools)

