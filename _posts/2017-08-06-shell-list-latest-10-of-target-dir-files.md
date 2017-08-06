---
layout: post
title: "shell列出目录最新的10个文件"
tagline: ""
description: "ls + head 组合命令查询目录最新的N个文件"
date: '2017-08-06 21:48:43 +0800'
category: linux
tags: linux-command shell linux
---
> {{ page.description }}

# 组合命令
直接上代码:`ll_head`
```bash
#!/bin/bash
#author:xu3352@gmail.com
#desc: list latest 10 of target dir files

DIR=$1

NUM=10
# if $2 is not null
if [ $2 ]; then
    NUM=`echo "$2 + 0" | bc`
fi
# NUM need great tham 10
if [ $NUM -lt 10 ]; then
    NUM=10
fi

# list files
ls -lht $DIR |head -$NUM
```
shell 的字符串转 int 还是有点别扭

# 使用
```shell
# 当前目录最新的10个文件
$ ll_head

# 指定目录最新的10个文件
$ ll_head _posts

# 指定目录，最新的 20 个文件
$ ll_head _posts 20
```

---

参考：
- [In bash shell script how do I convert a string to an number](https://stackoverflow.com/questions/1786888/in-bash-shell-script-how-do-i-convert-a-string-to-an-number)

