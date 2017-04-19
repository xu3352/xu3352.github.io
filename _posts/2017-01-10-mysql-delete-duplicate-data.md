---
layout: post
title: "Mysql大数据去重复"
date: '2017-01-10 18:14:00 +0800'
categories: mysql
tags: mysql
---
> Mysql大数据去重复

# 场景
总数据量：380w，单个字段重复的70w左右，单字段有索引的；这点数据量其实算不了大数据，勉强吧

# 重复次数少，基数大
```sql
-- 比如：查询出重复记录中最大的ID列表，然后删除；然后继续找，继续删除......
-- 查找column_a重复的记录中，id最大的一个
select max(id) from tbl_a group by column_a having count(1) > 1;
-- 按ID列表删除
delete from tbl_a where id in ( ... );
```

那么如果同一条数据重复次数很多呢？可操作性就不太行了；  
另外一种去重复的方式：查询最小的ID（假设保留最小的）和 ```column_a``` 然后批量生成 ```delete``` 语句执行，这种的效率低，适合重复基数少，次数多的情况。

# 重复次数多，基数小
```sql
-- 快速生成删除语句，我一般是查询完之后拷贝到sublime里，然后正则替换一下
select column_a, min(id) from tbl_a group by column_a having count(1) > 1;
delete from tbl_a where column_a = ? and id > ?;

-- 直接拼接 sql 语句
select concat('delete from tbl_a where column_a = \'', column_a, '\' and id > ', min(id), ';')
from tbl_a group by column_a having count(1) > 1; 
```

# 总结  
```
个人感觉最快的方式是：
1.先找到重复的数据的ID；
2.按ID列表删除
```

参考：[mysql中数据去重和优化](http://www.cnblogs.com/rainduck/archive/2013/05/15/3079868.html)

