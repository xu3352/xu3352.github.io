---
layout: post
title: "SSH免密码登陆(公钥认证)"
tagline: ""
description: "每次 SSH 或者 SCP 的时候都输入密码一定是一件烦人的事情，一是密码还不一定记得住，二是感觉每次敲一遍密码感觉没那么安全，三是服务器多了就。。。"
date: '2017-06-24 21:21:35 +0800'
category: linux
tags: ssh scp linux
---
> {{ page.description }}

# ssh密码登陆
默认 ssh 从本地连接到服务器是需要输入密码的，而且每次都需要，如果你能忍受的话我表示十二分的佩服     
有帮你输入明文密码的命令，比如像：`expect`、`sshpass` 之类的。但是总感觉不够安全，毕竟密码是明文的

# 公钥认证
```bash
# 生成本机的公钥与密钥，指定 rsa 算法，直接敲3次回车即可
$ ssh-keygen -t rsa

# 上传公钥放到服务器对应账号下
$ ssh user@host 'mkdir -p .ssh && cat >> .ssh/authorized_keys' < ~/.ssh/id_rsa.pub
```
上传步骤：
- 使用 ssh 远程登陆服务器
- 服务器端：创建 .ssh 文件夹，不存在的话会创建，已存在的不影响
- 本地：读取本地公钥文件：`~/.ssh/id_rsa.pub`
- 服务器端：追加本地公钥到：`.ssh/authorized_keys` 文件最后一行

注意：  
比如这里使用的是 user 账号，那么就只有 user 账号可以免密码登陆      
公钥存放的地方为：`/home/user/.ssh/authorized_keys`，每个账号存储公钥的地方都不一样   
root 用户的公钥存储地方是： `/root/.ssh/authorized_keys`

# 免密码登陆
```bash
# 正常使用 ssh 和 scp 就不需要密码登陆了
$ ssh user@host
```

如果还是不行的话，可以检查一下：`/etc/ssh/sshd_config` 文件这几行前面的"#"是否去掉
```bash
RSAAuthentication yes
PubkeyAuthentication yes
AuthorizedKeysFile .ssh/authorized_keys
```
不过注释没有去掉我这里也是可以免密码登陆了

记得重启服务：
```bash
# ubuntu系统
$ service ssh restart
# debian系统
$ /etc/init.d/ssh restart
```

---
参考：
- [SSH原理与运用（一）：远程登录](http://www.ruanyifeng.com/blog/2011/12/ssh_remote_login.html)

