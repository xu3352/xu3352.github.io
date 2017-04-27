---
layout: post
title: "如何切分 tomcat 的 catalina.out 日志"
date: '2017-04-24 22:27:00 +0800'
category: linux
tags: logrotate tomcat linux
---

> Linux系统提供的一个按天切分日志文件的工具

# logrotate工具
Linux一般自带了该命令，查看是否已安装，直接看手册吧```man logrotate```

# 配置文件
以 Tomcat 的 catalina.out 为例:
```bash
# 新建配置文件
$ vim /etc/logrotate.d/tomcat
# 内容如下
/var/log/tomcat/catalina.out {  
    copytruncate  
    daily  
    rotate 7  
    compress  
    missingok  
    size 5M  
}
```
关于上面的配置：
- **/var/log/tomcat/catalina.out** - 这里的路径即需要切割的日志文件路径
- **daily** - 按天为单位切分 catalina.out 日志文件
- **rotate** - 最多保存 **7** 个切分的日志
- **compress** - 切分后压缩处理 (gzip压缩)
- **size** - 如果 catalina.out 大小超过 **5M** 则切分
- **copytruncate** - 在创建备份之后清空原始文件(大部分程序是不能删除/移动原始文件的，即使之后又重新创建了一个名字一样的也是不行的)。在备份和清空的间隙日志可能会丢失一部分。控制台日志一般没那么严格的要求

# 如何工作的
1. 每天晚上 cron 定时任务会扫码目录 **/etc/cron.daily/**
2. 触发 **/etc/cron.daily/logrotate** 脚本，即运行脚本：
```bash
/usr/sbin/logrotate /etc/logrotate.conf
```
3. **/etc/logrotate.conf** 会扫码所有 **/etc/logrotate.d/** 目录的脚本
4. 触发 **/etc/logrotate.d/tomcat** 上面新建的配置

# 手动执行
```bash
# 创建好配置文件后，可以手动触发一下看效果了
/usr/sbin/logrotate /etc/logrotate.conf
```

# 更多logrotate选项
```bash
# 查询 man 手册
man logrotate
```

原文参考：[How to rotate Tomcat catalina.out](http://www.vineetmanohar.com/2010/03/howto-rotate-tomcat-catalina-out/#comments)

