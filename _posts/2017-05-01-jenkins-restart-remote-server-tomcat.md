---
layout: post
title: "Jenkins重启远程服务器的Tomcat"
date: '2017-05-01 18:21:00 +0800'
category: linux
tags: jenkins tomcat shell linux
---
> Jenkins 一键重启服务器所有的 Tomcat 服务

# 整体流程
1. Jenkins 发起一次构建任务 
2. 执行本地 shell 脚本 
3. 调用远程服务器 shell 脚本 
4. 自动检测服务器远程的 tomcat (可以是多个)
5. 依次 kill tomcat 并重启 tomcat

# Jenkins是什么
[Jenkins](https://jenkins.io/) 是一个用Java编写的开源的持续集成工具。 
在与Oracle发生争执后，项目从Hudson项目复刻。 
Jenkins提供了软件开发的持续集成服务。 
它运行在Servlet容器中（例如Apache Tomcat）。

# 新建一个Job
1. 进入 jenkins 首页，当然需要登录一下哦
2. 点击左侧菜单的 【新建】Job，输入一个Item名称：tomcat-restart
3. 配置 “tomcat-restart” Job，这里选择【参数化构建过程】，因为这里我们需要选择远程服务器的IP，取名叫：ip。后面执行 shell 的时候以变量的形式传递
4. 源码管理这块选择“None”
5. 构建【增加构建步骤】，选择【Execute Shell】 选项，输入我们本地执行的脚本，这里我们引入本地的 shell 脚本文件
6. 点击【保存】按钮保存设置
```bash
echo "server:" $ip " Tomcat 即将重启!"
/root/.jenkins/workspace/shell/tomcat-restart.sh $ip
```
参考图：
![](http://on6gnkbff.bkt.clouddn.com/20170501111913_jenkins-config-job-01.png){:width="100%"}
![](http://on6gnkbff.bkt.clouddn.com/20170501111914_jenkins-config-job-02.png){:width="100%"}

# 配置本地执行脚本
`/root/.jenkins/workspace/shell/tomcat-restart.sh`代码：
```bash
#!/bin/sh
# desc: 重启 Tomcat

# ip param
HOST=$1

## ssh to remote server
ssh -tt root@$HOST <<EOF
    sh /tmp/tomcat-restart.sh
    exit
EOF
```

# 配置远程服务器执行脚本
在远程服务器执行指定的脚本可以根据当前服务器定制一些步骤，不足的地方就是就是必须得每台服务器都 copy 一份代码了, 不过批量分发的也可以做成脚本的，嘿嘿

`/tmp/tomcat-restart.sh`代码：
```bash
#!/bin/sh

# desc tomcat重启
# 1.找出所有 tomcat 的进程ID 和 安装目录
# 2.挨个 kill 后重新启动即可

PID=
CPU=
TOMECAT_DIR=
TMP_PATH=/tmp/tomcat_pids.txt

# 1
ps aux | grep -v grep | grep "tomcat" | awk '{for(i=1;i<=NF;i++){if ($i ~ /catalina.base/){printf("%s %s %s\n", $2, $3, $i)}}}' > $TMP_PATH

## 2
echo "Tomcat Pid Infos:$TMP_PATH"
cat $TMP_PATH

# for loop
while read line
do
    # echo "line:" $line
    PID=`echo $line | awk '{print $1}'`
    CPU=`echo $line |awk '{print $2}'`
    TOMECAT_DIR=`echo $line |awk '{print $3}' |awk -F'=' '{print $2}'`
    echo "PID:$PID CPU:$CPU TOMCAT_HOME:$TOMECAT_DIR"

    # gc 信息打印
    echo "show gc info:jstat -gc $PID 1000 5"
    jstat -gc $PID 1000 5

    # kill and startup tomcat
    echo "kill and startup tomcat........"
    kill -9 $PID

    #cd $TOMCAT_HOME
    $TOMECAT_DIR/bin/startup.sh
    sleep 3

    # ps tomcat
    echo "check tomcat running........"
    ps aux|grep $TOMECAT_DIR
    echo "$TOMCAT_HOME 重启完毕"
    sleep 2
done < $TMP_PATH
```

# 运行Job
执行就简单了，点击列表右侧运行按钮，然后会提示你选择设定的ip下拉菜单，点击【开始构建】即可。构建时可以查看【Console Output】实时控制台输入日志，非常的方便
![](http://on6gnkbff.bkt.clouddn.com/20170501111915_jenkins-run-job.png){:width="100%"}


参考：
- [awk字段包含字符串](http://www.unix.com/unix-for-dummies-questions-and-answers/181267-how-print-column-contains-string-delimited-file-unix.html)
- [Shell脚本 逐行处理文本文件](http://www.cnblogs.com/dwdxdy/archive/2012/07/25/2608816.html)

