---
layout: post
title: "du查询文件夹占用空间，自动删除超过N天的文件"
date: '2017-01-09 16:20:02 +0800'
categories: linux
tags: linux du crontab find linux-command
---
> 查找占用大的文件，删除掉，如日志文件

# 场景
收到系统磁盘报警了，需要在快速找出哪些文件占用过大，及时清理，一般都是日志占用，可以做成定时任务，超过多少天的自动清理

# 查找占用空间最大的文件
```bash
# 查找 /var 下最大的，排前10的文件
$ du -a /var | sort -n -r | head -n 10
```

# 删除超过N天的文件
比如：`clean_expired_logs.sh`
```bash
# 清理 /path/log 目录超过10天的 *.log 文件
$ find /path/log -name "*.log" -type f -mtime +10 | xargs rm -rf
```

# 定时任务
```bash
# 编辑定时任务，一行代表一个定时任务
# "30 05 * * *" 代表每天的 05:30:00 分钟执行任务
$ crontab -e
30 05 * * * sh /path/clean_expired_logs.sh

# 查看有哪些定时任务
$ crontab -l
30 05 * * * sh /path/clean_expired_logs.sh
```

参考：
- [How Do I Find The Largest Top 10 Files and Directories On a Linux / UNIX / BSD?](https://www.cyberciti.biz/faq/how-do-i-find-the-largest-filesdirectories-on-a-linuxunixbsd-filesystem/)
- [linux crontab格式和详细例子](http://dolphin-ygj.iteye.com/blog/455640)
