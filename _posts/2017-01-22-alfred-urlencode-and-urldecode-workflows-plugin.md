---
layout: post
title: "Alfred urlencode/urldecode插件"
date: '2017-01-22 04:13:54'
category: mac
tags: alfred tools python
---

> Alfred urlencode/urldecode插件

# 自己做个工具
老去搜索在线的urldecode工具，直接搞一个吧，更加方便了   
直接上关键Script代码：😉

# urlencode
```
#!/usr/bin/env python
# -*- encoding: utf-8 -*-
# author: xu3352<xu3352@gmail.com>
# desc: urlencode

## python2
# import sys
# import urllib
# result = urllib.quote('{query}');
# sys.stdout.write(result);

## python3
import sys
import urllib.parse

result = urllib.parse.urlencode({'': '{query}'})
sys.stdout.write( result[1:] )
```

# urldecode
```
#!/usr/bin/env python
# -*- encoding: utf-8 -*-
# author: xu3352<xu3352@gmail.com>
# desc: urldecode

## python2
# import urllib
# import sys

# result = urllib.unquote('{query}').decode('utf8');
# sys.stdout.write(result);

## python3
from urllib.parse import unquote
import sys

result = unquote(unquote('{query}'))
sys.stdout.write(result);
```

下载资源：
- [UrlEncode.alfredworkflow](http://on6gnkbff.bkt.clouddn.com/20170419162632_UrlEncode.alfredworkflow.zip)
- [UrlDecode.alfredworkflow](http://on6gnkbff.bkt.clouddn.com/20170419162632_UrlDecode.alfredworkflow.zip)

参考：
- [Url decode UTF-8 in Python](http://stackoverflow.com/questions/16566069/url-decode-utf-8-in-python)
- [python中的urlencode与urldecode](http://blog.csdn.net/haoni123321/article/details/15814111)
- [Is there a way to substring a string in Python?](http://stackoverflow.com/questions/663171/is-there-a-way-to-substring-a-string-in-python)
- [URL Decode with Python 3](http://stackoverflow.com/questions/8628152/url-decode-with-python-3)
