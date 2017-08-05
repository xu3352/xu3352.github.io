---
layout: post
title: "脚本切换多套网络环境 hosts"
tagline: ""
description: "可以自定义多套 hosts 备用模板，随意组合切换"
date: '2017-08-04 15:47:32 +0800'
category: mac
tags: mac python hosts
---
> {{ page.description }}

# 场景
对于开发和测试来说，这个就比较常见了，合理一点的都会区分线上、线下环境之类的，而往往会有这么几个划分：
- 开发环境 - dev - 开发的本地环境，IDE里面写完代码就可以调试和看效果了
- 测试环境1- qa1 - 功能或者Bugfix之后，测试部门回归问题的环境
- 测试环境2 - qa2 - 测试环境有时候可能不止有一套，比如多个项目并发的时候
- 预上线环境- preonline - 这个环境一般的数据都是正式的数据，已经缓存
- 正式环境- online - 对外提供的服务

# 多个服务
比如一个网站可能使用到了：
- 网站服务 - 这里可能是多个网站
- 图片服务 - 文件服务器、Mongo之类的 
- 缓存服务 - Memcached、Redis等

那么这里每个服务基本都会有自己的域名，访问的时候使用域名就可以了，那么切换环境的时候，其实只需要修改域名对应的IP的指向就可以了，而代码层面是不用改动的，这点就非常实用了

# 准备模板
模板文件准备，比如我们前面的5个场景环境，这里就需要准备5个模板，这里就以 `.host` 为后缀，存储路径为：`/Users/xuyinglong/work/host/template/`
- dev.host
- qa1.host
- qa2.host
- preonline.host
- online.host

文件的内容跟 `/etc/hosts` 类似，都是以 `IP 域名` 形式的

# 组装脚本
python(3.5.2) 脚本处理起来方便点：`host.py`
```python
#!/usr/bin/env python
# coding:utf8
# author:xu3352
# TODO: 
#	1.根据参数获取模板文件（不带后缀）
#	2.把指定的模板文件列表写入 host 文件
#	3.刷新 dns 缓存

import sys
import os
import importlib

importlib.reload(sys)
# sys.setdefaultencoding('utf8')

filenames = ['' for n in range(len(sys.argv)+1)]

# fill first:public and last:google
filenames[0] = 'public';
filenames[len(filenames)-1] = 'google'

#argvs in the middle
for x in range(1, len(sys.argv)):
	filenames[x] = sys.argv[x]

print("load template files : ", filenames)

# local setting
localhost = '/etc/hosts';
templatedir='/Users/xuyinglong/work/host/template/';

outfile = open(localhost, 'w');

#write file
for hostfile in filenames:
	outfile.write('####\t' + hostfile + '.host \n');
	for line in open(templatedir + hostfile + '.host'):
		outfile.write(line)
	outfile.write('\n\n');

outfile.close()

print('clear dns for mac ...')
# clear dns（mac）
os.system('dscacheutil -flushcache');

print('WELL DONE! :)')

```
按照执行时给的参数来决定加载哪些模板，自动会默认加载：`public`（第一个） 和 `google`（最后一个） 模板，这样可以把公共的放到 `public` 里面

`host.py` 记得给可执行的权限，为了方便，最好是放到 $PATH 目录下面, 这样在任何地方的可以调用了

使用：
```shell
# 比如这里切换到：qa1 环境，可以指定多个模板，中间用空格分开
$ host.py qa1
load template files :  ['public', 'qa1', 'google']
clear dns for mac ...
WELL DONE! :)
```
这里实际上加载的：`public.host、qa1.host、google.host` 三个模板

# 浏览器插件
那么如何确定环境是否切换了成功了呢，`ping` 一下就知道IP了；

浏览器也有好多扩展可以看到 IP 的；chrome 扩展程序：`Website IP`，Firefox 扩展程序：`HostAdmin`

有的浏览器插件甚至可以直接修改 host，改完即生效，也是很方便的


