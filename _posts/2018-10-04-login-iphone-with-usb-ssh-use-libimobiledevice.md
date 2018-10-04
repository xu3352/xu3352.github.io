---
layout: post
title: "USB SSH 链接iPhone设备:libimobiledevice"
tagline: ""
description: "SSH 在 WiFi 环境下链接iPhone时, 总是是不是的卡顿, 很烦... 这里通过 USB 端口转发的方式进行连接; 纵享丝滑, defu..."
date: '2018-10-04 18:39:28 +0800'
category: mac
tags: libimobiledevice ssh usb usbmuxd mac
---
> {{ page.description }}

之前的一篇文章:[SSH免密码登录越狱iPhone:公钥登录](https://xu3352.github.io/mac/2018/09/12/SSH-into-your-jailbroken-iPhone-without-a-password)

# 安装 libimobiledevice
Mac 下直接可以通过 HomeBrew 安装, 自动就把依赖的包 `libplist ✘, libtasn1 ✘, usbmuxd ✘` 一起安装了
```bash
# 安装 libimobiledevice 
$ brew install libimobiledevice

# 查看版本/依赖等信息
$ brew info libimobiledevice
libimobiledevice: stable 1.2.0 (bottled), HEAD
Library to communicate with iOS devices natively
https://www.libimobiledevice.org/
/usr/local/Cellar/libimobiledevice/1.2.0_3 (66 files, 1MB) *
  Poured from bottle on 2018-10-04 at 17:42:08
From: https://github.com/Homebrew/homebrew-core/blob/master/Formula/libimobiledevice.rb
==> Dependencies
Build: pkg-config ✘
Required: libplist ✔, libtasn1 ✔, openssl ✔, usbmuxd ✔
...
```

# SSH 连接
```bash
# 先开启端口转发
$ iproxy 2222 22
waiting for connection

# 新开个TAB终端 (USB先连接到Mac上哦) 首次连接会有个提示, 直接:yes 就行
$ ssh root@localhost -p 2222
The authenticity of host '[localhost]:2222 ([127.0.0.1]:2222)' can\'t be established.
RSA key fingerprint is SHA256:2jMDDDak8J4Isu9XyK/nfCcrYBRPkLW2mq490277iks.
Are you sure you want to continue connecting (yes/no)? yes
Warning: Permanently added '[localhost]:2222' (RSA) to the list of known hosts.
iPhone:~ root#
```

再设置个别名就更方便了:
```bash
# 设置别名
$ alias ssh_usb='ssh root@localhost -p 2222'

# 登录
$ ssh_usb
iPhone:~ root#
```


# SCP 文件传输
```bash
# 默认方式:上传/下载
$ scp /path/to/localFile user@ip:/path/to/remoteFile
$ scp user@ip:/path/to/remoteFile /path/to/localFile 

# USB方式:上传/下载 指定到转发端口即可
$ scp -P 2222 /path/to/localFile user@ip:/path/to/remoteFile
$ scp -P 2222 user@ip:/path/to/remoteFile /path/to/localFile 
```

---
参考：
- <<iOS应用逆向与安全>> - 2.3.5 通过USB登陆
- [SSH免密码登录越狱iPhone:公钥登录](https://xu3352.github.io/mac/2018/09/12/SSH-into-your-jailbroken-iPhone-without-a-password)
- [什么是usbmuxd? iDevice通过USB与桌面系统通信原理小科普](http://bbs.iosre.com/t/usbmuxd-idevice-usb/1482)
- [OpenSSH + usbmuxd](https://www.jianshu.com/p/fd2773a8359f)

