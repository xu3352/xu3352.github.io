---
layout: post
title: "Nginx支持https访问"
tagline: ""
description: "如果数据需要加密的时候, 建议使用https"
date: '2018-03-20 11:09:05 +0800'
category: linux
tags: nginx linux
---
> {{ page.description }}

# nginx安装
Nginx 下载页面: [地址](https://nginx.org/en/download.html)

要支持 `https` 方式访问, 好像只有源码安装了, 如果有其他依赖, 可以使用 `yum` 先解决
```bash
# 安装配置
# openssl 和 pcre 指定源码目录(下载源码包, 然后解压的目录)即可
./configure --prefix=/usr/local/nginx \
--with-openssl=/usr/local/openssl-1.0.1s \
--with-pcre=/usr/local/pcre-8.35 \
--with-http_stub_status_module \
--with-http_ssl_module

# 编译+安装
make && make install
```
这里必须开启ssl模式才行 `--with-http_ssl_module`


# SSL证书申请
大多是收费的, 不过也有免费的, 这里使用的 阿里云的1年免费证书, 申请流程可以参考这里:     
[免费申请阿里云DV SSL证书](https://www.xiaoz.me/archives/7442)


# 配置SSL
核心配置示例
```bash
server {
    listen 443;
    server_name localhost;
    ssl on;
    root html;
    index index.html index.htm;
    # 服务器证书
    ssl_certificate   /usr/local/mycert/server.pem;
    # 私钥文件, 好好保存, 切勿外泄!
    ssl_certificate_key  /usr/local/mycert/server.key;
    ssl_session_timeout 5m;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_prefer_server_ciphers on;

    location / {
        root html;
        index index.html index.htm;
    }
}
```

---
参考：
- [HTTPS服务器配置](https://pay.weixin.qq.com/wiki/doc/api/wxa/wxa_api.php?chapter=10_4)
- [免费申请阿里云DV SSL证书](https://www.xiaoz.me/archives/7442)
