---
layout: post
title: "SSH免密码登录越狱Iphone:公钥或expect脚本"
tagline: ""
description: "使用公钥不一定好使(有的设备好使), 这个时候可以使用 expect 脚本补充一下"
date: '2018-09-12 11:42:50 +0800'
category: mac
tags: ssh expect jailbroken mac
---
> {{ page.description }}

# SSH公钥登录
这个之前已经介绍过了, 请移驾: [SSH免密码登陆(公钥认证)](https://xu3352.github.io/linux/2017/06/24/ssh-login-without-password)

**大致分2步**:
- `创建秘钥/公钥` 
- `拷贝公钥到目标服务器` 

如果不好使, 可以先检查一下目标机器的目录权限: [SSH免密码登陆(公钥认证)-目录权限设置](https://xu3352.github.io/linux/2017/06/24/ssh-login-without-password#补充)

# Expect自动填充密码
这里重点介绍一下 `expect` 自动交互脚本, 常见的应该就是自动填充登录密码了吧

安装 `expect`:
```bash
# 快捷安装
$ brew install expect
```

SSH自动填充密码登录脚本:`iphone.expect`
```bash
#!/usr/bin/expect
#author:xu3352@gmail.com
#desc: ssh iphone device with the same password

set PASSWD  "alpine"
set IP_LAST [lindex $argv 0]

spawn ssh root@192.168.7.$IP_LAST
expect "*password:"
send "$PASSWD\r"
expect "*#"
interact
```
由于内网 ip 会变化, 但是 ip 的前3端是固定的, 所以直接写死, 最后一位用参数的方式传过去; 这个语法和 `Base` 脚本有些差别的

使用示例:(自动填充密码)
```bash
$ iphone.expect 124
spawn ssh root@192.168.7.124
root@192.168.7.124's password:
iPhone:~ root# 
```
这样也不用每次输入密码了

# 其他
- `SSH` 公钥的方式是最安全和高效的;
- `expect` 脚本是自动填充密码的, 但是密码是明文的, 不是很安全;
- 此两种方式同样适用于其他 `Linux` 服务器

---
参考：
- [SSH免密码登陆(公钥认证)](https://xu3352.github.io/linux/2017/06/24/ssh-login-without-password)
- [Linux 101 Hacks - SSH免密码登录](https://xu3352.github.io/linux/2017/10/06/Linux-101-Hacks-Chapter-8-System-Administration-Tasks-Part2#62ssh%E5%85%8D%E5%AF%86%E7%A0%81%E7%99%BB%E5%BD%95)
- [Passwordless SSH](https://gist.github.com/DomiR/8870918)
- [Expect Script SSH Example Tutorial](https://www.journaldev.com/1405/expect-script-ssh-example-tutorial)
- [Expect - 自动交互脚本](http://xstarcd.github.io/wiki/shell/expect.html)
- [Linux Expect 简介和使用实例](https://www.jianshu.com/p/70556b1ce932)
