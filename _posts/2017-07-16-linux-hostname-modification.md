---
layout: post
title: "永久修改 Linux 主机名"
tagline: ""
description: "永久修改 Linux 主机名，注意3个地方即可"
date: '2017-07-16 17:08:00 +0800'
category: linux
tags: linux APM
---
> {{ page.description }}

# hostname
`hostname` 可以用来查看和修改 主机名称，但是主机重启后就失效
```bash
# 修改主机名
hostname server_007
```

# network
`/etc/sysconfig/network` 文件存储了主机名，系统启动时会读取次文件的主机名
```bash
# 修改 network 文件中的主机名
vim /etc/sysconfig/network

NETWORKING=yes
HOSTNAME=server_007
NOZEROCONF=yes
```

# hosts
另外 `/etc/hosts` 文件也存储了主机名，这里对应了 IP，应该是网络当中会用到     

正常此文件可以配置IP对应的域名，在此主机访问配置的域名就会重新定向到指定的 IP 上，所以有时候可以利用这个特点来切换测试环境和正式环境，测试环境的时候，给域名配置测试的IP就行了

```bash
# 修改 hosts 文件里的主机名
vim /etc/hosts

127.0.0.1 server_007
10.13.xxx.xxx server_007
```

# 其他
主流的几个 Linux 发行版应该都可以，小伙伴们可以进行尝试，不过如果重启线上的服务器最好还是慎重一点！

此外 New Relic 的 JVMs 监控也是会读取 hostname 的，如果是默认的，集群的几个主机放一起，你就不知道 jvm 是属于哪个台服务器了，这个时候修改 hostname 就显得很必要了

有时候翻墙也可以修改 hosts 达到目的😆

---
参考：
- [Linux (Redhat / Fedora / CentOS) 更改hostname 的方式](http://www.ichiayi.com/wiki/tech/linux_hostname)

