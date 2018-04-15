---
layout: post
title: "sublime text 3 python3 utf-8中文输出乱码解决"
date: '2017-03-02 14:12:20'
category: python
tags: python sublime-text-3
---

> 中文输出在 `python3` 的控制台没问题,但是 `sublime text 3` 里面直接 `build` 会报错…

# 先看控制台
```bash
➜  ~ python3
Python 3.5.2 (v3.5.2:4def2a2901a5, Jun 26 2016, 10:47:25)
[GCC 4.2.1 (Apple Inc. build 5666) (dot 3)] on darwin
Type "help", "copyright", "credits" or "license" for more information.
>>> print('中文')
中文
```

直接在控制台执行也是没有问题的：`python3 str_utf8_python3.py`   
文件：`str_utf8_python3.py`
```python
#!/usr/bin/env python
#coding=utf-8
# author: xu3352
# desc: str output test in python3

print("中文")
```

但是在`sublime text 3`里直接 `build`报错
```python
Traceback (most recent call last):
  File "/Users/xuyinglong/coding-python/str_utf8_python3.py", line 6, in 
    print("\u4e2d\u6587")
UnicodeEncodeError: 'ascii' codec can't encode characters in position 0-1: ordinal not in range(128)
``` 

# 改造
改造：`str_utf8_python3.py`再次执行OK, 感觉略坑…
```python
#!/usr/bin/env python
#coding=utf-8
# author: xu3352
# desc: str output test in python3

import sys
sys.stdout = open(sys.stdout.fileno(), mode='w', encoding='utf8', buffering=1)

print("中文")
## Also works with other methods of writing to stdout:
sys.stdout.write("中文\n")
sys.stdout.buffer.write("中文\n".encode())
```

# 构建补充
自定义的 `Build` 改成如下就可以支持了: 

首次创建: `Tools` -> `Build System` -> `New Build System...`, 内容如上; 实际 `python3` 可以写绝对路径; 保存时命名为 `python3.sublime-build` 即可
```bash
{
    "cmd": ["/usr/local/bin/python3", "-u", "$file"],
    "env": {"PYTHONIOENCODING": "utf8"}, 
    "file_regex": "^[ ]*File \"(...*?)\", line ([0-9]*)",
    "selector": "source.python"
}
```

修改路径: `Preferences` -> `Browse Packages...` -> `./Packages/User/python3.sublime-build`

构建文件时可以手动选择: `Tools` -> `Build System` -> `python3`, 然后 `Cmd + B` 直接就可以执行你当前的 `xx.py` 文件了

(2018.04.15 补充更新)


参考：
- [How to print utf-8 to console with Python 3.4 (Windows 8)?](http://stackoverflow.com/questions/25127673/how-to-print-utf-8-to-console-with-python-3-4-windows-8)
- [How to set sys.stdout encoding in Python 3?](http://stackoverflow.com/questions/4374455/how-to-set-sys-stdout-encoding-in-python-3)

