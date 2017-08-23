---
layout: post
title: "将Shell脚本分发到多台服务器并执行"
tagline: ""
description: "多台服务器的 `Tomcat` 日志和其他日志需要不定期的清理, 于是做成脚本工具"
date: '2017-08-23 15:17:30 +0800'
category: linux
tags: tomcat shell log tools linux
---
> {{ page.description }}

# 缘由
由于之前做过一个自动发现并备份和清理的脚本: [rotate_tomcat_log.sh](https://xu3352.github.io/linux/2017/08/21/tomcat-rotate-catalina.out-log)     

但是没有解决一个问题, 那就是如果有多台服务器的话, 每台服务器都需要相同的操作来走一遍

如果是2~3台的话就忍了, 如果有10来台甚至更多, 那么还是挺费劲的

于是就想到使用脚本来循环的安装清理脚本和加入定时任务, 按照这个思路其实也是可以的, 不过有更好的路子: 既然都已经上传清理脚本了, 那么直接执行不就可以了么

万一以后定时器要改个时间, 又麻烦了, 所以其实可以拿内网的一台机器做一个定时任务, 然后循环登陆每台机器, 执行清理脚本即可

思考: `如果以后还有类似的每台机器都要搞一遍的需求呢?`

# 分发脚本
所以这个做工具的功能需要: 
1. 上传指定的脚本文件 
2. 在目标机器上执行刚刚上传的脚本

我把这个工具起名为:`batch_distribute.sh`
```bash
#!/bin/bash
#author:xu3352@gmail.com
#desc:distribute script to multi servers

# params
USER=root
FILE=$1

# SERVER_HOSTS=(121.41.39.xxx 116.62.100.xxx)
SERVER_HOSTS=

## output console log with timestamp
function log() {
    echo `date "+%Y-%m-%d %H:%M:%S"` ':' $1
}

## append list
function server_hosts_append() {
    local LEN=${#SERVER_HOSTS[*]}
    SERVER_HOSTS[$LEN]=$1
}

## init server list
function init_server_hosts() {
    ## empty list
    unset SERVER_HOSTS
    ## my server ip
    server_hosts_append 121.41.39.xxx
    server_hosts_append 116.62.100.xxx
}

## copy file to remote server (check file whether exists)
function scp_file() {
    local _USER=$1
    local _SERVER_HOST=$2
    local _FILE=$3

    if [ ! -f "$_FILE" ]; then
        log "remote shell scrpt: $_FILE not exists ..."
        exit 1
    fi

    log "scp $_FILE $_USER@$_SERVER_HOST:/tmp/" 
    scp $_FILE $_USER@$_SERVER_HOST:/tmp/
}

## execute target shell script on remote server
function remote_execute() {
    local _USER=$1
    local _SERVER_HOST=$2
    local _FILE=/tmp/$(basename $3)

    ssh -tt $_USER@$_SERVER_HOST "
        chmod 755 $_FILE
        sh $_FILE
        rm -rf $_FILE
        exit
    "
}

## main job
do_job() {
    if [ ! -f "$FILE" ]; then
        log "you need a bash script file to remote execute ..."
        exit 1
    fi

    # init 
    init_server_hosts

    # for loop
    local LEN=${#SERVER_HOSTS[*]}
    for (( i=0; i<$LEN; i++ ))
    do
        local SERVER_HOST=${SERVER_HOSTS[i]}
        log "HOST[$i/$LEN] : $SERVER_HOST"

        scp_file $USER $SERVER_HOST $FILE
        remote_execute $USER $SERVER_HOST $FILE

        log "HOST[$i/$LEN] : $SERVER_HOST remote execute complate!!!"
        echo ""
    done
}

## start job
do_job

```

有没有一种写高级语言代码的感觉!!!

测试脚本:`test.sh`
```bash
!/bin/bash

echo "hello world!"
```

使用方法: `batch_distribute.sh 远程脚本路径`
```bash
# 指定的几台服务器执行 test.sh 脚本
./batch_distribute.sh test.sh
```

说明:
- 服务器 IP 列表做成函数式动态调用追加的形式了, 使用起来方便点
- `scp` 做成一个函数调用
- `ssh` 做成一个函数
- 如果 `scp` 或 `ssh` 需要输入密码, 请移驾这里:[SSH免密码登陆(公钥认证)](https://xu3352.github.io/linux/2017/06/24/ssh-login-without-password)

# 高级用法
好了, 分发脚本工具做好了, 上面的测试已经小试牛刀, 厉害的来了

结合之前的: `rotate_tomcat_log.sh`, 还需要每台服务器安装一个定时任务来跑吗? 

显然只需要调用: `./batch_distribute.sh rotate_tomcat_log.sh` 就可以完成工作了

如果远程执行的脚本临时想加点东西, 但是脚本是以每台服务器定时任务的方式跑的, 那么就得全部重新上传一遍了, 万一定时任务还要修改时间呢... WTF ...

而使用分发工具: `只需要改一个地方, 全部都好使!`

如果需要定时任务, 可以拿内网的一台服务器, 做一个定时任务, 然后执行分发脚本调用就可以了

---
参考：
- [Tomcat 备份和清理 catalina.out 文件 (高级版)](https://xu3352.github.io/linux/2017/08/21/tomcat-rotate-catalina.out-log)
- [What is the cleanest way to ssh and run multiple commands in Bash?](https://stackoverflow.com/questions/4412238/what-is-the-cleanest-way-to-ssh-and-run-multiple-commands-in-bash)
- [Shell 定义数组](http://opus.konghy.cn/shell-tutorial/chapter2.html#array)

