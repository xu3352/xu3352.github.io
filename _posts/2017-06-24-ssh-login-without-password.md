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
# 生成本机的公钥与密钥(已有秘钥可以跳过)，指定 rsa 算法，直接敲3次回车即可
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

# 补充
(2018-10-01更新)

如果还是不好使, 那么可以看日志
```bash
# 详细日志模式 (额, 好吧, 这个表示看不懂)
$ ssh -vvv root@192.168.7.191
......

# 目标机器的 sshd 日志 
$ tail -200 /var/log/secure | grep sshd
Oct  1 09:04:50 725 sshd[4088]: Authentication refused: bad ownership or modes for directory /private/var/root
```

啊, 上面就是权限问题导致的了, 检查目标机器相关目录权限:

`$HOME` :  `用户目录` 权限为 755 或者 700，就是不能是77x、777

```bash
# .ssh 目录权限 (700)
drwx------   2 root root       4096 Apr  9  2015 .ssh

# .ssh 目录下文件的权限 (644 600)
-rw-r--r--   1 root root 1609 Mar  2 14:05 authorized_keys
-rw-------   1 root root 1675 Dec 12  2014 id_rsa
-rw-r--r--   1 root root  405 Dec 12  2014 id_rsa.pub
-rw-r--r--   1 root root 4701 May 25  2016 known_hosts
```

---
参考：
- [SSH原理与运用（一）：远程登录](http://www.ruanyifeng.com/blog/2011/12/ssh_remote_login.html)
- [Understanding debug log for failed ssh connection with key pairs](https://superuser.com/questions/1318789/understanding-debug-log-for-failed-ssh-connection-with-key-pairs)
- [ssh免密码登陆设置时Authentication refused: bad ownership or modes错误解决方法](https://www.bo56.com/ssh%E5%85%8D%E5%AF%86%E7%A0%81%E7%99%BB%E9%99%86%E8%AE%BE%E7%BD%AE%E6%97%B6authentication-refused-bad-ownership-or-modes%E9%94%99%E8%AF%AF%E8%A7%A3%E5%86%B3%E6%96%B9%E6%B3%95/)
- [ssh目录权限说明](https://blog.csdn.net/levy_cui/article/details/59524158)

