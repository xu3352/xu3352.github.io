---
layout: post
title: "Python pymysql (1366, Incorrect string value: xF0x9F"
keywords: "python mysql pymysql"
description: "Python pymysql (1366, Incorrect string value: xF0x9F"
tagline: ""
date: '2022-11-17 18:13:52 +0800'
category: python
tags: python mysql pymysql
---
> {{ page.description }}

# 字符集问题

这种多半是emoji表情符号导致的问题, 链接数据库时需要指定字符集: `utf8mb4`

当然, 对应的数据库也是需要支持的

```sql
-- 修改表的字符集
ALTER TABLE table_xxx CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;


-- 修改字段字符集
alter table tbl_name CHANGE column_a
`column_a` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT 'xxxx';
```

---
参考：
- [Python+Mysql 遇到pymysql.err.InternalError: (1366, “Incorrect string value: xF0x9报错)](https://blog.csdn.net/weixin_45890771/article/details/121438350){:target='blank'}

