---
layout: post
title: "Mysql大数据导出(备份)到本地"
keywords: ""
description: "Mysql单表大数据量数据导出(备份)到本地的一个比较笨, 但很实在的方法: 蚂蚁搬家"
tagline: ""
date: '2019-02-17 11:01:43 +0800'
category: mysql
tags: mysql python
---
> {{ page.description }}

# 需求
Mysql 某表的数据量很大(几十个G), 直接用mysql客户端的工具没法导出

所以干脆就写个脚本一批一批的导出, 就叫它: 蚂蚁搬家

# 代码清单
思路基本就有了: 先查数据库, 假如每次查询10w条记录, 然后写入到本地的文件里, 直到数据全部导出

直接上代码吧: `db_tablename_backup.py`

```python
#!/usr/bin/env python
# -*- coding: utf-8 -*-
# author: xu3352<xu3352@gmail.com>
# xx_tablename 数据备份

import sys

from utils import mysqlutils
from utils.timeutils import get_time, get_secs, timecost


def dojob(name):
    print('{} backup data start... tablename:{} '.format(get_time(), name))
    s_time = get_secs()
    con, cur = mysqlutils.get_connect_cursor()

    table_name = 'database_name.{}'.format(name)
    # 按 id 区间查询
    sql = ''' select min(id) minid, max(id) maxid, count(1) totalcnt from {table_name} '''.format(table_name=table_name)
    info = mysqlutils.queryone_process(con, cur, sql)
    print('table_name:{}   minid:{} maxid:{} totalcnt:{}'.format(table_name, info['minid'], info['maxid'], info['totalcnt']))

    currid = info['minid']
    maxid = info['maxid']
    #currid = 1
    #maxid = 123456789
    step = 10 * 10000
    while currid < maxid:
        sql = ''' select id, a, b, c, d, e, f, ...
                         from {table_name}
                         where id between %s and %s
                         '''.format(table_name=table_name)
        rows = mysqlutils.queryall_process(con, cur, sql, (currid, currid + step))
        cnt = write2file(rows)
        currid += step
        percent = '{0:.0%}'.format(currid / maxid)
        print('{} nextid:{} rows:{} time:{} process:{}'.format(get_time(), currid, cnt, timecost(s_time), percent))

    mysqlutils.close_cursor_connect(cur, con)
    print('{} backup data complate... time:{}'.format(get_time(), timecost(s_time)))


def write2file(rows):
    """ 简单处理后, 写入文件 """
    if not rows:
        return 0
    lines = []
    for row in rows:
    strs = '{}|{}|{}|{}|{}|{}|{}|...'.format(
            row['id'],
            row['a'],
            row['b'],
            row['c'].replace('|', ''),
            row['d'],
            row['e'],
            row['f'],
            ...
            )
        lines.append(strs)
    # 写入文件
    write_file(filename, lines)
    return len(lines)


def write_file(filepath, rows=[]):
    """ 写文件 """
    with open(filepath, 'a') as output:
        for text in rows:
            output.write(text + '\n')
    return len(rows)


if __name__ == "__main__":
    filename = '/data/xx_tablename.txt'
    name = 'xx_tablename'
    dojob(name)
```

还可以选择性的只备份重要的字段, 省网络流量, 省存储空间, 不过主键ID得是自增型的


# 注意事项

- 由于耗时较长(几个小时), 本地网络可能不稳定, 建议放到找一台服务器跑: [tmux](https://xu3352.github.io/linux/2018/06/29/revisit-magical-tmux) 或 nohup 都是不错的选择, 可以无人值守
- 磁盘空间要留足, 导出来也是几十个G
- 如果执行过程中断了, 可以根据最后存的ID位置重新跑, 节省时间
- 大文件不好传输(下载)的, 可以切分为多个小文件: [split 命令](https://xu3352.github.io/linux/2019/01/02/split-large-text-file-into-parts#split%E5%91%BD%E4%BB%A4)

---
参考：
- [Python3 Mysql连库及简单封装使用](https://xu3352.github.io/python/2018/05/22/python-mysql-usage)
- [将线上大数据mysql备份到本地的好方法](http://www.dewen.net.cn/q/2876/%E5%B0%86%E7%BA%BF%E4%B8%8A%E5%A4%A7%E6%95%B0%E6%8D%AEmysql%E5%A4%87%E4%BB%BD%E5%88%B0%E6%9C%AC%E5%9C%B0%E7%9A%84%E5%A5%BD%E6%96%B9%E6%B3%95)
- [将txt大文件切分成多个小文件](https://xu3352.github.io/linux/2019/01/02/split-large-text-file-into-parts#split%E5%91%BD%E4%BB%A4)

