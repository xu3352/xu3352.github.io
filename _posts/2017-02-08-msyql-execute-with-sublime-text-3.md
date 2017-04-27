---
layout: post
title: "sublime text 3执行mysql语句"
date: '2017-02-08 11:54:13 +0800'
category: mysql
tags: mysql sublime-text-3
---

> Sublime Text 3执行简单的 sql 语句(mysql版)

# Mysql终端比较
- `equel Pro`：简洁快速，自动补全，使用方便，绝大部分时间使用此App
- `DEA Database插件`：深度集成，非常强大，补全提示没的说，跨库查询时，不会自动提示不全（已解决）
- `ublime text 3`：没有自动补全，以命令行形式执行SQL和展示结果集，适合简单的查询和执行语句，并且是整个文件全部执行

在使用`Sequel Pro`的时候，有时候需要在`sublime text 3`里正则批量替换编辑好SQL语句，然后切换到`Sequel Pro`里执行，操作多了就会嫌麻烦了。。。

# 开始制作
Google了一些视频，文档，然后可以继续了    
1.首先需要安装Mysql，如果有了请跳过：
```bash
brew install mysql
```

2.安装好之后测试一下：
```bash
mysql -h *** -u *** -p
```

3.测试通过，切换到SBL3：`Tools > Build System > New Build System...`，保存并取名为：`mysql`
```
{
    "cmd": ["/usr/local/bin/mysql", "-h", "***", "-u", "***", "-p***", "-D", "wordpress", "-e", "source $file", "-t"],
    "selector": "source.sql"
}
```

4.新建一个测试的`test.sql`文件并保存
```sql
-- show databases;
-- use wordpress;

show tables;

select * from tbl_a;
```

5.开始执行sql语句：`Tools > Build System > mysql`，然后按 `Command+B` 执行即可看到结果：
```sql
mysql: [Warning] Using a password on the command line interface can be insecure.
+-----------------------+
| Tables_in_wordpress   |
+-----------------------+
| tbl_a                 |
| wp_commentmeta        |
| wp_comments           |
| wp_links              |
| wp_options            |
| wp_postmeta           |
| wp_posts              |
| wp_term_relationships |
| wp_term_taxonomy      |
| wp_termmeta           |
| wp_terms              |
| wp_usermeta           |
| wp_users              |
+-----------------------+
+------+----------+----------+-------------+----------+
| id   | column_a | column_b | longitude   | latitude |
+------+----------+----------+-------------+----------+
| 1000 | aaa      | 23123    | 9999.999999 | 0.000000 |
| 1001 | aaa      | sdfsdf   |    0.000000 | 0.000000 |
| 1002 | bsdf     | ssdf     |    0.000000 | 0.000000 |
| 1003 | aaa      | 23424    |    0.000000 | 0.000000 |
+------+----------+----------+-------------+----------+
[Finished in 0.6s]
```

参考：
- [Execute MySQL from Sublime Text](https://bartinger.at/execute-mysql-from-sublime-text-2/)
- [在 Mac 下用 Homebrew 安装 MySQL](http://blog.neten.de/posts/2014/01/27/install-mysql-using-homebrew/)

