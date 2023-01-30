---
layout: post
title: "MySQL 使用 order by field() 自定义排序"
keywords: "mysql,order by,field"
description: "MySQL 使用 order by field 自定义排序"
tagline: ""
date: '2023-01-30 16:35:34 +0800'
category: mysql
tags: mysql
---
> {{ page.description }}

# MySQL FIELD() 函数

语法: `FIELD(value, val1, val2, val3, ...)`

> `FIELD()` 函数返回值在值列表中的索引位置。<br/>此函数执行不区分大小写的搜索。<br/>注意：如果在值列表中没有找到指定的值，该函数将返回0。如果值为NULL，该函数将返回0。

```mysql
SELECT FIELD("q", "s", "q", "l");
> 2 

SELECT FIELD("qs", "s", "q", "l");
> 0
```

# order by + field 自定义排序

在做一些统计里, 文本非自然排序, 只有较少几行数据时, 就非常好用了

```mysql
SELECT * FROM mytable 

+----+---------+
| id |  name   |
+----+---------+
|  1 | stan    |
|  2 | kyle    |
|  3 | kenny   |
|  4 | cartman |
+----+---------+ 

SELECT * FROM mytable 
WHERE id IN (3,2,1,4) 
ORDER BY FIELD(id,3,2,1,4)

+----+---------+
| id |  name   |
+----+---------+
|  3 | kenny   |
|  2 | kyle    |
|  1 | stan    |
|  4 | cartman |
+----+---------+ 
```

---
参考：
- [MySQL 使用 order by field 自定义排序](https://www.jianshu.com/p/2f5fce5e572f){:target='blank'}
- [MySQL FIELD() 函数](https://www.w3schools.cn/mysql/func_mysql_field.asp){:target='blank'}
- [How does ORDER BY FIELD() in MySQL work internally](https://dba.stackexchange.com/questions/109120/how-does-order-by-field-in-mysql-work-internally){:target='blank'}

