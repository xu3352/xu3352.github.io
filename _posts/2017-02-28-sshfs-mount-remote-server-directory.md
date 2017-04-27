---
layout: post
title: "sshfs挂载远程主机目录"
date: "2017-02-28 16:48:40"
category: linux
tags: sshfs linux
---

> 最近查询日志比较频繁，而ssh登录远程服务器后很快就会过期，再加上多个服务器之间切换，多搞几次之后就有点不爽了😡

# 安装
sshfs 可很好的解决这个问题，可以用来作为日志服务器（比如可以收集多个服务器的日志，省得切换麻烦）
```bash
#安装，如果是Redhat，需要先安装epel，见下面的参考链接
yum install sshfs
```

- 优点：只需在一台机器上就可以看所有应用的日志了
- 缺点：由于我的是本地环境，如果日志量级很大，同步就会占用挺多网络资源，所以最好是线上内网环境


一种是：直接 ssh 到指定目录，可做成 alias 使用，这个很灵活，可以方便的使用：tail、cat、scp等命令

# 代码清单
```bash
ssh root@IP -t "cd /path/logs/; /bin/bash"
```

另一种解决方案：做成脚本😆
```bash
#!/bin/bash
#author:xu3352

SERVER_HOST=IP
SERVER=$1
PARAM=$2

# server name
case $SERVER in
    132)
        SERVER_HOST=IP1
        ;;
    *)
        SERVER_HOST=DEFAULT_IP
        ;;
esac

## functions
function log {
    echo '==========================' `date "+%Y-%m-%d %H:%M:%S"` ':' $1
}

log "you server host is:$SERVER_HOST"

# choose you file path
array=("path1" "path2")
len=${#array[*]}
for (( i=0; i<len; i++ ))
do
    echo "$i ${array[$i]}"
done
echo -n "choose you file path:[num]"
read FILE_INDEX
FILE=${array[$FILE_INDEX]}

## ssh tail file
log "ssh target server $SERVER_HOST and show logs"
ssh -tt root@$SERVER_HOST <<EOF
    tail -200f $FILE
    exit
EOF

# job down
log "log viewer job complate..."
```


参考：
- [sshfs把远程主机的文件系统映射到本地的目录中](http://www.fwolf.com/blog/post/329)
- [Red Hat 系列 Linux 啟用 EPEL Repo 教學（包含 RHEL、CentOS 與 Scientific Linux）](https://blog.gtwang.org/linux/redhat-linux-enable-epel-repo/)
- [安装epel源后，报错Error: Cannot retrieve metalink for repository: epel. Please verify its path..](http://jschu.blog.51cto.com/5594807/1750177)
- [ssh到指定目录](http://www.haow.ca/blog//2013/ssh/)

epel安装，我的是：`vim /etc/yum.repos.d/epel.repo` ，然后把 `mirrorlist` 里的 `https` 改成 `http` 后OK的

