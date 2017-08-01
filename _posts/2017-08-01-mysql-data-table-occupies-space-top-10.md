---
layout: post
title: "Mysql数据表占用空间排行Top10"
tagline: ""
description: "快速找到哪些表占用了大部分的数据存储空间；如果需要处理数据量大的数据，建议蚂蚁搬家的方式，每次小量，分多次完成"
date: '2017-08-01 13:30:28 +0800'
category: mysql
tags: mysql
---
> {{ page.description }}

# 排行榜
```sql
-- 按总的占用空间排行 Top10 (单位G)
select t.TABLE_NAME 
    , t.TABLE_ROWS
    , round(t.DATA_LENGTH/1024/1024/1024, 2) dataSpace
    , round(t.INDEX_LENGTH/1024/1024/1024, 2) indexSpace
    , round(sum((t.DATA_LENGTH + t.INDEX_LENGTH)/1024/1024/1024), 2) usedSpace
from information_schema.TABLES t
where t.TABLE_SCHEMA = 'xx数据库'
group by t.TABLE_NAME
order by usedSpace desc
limit 10
```

# 效果图
此处按照 数据+索引 总的倒叙排列，需要其他排序方式的可自行修改
![效果图](http://on6gnkbff.bkt.clouddn.com/20170801053350_mysql-table-used-space-top10.png){:width="100%"}

# information_schema
应该是所有的数据库、表、字段、触发器等之类的信息都可以在这里找到     

表信息存在在：`information_schema.TABLES`
- TABLE_SCHEMA - 数据库名
- TABLE_NAME - 表名
- ENGINE - 所使用的存储引擎
- TABLES_ROWS - 记录数
- DATA_LENGTH - 数据大小（单位：字节）
- INDEX_LENGTH - 索引大小（单位：字节）

单位：
- 1024 Byte = 1 KB 
- 1024 KB = 1 MB 
- 1024 MB = 1 GB

---
参考：
- [mysql查看数据库和表的占用空间大小](http://xiaosu.blog.51cto.com/2914416/687835)

