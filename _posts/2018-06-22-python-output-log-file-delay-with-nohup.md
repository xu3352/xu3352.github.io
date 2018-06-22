---
layout: post
title: "Python nohup 日志输出延迟问题"
tagline: ""
description: "使用 `nohup` 在后台跑任务时, `python` 脚本的 `print()` 日志需要等待几分钟到十几分钟才能看到, 而且还是部分..."
date: '2018-06-22 16:34:22 +0800'
category: python
tags: nohup log python
---
> {{ page.description }}

# 缓存
假如执行的命令如下:
```bash
nohup python ./cmd.py > cmd.log &
```
一开始 `cmd.log` 日志文件会立即创建, 可是过了几分钟, 这个日志文件还是空的; 反正就是很长时间才会写入部分日志, 这个日志的写入缓存还是太夸张了点... 假如现在立马终止程序, 后面没有输出的日志就直接消失了... 

# 解决
> You can run Python with the -u flag to avoid output buffering:
```bash
nohup python -u ./cmd.py > cmd.log &
```

没错, 只需要执行的时候加一个 `-u` 的参数避免延迟缓存写入

---
参考：
- [Nohup is not writing log to output file](https://stackoverflow.com/questions/12919980/nohup-is-not-writing-log-to-output-file)

