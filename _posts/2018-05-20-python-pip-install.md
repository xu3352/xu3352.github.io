---
layout: post
title: "Pip 源码安装和升级"
tagline: ""
description: "pip 源码安装和升级"
date: '2018-05-20 13:32:39 +0800'
category: python
tags: pip python
---
> {{ page.description }}

官网: 
> pip is already installed if you are using Python 2 >=2.7.9 or Python 3 >=3.4 downloaded from [python.org](https://www.python.org/) 
> or if you are working in a Virtual Environment created by virtualenv or pyvenv. 
> Just make sure to upgrade pip.

说是 `pip` 已经自带了, 如果是 python2 >= 2.7.9 或者 python3 >= 3.4 的话 (官网下载的)

# 安装
```bash
# 下载源码包
$ curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py

# 安装
$ python get-pip.py
```

安装之后 `pip` 默认是放到源码包的 bin 目录下, 比如: `/usr/local/python2.7/bin/pip2.7` 

手动创建软链:
```bash
$ ln -s /usr/local/python2.7/bin/pip2.7 /usr/bin/pip2.7
```

查看版本号和位置:
```bash
$ pip2.7 -V
pip 10.0.1 from /usr/local/python2.7/lib/python2.7/site-packages/pip (python 2.7)
```

安装模块包:
```bash
# 安装 SomePackage 模块
$ python -m pip install SomePackage

# 安装指定版本模块
$ python -m pip install SomePackage==1.0.4    # specific version

# 安装最低版本模块
$ python -m pip install "SomePackage>=1.0.4"  # minimum version

# 升级模块
$ python -m pip install --upgrade SomePackage

# 卸载模块
$ python -m pip uninstall SomePackage
```

简单点的就直接使用 `pip2.7 intall SomePackage` 也是一样的

# 升级
```bash
# windows
$ python -m pip install -U pip

# linux or macos
$ pip install -U pip
```

---
参考：
- [python官网 www.python.org](https://www.python.org/)
- [pip Installation](https://pip.pypa.io/en/stable/installing/)
- [Python 3 源码安装及问题解决](https://xu3352.github.io/python/2018/05/15/python-3-install)

