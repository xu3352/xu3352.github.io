---
layout: post
title: "Python Excel操作:Openpyxl"
tagline: ""
description: "`Openpyxl`:非常简单的 `Excel` 操作模块 (不过不支持读 `xls` 格式; 支持报表)"
date: '2018-07-27 21:37:27 +0800'
category: python
tags: openpyxl excel python
---
> {{ page.description }}

# Openpyxl
支持的格式: Excel 2010 `xlsx/xlsm/xltx/xltm`

因为简单, 所以选她... 名字比其他几个得劲一点

# 安装
```bash
$ sudo pip3 install openpyxl
```

# 写文件
```python
#!/usr/bin/python3

from openpyxl import Workbook

book = Workbook()
sheet = book.active

rows = (
    (88, 46, 57),
    (89, 38, 12),
    (23, 59, 78),
    (56, 21, 98),
    (24, 18, 43),
    (34, 15, 67)
)

for row in rows:
    sheet.append(row)

book.save('appending.xlsx')
```
额, 好吧, 就是这么简单... 

更多的可以看看文档

---
参考：
- [教程:Openpyxl tutorial](http://zetcode.com/articles/openpyxl/)
- [最流行的Python Excel的模块:Working with Excel Files in Python](http://www.python-excel.org/)
- [Openpyxl官网:A Python library to read/write Excel 2010 xlsx/xlsm files](https://openpyxl.readthedocs.io/en/stable/index.html)

