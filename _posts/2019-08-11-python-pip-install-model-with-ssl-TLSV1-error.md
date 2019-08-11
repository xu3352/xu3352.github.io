---
layout: post
title: "python3的pip安装模块报错:[SSL: TLSV1_ALERT_PROTOCOL_VERSION]"
keywords: "python,pip,ssl,aliyun"
description: "当使用 `virtualenvwrapper` 创建了一个新的环境时, 使用 pip 安装模块报错, pip 版本过低又无法自动升级"
tagline: ""
date: '2019-08-11 12:15:54 +0800'
category: mac
tags: mac
---
> {{ page.description }}

# 安装错误

```bash
# 创建并切换到新环境
$ mkvirtualenv aliyun_image_search
$ workon aliyun_image_search

# 安装模块
$ python -m pip install aliyun-python-sdk-core
Collecting aliyun-python-sdk-core
  Could not fetch URL https://pypi.python.org/simple/aliyun-python-sdk-core/: There was a problem confirming the ssl cer
tificate: [SSL: TLSV1_ALERT_PROTOCOL_VERSION] tlsv1 alert protocol version (_ssl.c:645) - skipping
  Could not find a version that satisfies the requirement aliyun-python-sdk-core (from versions: )
No matching distribution found for aliyun-python-sdk-core
```

```bash
# 查看 pip 版本
$ python -m pip --version
pip 9.0.1 from /Users/xuyinglong/.virtualenvs/aliyun_image_search/lib/python3.5/site-packages/pip-9.0.1-py3.5.egg (pytho
n 3.5)

# pip 自动升级也是同样的错误
$ python -m pip install --upgrade pip 
Could not fetch URL https://pypi.python.org/simple/pip/: There was a problem confirming the ssl certificate: [SSL: TLSV1
_ALERT_PROTOCOL_VERSION] tlsv1 alert protocol version (_ssl.c:645) - skipping
Requirement already up-to-date: pip in /Users/xuyinglong/.virtualenvs/aliyun_image_search/lib/python3.5/site-packages/pi
p-9.0.1-py3.5.egg
```

# 更新pip
```bash
# 安装最新的pip
$ curl https://bootstrap.pypa.io/get-pip.py | python
```

成功安装之后, pip 就可以正常使用了

---
参考：
- [Python virtualenv 和 virtualenvwrapper 安装和使用](https://xu3352.github.io/python/2018/08/17/Python-work-with-virtualenv-and-virtualenvwrapper)
- [mac下python环境pip报错[SSL: TLSV1_ALERT_PROTOCOL_VERSION] tlsv1 alert protocol version (_ssl.c:590) 的解决方法](https://www.cnblogs.com/testyao/p/9323030.html)
