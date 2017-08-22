---
layout: post
title: "Linux shell 提取文件名和目录名"
tagline: ""
description: "使用字符串截取, 替换之类的固然可行, 不过有简单的方法"
date: '2017-08-22 15:13:57 +0800'
category: linux
tags: shell linux-command linux
---
> {{ page.description }}

# 获取文件名
语法: `basename NAME [SUFFIX]`
```bash
# 文件名获取
$ var=/a/b/c/d.txt
$ echo $(basename $var)
d.txt
$ echo $(basename $var .txt)
d
```

# 获取目录名
语法: `dirname NAME`
```bash
# 目录获取
$ var=/a/b/c/d.txt
$ echo $(dirname $var)
/a/b/c
```

# 使用 ${}
通常使用变量直接在前面加 `$` 符号即可, 比如:`$var`; 另一种写法是: `${var}` 

以前还真没怎么注意, 反正常用第一种写法, 偶尔使用第二种写法

然而其实还有高级的用法: `字符的提取和替换等等操作`

以文件名和目录获取为例:     
```bash
# 文件名获取
$ var=/a/b/c/d.txt
$ echo ${var##*/}
d.txt

# 文件夹获取
$ ${var%/*}
/a/b/c
```

替换操作:     
语法:`${变量名/查找字符/替换字符}` or `${变量名//查找字符/替换字符}`
```bash
# 字符替换
$ var=/a/b/c/b/d.txt
$ echo ${var/b/x}
/a/x/c/b/d.txt
 
$ echo ${var//b/x}
/a/x/c/x/d.txt
```

字符截取:    
语法:`${变量名:位置起点}` or `${变量名:位置起点:长度}`
```bash
$ var="12345678"
$ echo ${var:0:5}
12345

$ echo ${var:5}
678
```

截断/替换/截取详解:
- `#` - 从左边算起第一个
- `##` - 从左边算起最后一个
- `%` - 从右边算起第一个
- `%%` - 从右边算起最后一个
- `*` - 通配符, 代表所有字符, 注意匹配字符串的前后位置

- `/find/replace` - 查找指定字符串并替换, 第一个
- `//find/replace` - 查找指定字符串并替换, 全部

- `:start` - 截取start位置到最后
- `:start:length` - 截取start位置后length长度的字符串

---
参考：
- [Linux shell 之 提取文件名和目录名的一些方法](http://blog.csdn.net/ljianhui/article/details/43128465)
- [更多命令提取文件名 - Extract file name](https://stackoverflow.com/questions/2536046/extract-file-name)
- [Shell 的变量扩展功能](http://opus.konghy.cn/shell-tutorial/chapter2.html#varext)
