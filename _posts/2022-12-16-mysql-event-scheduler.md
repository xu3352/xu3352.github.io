---
layout: post
title: "MySQL自带的定时任务"
keywords: "mysql,scheduler"
description: "MySQL自带的定时任务, 做数据备份之类的就方便了"
tagline: ""
date: '2022-12-16 14:04:27 +0800'
category: mysql
tags: mysql scheduler
---
> {{ page.description }}

> 自MySQL5.1.6起，增加了一个非常有特色的功能-事件调度器（Event Scheduler），可以用做定时执行某些特定任务（例如：删除记录、对数据进行汇总、数据备份等等）


# 语法

```sql
CREATE EVENT [IFNOT EXISTS] event_name
    　　 ONSCHEDULE schedule
    　　 [ONCOMPLETION [NOT] PRESERVE]
    　　 [ENABLE | DISABLE]
    　　 [COMMENT 'comment']
    　　 DO sql_statement;

schedule:
　　 AT TIMESTAMP [+ INTERVAL INTERVAL]
　　 | EVERY INTERVAL [STARTS TIMESTAMP] [ENDS TIMESTAMP]
　　
　　INTERVAL:
　　 quantity {YEAR | QUARTER | MONTH | DAY | HOUR | MINUTE |
　　 WEEK | SECOND | YEAR_MONTH | DAY_HOUR | DAY_MINUTE |
　　 DAY_SECOND | HOUR_MINUTE | HOUR_SECOND | MINUTE_SECOND}
```

# 数据备份示例
例如需要把某个表超过15天的数据进行归档处理, 可以先建一个备份的存储过程, 然后定时执行即可; 


```sql
# 1.创建存储过程 (先备份,后清理)
create procedure do_xxxx_data_archived()
begin
    set @d15 := date_add(curdate(), interval - 15 day);
    # 超15天的归档
    insert into xxxx_data_history
    select * from xxxx_data where date < @d15;
    # 删除超15天的数据
    delete from xxxx_data where date < @d15;
end;

# 2.创建定时任务, 每天执行一次
create event 定时任务名称XXX on schedule
    every '1' day
        starts '2022-12-01 03:00:00'
    on completion preserve
    enable
    do
    call do_xxxx_data_archived();
```

如果执行的SQL预计只有一条, 那么直接把SQL语句放定时任务的 `do` 后面即可
```sql
create event 定时任务名称XXX on schedule
    every '1' day
        starts '2022-12-01 03:00:00'
    on completion preserve
    enable
    do
    delete from xxxx_data where date < date_add(curdate(), interval - 15 day);
```

---
参考：
- [MySQL创建定时任务](https://www.cnblogs.com/javahr/p/9664203.html){:target='blank'}
- [MySQL Events and Event Scheduler Guide](https://phoenixnap.com/kb/mysql-event){:target='blank'}

