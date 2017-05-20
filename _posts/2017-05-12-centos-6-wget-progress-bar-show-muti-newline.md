---
layout: post
title: "centos 6 wget progress bar show muti newline"
tagline: ""
date: '2017-05-12 23:29:14 +0800'
category: linux
tags: centos wget linux
---
> Centos 6下的wget进度条多行显示bug

# wget 进度条每次刷新起一行
说的是翻译错误，不过为什么不修复。。。

# 修复
```bash
$ cd /usr/share/locale/zh_CN/LC_MESSAGES/
#要养成习惯做一下备份
$ mv ./wget.{mo,mo.back}
#这里会用到msgunfmt和msgfmt专门用来查看*.mo格式的二进制文件,在这里把备份文件的导到stdI/O上覆盖源文件
$ msgunfmt wget.mo.back -o - | sed 's/eta(英国中部时间)/eta/g' | msgfmt - -o wget.mo
```

参考：
- [Centos 6下的wget进度条多行显示bug](http://jim123.blog.51cto.com/4763600/1881595)
