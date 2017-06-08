---
layout: post
title: "OpenVPN 使用账号+密码方式登陆"
tagline: ""
description: "使用账号+密码方式方便给多人分配不同的账号和密码，多人使用更加方便"
date: '2017-06-08 21:45:36 +0800'
category: linux
tags: openvpn linux
---
> {{ page.description }}

原文链接：[配置OpenVPN使用User/Pass方式验证登录](http://ylw6006.blog.51cto.com/470441/1009004)，不过有个大坑，后面讲        

鉴于上一篇文章已经成功的搭建好 OpenVPN 了，不过客户端直接使用证书就可以连接了，但是多个人使用的话，建议还是改为账号+密码方式的，这里介绍比较简单的一种方式

# 服务端配置
```bash
# 修改服务端配置文件，文件最后追加几行
$ vim /etc/openvpn/delta.conf

# use username and password login
auth-user-pass-verify /etc/openvpn/checkpsw.sh via-env
client-cert-not-required
username-as-common-name
script-security 3 execve
```
如果加上client-cert-not-required则代表只使用用户名密码方式验证登录，如果不加，则代表需要证书和用户名密码双重验证登录！

`/etc/openvpn/checkpsw.sh` 文件内容：
```bash
#!/bin/sh
###########################################################
# checkpsw.sh (C) 2004 Mathias Sundman <mathias@openvpn.se>
#
# This script will authenticate OpenVPN users against
# a plain text file. The passfile should simply contain
# one row per user with the username first followed by
# one or more space(s) or tab(s) and then the password.

PASSFILE="/etc/openvpn/psw-file"
LOG_FILE="/etc/openvpn/openvpn-password.log"
TIME_STAMP=`date "+%Y-%m-%d %T"`

###########################################################

if [ ! -r "${PASSFILE}" ]; then
  echo "${TIME_STAMP}: Could not open password file \"${PASSFILE}\" for reading." >> ${LOG_FILE}
  exit 1
fi

CORRECT_PASSWORD=`awk '!/^;/&&!/^#/&&$1=="'${username}'"{print $2;exit}' ${PASSFILE}`

if [ "${CORRECT_PASSWORD}" = "" ]; then 
  echo "${TIME_STAMP}: User does not exist: username=\"${username}\", password=\"${password}\"." >> ${LOG_FILE}
  exit 1
fi

if [ "${password}" = "${CORRECT_PASSWORD}" ]; then 
  echo "${TIME_STAMP}: Successful authentication: username=\"${username}\"." >> ${LOG_FILE}
  exit 0
fi

echo "${TIME_STAMP}: Incorrect password: username=\"${username}\", password=\"${password}\"." >> ${LOG_FILE}
exit 1
```

配置 账号/密码，新增账号/密码增加到这里即可，一行一个账号，密码用空格隔开：
```bash
$ cat psw-file
xu3352 123456@

# 重置权限，安全着想吧
$ chmod 400 psw-file
$ chown nobody.nobody psw-file 
```

重启服务openvpn：`service openvpn restart`

# 客户端配置
`client.conf` 文件里：
```bash
# 注释掉即可
;cert laptop.crt
;key laptop.key

# 新增验证方式
auth-user-pass
```
重新导入配置文件，尝试链接，可以看到弹出登陆框，输入账号和密码进行链接

# 其他
注意服务端配置最后一行 
```bash
script-security 3 execve
``` 
默认的级别是 2，可以用 ps 看进程号时能看到   
如果没有这个的话，会有个很神奇的现象，就是账号可以传过来，但是密码获取不到，可以在登录日志里查看日志！！！


如果客户端需要记住账号/密码，可以在客户端配置里设置：（Tunnelblick试过不好使）
```bash
auth-user-pass login.conf
```
然后 `login.conf` 内容：
```
xu3352
123456@
```


