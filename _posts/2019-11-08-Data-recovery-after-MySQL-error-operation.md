---
layout: post
title: "MySQL误操作后数据恢复（delete）"
keywords: "mysql"
description: "MySQL误操作数据被删除, 后悔药来了... 当操作失误时, 脑瓜是不是嗡嗡的 :( "
tagline: ""
date: '2019-11-08 15:45:16 +0800'
category: mysql
tags: mysql
---
> {{ page.description }}

# 谨慎操作

常在河边走哪有不湿鞋, 经常用 mysql , 总会碰到手快或脑瓜不清晰的时候, 然后就悲剧了吧...

如何避免呢? 
- 当 [删除/更新] 操作时最好多检查检查, 尤其是删除
- 脑瓜不清醒时尽量别搞了, 尤其是后半夜...
- 找别人给你 review 一下SQL代码

# 误删除数据恢复

首先要感谢大牛DBA的整理, 见最后的参考

这里针对 Delete 误操作做一些补充...

前两天同事一个误操作, 把阿里云rds mysql 数据据库的100多条数据给删除掉了, 所以再次重温一下如何从 mysql 的 binlog 恢复数据

阿里云 BINLOG 文件位置: 
    进入MySQL实例首页 -> 备份恢复 -> 日志备份

然后就可以看到 `mysql-bin.001250` (一般是500M一个)的列表了, 有记录的起止时间, 最后可以点击下载到本地

**恢复步骤**:
```bash
# 把binlog解析为文本格式
$ mysqlbinlog --no-defaults --base64-output=decode-rows -v -v ./mysql-bin.001250 > mysql_bin_log.txt

# 过滤出 test_db.test_table 的删除内容
# 注意: 这里是记录到的所有内容, 所以可以按照误操作的时间可以先核查一遍
$ cat mysql_bin_log.txt | sed -n '/### DELETE FROM `test_db`.`test_table`/,/COMMIT/p' > table_delete.txt

# 把 DELETE 数据转换成 insert into 语句
$ cat table_delete.txt \
 | sed -n '/###/p' \
 | sed 's/### //g;s/\/\*.*/,/g;s/DELETE FROM/INSERT INTO/g;s/WHERE/SELECT/g;' \
 | gsed -r 's/(@22.*),/\1;/g' \
 | sed 's/@.*=//g' > recovery.sql
```

`recovery.sql` 就是恢复的可以直接插入的数据了

所以最后(4个`sed`)替换的操作为: 
1. 只保留包含 `###` 的行
2. 多重操作
    - 删除每行的前缀注释 `### `; 
    - 删除 数据列 对应的 mysql注释; 
    - 替换 `DELETE FROM` 为 `INSERT INTO`; 
    - 替换 `WHERE` 为 `SELECT`
3. 按正则替换第 `22` 列(表一共22列)最后的 `,` 逗号为 `;` 分号
4. 删除 数据列 的前缀, 只保留对应的数据

**注意**:
- `gsed` 是由于MAC系统自带的 `sed` 没有 `-r` 选项, 所以安装:
     - `brew install gnu-sed --with-default-names` 的 `gsed` 来支持使用正则表达式
- `gsed -r 's/(@22.*),/\1;/g'` 中的 `@22` 其实是 `test_table` 表的最后一列

**其他问题**:
- `timestamp` 类型的数据列是 秒数, 可以通过 `from_unixtime(1573034757)` 转换
- `int` 类型的行可能是 `###   @9=-1 (4294967295) /* INT meta=0 nullable=1 is_null=0 */` 这样的, 所以也可以替换掉

**改造之后**: 
```bash
$ cat table_delete.txt \
 | sed -n '/###/p' \
 | gsed -r 's/(###.*=)([0-9]+) (\/\* TIMESTAMP.*)/\1from_unixtime(\2) \3/g' \
 | sed 's/### //g;s/\/\*.*/,/g;s/DELETE FROM/INSERT INTO/g;s/WHERE/SELECT/g;' \
 | gsed -r 's/(@[0-9]+=-[0-9]+) \([0-9]+\).*/\1 ,/g' \
 | gsed -r 's/(@22.*),/\1;/g' \
 | sed 's/@.*=//g' > recovery.sql
```

# 其他

`mysqlbinlog` 是mysql服务端的命令, 本地安装了服务端版本就可以使用了, 否则估计的找台安装了 mysql 的 linux 来操作了

另外常用的一种方式是按照 `时间段` 来提取 binlog 数据:
```bash
# 按时间段提取数据
$ mysqlbinlog \
--start-datetime="2019-11-06 20:50:00" \
--stop-datetime="2019-11-06 20:58:00" \
--no-defaults --base64-output=decode-rows -v -v ./mysql-bin.001250 > new_bin_log.txt
```

---
参考：
- [MySQL 误操作后数据恢复（update,delete忘加where条件）](https://www.cnblogs.com/gomysql/p/3582058.html)
- [超级有用的15个mysqlbinlog命令](http://www.ttlsa.com/mysql/super-useful-mysqlbinlog-command/)

