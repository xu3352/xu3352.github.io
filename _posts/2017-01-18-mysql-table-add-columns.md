---
layout: post
title: "Mysql 大数据表加字段"
date: '2017-01-18 15:11:34'
categories: mysql
tags: mysql
---

> 数据库操作千万注意，记得先备份表，不然哪天哭死你

# 加字段
```sql
alter table tbl_a add column 
`remark` varchar(255) NOT NULL DEFAULT '' COMMENT '备注' after `name`;
```
清单：tbl_a
```sql
CREATE TABLE `tbl_a` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL DEFAULT '' COMMENT '姓名',
  `age` int(10) NOT NULL DEFAULT '0' COMMENT '年龄',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1004 DEFAULT CHARSET=utf8 COMMENT='测试表';
```

# 注意事项
- 最好是写标准的sql语句来加/删字段、索引
- 字段要有默认值，备注
- 可以指定新加字段的位置

# 痛点
有一个大数据的表，1.37亿（数据量36G，索引13G），一个 count(1) 语句就得25s左右，不知道是快还是慢？

配置：`数据库类型:MySQL 5.6 CPU:11核 数据库内存:24G`

新建了4个字段，加一个字段就得1个小时！！！花了4个小时，可否有比较快速的方法？

想过新建一个表，字段先建好，然后把数据复制过去，再加索引，但是时间不好评估，就没这么搞了；
复制数据+建索引的时间至少也得几个小时

还有就是大数据表一定不能整体的 `update` 之类的操作，最好是写程序小批小批的操作，不然一旦更新失败或者取消，还得回滚，那就够喝一壶的了😂



