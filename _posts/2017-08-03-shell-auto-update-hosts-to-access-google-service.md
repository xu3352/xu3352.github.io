---
layout: post
title: "脚本自动更新 hosts 来访问 Google 服务"
tagline: ""
description: "7.21号 鱼摆摆 服务挂掉了，后来知道是被狙了；<br/>此VPN一直用了2年多，平时用得最多也就就Google，算是便宜又稳定的；<br/>百度出来的东西质量还是不太行啊。。。"
date: '2017-08-03 21:57:55 +0800'
category: mac
tags: mac hosts VPN
---
> {{ page.description }}

# 忧伤
如果程序员没有了 Google、百度，那简直不敢想象。。。     

`因为你踩的坑，99%的人都已经踩过了！！！老司机都懂的！！！`

没办法，要么就是换个VPN，找了找也不知道哪个好。。。

临时的就先改 hosts 了，用度娘找了找，还是有好心人专门收集并定时更新 hosts，万分感谢，好人一生平安!

# hosts 
Linux系列（Mac也是）路径都是 `/etc/hosts` ，这里可以配置指定域名对应的IP，这样访问指定域名就走指定的IP了，从而达到翻墙的目的    

作为一个开发，避免不了的就是多个环境切换，比如：本地、开发、测试、预上线、正式等环境；

如果每次都是用IP来访问，那估计早就哭晕在厕所了；那么就可以一个域名配置多套方案，以对应这些环境，切换环境的时候，替换成配置好的方案就可以了；

而每个方案最终控制的就是 `hosts` 文件的内容！ Chrome 和 Firefox 浏览器有专门的插件来做这个的

# 更新 hosts 
直接做成脚本：`auto-update-hosts.sh`
```shell
#!/bin/bash
# author:xu3352
# desc:auto update hosts from "https://github.com/racaljk/hosts"

# 1.下载 重命名
curl -o /tmp/google-hosts "https://raw.githubusercontent.com/racaljk/hosts/master/hosts"

# 2. 清空源文件，然后替换为最新的内容
echo "" > /etc/hosts
cat /tmp/google-hosts > /etc/hosts

# 3. 清除 DNS 缓存
dscacheutil -flushcache
```

注意给个可执行的权限 
```shell
# 指定为 root 用户
sudo chown root:wheel auto-update-hosts.sh

# 可执行权限
chmod 755 auto-update-hosts.sh
```    

# 定时更新脚本
```shell
# 切换成 root 用户
sudo su -

# 加入定时任务 13:30 执行
crontab -e
30 13 * * * sh /path/auto-update-hosts.sh
```
这样就能定时自动更新到最新的 hosts 了

基本上就搞定了，但是比较粗暴，直接全部替换了！

但是如果还想有其他配置怎么办呢？比如多个环境之间切换呢？

当然也是修改 `/etc/hosts` 文件了，后续再慢慢介绍

# 补充
用了一段时间, 自动更新的 hosts 也不太好使, 好像是2017.08月上旬开始不好使的, 然后发现 [老D博客 - 2017 Google hosts 持续更新](https://laod.cn/hosts/2017-google-hosts.html) 是好使的, 定时任务是在跑的, 不过没替换当前的 hosts 了, 而是存入一个备用文件了, 没准哪天又好使了呢, 到时候直接换回来就行了

于 2017-09-10 补充...

---
参考：
- [微博-鱼摆摆家的华叔](http://weibo.com/emptyhua?refer_flag=1005050010_&is_hot=1)
- [2017 Google hosts 持续更新](https://laod.cn/hosts/2017-google-hosts.html)
- [最新可用的google hosts文件](https://github.com/racaljk/hosts)
- [CURL上传下载](https://xu3352.github.io/linux/2017/02/24/curl-upoload-and-download-files)


