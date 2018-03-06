---
layout: post
title: "Linux ntpdate 同步网络时间"
tagline: ""
description: "当服务器的时间不准的时候, 需要同步成一致的时间"
date: '2018-03-06 10:27:09 +0800'
category: linux
tags: ntpdate linux
---
> {{ page.description }}

# 同步网络时间
```bash
ntpdate time.nist.gov
```

# 报错处理

1. 提示:`the NTP socket is in use, exiting`, 可以先关掉 `ntpd` 服务再尝试
```bash
service ntpd stop
```

2. 提示:`no server suitable for synchronization found`, 可以查看 `/etc/ntp.conf` 配置文件, 把 `notrap` 去掉再尝试
```bash
# Access Control Support
# restrict    default kod nomodify notrap nopeer noquery
# restrict -6 default kod nomodify notrap nopeer noquery
restrict    default kod nomodify nopeer noquery
restrict -6 default kod nomodify nopeer noquery
restrict 127.0.0.1
```

3. 也有可能是防火墙的问题(可能是server的防火墙屏蔽了upd 123端口), 也可以把防火墙关掉尝试
```bash
service iptables stop
```

---
参考：
- [Linux下ntpdate时间同步命令出现the NTP socket is in use, exiting](http://www.heminjie.com/system/linux/6477.html)
- [解决ntp的错误 no server suitable for synchronization found](http://www.blogjava.net/spray/archive/2008/07/10/213964.html)
- [国内常用NTP服务器地址及IP](https://www.douban.com/note/171309770/)
