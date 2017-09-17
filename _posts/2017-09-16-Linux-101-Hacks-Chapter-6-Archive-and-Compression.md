---
layout: post
title: "Linux 101 Hacks 第六章:归档和压缩"
tagline: ""
description: "常用的归档和压缩/解压命令"
date: '2017-09-16 22:12:10 +0800'
category: linux
tags: linux linux-command linux-101-hacks ebook
---
> {{ page.description }}

# 45.Zip命令基础
语法: `zip {.zip file-name} {file-names}`

示例1. 如何压缩多个文件?
```bash
$ zip var-log-files.zip /var/log/*
  adding: var/log/acpid (deflated 81%)
  adding: var/log/anaconda.log (deflated 79%)
  adding: var/log/anaconda.syslog (deflated 73%)
  adding: var/log/anaconda.xlog (deflated 82%)
  adding: var/log/audit/ (stored 0%)
  adding: var/log/boot.log (stored 0%)
  adding: var/log/boot.log.1 (deflated 40%)
  adding: var/log/boot.log.2 (deflated 42%)
  adding: var/log/boot.log.3 (deflated 40%)
  adding: var/log/boot.log.4 (deflated 40%)
  ...
```

示例2. 如何压缩一个目录(文件夹)
```bash
$ zip -r var-log-dir.zip /var/log/
updating: var/log/ (stored 0%)
  adding: var/log/wtmp (deflated 78%)
  adding: var/log/scrollkeeper.log (deflated 94%)
  adding: var/log/rpmpkgs.3 (deflated 68%)
  adding: var/log/spooler (stored 0%)
  adding: var/log/cron.2 (deflated 90%)
  adding: var/log/spooler.1 (stored 0%)
  adding: var/log/spooler.4 (stored 0%)
  adding: var/log/httpd/ (stored 0%)
  adding: var/log/rpmpkgs.1 (deflated 68%)
  adding: var/log/anaconda.log (deflated 79%)
  adding: var/log/secure.2 (deflated 93%)
  ...
```

示例3. 解压一个 `*.zip` 压缩文件
```bash
$ unzip var-log.zip
Archive:  var-log.zip
  inflating: var/log/acpid
  inflating: var/log/anaconda.log
  inflating: var/log/anaconda.syslog
  inflating: var/log/anaconda.xlog
   creating: var/log/audit/
```

示例4. 查看压缩文件里的文件详细内容
```bash
$ unzip -v var-log.zip
Archive: var-log.zip
Length Method Size Ratio Date Time   CRC-32    Name
--------  ------  ------- -----   ----   ----  ------
1916  Defl:N      369  81%  02-08-08 14:27  e2ffdc0c    var/log/acpid
13546  Defl:N     2900  79%  02-02-07 14:25  34cc03a1   var/log/anaconda.log
skip..
7680  Defl:N      411  95%  12-30-08 10:55  fe876ee9    var/log/wtmp.1kkkkk
40981  Defl:N     7395  82%  02-08-08 14:28  6386a95e   var/log/Xorg.0.log
--------          -------  ---
41406991          2809229  93%                          56 files
``` 

示例5. 如何列出压缩文件里的内容
```bash
$ unzip -l var-log.zip
Archive:  var-log.zip
  Length     Date   Time    Name
 --------    ----   ----    ----
     1916  02-08-08 14:27   var/log/acpid
    13546  02-02-07 14:25   var/log/anaconda.log
..skip..
    40981  02-08-08 14:28   var/log/Xorg.0.log
    40981  02-08-07 14:56   var/log/Xorg.0.log.old
 --------                   -------
 41406991                   56 files
```

# 46.Zip命令高级压缩
`zip` 命令有10个压缩等级:
- `0` - 最低等级, 只是归档了, 没有做任何的压缩
- `1` - 最低级压缩, 最快速
- `6` - 默认的压缩级别
- `9` - 最大压缩级别, 但是最慢; 除非是很大的文件, 其他都建议使用级别9

示例1. 3个级别的压缩对比
```bash
$ zip var-log-files-default.zip /var/log/*
$ zip -0 var-log-files-0.zip /var/log/*
$ zip -9 var-log-files-9.zip /var/log/*

$ ls -ltr
-rw-r--r--   1 root       root  var-log-files-default.zip
-rw-r--r--   1 root       root  var-log-files-0.zip
-rw-r--r--   1 root       root  var-log-files-9.zip
```

示例2. 验证是否为 zip 文件
```bash
$ unzip -t var-log.zip
     Archive:  var-log.zip
    testing: var/log/acpid            OK
    testing: var/log/anaconda.log     OK
    testing: var/log/anaconda.syslog   OK
skip...
    testing: var/log/wtmp             OK
    testing: var/log/wtmp.1           OK
    testing: var/log/Xorg.0.log       OK
```
如果没有错误的话, 那表示就可以正常的解压缩了

# 47.设置带密码的压缩文件
显示的密码方式, 在命令历史里面可以查到的
```bash
$ zip -P mysecurepwd var-log-protected.zip /var/log/*
```

如果不想密码被查询到, 可以使用下面的方法
```bash
$ zip -e var-log-protected.zip /var/log/*
Enter password:
Verify password:
updating: var/log/acpid (deflated 81%)
updating: var/log/anaconda.log (deflated 79%)
```

解压:
```bash
$ unzip  var-log-protected.zip
Archive:  var-log-protected.zip
[var-log-protected.zip] var/log/acpid password:
```

# 48.Tar命令示例
语法: `tar [options] [tar-archive-name] [other-file-names]`

示例1. 目录整体打包
```bash
$ tar cvf /tmp/my_home_directory.tar /home/jsmith
```
详解:
- `c` - 创建归档文件
- `v` - 详细模式, 展示比较详细的信息
- `f` - 指定归档文件名称

示例2. 查看归档压缩包内的文件列表
```bash
$ tar tvf /tmp/my_home_directory.tar
```

示例3: 解压归档文件
```bash
$ tar xvf /tmp/my_home_directory.tar
```

示例4: 指定目录解压
```bash
$ tar xvfz /tmp/my_home_directory.tar.gz –C /home/ramesh
``` 

 更多:
 - [The Ultimate Tar Command Tutorial with 10 Practical Examples](http://www.thegeekstuff.com/2010/04/unix-tar-command-examples/)

# 49.Tar命令结合gzip, bzip2
`bizp2` 比 `gzip` 压缩等级要高一些

示例1: tar 如何使用 gzip
加上 `z` 选项就可以实现 `tar.gz` 压缩文件了
```bash
# 压缩文件 gzip
$ tar cvfz /tmp/my_home_directory.tar.gz /home/jsmith

# 解压文件
$ tar xvfz /tmp/my_home_directory.tar.gz

# 查看文件
$ tar tvfz /tmp/my_home_directory.tar.gz
```

示例2: tar 如何使用 bzip2
加上 `j` 就可以实现 `tar.bz2` 压缩文件
```bash
# 压缩文件 bzip2
$ tar cvfj /tmp/my_home_directory.tar.bz2 /home/jsmith

# 解压文件 bzip2
$ tar xvfj /tmp/my_home_directory.tar.bz2

# 查看文件
$ tar tvfj /tmp/my_home_directory.tar.bz2
```

# 50.Bz*命令系列
`bzip2` 命令用于压缩和解压缩文件. `bizp2` 的优点是最大化的压缩文件大小

`bzip2` vs `gzip`:
- `bzip2` 比 `gzip` 压缩率更高
- 速度方面, `bzip2` 比 `gzip` 和 `zip` 要慢
- `bzip2` 以合理的速度挺高速率的压缩

linux 提供了一系列的 `bz` 命令来操作 `bzip2` 文件

示例1: 使用 bzip2 压缩文件
```bash
$ bzip2 trace

$ ls -l trace.bz2
-rw-r--r-- 1 root root       54167 Jan 23  2009 trace.bz2
```

示例2: 使用 `bzgrep` 正则搜索 `bzip2` 的文件
语法: `bzgrep grep-options -e pattern filename` 
```bash
$ bzgrep -i "CONSOLE=.*"  trace.bz2
2010-10-11T08:40:28.100 gs(16985): CONSOLE=/dev/pts/0
2010-10-11T08:40:29.772 gs(17031): CONSOLE=/dev/pts/0
2010-10-11T08:40:58.140 gs(17099): CONSOLE=/dev/pts/0
2010-10-11T08:41:27.547 gs(17164): CONSOLE=/dev/pts/0
2010-10-11T08:41:57.962 gs(17233): CONSOLE=/dev/pts/0
2010-10-11T08:42:28.392 gs(17294): CONSOLE=/dev/pts/0
2010-10-11T08:42:57.721 gs(17439): CONSOLE=/dev/pts/0
```
如果没有 `bzgrep` 的话, 那么你就需要先解压, 然后再进行匹配了

`bzegrep` 和 `bzfgrep` 命令将分别对 `bzip2` 文件应用 `egrep` 和 `fgrep` 操作

示例3: 使用 `bzcat` 查看 `bzip2` 文件
```bash
$ bzcat trace.bz2
0: ERR: Wed Sep 22 09:59:42 2010:
gs(11153/47752677794640): [chk_sqlcode.scp:92]: Database:
ORA-01653: unable to extend table OPC_OP.OP
C_HIST_MESSAGES (OpC50-15)
0: ERR: Wed Sep 22 09:59:47 2010:
gs(11153/47752677794640): [chk_sqlcode.scp:92]: Database:
ORA-01653: unable to extend table OPC_OP.OP
C_HIST_MESSAGES (OpC50-15)
Retry. (OpC51-22)
Database: ORA-01653: unable to extend table
OPC_OP.OPC_HIST_MESSAGES by 64 in tablespace OPC_6
(OpC50-15)
...
```

示例4: 使用 `bzless` 和 `bzmore` 分页浏览 `bzip2` 文件内容
```bash
$ bzless trace.bz2

$ bzmore trace.bz2
0: ERR: Wed Sep 22 09:59:42 2010:
gs(11153/47752677794640): [chk_sqlcode.scp:92]: Database:
ORA-01653: unable to extend table OPC_OP.OP
C_HIST_MESSAGES (OpC50-15)
0: ERR: Wed Sep 22 09:59:47 2010:
gs(11153/47752677794640): [chk_sqlcode.scp:92]: Database:
ORA-01653: unable to extend table OPC_OP.OP
C_HIST_MESSAGES (OpC50-15)
Retry. (OpC51-22)
Database: ORA-01653: unable to extend table
OPC_OP.OPC_HIST_MESSAGES by 64 in tablespace OPC_6
(OpC50-15)
.
.
--More--
```

示例5: 使用 `bzcmp` 比较 `bzip2` 文件差异
事实上是使用 `cmp` 对压缩的内部文件进行比较
```bash
$ cmp System.txt.001 System.txt.002
System.txt.001 System.txt.002 differ: byte 20, line 2

$ bzcmp System.txt.001.bz2 System.txt.002.bz2
- /tmp/bzdiff.csgqG32029 differ: byte 20, line 2
```

示例6: 使用 `bzdiff` 对比 `bzip2` 文件内容差异

`diff` 会比较两个文本文件的内容差异, 但是如果是压缩文件则不行
```bash
$ bzdiff System.txt.001.bz2 System.txt.002.bz2
2c2
< 0: ERR: Mon Sep 27 12:19:34 2010: gs(11153/1105824064):
[chk_sqlcode.scp:92]: Database: ORA-01654: unable to
extend index OPC_OP.OPCX
_ANNO_NUM by 64 in tablespace OPC_INDEX1
---
> 0: ERR: Wed Sep 22 09:59:42 2010:
gs(11153/47752677794640): [chk_sqlcode.scp:92]: Database:
ORA-01653: unable to extend table OPC_OP.
OPC_HIST_MESSAGES by 64 in tablespace OPC_6
4,5c4
< Retry. (OpC51-22)
< Database: ORA-01654: unable to extend index
OPC_OP.OPCX_ANNO_NUM by 64 in tablespace OPC_INDEX1
---
> 0: ERR: Wed Sep 22 09:59:47 2010:
gs(11153/47752677794640): [chk_sqlcode.scp:92]: Database:
ORA-01653: unable to extend table OPC_OP.
OPC_HIST_MESSAGES by 64 in tablespace OPC_6
```

 更多:
 - [bzip2, bzgrep, bzcmp, bzdiff, bzcat, bzless, bzmore examples](http://www.thegeekstuff.com/2010/10/bzcommand-examples/)

# 51.Cpio示例 
`cpio` 表示 `copy in, copy out`, 用来处理: `*.cpio` 或 `*.tar` 文件

`cpio` 有3种操作:
- 拷贝文件到归档文件中
- 从归档文件里解压文件
-  将文件传递到另一个目录中 (移动文件)

示例1: 创建 `*.cpio` 文档
```bash
$ cd objects

$ ls
file1.o file2.o file3.o

$ ls | cpio -ov > /tmp/object.cpio
```
`-ov` 选项可以包含文件和文件夹

示例2: 解压 `*.cpio` 文件
```bash
$ mkdir output

$ cd output

$ cpio -idv < /tmp/object.cpio 
```

示例3: 指定文件归档
```bash
$ find . -iname *.c -print | cpio -ov >/tmp/c_files.cpio
```

示例4: 使用 -F 选项创建 `*.tar` 文档
```bash
$ ls | cpio -ov -H tar -F sample.tar 
```

示例5: 解压 `*.tar` 文档
```bash
$ cpio -idv -F sample.tar
```

示例6: 查看 `*.tar` 文档
```bash
$ cpio -it -F sample.tar
```

示例7: 可以把符号链接的原始文件一起打包
```bash
$ ls | cpio -oLv >/tmp/test.cpio
```

示例8: cpio 可以恢复文件的修改时间
```bash
$ ls | cpio -omv >/tmp/test.cpio
```

示例9: 拷贝目录树
```bash
$ mkdir /mnt/out

$ cd objects

$ find . -depth | cpio -pmdv /mnt/out
```

 更多:
 - [Linux cpio Examples: How to Create and Extract cpio Archives (and tar archives)](http://www.thegeekstuff.com/2010/08/cpio-utility/)
 - [How to View, Modify and Recreate initrd.img Using cpio Command](http://www.thegeekstuff.com/2009/07/how-to-view-modify-and-recreate-initrd-img/)

