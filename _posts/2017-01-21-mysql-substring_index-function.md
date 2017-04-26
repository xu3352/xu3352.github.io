---
layout: post
title: "Mysql substring_index函数 lastIndexOf+substring"
date: '2017-01-21 16:18:14'
categories: mysql
tags: mysql
---

> Mysql函数：SUBSTRING_INDEX的使用

比如需要把IP提取前3段：SELECT SUBSTRING_INDEX('115.216.230.189', '.', 3);

SUBSTRING_INDEX：一个强大的截取函数，汇总一下就是：substring + indexOf/lastIndexOf 的组合，指定标识符往前或者往后截取
给个例子就懂了：

```sql
mysql> SELECT SUBSTRING_INDEX('www.mysql.com', '.', 2);
        -> 'www.mysql'
mysql> SELECT SUBSTRING_INDEX('www.mysql.com', '.', -2);
        -> 'mysql.com'
```

查询Dash手册：  
**SUBSTRING_INDEX(str,delim,count)**

_Returns the substring from string str before count occurrences of the delimiter delim. If count is positive, everything to the left of the final delimiter (counting from the left) is returned. If count is negative, everything to the right of the final delimiter (counting from the right) is returned. **SUBSTRING_INDEX()** performs a case-sensitive match when searching for **delim**._


参考：
[Last index of a given substring in MySQL](http://stackoverflow.com/questions/12775352/last-index-of-a-given-substring-in-mysql)


