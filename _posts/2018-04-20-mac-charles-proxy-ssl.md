---
layout: post
title: "Charles抓包Https请求(MAC)"
tagline: ""
description: "Mac下的抓包利器, 所有请求都逃不过它的法眼"
date: '2018-04-20 17:26:50 +0800'
category: mac
tags: charles https mac
---
> {{ page.description }}

# 安装和使用
请移驾: [Charles安装与使用](https://www.jianshu.com/p/a9531405526d)

# Https配置
请移驾: [MAC环境下使用Charles抓包Https请求](https://segmentfault.com/a/1190000005070614)

# SSL代理注意事项

1. Mac和手机一定是同一个网络(网段必须一样)
2. 把Mac设置为代理服务器
    - `Proxy -> Proxy Settings...`
        - `Proxies -> HTTP Proxy -> 默认端口:8888 -> Enable transparent HTTP Proxying 打钩`
        - `macOS -> Enable macOS proxy打钩, 能勾的都可以勾上`
3. Mac和手机都需要安装证书
    - `Help -> SSL Proxying -> Install Charles Root Certificate`
    - `Help -> SSL Proxying -> Install Charles Root Certificate on a Mobile Device or Remote Browser`
    - 手机证书安装:`配置好手机代理 -> 浏览器输入:chls.pro/ssl -> 进行安装即可`
4. 手机安装证书后一定记得<font color="red">开启, 开启, 开启</font>!!!  我就被坑在这里了
    - `设置 -> 通用 -> 关于本机 -> 证书信任设置 -> 把Charles Proxy CA证书开启`
5. 手机代理设置:
    - `设置 -> 无线局域网 -> 当前WiFi -> 配置代理 -> 手动 -> Mac的IP和端口 -> 存储`
6. 设置需要代理的https请求
    - `Proxy -> SSL Proxying Settings... -> Enable SSL Proxying勾上 -> 可以全局都代理: *:443`
    - 单独设置域名开启/关闭SSL `右键请求的域名 -> Enable SSL Proxying / Disable SSL Proxying`
7. 本机IP快速查看
    - `Help -> Local IP Addresses`
8. 如果mac有其他代理软件, 建议先关掉, 避免冲突

---
参考：
- [Charles安装与使用](https://www.jianshu.com/p/a9531405526d)
- [MAC环境下使用Charles抓包Https请求](https://segmentfault.com/a/1190000005070614)
- [Charles Proxy SSL Certificate not working](https://stackoverflow.com/questions/41228511/charles-proxy-ssl-certificate-not-working)

