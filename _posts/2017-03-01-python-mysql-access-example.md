---
layout: post
title: "Python Mysql访问示例"
date: '2017-03-01 20:45:01'
categories: python mysql
tags: 
- mysql
- python
---

> Python3 Mysql数据库查询 Demo示例

# 安装
```bash
#安装 pymysql 模块
pip3 install pymysql
```

# 代码清单
```python
#!/usr/bin/env python
# -*- encoding: utf-8 -*-
# author: xu3352
# desc: mysql db access test

import pymysql
pymysql.install_as_MySQLdb()
import MySQLdb

# Open database connection
host="IP"
username="***"
passwd="***"
dbname="wordpress"
db = MySQLdb.connect(host, username, passwd, dbname)

# prepare a cursor object using cursor() method
cursor = db.cursor()

# Prepare SQL query to INSERT a record into the database.
# sql = "show tables"
sql = "select * from tbl_a where id > %d" % (0)
print( sql )

try:
   # Execute the SQL command
   cursor.execute(sql)
   # Fetch all the rows in a list of lists.
   results = cursor.fetchall()
   print ("id\t\tname\tage")
   for row in results:
      id = row[0]
      name = row[1]
      age = row[2]
      # Now print fetched result
      # print ("name = %s, age = %s" % (name, age))
      print("%s\t%s\t%s" % (id, name, age))
except:
   print ("Error: unable to fetch data")

## disconnect from server
db.close()
```

参考：
- [Python 3 – MySQL Database Access](https://www.tutorialspoint.com/python3/python_database_access.htm)
- [Python 3 and MySQL](http://stackoverflow.com/questions/4960048/python-3-and-mysql)

