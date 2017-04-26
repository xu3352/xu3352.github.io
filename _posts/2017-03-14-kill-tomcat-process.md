---
layout: post
title: "如何kill 掉 tomcat 所有的进程"
date: '2017-03-14 17:57:33'
categories: tomcat
tags: tomcat
---

> 一条命令行 ```kill tomcat``` 进程

# 霸道的kill
```bash
#kill 掉指定的tomcat
ps aux |grep "$TOMCAT_HOME"|grep -v grep|tr -s ' '|cut -d' ' -f2|xargs kill -9

#展示所有匹配的tomcat PID，比如：1.有多个tomcat 2.tomcat被启动多次
ps aux |grep "$TOMCAT_HOME"|grep -v grep|tr -s ' '|cut -d' ' -f2|xargs echo
```

