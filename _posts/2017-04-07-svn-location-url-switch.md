---
layout: post
title:  "SVN检出地址切换"
date:   2017-04-07 01:55:00 +0800
category: java
tags: intellij-idea svn tools
---
>  同一个SVN资源库检出地址切换

# 准备
```
场景：同一个SVN资源库，一个内网地址，一个外网地址，本机地址为内网地址   
期望：再不删除本地代码并重新检出的情况下进行切换，尤其是代码有变更，还没提交情况。比回到家或在外面 
IDE：IntelliJ IDEA   
```

# 操作
```bash
1.最直接的是更新外网SVN地址的资源库，但是这个报错:
    Error:svn: E155025: 'svn://192.168.0.235/xxx'
    is not the same repository as
    'svn://外网IP'
2.正确的应该是：
    选择Relocate，然后把目标地址填写成：外网资源库地址
3.命令行操作，如：
    svn relocate http://99.99.99.old/svn/company/project/trunk/web http://99.99.99.new/svn/company/project/trunk/web
```
![指向新地址](http://on6gnkbff.bkt.clouddn.com/20170406181113_svn-update-directory.png){:width="100%"}

参考：
[svn switch error - is not the same repository](http://stackoverflow.com/questions/925698/svn-switch-error-is-not-the-same-repository)



