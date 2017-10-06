---
layout: post
title: "Linux 101 Hacks 第八章:系统管理任务(二:账号、组、SSH管理、定时器)"
tagline: ""
description: ""
date: '2017-10-06 18:47:01 +0800'
category: linux
tags: linux linux-command linux-101-hacks ebook
---
> {{ page.description }}

# 60.创建新用户
示例1: 新建用户基础用法
```bash
$ useradd jsmith
```

示例2: 使用额外参数创建用户
```bash
$ adduser -c "John Smith - Oracle Developer" -e 12/31/09 jsmith
```
参数:
- `-c` - 设置描述
- `-e` - 设置到期日期，格式：`mm/dd/yy` 

查看用户是否添加成功
```bash
$ grep jsmith /etc/passwd
jsmith:x:510:510:John Smith - Oracle Developer:/home/jsmith:/bin/bash
```

示例3: 修改密码
```bash
$ passwd jsmith
Changing password for user jsmith.
New UNIX password:
BAD PASSWORD: it is based on a dictionary word
Retype new UNIX password:
passwd: all authentication tokens updated successfully. 
```

示例4: 查看`useradd`使用的默认值
```bash
$ useradd –D
GROUP=100
HOME=/home
INACTIVE=-1
EXPIRE=
SHELL=/bin/bash
SKEL=/etc/skel
```

更多:
- [The Ultimate Guide to Create Users in Linux / Unix](http://www.thegeekstuff.com/2009/06/useradd-adduser-newuser-how-to-create-linux-users/)
- [The Ultimate Guide for Creating Strong Passwords](http://www.thegeekstuff.com/2008/06/the-ultimate-guide-for-creating-strong-passwords/)


# 61.创建分组
示例1: 创建用户组
```bash
# 创建名为 developers 的用户组
$ groupadd developers

# 检查是否创建成功
$ grep developer /etc/group
developers:x:511:
```

示例2: 把用户加到指定的组
```bash
# 添加用户时可以分配组，但是如果用户已经存在的话会报错
$ useradd -G developers jsmith
useradd: user jsmith exists

# 分配用户到指定组
$ usermod -g developers jsmith
```

示例3: 检用户组是否修改成功
```bash
# 检查用户
$ grep jsmith /etc/passwd
jsmith:x:510:511:Oracle Developer:/home/jsmith:/bin/bash

# 查看用户
$ id jsmith
uid=510(jsmith) gid=511(developers) groups=511(developers)

# 查看分组信息 
$ grep jsmith /etc/group
jsmith:x:510:
developers:x:511:jsmith
```

# 62.SSH免密码登录
如果经常使用SSH登录指定的远程服务器，免密码登录就非常舒服了，否则每次需要输入密码的

步骤1: 使用 `ssh-key-gen` 在本机创建公钥和私钥
```bash
jsmith@local-host$ ssh-keygen
Generating public/private rsa key pair.
Enter file in which to save the key
(/home/jsmith/.ssh/id_rsa):[Enter key]
Enter passphrase (empty for no passphrase): [Press enter key]
Enter same passphrase again: [Pess enter key]
Your identification has been saved in
/home/jsmith/.ssh/id_rsa.
Your public key has been saved in
/home/jsmith/.ssh/id_rsa.pub.
The key fingerprint is:
33:b3:fe:af:95:95:18:11:31:d5:de:96:2f:f2:35:f9
jsmith@local-host
```
不想设置的就一路回车就行

步骤2: 使用 `ssh-copy-id` 拷贝公钥到远程主机
```bash
jsmith@local-host$ ssh-copy-id -i ~/.ssh/id_rsa.pub remote-host
jsmith@remote-host’s password:
Now try logging into the machine, with “ssh ‘remote-host’”, and check in:
.ssh/authorized_keys to make sure we haven’t added extra
keys that you weren’t expecting.
```

步骤3: 尝试登录
```bash
jsmith@local-host$ ssh remote-host
 Last login: Sun Nov 16 17:22:33 2008 from 192.168.1.2
```

更多: [3 Steps to Perform SSH Login Without Password Using ssh-keygen & ssh-copy-id](http://www.thegeekstuff.com/2008/11/3-steps-to-perform-ssh-login-without-password-using-ssh-keygen-ssh-copy-id/)


# 63.SSH使用ssh-copy-id安装公钥
上面的例子里已经演示了该命令的用法，其实原理很简单：

就是把本机的 `~/.ssh/id_rsa.pub` 内容追加到远程服务器的 `~/.ssh/authorized_key` 里面，注意是追加哦；所以一般手动copy过去就可以了

如果遇到 `~/.ssh/id_rsa.pub` 不存在或者内容为空时
```bash
jsmith@local-host$ ssh-copy-id -i remote-host
/usr/bin/ssh-copy-id: ERROR: No identities found
```

使用 `ssh-add` 把公钥放到 `ssh-agent`中，然后就可以使用 `ssh-copy-id` 安装到远程服务器了
```bash
$ jsmith@local-host$ ssh-agent $SHELL

jsmith@local-host$ ssh-add -L
The agent has no identities.

# 自动加载
jsmith@local-host$ ssh-add
Identity added: /home/jsmith/.ssh/id_rsa (/home/jsmith/.ssh/id_rsa)

# 列出KEY
jsmith@local-host$ ssh-add -L
ssh-rsa AAAAB3Nza...........MUNzApnyxsHpH1tQ/Ow== /home/jsmith/.ssh/id_rsa

# 安装到远程服务器
jsmith@local-host$ ssh-copy-id -i remote-host
jsmith@remote-host’s password:
Now try logging into the machine, with “ssh ‘remote-
host’”, and check in: .ssh/authorized_keys to make sure we
haven’t added extra keys that you weren’t expecting.
```

# 64.定时任务
Linux下的定时任务也是比较常用的，一般用于定期清理日志文件，过期的其他文件之类的

示例1: 添加一个定时任务
```bash
# 每天的凌晨5点执行 /root/bin/backup.sh 脚本
$ crontab –e
0 5 * * * /root/bin/backup.sh
```
注意，这里要使用：`绝对路径`

格式：
```bash
{minute} {hour} {day-of-month} {month} {day-of-week} {full-path-to-shell-script}
```
详解: 
- `minute` - 分钟: 0~59
- `hour` - 小时: 0~23
- `day-of-month` - 日期: 0~31
- `month` - 月份: 1~12
- `day-of-week` - 星期几 0~7  星期天为0或者7 
- `full-path-to-shell-script` - 脚本的全路径!!!

一些常用的示例
```bash
# 00:01 执行备份脚本
1 0 * * * /root/bin/backup.sh

# 工作日(1~5) 11:59 执行备份
59 11 * * 1,2,3,4,5 /root/bin/backup.sh

# 同上
59 11 * * 1-5 /root/bin/backup.sh

# 5分钟执行一次
*/5 * * * * /root/bin/check-status.sh

# 每月的1号 13:10 执行
10 13 1 * * /root/bin/full-backup.sh

# 工作日的 23:00 执行
0 23 * * 1-5 /root/bin/incremental-backup.sh
```

`crontab` 选项:
- `crontab -e` - 编辑/新建 `crontab` 定时任务
- `crontab -l` - 列出已有的定时任务列表
- `crontab -r` - 删除定时任务
- `crontab -ir` - 删除前提醒

定时器相关:
- [Linux Crontab: 15 Awesome Cron Job Examples](http://www.thegeekstuff.com/2009/06/15-practical-crontab-examples/)
- [How to Run Cron Every 5 Minutes, Seconds, Hours, Days, Months](http://www.thegeekstuff.com/2011/07/cron-every-5-minutes/)
- [Cron Vs Anacron: How to Setup Anacron on Linux (With an Example)](http://www.thegeekstuff.com/2011/05/anacron-examples/)

