---
layout: post
title: "Linux下 Nginx 配置文件位置"
tagline: ""
description: "一般手动安装 Nginx 时, 安装目录都会放在 `/usr/local/nginx`, 但是快捷安装的就找不到安装目录了, 那么对应的配置文件在哪里呢?"
date: '2017-08-18 19:31:04 +0800'
category: linux
tags: nginx linux
---
> {{ page.description }}

# 定位位置
手动安装的目录一般是: `/usr/local/nginx`     
所以配置文件位置就是: `/usr/local/nginx/conf/nginx.conf`

利用 `nginx -t` 命令检查配置文件的语法, 可以看具体位置

```bash
# 1. 查看 nginx 的 PID, 通常为 80 端口
$ netstat -anop | grep 0.0.0.0:80
tcp    0    0   0.0.0.0:80    0.0.0.0:*    LISTEN   1291/nginx: worker  keepalive (0.00/0/0)

# 2. 通过PID(如:1291), 查询到正在运行的 nginx 命令位置
$ ll /proc/1291/exe
lrwxrwxrwx 1 www-data www-data 0 Aug 17 23:04 /proc/1291/exe -> /usr/sbin/nginx*

# 3. 利用 nginx -t 找到配置文件
$ /usr/sbin/nginx -t
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

另外 `ps aux | grep master | grep nginx` 也是可以找到 `nginx` 的主进程的

运气好的话, 直接就找到 `nginx` 的位置了
```bash
$ ps aux|grep nginx
www-data  1291  0.4  0.0  86364  2668 ?        S    Aug17   5:58 nginx: worker process
www-data  1292  0.4  0.0  86364  2668 ?        S    Aug17   5:44 nginx: worker process
www-data  1293  0.4  0.0  86364  2668 ?        S    Aug17   5:44 nginx: worker process
www-data  1297  0.4  0.0  86408  2676 ?        S    Aug17   5:42 nginx: worker process
root      1557  0.0  0.0  86012  2388 ?        Ss   Jul16   0:00 nginx: master process /usr/sbin/nginx
root     13865  0.0  0.0  13416   936 pts/0    R+   19:58   0:00 grep --color=auto nginx
```

---
参考：
- [ Linux下如何查看定位当前正在运行的Nginx的配置文件](http://blog.csdn.net/heiyueya/article/details/70148591)

