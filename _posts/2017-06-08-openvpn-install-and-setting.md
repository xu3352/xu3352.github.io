---
layout: post
title: "OpenVPN 搭建和配置"
tagline: ""
description: "给自己的(内网)办公网搭建一个VPN网络，以后在外面办公就方便多了"
date: '2017-06-08 00:31:42 +0800'
category: linux
tags: openvpn linux
---
> {{ page.description }}

# 说明
原文：[十步搭建 OpenVPN，享受你的隐私生活](https://linux.cn/article-3706-1.html)       
原文里的 easy-rsa 版本不一样，有点区别，然后就是排版几个地方有点不友好，这里精简了一下，以及分享一下安装过程中的遇到的问题

# 1. 准备系统
系统环境：`Red Hat Enterprise Linux Server release 6.0 (Santiago)`
```bash
$ yum update && yum install epel-release
$ yum -y install openvpn easy-rsa dnsmasq
```

说明：  
- openvpn提供了OpenVPN的核心
- easy-rsa包含了一些有用的密钥管理脚本
- dnsmasq是当我们的OpenVPN所在的主机将扮演客户端的路由器时会用到的域名服务器

# 2. 生成证书和私钥
安装OpenVPN中最重要和最关键的一步，目的是建立公钥基础设施(PKI)。包括如下内容:

- 为OpenVPN服务器创建一个证书(公钥)和一个私钥
- 为每个OpenVPN客户端创建证书和私钥
- 建立一个证书颁发机构(CA)并创建证书和私钥。这个私钥用来给OpenVPN服务器和客户端的证书签名

```bash
$ sudo mkdir /etc/openvpn/easy-rsa
$ sudo cp -r /usr/share/easy-rsa/* /etc/openvpn/easy-rsa

$ cd /etc/openvpn/easy-rsa
$ vim ./2.0/vars
```

文件最后修改为应的值：
```bash
export KEY_COUNTRY="GR"
export KEY_PROVINCE="Central Macedonia"
export KEY_CITY="Thessaloniki"
export KEY_ORG="Parabing Creations"
export KEY_EMAIL="nobody@parabing.com"
export KEY_CN="VPNsRUS"
export KEY_NAME="VPNsRUS"
export KEY_OU="Parabing"
export KEY_ALTNAMES="VPNsRUS"
```

开始生成:主证书和私钥
```bash
# 使用 root 用户操作
$ sudo su
$ cd /etc/openvpn/easy-rsa

# 加载参数
$ source ./2.0/vars

# 清理之前的证书和私钥
$ sh ./2.0/clean-all

# 根据 vars 生成：主证书和私钥, 一路敲回车即可
$ sh ./2.0/build-ca
```

执行 build-ca 如果遇到报错：    
`build-ca: line 8: /etc/openvpn/easy-rsa/pkitool: 没有那个文件或目录`       

修改 `/etc/openvpn/easy-rsa/2.0/vars` 文件 2个 地方     
然后重新回到 `source ./2.0/vars` 开始生成：
```bash
# export EASY_RSA="`pwd`"
export EASY_RSA="/etc/openvpn/easy-rsa/2.0"

# export KEY_CONFIG=`$EASY_RSA/whichopensslcnf $EASY_RSA`
export KEY_CONFIG="$EASY_RSA/openssl-1.0.0.cnf"
```

最后会在 `/etc/openvpn/easy-rsa/2.0/keys/` 目录生成：主证书文件`ca.crt` 和 私钥`ca.key`

# 3. 服务器的证书和私钥生成
服务器证书和密钥起名:`delta`，然后运行 `build-key-server` 脚本来获取证书和密钥:

```bash
# 进入 easy-rsa 目录
$ cd /etc/openvpn/easy-rsa

# 生成服务端证书和私钥：delta 。到 [y/n] 敲 y + 回车，其他的敲回车即可
$ sh ./2.0/build-key-server delta
```
最后会在 `/etc/openvpn/easy-rsa/2.0/keys/` 目录生成：服务器证书`delta.crt` 和 私钥`delta.key`

# 4. 生成 Diffie-Hellman 参数
```bash
# 生成 Diffie-Hellman 参数， 需要等待一会儿
$ sh ./2.0/build-dh
```
同样最后生成的文件会在 `/etc/openvpn/easy-rsa/2.0/keys/` 目录下，最后会是这5个文件：   
- ca.crt – 证书颁发机构(CA)的证书
- ca.key – CA的私钥
- delta.crt – OpenVPN服务器的证书
- delta.key – OpenVPN服务器的私钥
- dh2048.pem – Diffie-Hellman参数文件

然后我们需要把文件拷贝到指定地方：
```bash
$ cd /etc/openvpn/easy-rsa/2.0/keys

# 把除了 ca.key 之外的文件拷贝到：/etc/openvpn 目录
$ cp ca.crt delta.crt delta.key dh2048.pem /etc/openvpn
```

# 5. 客户端证书和私钥生成
客户端证书和私钥生成，比如取名：laptop
```bash
$ cd /etc/openvpn/easy-rsa/

$ source ./2.0/vars

# 遇到 [y/n] 敲 y + 回车，其他的敲回车即可
$ sh ./2.0/build-key laptop
```
最后会在 `/etc/openvpn/easy-rsa/2.0/keys/` 目录生成：服务器证书`laptop.crt` 和 私钥`laptop.key`

客户端的证书和秘钥单独放到一个文件夹下，后面会用到：
```bash
$ mkdir /home/sub0/ovpn-client
$ cd /etc/openvpn/easy-rsa/2.0/keys/

# 证书和秘钥放到 /home/sub0/ovpn-client 目录下备用
$ cp ca.crt laptop.crt laptop.key /home/sub0/ovpn-client
```

# 6. OpenVPN 服务器设置
服务端的配置：
```bash
$ cd /etc/openvpn

# 拷贝一个服务端配置模板
$ cp /usr/share/doc/openvpn-2.3.14/sample/sample-config-files/server.conf .

# 重命名一下
$ mv server.conf delta.conf
```

修改 `delta.conf` 配置
```bash
# 修改配置
$ vim delta.conf

# cert server.crt 修改为 delta.crt
# key server.key 修改为 delta.key
cert delta.crt
key delta.key

# dh dh1024.pem 如果是 1024 需要改成 2048
dh dh2048.pem

# 文件末尾追加两行：
push "redirect-gateway def1"
push "dhcp-option DNS 10.8.0.1"

# 日志文件，方便看查看日志，比如启动失败
# ;log-append  openvpn.log  改为下面一行
log-append  /etc/openvpn/openvpn.log
```
最后这两行指示客户端用OpenVPN作为默认的网关，并用 `10.8.0.1` 作为DNS服务器。     
注意 `10.8.0.1` 是OpenVPN启动时自动创建的隧道接口的IP。   
如果客户用别的域名解析服务，那么我们就得提防不安全的DNS服务器。     
为了避免这种泄露，我们建议所有OpenVPN客户端使用 `10.8.0.1` 作为DNS服务器。

启动 openVPN ：
```bash
$ service openvpn start

# 端口查看，openvpn 默认端口是: 1194
$ netstat -anup
```

如果启动失败，且日志提示如下：
```bash
Options error: --explicit-exit-notify cannot be used with --mode server
Use --help for more information.
```
则把 `delta.conf` 配置文件中的 `explicit-exit-notify 1` 关闭或者注释掉就可以了

# 7. 为 OpenVPN 客户端搭建 DNS
配置 `dnsmasq.conf` 2个地方:
```bash
$ vim /etc/dnsmasq.conf

#listen-address=
listen-address=127.0.0.1, 10.8.0.1

#bind-interfaces
bind-interfaces
```

重启 dnsmasq :
```bash
$ service dnsmasq restart

# 查看 dnsmasq 端口
$ netstat -anup
```

# 8. 路由功能
开启 IP 转发功能：
```bash
# 把 /proc/sys/net/ipv4/ip_forward 值改为 1
$ echo "1" > /proc/sys/net/ipv4/ip_forward

# 编辑
$ vim /etc/sysctl.conf

#net.ipv4.ip_forward = 1
net.ipv4.ip_forward = 1
```

防火墙 iptables 设置：
```bash
$ iptables -A FORWARD -m state --state RELATED,ESTABLISHED -j ACCEPT
$ iptables -A FORWARD -s 10.8.0.0/24 -j ACCEPT
$ iptables -A FORWARD -j REJECT
$ iptables -t nat -A POSTROUTING -s 10.8.0.0/24 -o eth0 -j MASQUERADE
# 如果是双网卡的话，eth1 也加上吧
$ iptables -t nat -A POSTROUTING -s 10.8.0.0/24 -o eth1 -j MASQUERADE
```

启动生效配置：`/etc/rc.local`
```bash
#!/bin/sh
#
# This script will be executed *after* all the other init scripts.
# You can put your own initialization stuff in here if you don't
# want to do the full Sys V style init stuff.

iptables -A FORWARD -m state --state RELATED,ESTABLISHED -j ACCEPT
iptables -A FORWARD -s 10.8.0.0/24 -j ACCEPT
iptables -A FORWARD -j REJECT
iptables -t nat -A POSTROUTING -s 10.8.0.0/24 -o eth0 -j MASQUERADE
iptables -t nat -A POSTROUTING -s 10.8.0.0/24 -o eth1 -j MASQUERADE

service dnsmasq restart

exit 0
```
请注意倒数第二行: `service dnsmasq restart` 非常重要，别落下就行

# 9. 客户端设置
也是从模板里拷贝客户端配置文件，然后再改动：
```bash
$ cd /home/sub0/ovpn-client

# 拷贝模板文件
$ cp /usr/share/doc/openvpn-2.3.14/sample/sample-config-files/client.conf .

# 修改配置
$ vim client.conf

# 定位到这里，把 my-server-1 换成服务器公网静态ip或者域名
remote my-server-1 1194

# 换成客户端的证书和密钥文件
# cert client.crt
# key client.key
cert laptop.crt
key laptop.key

# 4个文件打包压缩，下载到本地测试
$ cd /home/sub0/
$ zip -r ovpn-client.zip ovpn-client
```
由于我这里办公网有静态的IP，只需要在路由器上面做个端口映射就可以了，如果是 DHCP 网络，应该是可以走动态域名解析的，这个没尝试过

# 10. 链接测试
首先需要把 `ovpn-client.zip` 客户端配置文件下载到本地备用       
客户端：
- Mac OSX：[Tunnelblick](https://code.google.com/p/tunnelblick) 开源的可以连接 OpenVPN，已测试过，可以使用
- Windows：[OpenVPN Desktop Client](http://swupdate.openvpn.net/downloads/openvpn-client.msi) OpenVPN2.4 不支持 XP。配置文件client.conf需要重命名成client.ovpn。导入配置的时候不要把安装目录下的 client.ovpn 覆盖了！

# 最后
默认服务端和客户端都是：`UDP` 协议的，访问内网中的某些HTTP服务时，会链接不上。    
而要使用 `TCP` 协议，***服务端和客户端的配置文件都需要修改***，只改客户端会提示：
```bash
openvpn tcp connect to [AF_INET] xxx.xxx.xxx.xxx:1194 failed, will try again in 5 seconds: Connection refused
```

服务端配置成 TCP 模式：`delta.conf`
```bash
# TCP or UDP server?
;proto udp
proto tcp
```

客户端配置成 TCP 模式：`client.conf`
```bash
# Are we connecting to a TCP or
# UDP server?  Use the same setting as
# on the server.
;proto udp
proto tcp
```

---
参考：  
- [十步搭建 OpenVPN，享受你的隐私生活](https://linux.cn/article-3706-1.html)
- [如何在RHEL / CentOS 7中使用Linux和Windows客户端安装和配置OpenVPN服务器](https://www.howtoing.com/setup-openvpn-server-with-linux-and-windows-clients-in-centos-rhel/)
- [build-ca throws error message](http://www.sysadminworld.com/2012/build-ca-throws-error-message/)

