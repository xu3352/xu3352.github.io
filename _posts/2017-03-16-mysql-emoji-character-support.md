---
layout: post
title: "mysql修改列字符集来支持emoji符号"
date: '2017-03-16 12:55:53'
categories: mysql
tags: mysql
---

> 当 ```mysql``` 遇到 ```emoji``` 表情符号

mysql 5.5.3版本以上的版本才支持哦

# 代码清单
```sql
-- 修改字段字符集
alter table tbl_name CHANGE column_a
`column_a` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT 'xxxx';
```

