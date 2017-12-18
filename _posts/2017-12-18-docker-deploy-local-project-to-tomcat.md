---
layout: post
title: "Docker部署本地项目到Tomcat中(jenkins配合部署)"
tagline: ""
description: "jenkins 快捷部署项目到 docker tomcat 中"
date: '2017-12-18 13:57:46 +0800'
category: docker
tags: docker tomcat jenkins
---
> {{ page.description }}

# 拉取tomcat镜像
```bash
# 这里以 tomcat 8 为例
$ docker pull tomcat:8.0
```
已支持的标签(版本7~9): [官方 docker Tomcat](https://hub.docker.com/_/tomcat/)

# 初始化tomcat容器
目录准备
```bash
$ mkdir -p /data/tomcat8/webapps
$ mkdir -p /data/tomcat8/logs
```

初始化脚本:`docker_init_tomcat8.sh`
```
#!/bin/bash

# tomcat8 给内网服务器使用
docker run --name tomcat8 -d \
	-v /data/tomcat8/webapps:/usr/local/tomcat/webapps \
	-v /data/tomcat8/logs:/usr/local/tomcat/logs \
	-v /etc/localtime:/etc/localtime:ro \
	-e TZ="Asia/Shanghai" \
	-p 9005:8080 tomcat:8.0

```
详解:
1. `--name tomcat8` 容器命名为 tomcat8, 以后容器操作时用到; `-d` 以后台模式运行
2. `webapps` 目录映射到本地, 方便后面的项目部署
3. `logs` 日志映射到本地, 方便查日志
4. 时区调整, 不然时间可能会有点问题(还有catalina.out日志里的时间戳)
5. `-p 9005:8080` 端口映射, 开放本地端口 `9005`, 以:`http://ip:9005` 访问
6. `tomcat:8.0` 运行 `8.0` 标签版本, 也就是 `tomcat8` 了

直接运行脚本, 就可以创建一个叫 tomcat8 的容器, 并且已经运行起来了; 不过这个时候访问: `http://ip:9005` 什么也没有, 因为映射的本地的 `/data/tomcat8/webapps` 空目录, 把这个去掉就可以访问默认的Tomcat页面了

# 部署本地项目
由于前面把部署的目录映射到本地了, 所以项目直接解压到本地的指定目录即可完成部署
 
```bash
# 先停掉tomcat
$ docker container stop tomcat8

# 删除原来的项目(整体部署)
$ rm -rf /data/tomcat8/webapps/$PROJECT

# 手动解压war包 (也可以直接把 war 包丢到 webapps 下由tomcat解压)
$ unzip /tmp/$PROJECT-0.0.1-SNAPSHOT.war -d /data/tomcat8/webapps/$PROJECT

# 最后在启动tomcat
$ docker container start tomcat8
```

然后访问: `http://ip:9005/$PROJECT` 即可

# Tomcat 容器删除
```bash
# 删除前需要先停下来
$ docker container stop tomcat8

# 然后按容器名称删除
$ docker container rm tomcat8

# 日志查看(已经映射到本地)
$ docker logs tomcat8
```

删除之后就可以重新执行: `docker_init_tomcat8.sh` 重新初始化了

# 配合 jenkins 部署
直接做成脚本: `dev-deploy-docker.sh`
```bash
#!/bin/sh
# author: xu3352@gmail.com
# description: 自动部署war包到指定的内网docker服务器
# 1. mvn编译打包(jenkins完成)
# 2. scp到目标内网服务器, 并解压到指定目录
# 3. 重启docker tomcat容器


# 1
PROJECT=$1
HOST=192.168.7.251
WAR=$WORKSPACE/target/$PROJECT-0.0.1-SNAPSHOT.war

if [ ! -f "$WAR" ]; then
    echo "待发布的 war 包不存在：filepath=$WAR"
    exit 1
fi


# 3 scp war files
scp $WAR root@$HOST:/tmp
echo ".................... scp war files: $WORKSPACE/target/$PROJECT-0.0.1-SNAPSHOT.war "

# 4.docker container restart
ssh -tt root@$HOST <<EOF
    docker container stop tomcat8

    rm -rf /data/tomcat8/webapps/$PROJECT

    unzip /tmp/$PROJECT-0.0.1-SNAPSHOT.war -d /data/tomcat8/webapps/$PROJECT

    docker container start tomcat8

    exit
EOF
echo ".................... docker container restart tomcat8 "

```

使用:在jenkins mvn打包完成之后, 直接调用脚本部署到目标服务器即可
![](http://on6gnkbff.bkt.clouddn.com/20171218071743_1000.png){:width="100%"}

---
参考：
- [Docker 初体验 (2) - docker tomcat 部署本地 war 包项目](https://zhujun2730.github.io/2017/06/27/start-docker-2/)

