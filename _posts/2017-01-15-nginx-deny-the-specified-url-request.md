---
layout: post
title: "Nginx忽略指定的URL链接请求"
date: '2017-01-15 17:17:22'
categories: nginx
tags: nginx
---

> Nginx配置忽略指定的URL链接请求

# 起因
看来今天是找到罪魁祸首了：日志请求太频繁；最近线上环境很不稳定，业务量一上来就不稳定，总卡死。。。

# 排查问题
1. 数据库没有压力，排除数据库的问题。
2. tomcat服务器CPU非常高，带宽不够用，总以为是业务量真大导致的问题，不过确实是业务量高峰期问题爆发的，被迷惑了，然后就一顿扩CPU和带宽，配置是原来的2倍，然后4倍还是扛不住。。。
3. 总 Nginx 带宽消耗非常大，方向代理改为内网IP后，到后端的宽带压力好了很多，但还是有问题
4. 之前也有怀疑是日志打印频繁的问题，不过平时跑起来问题不大，就没多想了。。。后来决定要把线上的日志先干掉，从源头解决问题
5. 临时方案就是把 日志的 url 过滤掉，不到后端就可以了，配置好以后，发现整个世界都清净了。。。😌。。。

# 配置 nginx
刚配置Nginx的时候，不好使，原因是 location 在匹配的时候有优先级，测试下就可以了
```nginx
location ^~ /path/serverlog.htm {
    allow 1.2.3.4;
    deny all;
}
```

参考：  
[Nginx: Block URL Access (wp-admin/wp-login.php) To All Except One IP Address](https://www.cyberciti.biz/faq/nginx-block-url-access-all-except-one-ip-address/)     
[nginx location匹配规则](http://www.nginx.cn/115.html)

