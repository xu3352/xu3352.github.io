---
layout: post
title: "学会用 Mysql show processlist 排查问题"
tagline: ""
description: "mysql show full processlist 查看当前线程处理情况"
date: '2017-07-08 11:12:18 +0800'
category: mysql
tags: mysql
---
> {{ page.description }}

# 事发现场
每次执行看到的结果应该都有变化，因为是实时的，所以我定义为：“事发现场”，每次执行就相当于现场的快照

一般用到 `show processlist` 或 `show full processlist` 都是为了查看当前 mysql 是否有压力，都在跑什么语句，当前语句耗时多久了，有没有什么慢 SQL 正在执行之类的

可以看到总共有多少链接数，哪些线程有问题(time是执行秒数，时间长的就应该多注意了)，然后可以把有问题的线程 kill 掉，这样可以临时解决一些突发性的问题

`有时候一个快照可能看不出什么问题，那么可以频发的刷新试试`

# 问题排查
`show full processlist` 可以看到所有链接的情况，但是大多链接的 state 其实是 Sleep 的，这种的其实是空闲状态，没有太多查看价值

我们要观察的是有问题的，所以可以进行过滤：
```sql
-- 查询非 Sleep 状态的链接，按消耗时间倒序展示，自己加条件过滤
select id, db, user, host, command, time, state, info
from information_schema.processlist
where command != 'Sleep'
order by time desc 
```
这样就过滤出来哪些是正在干活的，然后按照消耗时间倒叙展示，排在最前面的，极大可能就是有问题的链接了，然后查看 info 一列，就能看到具体执行的什么 SQL 语句了，针对分析
![](http://on6gnkbff.bkt.clouddn.com/20170708035641_mysql-show-full-processlist-nonsleep.png){:width="100%"}

展示列解释：
- **id** - 线程ID，可以用：`kill id;` 杀死一个线程，很有用
- **db** - 数据库
- **user** - 用户
- **host** - 连库的主机IP
- **command** - 当前执行的命令，比如最常见的：Sleep，Query，Connect 等
- **time** - 消耗时间，单位秒，很有用
- **state** - 执行状态，比如：Sending data，Sorting for group，Creating tmp table，Locked等等，很有用，其他状态可以看看本文最后的参考文章
- **info** - 执行的SQL语句，很有用

# kill 使用
上面提到的 线程ID 是可以通过 kill 杀死的；所以上面基本上可以把有问题的执行语句找出来，然后就可以 kill 掉了，那么一个一个来 kill 么？
```sql
-- 查询执行时间超过2分钟的线程，然后拼接成 kill 语句
select concat('kill ', id, ';')
from information_schema.processlist
where command != 'Sleep'
and time > 2*60
order by time desc 
```
在下一步我就不用说了吧，把拼接 kill 的执行结果跑一遍就搞定了

这个有时候非常好用，谁用谁知道

# 常见问题
一些问题会导致连锁反应，而且不太好定位，有时候以为是慢查询，很可能是大多时间是在等在CPU、内存资源的释放，所以有时候同一个查询消耗的时间有时候差异很大

 总结了一些常见问题：
- CPU报警：很可能是 SQL 里面有较多的计算导致的
- 连接数超高：很可能是有慢查询，然后导致很多的查询在排队，排查问题的时候可以看到”事发现场“类似的 SQL 语句一大片，那么有可能是没有索引或者索引不好使，可以用：`explain` 分析一下 SQL 语句


---
参考：
- [mysql show processlist的 state 列含义参考](http://www.cnblogs.com/JulyZhang/archive/2011/01/28/1947165.html)

