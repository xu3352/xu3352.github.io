---
layout: post
title: "Python3 Mysql连库及简单封装使用"
tagline: ""
description: "通过 `db_config.json` 加载数据库配置; 常规的增删改查进行封装"
date: '2018-05-22 09:32:26 +0800'
category: python
tags: pymysql logger python mysql
---
> {{ page.description }}

# 代码
连库配置: `db_config.json`
```json
{
  "host": "192.168.7.251",
  "user": "root",
  "password": "123456",
  "db": "mars",
  "charset": "utf8",
  "port": 3306
}
```

封装工具类: `mysqlutils.py`
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


def connect_mysql():
    """ 创建链接 """
    try:
        config = find("db_config.json", os.path.abspath("."))
        with open(config, "r") as file:
            load_dict = json.load(file)
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

    row = None
    try:
        cur.execute(sql, param)
        row = cur.fetchone()
    except Exception as e:
        con.rollback()
        logger.error(traceback.format_exc())
        logger.error("[sql]:{} [param]:{}".format(sql, param))

    cur.close()
    con.close()
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

    rows = None
    try:
        cur.execute(sql, param)
        rows = cur.fetchall()
    except Exception as e:
        con.rollback()
        logger.error(traceback.format_exc())
        logger.error("[sql]:{} [param]:{}".format(sql, param))

    cur.close()
    con.close()
    return simple_list(rows)


def insertmany(sql, arrays=None):
    """
    批量插入数据
    :param sql: sql语句
    :param arrays: list|tuple [(),(),()...]
    :return: 入库数量
    """
    con = connect_mysql()
    cur = con.cursor()

    cnt = 0
    try:
        cnt = cur.executemany(sql, arrays)
        con.commit()
    except Exception as e:
        con.rollback()
        logger.error(traceback.format_exc())
        logger.error("[sql]:{} [param]:{}".format(sql, arrays))

    cur.close()
    con.close()
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

    cnt = 0
    try:
        cnt = cur.execute(sql, param)
        con.commit()
    except Exception as e:
        con.rollback()
        logger.error(traceback.format_exc())
        logger.error("[sql]:{} [param]:{}".format(sql, param))

    cur.close()
    con.close()
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


if __name__ == '__main__':
    print("hello everyone!!!")

    # print("删表:", execute('drop table test_users'))

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
    print("只取一行:", queryone("select * from test_users limit %s,%s", (0, 1)))    #尽量使用limit
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
```

# 运行结果
```
hello everyone!!!
删表: 0
建表: 0
插入数据: 4
只取一行: {'id': 1, 'password': '111111', 'email': 'aaa@126.com'}
查询全表: [{'id': 1, 'password': '111111', 'email': 'aaa@126.com'}, {'id': 2, 'password': '222222', 'email': 'bbb@126.com'}, {'id': 3, 'password': '333333', 'email': 'ccc@126.com'}, {'id': 4, 'password': '444444', 'email': 'ddd@126.com'}]
一列: ['aaa@126.com', 'bbb@126.com']
多列: [{'id': 2, 'password': '222222', 'email': 'bbb@126.com'}]
更新: 1
删除: 1
再次查询全表: [{'id': 1, 'password': '111111', 'email': 'new@126.com'}, {'id': 2, 'password': '222222', 'email': 'bbb@126.com'}, {'id': 3, 'password': '333333', 'email': 'ccc@126.com'}]
数据总数: 3
```

# 使用方法
`db_config.json` 是从当前执行的目录进行扫描的, 可以在子目录里

数据库配置好了, 直接运行就能看到效果

<span style="color:red">删表操作请先确认好了!!!</span> 这里先注释掉

增删改查示例都有, 操作起来也算是比较方便了, 只需要写sql, 传参数, 就基本搞定

默认多行的结果集都是 list[dict] 的, 即使只有一列也是! 所以加了个 simple_list 方法只取数据 list

**工具类注意事项**:
1. `%s` 为 `mysql` 占位符; 能用 `%s` 的地方就不要自己拼接 `sql` 了
2. `sql` 里有一个占位符可使用 `string` 或 `number`; 有多个占位符可使用 `tuple|list`
3. `insertmany` 的时候所有字段使用占位符 `%s` (预编译), 参数使用 `tuple|list`
4. `queryall` 结果集如果只有一列的情况, 会自动转换为简单的列表 参考:`simple_list()`
5. `queryone` 结果集如果只有一行一列的情况, 自动转为结果数据 参考:`simple_value()`
6. `insertone` 插入一条数据, 返回数据ID

# 其他
`pymysql` 由于 sql 都是直接写的, 所以数据库操作非常灵活; 如果做 `ORM` 的话, 就需要自己手动进行转换; 类似于 `java` 的 `MyBatise` 

如果你在找 `Python` 的 `ORM` 框架的话, `SQLAlchemy` 应该是个不错的选择; 类似于 `Java` 的 `Hibernate`

# 日志
`loggerutils.py`
```python
#!/usr/bin/python
# -*- coding: UTF-8 -*-
# author: xu3352<xu3352@gmail.com>
"""
Python 日志工具包
@see https://blog.csdn.net/chosen0ne/article/details/7319306
"""
import logging
import logging.handlers

log_file = 'output.log'
fmt = '%(asctime)s - %(levelname)s - %(filename)s#%(funcName)s():%(lineno)s - %(name)s - %(message)s'

# 实例化handler
handler = logging.handlers.RotatingFileHandler(log_file, maxBytes=1024 * 1024, backupCount=5)
formatter = logging.Formatter(fmt)  # 实例化formatter
handler.setFormatter(formatter)     # 为handler添加formatter

logger = logging.getLogger("main")  # 获取名为tst的logger
logger.addHandler(handler)          # 为logger添加handler
logger.setLevel(logging.DEBUG)      # 'DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL'


if __name__ == '__main__':
    logger.debug("first message debug")
    logger.info("first message info")
    logger.warning("first message warning")
    logger.error("first message error")
    logger.critical("first message critical")
```

2018.05.28 更 
- 增加 `logger` 把错误日志记录到指定的文件里 
- `connect_mysql` 改造为 `kwargs` 形式传参(以后可以传入数据源字典)
- 增加 `insertone` 方法, 返回主键ID

---
参考：
- [Github:PyMySQL](https://github.com/PyMySQL/PyMySQL)
- [Python3 MySQL 数据库连接](http://www.runoob.com/python3/python3-mysql.html)
- [有哪些比较好的在 Python 中访问 MySQL 的类库？](https://www.zhihu.com/question/19869186)
- [Python笔记之SqlAlchemy使用](http://www.cnblogs.com/liu-yao/p/5342656.html)
