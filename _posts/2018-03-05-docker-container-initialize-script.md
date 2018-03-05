---
layout: post
title: "Docker容器初始化/启动脚本"
tagline: ""
description: "容器初始化前加一个容器是否已存在的检查, 如果存在则直接启动容器, 否则新建一个容器并启动"
date: '2018-03-05 16:00:36 +0800'
category: docker
tags: docker linux
---
> {{ page.description }}

这里以tomcat容器为例

# 容器初始化
如果是第一次创建tomcat容器时, 直接执行以下脚本即可:`docker_init_tomcat8.sh`
```bash
#!/bin/bash

# tomcat8 容器初始化
docker run --name tomcat8 -d \
	-v /data/tomcat8/webapps:/usr/local/tomcat/webapps \
	-v /data/tomcat8/logs:/usr/local/tomcat/logs \
	-v /etc/localtime:/etc/localtime:ro \
	-e TZ="Asia/Shanghai" \
	-p 9005:8080 tomcat:8.0
```

# 检查容器是否存在
如果容器已经存在, 再次执行初始化脚本则会失败, 所以可以加一个检查的脚本:`docker_container_isrunning_check.sh`
```bash
#!/bin/bash
# 检查容器是否已经存在, 如果已经存在则不需要再创建了. 如果是停止状态的则重新启动一下
# $NAME 为容器名称

IS_EXISTS=$(docker ps -a | grep $NAME | wc -l)
if [[ $IS_EXISTS == 1 ]]; then
    echo "container $NAME is exists..."

    # 检查是否正在运行
    IS_RUNNING=$(docker ps | grep $NAME | wc -l)
    if [[ $IS_RUNNING == 1 ]]; then
        echo "container $NAME is running... do nothing..."
    fi

    # 检查是否已经停止运行
    IS_EXITED=$(docker ps -a | grep $NAME | grep 'Exited' | wc -l)
    if [[ $IS_EXITED == 1 ]]; then
        echo "container $NAME is exited... prepare start..."
	docker container start $NAME
    fi

    exit 0
fi
```
最后如果容器已经存在, 直接退出; 后面的脚本就不会执行了

# 嵌入初始化脚本
在初始化脚本中, 把容器名称做成变量`NAME`, 然后载入检查的脚本即可

```bash
#!/bin/bash

NAME=tomcat8

# 检查容器是否已经运行
. docker_container_isrunning_check.sh

# tomcat8 容器初始化
docker run --name $NAME -d \
	-v /data/tomcat8/webapps:/usr/local/tomcat/webapps \
	-v /data/tomcat8/logs:/usr/local/tomcat/logs \
	-v /etc/localtime:/etc/localtime:ro \
	-e TZ="Asia/Shanghai" \
	-p 9005:8080 tomcat:8.0
```
其他的容器初始化脚本也可以这么直接嵌入即可

---
参考：
- [Docker部署本地项目到Tomcat中(jenkins配合部署)](https://xu3352.github.io/docker/2017/12/18/docker-deploy-local-project-to-tomcat)

