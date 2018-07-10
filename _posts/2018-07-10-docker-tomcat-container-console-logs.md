---
layout: post
title: "Docker Tomcat控制台日志查看"
tagline: ""
description: "`Docker` `Tomcat` 容器启动后, 找不到 `catalina.out` 控制台日志?"
date: '2018-07-10 11:58:12 +0800'
category: docker
tags: logs tomcat docker
---
> {{ page.description }}

# docker容器日志
`docker` 容器运行分前端和后端(运行时加参数 `-d`), 前端运行直接就可以看到终端输出的日志信息; 后端运行就不能直接看到日志内容了; 

这时候要查看容器日志, 有2种方法:
- `docker attach` - 链接到正在运行中的容器, 这是可以看到后面输出的日志内容, 容易误操作, 按到`Ctrl+C`就停止容器了... 不过好像可以通过参数避免:`--sig-proxy=false`
- `docker logs` - 可以看到容器所有的日志, 非常灵活, 也可以查看实时日志, 像:`tail -f` 一样; 推荐

# 查看容器日志脚本
`tomcat` 容器以后端方式运行时, 默认的控制台的日志就不是 `catalina.out` 文件了, 而是作为容器的日志存放起来了, 可以通过 `docker logs` 进行实时查看

`tomcat8` 为容器的名称, 默认查看 `tomcat8` 容器当天控制台最后100条的日志信息, 查看行数可以已第一个参数传过去
```bash
$ cat logs_tomcat8.sh
#!/bin/bash
# see http://www.runoob.com/docker/docker-logs-command.html

NAME=tomcat8
NUM=100
DATE=`date "+%Y-%m-%d"`

# 设置默认值
if [ $1 ]; then
    NUM=`echo "$1 + 0" | bc`
fi

# 进入容器内部
# docker logs --since="2018-07-01" --tail=10 tomcat8
echo "docker logs --since=\"$DATE\" --tail=$NUM $NAME"
docker logs --since="$DATE" --tail=$NUM $NAME
```
如果想实时输出日志, 最后可以加一个 `-f` 参数

# 使用手册
```bash
$ docker logs --help
Usage: docker logs [OPTIONS] CONTAINER
  Options:
        --details        显示更多的信息
    -f, --follow         跟踪日志输出，最后一行为当前时间戳的日志
        --since string   显示自具体某个时间或时间段的日志
        --tail string    从日志末尾显示多少行日志， 默认是all
    -t, --timestamps     显示时间戳
```

一般常用: 实时查看容器最新的日志 效果同:`tail -100f catalina.out`
```
docker logs --tail=100 -f CONTAINER
```

---
参考：
- [Docker logs 命令](http://www.runoob.com/docker/docker-logs-command.html)
- [从敲下docker logs开始理解docker日志原理](https://segmentfault.com/a/1190000010086763)
- [日志管理之 Docker logs - 每天5分钟玩转 Docker 容器技术](https://www.ibm.com/developerworks/community/blogs/132cfa78-44b0-4376-85d0-d3096cd30d3f/entry/%E6%97%A5%E5%BF%97%E7%AE%A1%E7%90%86%E4%B9%8B_Docker_logs_%E6%AF%8F%E5%A4%A95%E5%88%86%E9%92%9F%E7%8E%A9%E8%BD%AC_Docker_%E5%AE%B9%E5%99%A8%E6%8A%80%E6%9C%AF_87?lang=en)
- [Docker attach 命令](http://www.runoob.com/docker/docker-attach-command.html)

