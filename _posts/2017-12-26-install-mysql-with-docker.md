---
layout: post
title: "Docker安装MYSQL"
tagline: ""
description: "docker 安装最新版的 mysql"
date: '2017-12-26 12:52:01 +0800'
category: linux
tags: mysql docker linux
---
> {{ page.description }}

# 拉取镜像
```bash
# 默认标签即 :latest 
$ docker pull mysql
```

# 初始化mysql容器
```bash
$ docker run -p 3306:3306 \
    --name mysql \
    -v /data/mysql/data:/var/lib/mysql \
    -e MYSQL_ROOT_PASSWORD=123456 \
    -d mysql
```
**详解**:
- `-p 3306:3306` - 端口映射, `本地端口:容器端口`
- `--name mysql` - 容器命名为: mysql, 容器管理时用(启动/停止/重启/查看日志等)
- `-v /data/mysql/data:/var/lib/mysql` - 数据存储目录映射到本地 `/data/mysql/data` (目录不存在的话先创建)
- `-e MYSQL_ROOT_PASSWORD=123456` - 设置环境变量, 这里设置的ROOT的初始密码, 其他环境变量参考最后的官方镜像文档 
- `-d` - 以后台模式运行
- `mysql` - 要启动的镜像 这里相当于: `mysql:latest`


---
参考：
- [Docker_Mysql官方镜像](https://hub.docker.com/_/mysql/)
- [Docker使用官方mysql镜像](http://phonzia.github.io/2016/09/Docker%E4%BD%BF%E7%94%A8%E5%AE%98%E6%96%B9mysql%E9%95%9C%E5%83%8F)

