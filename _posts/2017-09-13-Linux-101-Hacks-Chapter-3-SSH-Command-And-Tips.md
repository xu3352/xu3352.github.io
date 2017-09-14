---
layout: post
title: "Linux 101 Hacks 第三章:SSH命令和提示"
tagline: ""
description: "SSH - 登陆/管理远程服务器必不可少的工具<br/>`ssh` -- OpenSSH SSH client (remote login program)"
date: '2017-09-13 19:40:33 +0800'
category: linux
tags: linux linux-command linux-101-hacks ebook
---
> {{ page.description }}

# 28. SSH提示信息
使用 `ssh` 的时候, 偶尔会遇到一些警告或提示
```bash
ssh -l jsmith remotehost.example.com
ssh: Could not resolve hostname remotehost.example.com: Name or 
service not known
```

使用 `-v` 输出详细的信息:
```bash
ssh -v -l jsmith remotehost.example.com
OpenSSH_5.3p1, OpenSSL 1.0.0-fips 29 Mar 2010
debug1: Reading configuration data /etc/ssh/ssh_config
debug1: Applying options for *
ssh: Could not resolve hostname remotehost.example.com: Name or 
service not known
```

# 29. 切换SSH会话
当你通过 `ssh` 登陆到远程服务器时, 如果你正好想回到本地做些操作, 然后在回到远程服务器; 这种情况下, 可以不用断掉 `ssh` 会话, 而是可以把会话放到后台

第一步:登陆到远程服务器
```bash
localhost$ ssh -l jsmith remotehost

remotehost$
```

第二步: 回到本机. 在远程服务器输入 `~<CTRL+Z>` (先输入 `~` 然后再按下 `CTRL+Z`)
```bash
remotehost$ ~^Z
[1]+ Stopped ssh -l jsmith remotehost

localhost$
```
当你输入 `~` 时, 必不能马上在屏幕上看到, 而是需要等到 `CTRL+Z` 之后才行

第三步: 再回到远程服务器. 
```bash
localhost$ jobs
[1]+ Stopped ssh -l jsmith remotehost

localhost$ fg %1
ssh -l jsmith remotehost

remotehost$
```

当然, 我们再从本地开一个终端不就完了么, 哈哈...

# 30. 显示SSH 会话状态
仅 `SSH2` 好使, 可以统计当前 `ssh` 会话的状态 (不过试了一下, 好像不好使了...不知道是不是发行版本的问题)
```bash
localhost$ ssh -l jsmith remotehost

remotehost$ ~s
        remote host: remotehost
        local host: localhost
        remote version: SSH-1.99-OpenSSH_3.9p1
        local version:  SSH-2.0-3.2.9.1 SSH Secure Shell
        compressed bytes in: 1506
        uncompressed bytes in: 1622
...
...
```
登陆到远程服务器后, 按下 `~`, 然后在按下 `s` 字母

更多:[SSH Client Commands](http://www.thegeekstuff.com/2008/05/5-basic-linux-ssh-client-commands/)

# 31. 修改 OpenSSH 安全选项
OpenSSH控制选项都在 `/etc/ssh/sshd_config` 文件里

在配置文件里, 有一些选项是使用 `#` 号注释掉的, 这些选项就会使用其默认值

比如想把公钥认证的方式由 `yes` 改为 `no`: (当前这里是举个例子, 其实默认值就很好)
```bash
$ grep -i pubkey /etc/ssh/sshd_config
#PubkeyAuthentication yes

$ vi /etc/ssh/sshd_config
PubkeyAuthentication no
```
把 `#` 号去掉, 然后把 `yes` 改为 `no` 就可以了

### 1.禁用 root 登陆
通常情况下, `root` 只有管理员才能使用, 登陆远程服务器是, 最好使用 `非root` 用户登陆, 需要使用 `root` 权限是, 在使用 `su -` 进行切换, 这样更加安全一些. 
```bash
$ vi /etc/ssh/sshd_config
PermitRootLogin no
```

### 2.用户和用户组白名单
仅允许的 用户和用户组 可以远程登陆
```bash
# 允许的用户列表
$ vi /etc/ssh/sshd_config
AllowUsers ramesh john jason

# 允许的用户组列表
$ vi /etc/ssh/sshd_config
AllowGroups sysadmin dba
```

### 3.用户和用户组黑名单
指定的 用户和用户组 是不可以登陆的
```bash
# 禁用的用户列表
$ vi /etc/ssh/sshd_config
DenyUsers cvs apache jane

# 禁用的用户组列表
$ vi /etc/ssh/sshd_config
DenyGroups developers qa
```

注意: 这里有个处理的优先级顺序: `DenyUsers` > `AllowUsers` > `DenyGroups` > `AllowGroups`

### 4.修改默认端口
默认的 `ssh` 端口是 `22`, 大多数黑客都会优先扫码22端口是否打开的, 然后就可以开始暴力破解了 (用户名/密码 随机组合)
```bash
$ vi /etc/ssh/sshd_config
Port 222
```
如果你发现 `/var/log/secure` 日志文件里有大量的未知的 用户名 和 IP, 那么你很可能遭到暴力破解了, 改为端口号就可以避免了, 改为记得通知一下别人哦!

### 5.修改登录超时时间
`ssh` 登录服务器时, 如果超过2分钟, 则会自动断开. 而默认的2分钟时间其实太长了点, 可以考虑修改为 30s 或者 1m.
```bash
$ vi /etc/ssh/sshd_config
LoginGraceTime 1m
```

### 6.限制服务器监听IP
默认是所有的 IP 都会被监听, 如果有多个网卡, 那么就可以指定 监听的IP 地址了
```bash
$ vi /etc/ssh/sshd_config
ListenAddress 192.168.10.200
ListenAddress 192.168.10.202
```

### 7.空闲自动终止会话
- `ClientAliveCountMax` - 服务端主动发送消息给ssh客户端, 而客户端没有回应的次数, 默认值为3
- `ClientAliveInterval` - 客户端活跃的间隔秒数

例如: 客户端10分钟(600秒)不活动超时自动退出
```bash
$ vi /etc/ssh/sshd_config
ClientAliveInterval 600
ClientAliveCountMax 0
```

更多:[7 Default OpenSSH Security Options that You Should Change](http://www.thegeekstuff.com/2011/05/openssh-options/)

# 32. 转移 PuTTY 会话
如果你想使用 `windows` 链接到 `linux`, 那么你就需要一个 `ssh` 客户端. 而 `PuTTY` 就是你最好的选择了: 轻量级, 仅仅一个 `putty.exe` 就可以了

[PUTTY 下载链接](http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html)

### 1.转移Putty会话
 PuTTY 会把会话信息保存到 注册表 里

导入到: `putty-registry.reg` 文件里
```bash
C:> regedit /e "%userprofile%\desktop\putty-registry.reg"
HKEY_CURRENT_USER\Software\Simontatham
```

另一台机器上面双击 `putty-registry.reg`, 点击 `合并` 就可以了导入了. 

### 2.清理PuTTY会话
使用命令可以一次性把所有会话信息的注册表都删除掉, 而不用挨个在注册表里删除
```bash
C:>putty -cleanup
```

更多:
- [Turbocharge PuTTY with 12 Powerful Add-Ons](http://www.thegeekstuff.com/2008/08/turbocharge-putty-with-12-powerful-add-ons-software-for-geeks-3/)
- [10 Awesome PuTTY Tips and Tricks You Probably Didn’t Know](http://www.thegeekstuff.com/2009/07/10-practical-putty-tips-and-tricks-you-probably-didnt-know/)
- [PuTTY: Extreme Makeover Using PuTTY Connection Manager](http://www.thegeekstuff.com/2009/03/putty-extreme-makeover-using-putty-connection-manager/)

