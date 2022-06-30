---
layout: post
title: "Mysql分组后每组取前N条数据"
keywords: ""
description: "Mysql分组后每组取前N条数据"
tagline: ""
date: '2022-06-30 15:12:03 +0800'
category: mysql
tags: mysql
---
> {{ page.description }}

版本 `MySQL 5.7`

数据准备:
```sql
drop table if exists heyf_t10;
create table heyf_t10 (empid int ,deptid int ,salary decimal(10,2) );
insert into heyf_t10 values
    (1,10,5500.00),
    (2,10,4500.00),
    (3,20,1900.00),
    (4,20,4800.00),
    (5,40,6500.00),
    (6,40,14500.00),
    (7,40,44500.00),
    (8,50,6500.00),
    (9,50,7500.00);
```


# 分组取1条
```sql
select t.* 
from (
    select distinct a.empid eid, a.* 
    from heyf_t10 a 
    order by salary desc 
) t 
group by t.deptid
```

`distinct a.empid eid` 可以防止分组排序失效

查询结果:
```sql
eid    empid    deptid    salary
1      1        10        5500.00
4      4        20        4800.00
7      7        40        44500.00
9      9        50        7500.00
```

# 分组取N条
```sql
select a.*
from heyf_t10 a, heyf_t10 b
where a.deptid = b.deptid
and a.salary <= b.salary
group BY a.deptid, a.salary
having count(a.deptid) <= 2
order by a.deptid, a.salary desc
```

查询结果:
```sql
empid    deptid    salary
1        10        5500.00
2        10        4500.00
4        20        4800.00
3        20        1900.00
7        40        44500.00
6        40        14500.00
9        50        7500.00
8        50        6500.00
```

# 分组取N条, 合并
```sql
select deptid
    , substring_index(group_concat(salary order by salary desc), ',', 2) salarTop2
    , group_concat(salary order by salary desc) salarys
from heyf_t10
group by deptid
```

`group_concat()` + `substring_index()` 特定场景, 这种方式也许更加方便

查询结果:
```sql
deptid    salarTop2          salarys
10        5500.00,4500.00    5500.00,4500.00
20        4800.00,1900.00    4800.00,1900.00
40        44500.00,14500.00  44500.00,14500.00,6500.00
50        7500.00,6500.00    7500.00,6500.00
```


---
参考：
- [mysql分组后，取每组第一条数据或最新一条](https://blog.csdn.net/u013066244/article/details/116461584){:target='blank'}
- [mysql 分组 组内排序 取每组前2条数据](http://www.3qphp.com/mysql/sqlquest/2349.html){:target='blank'}
- [mysql分组，然后组内排序，最后取每组前2条数据](https://wenku.baidu.com/view/1733fdf2b24e852458fb770bf78a6529657d3559.html){:target='blank'}

