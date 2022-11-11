---
layout: post
title: "Mysql left join索引不好使?"
keywords: "mysql index"
description: "Mysql left join索引不好使? <br/>明明索引已经加了, explain 检查时却没有生效?"
tagline: ""
date: '2022-11-11 13:41:22 +0800'
category: mysql
tags: mysql
---
> {{ page.description }}

# 表字符集不一致

SQL慢查询, 经过 `explain` 分析发现关联表索引未生效

最终查到: 关联表的字符集不一致, 一个是 `utf8mb4` 一个是 `utf8`, 后来把表字符集改成一致的就好使了



把关联表字符集改成 `utf8mb4`: 
```sql
ALTER TABLE table_xxx CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
```

注意: 改表的字符集, 最好在数据库压力小的时候进行操作, 别问我是怎么知道的, 哈哈~

另外, 字符集不一致, 关联查询时, 索引也不一定不好使 😆

---
参考：
- [mysql left join使用不了索引问题](https://blog.csdn.net/gb4215287/article/details/125809492){:target='blank'}
- [MySQL数据库字符集由utf8修改为utf8mb4](http://www.dagoogle.cn/n/599.html){:target='blank'}

