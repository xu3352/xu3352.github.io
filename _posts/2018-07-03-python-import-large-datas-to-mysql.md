---
layout: post
title: "Python大文件批量导入Mysql数据库"
tagline: ""
description: "把一个 `1037w` 行的文本文件, 大小为`1.3G`, 用 `python` 脚本批量导入到 `mysql` 数据库, 总共耗时: `450s`"
date: '2018-07-03 21:35:06 +0800'
category: python
tags: mysql python
---
> {{ page.description }}

# 脚本
`python` 处理文本文件是很快的, 不过单个文件太大的话, 不建议使用 `file.readlines()` 方法
```python
#!/usr/bin/env python
# -*- coding: UTF-8 -*-
# author: xu3352<xu3352@gmail.com>
"""
文本文件大数据量批量入库
"""
import sys

from utils import mysqlutils
from utils.timeutils import get_time, timecost, get_secs


def db_batch_save(con, cur, arrays):
    if len(arrays):
        return 0
    sql = """ insert into t_tmp_xxx (A, B) values (%s, %s) """
    return mysqlutils.insertmany_process(con, cur, sql, arrays)


def dojob(filepath):
    print('{} import datas start ...'.format(get_time()))
    s_time = get_secs()
    con = mysqlutils.connect_mysql()
    cur = con.cursor()

    total = 0
    rows = []
    batch_size = 10000  # 1w
    # a large txt file (if not file.readlines() is the better choice)
    with open(filepath) as infile:
        for line in infile:
            line = line.strip()
            cs = line.split(" ")
            rows.append([cs[0], cs[1]])

            if len(rows) >= batch_size:
                # each round
                total += db_batch_save(con, cur, rows)
                rows.clear()
                print('{} total:{} time:{}'.format(get_time(), total, timecost(s_time)))

    # the last round
    total += db_batch_save(con, cur, rows)

    cur.close()
    con.close()
    print('{} import datas complate ... totalSum:{} totalTime:{}'.format(get_time(), total, timecost(s_time)))


if __name__ == '__main__':
    dojob(sys.argv[1])
```

运行结果:
```
2018-07-01 22:30:51 import datas start ...
2018-07-01 22:30:51 total:10000 time:0
2018-07-01 22:30:52 total:20000 time:0
2018-07-01 22:30:52 total:30000 time:1
...
2018-07-01 22:38:15 total:10350000 time:444
2018-07-01 22:38:16 total:10360000 time:445
2018-07-01 22:38:17 total:10370000 time:445
2018-07-01 22:38:17 import datas complate ... totalSum:10374620 totalTime:446
```

**详解**:
- `mysqlutils` - 我们之前封装的 `pymysql` 工具模块 
- `timeutils` - 自己封装的时间工具模块:
    - `get_time` : 获取当前时间
    - `get_secs` : 当前时间的秒数
    - `timecost` : 耗时秒数
- 分批次入库, 没 10000 行一批, 最后一批别漏了
- 文件路径是做完第一个参数传进去的
- 文件过大, 内存不够用时, 就得一行一行读取了


# mysqlutils加强版
主要是增加了第7项, 批量处理数据时, 只创建一个连接即可!
```python
#!/usr/bin/python
# -*- coding: UTF-8 -*-
# author: xu3352<xu3352@gmail.com>
# python3 环境
"""
Python Mysql 工具包
1. 通过 db_config.json 加载数据库配置
2. 常规的增删改查进行封装

注意事项:
1. %s 为 mysql 占位符; 能用 %s 的地方就不要自己拼接 sql 了
2. sql 里有一个占位符可使用 string 或 number; 有多个占位符可使用 tuple|list
3. insertmany 的时候所有字段使用占位符 %s (预编译), 参数使用 tuple|list
4. queryall 结果集只有一列的情况, 会自动转换为简单的列表 参考:simple_list()
5. queryone 结果集只有一行一列的情况, 自动转为结果数据 参考:simple_value()
6. insertone 插入一条数据, 返回数据ID
7. *_process 重构方法, 方便支持批量数据处理
8. connect_mysql 支持传字典参数
"""
import os
import json
import traceback

import pymysql.cursors

from utils import loggerutils

logger = loggerutils.logger


def find(name, path):
    """ 查找文件路径 """
    for root, dirs, files in os.walk(path):
        if name in files:
            return os.path.join(root, name)


def connect_mysql(config_dict=None):
    """
    创建链接
    :param config_dict: 数据库配置字典; 可重置 host,user,password,db,port 等默认值 (间接支持多数据源)
    """
    try:
        # print(__file__)
        curr_dir = os.path.split(os.path.abspath(__file__))[0]
        config_path = find("db_config.json", curr_dir)
        with open(config_path, "r") as file:
            load_dict = json.load(file)
        # 合并参数 (可重置 db_config 里面的参数)
        if config_dict is not None and type(config_dict) is dict:
            load_dict.update(config_dict)
        return pymysql.connect(cursorclass=pymysql.cursors.DictCursor, **load_dict)
    except Exception as e:
        logger.error(traceback.format_exc())
        logger.error("cannot create mysql connect")


def queryone(sql, param=None):
    """
    返回结果集的第一条数据
    :param sql: sql语句
    :param param: string|tuple|list
    :return: 字典列表 [{}]
    """
    con = connect_mysql()
    cur = con.cursor()
    row = queryone_process(con, cur, sql, param)
    cur.close()
    con.close()
    return row


def queryone_process(con, cur, sql, param=None):
    """" queryone:内部调用 """
    row = None
    try:
        cur.execute(sql, param)
        row = cur.fetchone()
    except Exception as e:
        con.rollback()
        logger.error(traceback.format_exc())
        logger.error("[sql]:{} [param]:{}".format(sql, param))
    return simple_value(row)


def queryall(sql, param=None):
    """
    返回所有查询到的内容 (分页要在sql里写好)
    :param sql: sql语句
    :param param: tuple|list
    :return: 字典列表 [{},{},{}...] or [,,,]
    """
    con = connect_mysql()
    cur = con.cursor()
    rows = queryall_process(con, cur, sql, param)
    cur.close()
    con.close()
    return rows


def queryall_process(con, cur, sql, param=None):
    """" queryall:内部调用 """
    rows = None
    try:
        cur.execute(sql, param)
        rows = cur.fetchall()
    except Exception as e:
        con.rollback()
        logger.error(traceback.format_exc())
        logger.error("[sql]:{} [param]:{}".format(sql, param))
    return simple_list(rows)


def insertmany(sql, arrays=None, batch_size=10000):
    """
    批量插入数据
    :param sql: sql语句
    :param arrays: list|tuple [(),(),()...]
    :param batch_size: 每批入库数量, 超过自动多批入库
    :return: 入库数量
    """
    con = connect_mysql()
    cur = con.cursor()
    cnt = insertmany_process(con, cur, sql, arrays, batch_size)
    cur.close()
    con.close()
    return cnt


def insertmany_process(con, cur, sql, arrays=None, batch_size=10000):
    """ insertmany:内部调用 """
    cnt = 0
    try:
        batch_cnt = int(len(arrays) / batch_size) + 1
        for i in range(batch_cnt):
            sub_array = arrays[i * batch_size:(i + 1) * batch_size]
            if sub_array:
                cnt += cur.executemany(sql, sub_array)
                con.commit()
    except Exception as e:
        con.rollback()
        logger.error(traceback.format_exc())
        logger.error("[sql]:{} [param]:{}".format(sql, arrays))
    return cnt


def insertone(sql, param=None):
    """
    插入一条数据
    :param sql: sql语句
    :param param: string|tuple
    :return: id
    """
    con = connect_mysql()
    cur = con.cursor()
    lastrowid = 0
    try:
        cur.execute(sql, param)
        con.commit()
        lastrowid = cur.lastrowid
    except Exception as e:
        con.rollback()
        logger.error(traceback.format_exc())
        logger.error("[sql]:{} [param]:{}".format(sql, param))
    cur.close()
    con.close()
    return lastrowid


def execute(sql, param=None):
    """
    执行sql语句:修改或删除
    :param sql: sql语句
    :param param: string|list
    :return: 影响数量
    """
    con = connect_mysql()
    cur = con.cursor()
    cnt = execute_process(con, cur, sql, param)
    cur.close()
    con.close()
    return cnt


def execute_process(con, cur, sql, param=None):
    """ execute:内部调用 """
    cnt = 0
    try:
        cnt = cur.execute(sql, param)
        con.commit()
    except Exception as e:
        con.rollback()
        logger.error(traceback.format_exc())
        logger.error("[sql]:{} [param]:{}".format(sql, param))
    return cnt


def simple_list(rows):
    """
    结果集只有一列的情况, 直接使用数据返回
    :param rows: [{'id': 1}, {'id': 2}, {'id': 3}]
    :return: [1, 2, 3]
    """
    if not rows:
        return rows
    if len(rows[0].keys()) == 1:
        simple_list = []
        # print(rows[0].keys())
        key = list(rows[0].keys())[0]
        for row in rows:
            simple_list.append(row[key])
        return simple_list
    return rows


def simple_value(row):
    """
    结果集只有一行, 一列的情况, 直接返回数据
    :param row: {'count(*)': 3}
    :return: 3
    """
    if not row:
        return None
    if len(row.keys()) == 1:
        # print(row.keys())
        key = list(row.keys())[0]
        return row[key]
    return row


def batch_job_example():
    """ 批量任务示例:大体形式是这样 """
    con = connect_mysql()
    cur = con.cursor()

    # do something
    # 这里适合做一些需要大量和数据库交互的任务 (比如:大批量数据的导入导出工作)
    # 因为每次创建数据库链接也是有耗资源的, 小伙伴们可自行测试效果
    sql = None
    for i in 10000:
        print(i)
        break
        queryone_process(con, cur, sql)
        queryall_process(con, cur, sql)
        insertmany_process(con, cur, sql)
        execute_process(con, cur, sql)

    cur.close()
    con.close()
    return cnt


def run_test():
    print("删表:", execute('drop table test_users'))
    sql = '''
            CREATE TABLE `test_users` (
              `id` int(11) NOT NULL AUTO_INCREMENT,
              `email` varchar(255) NOT NULL,
              `password` varchar(255) NOT NULL,
              PRIMARY KEY (`id`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='测试用的, 可以直接删除';
            '''
    print("建表:", execute(sql))

    # 批量插入
    sql_str = "insert into test_users(email, password) values (%s, %s)"
    arrays = [
        ("aaa@126.com", "111111"),
        ("bbb@126.com", "222222"),
        ("ccc@126.com", "333333"),
        ("ddd@126.com", "444444")
    ]
    print("插入数据:", insertmany(sql_str, arrays))

    # 查询
    print("只取一行:", queryone("select * from test_users limit %s,%s", (0, 1)))  # 尽量使用limit
    print("查询全表:", queryall("select * from test_users"))

    # 条件查询
    print("一列:", queryall("select email from test_users where id <= %s", 2))
    print("多列:", queryall("select * from test_users where email = %s and password = %s", ("bbb@126.com", "222222")))

    # 更新|删除
    print("更新:", execute("update test_users set email = %s where id = %s", ('new@126.com', 1)))
    print("删除:", execute("delete from test_users where id = %s", 4))

    # 查询
    print("再次查询全表:", queryall("select * from test_users"))
    print("数据总数:", queryone("select count(*) from test_users"))
    print('run test complate ...')


if __name__ == '__main__':
    print("hello everyone!!!")
    run_test()

```

好了, 尽情的写 `SQL` 操作吧!

---
参考：
- [Python3 Mysql连库及简单封装使用(pymysql)](https://xu3352.github.io/python/2018/05/22/python-mysql-usage)
- [Read large text files in Python, line by line without loading it in to memory](https://stackoverflow.com/questions/6475328/read-large-text-files-in-python-line-by-line-without-loading-it-in-to-memory)

