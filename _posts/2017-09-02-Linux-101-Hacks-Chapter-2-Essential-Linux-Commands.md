---
layout: post
title: "Linux 101 Hacks 第二章:基础的Linux命令(第一部分)"
tagline: ""
description: "必不可少的 `linux` 命令, 如: `grep find xargs sort uniq cut stat diff sed awk vim chmod less wget`等等..."
date: '2017-09-02 13:48:32 +0800'
category: linux
tags: linux linux-command linux-101-hacks ebook
---
> {{ page.description }}

# 7. Grep命令
语法: `grep [options] pattern [files]`
```bash
# 从文件里匹配指定的关键词
$ grep John /etc/passwd
jsmith:x:1082:1082:John Smith:/home/jsmith:/bin/bash
jdoe:x:1083:1083:John Doe:/home/jdoe:/bin/bash

# -v 表示反向匹配: 除了指定关键词以外的行
$ grep -v John /etc/passwd
jbourne:x:1084:1084:Jason Bourne:/home/jbourne:/bin/bash

# -c 匹配到的行数
$ grep -c John /etc/passwd
2

# -cv 不匹配的行数
$ grep -cv John /etc/passwd
39

# -i 忽略大小写
$ grep -i john /etc/passwd
jsmith:x:1082:1082:John Smith:/home/jsmith:/bin/bash
jdoe:x:1083:1083:John Doe:/home/jdoe:/bin/bash

# -r 递归匹配所有子目录的文件, 以 "文件名: 匹配的行内容" 形式展示
$ grep -ri john /home/users
/home/users/subdir1/letter.txt:John, Thanks for your
contribution.
/home/users/name_list.txt:John Smith
/home/users/name_list.txt:John Doe

# -rl 只展示匹配的文件名
$ grep -ril john /root
/home/users/subdir1/letter.txt
/home/users/name_list.txt
```
常见的有从日志文件里匹配我们想要的行出来, 比如动态的打印匹配到的行:      
`tail -200f /path/file | grep keyword`

更多例子:
- [Get a Grip on the Grep! – 15 Practical Grep Command Examples](http://www.thegeekstuff.com/2009/03/15-practical-unix-grep-command-examples/)
- [The Power of Z Commands – Zcat, Zless, Zgrep, Zdiff Examples](http://www.thegeekstuff.com/2009/05/zcat-zless-zgrep-zdiff-zcmp-zmore-gzip-file-operations-on-the-compressed-files/)
- [7 Linux Grep OR, Grep AND, Grep NOT Operator Examples](http://www.thegeekstuff.com/2011/10/grep-or-and-not-operators/)

# 8. Grep正则匹配
正则表达式用于根据模式搜索和操作文本. 大多数Linux命令和编程语言都支持正则表达式
```bash
# ^ 一行的开始(仅当^是表达式中的第一个字符时)
$ grep "^Nov 10" messages.1
Nov 10 01:12:55 gs123 ntpd[2241]: time reset +0.177479 s
Nov 10 01:17:17 gs123 ntpd[2241]: synchronized to LOCAL(0), stratum 10
Nov 10 01:18:49 gs123 ntpd[2241]: synchronized to 15.1.13.13, stratum 3

# $ 一行的结尾(仅当$是表达式中的最后一个字符时)
$ grep "terminating.$" messages
Jul 12 17:01:09 cloneme kernel: Kernel log daemon terminating.
Oct 28 06:29:54 cloneme kernel: Kernel log daemon terminating.

# ^$ 统计空行数量
grep -c  "^$" messages anaconda.log
messages:0
anaconda.log:3

# . 单个字符
$ cat input
1. first line
2. hi hello
3. hi zello how are you
4. cello
5. aello
6. eello
7. last line

$ grep ".ello" input
2. hi hello
3. hi zello how are you
4. cello
5. aello
6. eello

# * 出现0次或者多次
$ grep "kernel: *." *
messages.4:Jul 12 17:01:02 cloneme kernel: ACPI: PCI interrupt for device 0000:00:11.0 disabled
messages.4:Oct 28 06:29:49 cloneme kernel: ACPI: PM-Timer IO Port: 0x1008
messages.4:Oct 28 06:31:06 btovm871 kernel:  sda: sda1 sda2 sda3
messages.4:Oct 28 06:31:06 btovm871 kernel: sd 0:0:0:0:Attached scsi disk sda
```
更多例子: 
- [grep 命令系列：grep 中的正则表达式](https://linux.cn/article-6941-1.html)
- [Regular Expressions in Grep Command with 10 Examples – Part I](http://www.thegeekstuff.com/2011/01/regular-expressions-in-grep-command/)
- [Advanced Regular Expressions in Grep Command with 10 Examples – Part II](http://www.thegeekstuff.com/2011/01/advanced-regular-expressions-in-grep-command-with-10-examples-%E2%80%93-part-ii/)

# 9. Find命令
语法: `find [pathnames] [conditions]`
```bash
# 包含 mail 名称的文件
$ find /etc -name "*mail*"

# 大于 100M 的文件
$ find / -type f -size +100M

# 10天 内没有改动过的文件
$ find . -mtime +10

# 2天 内有改动过的文件
$ find . –mtime -2

# 以 *.tar.gz 结尾, 且大于100MB 的文件 (使用 rm 之前 最好使用 ls -l 展示出来检查一遍, 防止误操作!!!)
$ find / -type f -name *.tar.gz -size +100M -exec ls -l {} \;
$ find / -type f -name *.tar.gz -size +100M -exec rm -f {} \;

# 批量打包压缩 60天 内没有变更的文件 (格式:ddmmyyyy_archive.tar)
$ find /home/jsmith -type f -mtime +60 | xargs tar -cvf /tmp/`date '+%d%m%Y'_archive.tar`
```

常用的日志清理:
```bash
# 清理 /path/log 目录超过10天的 *.log 文件
$ find /path/log -name "*.log" -type f -mtime +10 | xargs rm -rf
```
更多例子:
- [Mommy, I found it! — 15 Practical Linux Find Command Examples](http://www.thegeekstuff.com/2009/03/15-practical-linux-find-command-examples/)
- [Daddy, I found it!, 15 Awesome Linux Find Command Examples (Part2)](http://www.thegeekstuff.com/2009/06/15-practical-unix-linux-find-command-examples-part-2/)

# 10. 控制标准输出和错误信息
如果在屌丝 `shell` 脚本或者不想看到输入信息(标准输出 或 错误信息)时, 可以使用 `/dev/null` 把输出丢弃掉

使用: `> /dev/null` 丢弃标准输出
```bash
# 丢弃标准输出
$ cat file.txt > /dev/null
$ ./shell-script.sh > /dev/null
```
使用: `2> /dev/null` 丢弃错误信息
```bash
$ cat invalid-file-name.txt 2> /dev/null
$ ./shell-script.sh 2> /dev/null
```

常见到的一个例子 `crontab` 定时任务示例: `把标准输出和错误都丢弃了`
```bash
30 1 * * * command > /dev/null 2>&1
```
更多例子:[Linux Shell 1>/dev/null 2>&1 含义](http://blog.csdn.net/ithomer/article/details/9288353)

# 11. Join命令
如果两个文件有相同的列, 那么就可以使用 `join` 来合并行
```bash
$ cat employee.txt
100 Jason Smith
200 John Doe
300 Sanjay Gupta
400 Ashok Sharma

$ cat bonus.txt
100 $5,000
200 $500
300 $3,000
400 $1,250

$ join employee.txt bonus.txt
100 Jason Smith $5,000
200 John Doe $500
300 Sanjay Gupta $3,000
400 Ashok Sharma $1,250
```
前提是有相同的列哦

# 12. Tr大小写转换
```bash
$ cat employee.txt
100 Jason Smith
200 John Doe
300 Sanjay Gupta
400 Ashok Sharma

# 全部转大写
$ tr a-z A-Z < employee.txt
100 JASON SMITH
200 JOHN DOE
300 SANJAY GUPTA
400 ASHOK SHARMA

# 全部转小写
$ tr A-Z a-z < employee.txt
100 jason smith
200 john doe
300 sanjay gupta
400 ashok sharma
```

# 13. Xargs命令
这个命令就厉害了: `把一个命令的输出当做参数传递给另一个参数`
```bash
# 批量删除 *.log 文件
$ find ~ -name '*.log' -print0 | xargs -0 rm -f

# 列出 /etc 下所有以 .conf 结尾的文件
$ find /etc -name "*.conf" | xargs ls –l

# 如果有一批链接在文件里, 就可以批量下载了
$ cat url-list.txt | xargs wget –c

# 把所有的 *.jpg 文件打包到 images.tar.gz 文件里
$ find / -name *.jpg -type f -print | xargs tar -cvzf images.tar.gz

# 把所有图片复制到另一个硬盘里
$ ls *.jpg | xargs -n1 -i cp {} /external-hard-drive/directory
```

# 14. Sort命令
`sort` 命令是对文件中的行进行排序的. 
```bash
# 雇员名称:雇员ID:部门
$ cat names.txt
Emma Thomas:100:Marketing
Alex Jason:200:Sales
Madison Randy:300:Product Development
Sanjay Gupta:400:Support
Nisha Singh:500:Sales

# 默认排序:按字符排序
$ sort names.txt
Alex Jason:200:Sales
Emma Thomas:100:Marketing
Madison Randy:300:Product Development
Nisha Singh:500:Sales
Sanjay Gupta:400:Support

# 倒叙排序
$ sort -r names.txt
Sanjay Gupta:400:Support
Nisha Singh:500:Sales
Madison Randy:300:Product Development
Emma Thomas:100:Marketing
Alex Jason:200:Sales

# 按第二列(雇员ID)排序
$ sort -t: -k 2 names.txt
Emma Thomas:100:Marketing
Alex Jason:200:Sales
Madison Randy:300:Product Development
Sanjay Gupta:400:Support
Nisha Singh:500:Sales

# 按第三列(部门)排序, 去掉重复项
$ sort -t: -u -k 3 names.txt
Emma Thomas:100:Marketing
Madison Randy:300:Product Development
Alex Jason:200:Sales
Sanjay Gupta:400:Support

# 按 ip 排序
$ sort -t . -k 1,1n -k 2,2n -k 3,3n -k 4,4n /etc/hosts
127.0.0.1 localhost.localdomain localhost
192.168.100.101 dev-db.thegeekstuff.com dev-db
192.168.100.102 prod-db.thegeekstuff.com prod-db
192.168.101.20  dev-web.thegeekstuff.com dev-web
192.168.101.21  prod-web.thegeekstuff.com prod-web
```

# 15. Uniq命令
`uniq` 命令大多情况是和 `sort` 命令组合使用的      
注意: `uniq` 命令仅对相邻的相同行进行去重复操作
```bash
# 测试文件
$ cat sort.txt
A
B
D
X
B
C
F
C
E
C

# 常用:去重复
$ sort sort.txt | uniq

# 直接使用 sort 去重复
$ sort –u sort.txt

# 展示每行有多少个重复的
$ sort sort.txt| uniq -c
   1 A
   2 B
   3 C
   1 D
   1 E
   1 F
   1 X

# 仅展示重复的 (mac下无法正常工作)
$ sort sort.txt | uniq -cd
      2 B
      3 C
```

# 16. Cut命令
`cut` 命令通常被用来展示文件或者其他命令输出的指定的列
```bash
# 展示第一列(雇员名称), 按 ":" 分割列
$ cut -d: -f 1 names.txt
Emma Thomas
Alex Jason
Madison Randy
Sanjay Gupta
Nisha Singh

# 展示第1列,第3列, 按 ":" 分割列
$ cut -d: -f 1,3 names.txt
Emma Thomas:Marketing
Alex Jason:Sales
Madison Randy:Product Development
Sanjay Gupta:Support
Nisha Singh:Sales

# 展示每行的 1~8 个字符
$ cut -c 1-8 names.txt
Emma Tho
Alex Jas
Madison
Sanjay G
Nisha Si
```

实用例子:
- `cut -d: -f1 /etc/passwd` 列出系统所有登录名
- `free | tr -s ' ' | sed '/^Mem/!d' | cut -d " " -f2` 系统内存大小
- `ps aux | grep "tomcat" | grep -v "grep" | tr -s ' ' | cut -d' ' -f2` 列出运行中的 tomcat 进程号

# 17. Stat命令
`stat` 检查单个文件或文件系统的状态/属性
```bash
# 查看单个文件状态/属性
$ stat names.txt
  File: "names.txt"
  Size: 132       	Blocks: 8          IO Block: 4096   普通文件
Device: 805h/2053d	Inode: 678801      Links: 1
Access: (0644/-rw-r--r--)  Uid: (    0/    root)   Gid: (    0/    root)
Access: 2017-09-09 13:38:59.403017026 +0800
Modify: 2017-09-02 17:01:01.162984631 +0800
Change: 2017-09-02 17:01:01.199141877 +0800

# -f 文件系统信息
$ stat -f /usr
  File: "/usr"
    ID: e3c85246fa89a72a Namelen: 255     Type: ext2/ext3
Block size: 4096       Fundamental block size: 4096
Blocks: Total: 18278468   Free: 10455851   Available: 9527352
Inodes: Total: 4644864    Free: 4295095
```
更多例子:[Unix Stat Command: How To Identify File Attributes](http://www.thegeekstuff.com/2009/07/unix-stat-command-how-to-identify-file-attributes/)
# 18. Diff命令 
语法:`diff [options] file1 file2`

一般用于比对新老文件改动了什么
```bash
# -w 忽略空白行
$ diff -w name_list.txt name_list_new.txt
2c2,3
< John Doe
---
> John M Doe
> Jason Bourne
```
更多例子:[Top 4 File Difference Tools on UNIX / Linux – Diff, Colordiff, Wdiff, Vimdiff](http://www.thegeekstuff.com/2010/06/linux-file-diff-utilities/)

# 19. Ac 显示用户在线时长
`ac` 命令可以统计用户在线时长
```bash
# -d 按天统计
$ ac –d
Dec  1  total        1.08
Dec  2  total        0.99
Dec  3  total        3.39
Dec  4  total        4.50
Today   total        6.10

# -p 按用户统计
$ ac -p
	root                          5688.06
	lixxx                            6.59
	zhxxx                          256.40
	total     5951.06

# 可指定用户
$ ac -d sanjay
Jul  2  total       12.85
Aug 25  total        5.05
Sep  3  total        1.03
Sep  4  total        5.37
Dec 24  total        8.15
Dec 29  total        1.42
Today   total        2.95
```

# 20. 后台运行命令
有 5种 方式可以在后台运行命令
```bash
# 1. 使用 &
$ ./my-shell-script.sh &

# 2. nohup 方式
$ nohup ./my-shell-script.sh &

# 3. screen 命令
$ screen ./myscript.sh

# 4. at 方式: 指定时间点, 定时任务的方式
$ at -f backup.sh 10 am tomorrow

# 5. watch 方式
$ watch df -h
```
更多例子:
- [Bg, Fg, &, Ctrl-Z – 5 Examples to Manage Unix Background Jobs](http://www.thegeekstuff.com/2010/05/unix-background-job/)
- [Unix Nohup: Run a Command or Shell-Script Even after You Logout](http://linux.101hacks.com/unix/nohup-command/)
- [Screen Command Examples: Get Control of Linux / Unix Terminal](http://www.thegeekstuff.com/2010/07/screen-command-examples/)
- [Understand at, atq, atrm, batch Commands using 9 Examples](http://www.thegeekstuff.com/2010/06/at-atq-atrm-batch-command-examples/)
- [Watch: Repeat Unix Commands or Shell-Scripts every N seconds](http://www.thegeekstuff.com/2010/05/watch-command-examples/)

---
其他参考：
- [Linux 101 Hacks 官网 - The Geek Stuff](http://www.thegeekstuff.com/)
- [grep 命令系列：grep 中的正则表达式](https://linux.cn/article-6941-1.html)
- [Linux Shell 1>/dev/null 2>&1 含义](http://blog.csdn.net/ithomer/article/details/9288353)

