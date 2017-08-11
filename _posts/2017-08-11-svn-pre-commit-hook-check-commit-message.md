---
layout: post
title: "svn pre-commit 限制提交备注最小长度（中英文混合）"
tagline: ""
description: "svn pre-commit 做提交前的校验，不合格的休想过关！"
date: '2017-08-11 01:39:57 +0800'
category: work
tags: svn work
---
> {{ page.description }}

# pre-commit
pre-commit 钩子在事务创建新版本之前运行。通常这个钩子是用来保护因为内容或位置(例如，你要求所有到一个特定分支的提交必须包括一个 bug 追踪的 ticket 号，或者是要求日志信息不为空)而不允许的提交。

如果 pre-commit 钩子返回非零值，提交会终止，提交事务被删除，所有 stderr 的输出会返回到客户端。 

# 中文乱码
首先复制一个模板过来，自带的模板是必须有提交备注才可以提交
```bash
# 进入 svn 仓库的 hooks 目录
cd /path/svn_repository/hooks

# 拷贝模板
cp pre-commit.tmpl pre-commit

# 给个可执行权限
chmod 755 pre-commit
```

可是中文提交的时候，这里获取到的提交备注是乱码的：
```bash
SVNLOOK=/usr/bin/svnlook
MSG=`$SVNLOOK log -t "$TXN" "$REPOS" | grep "[a-zA-Z0-9]"`

# 备注长度
SIZE=`echo $MSG | wc -m`

# 提交的备注输出到指定文件里
echo "size:$SIZE message:$MSG" >> /tmp/svn-pre-commit.log
```

把日志输出到指定文件后，查看日志文件：
```
# 查看日志
cat /tmp/svn-pre-commit.log

...... ?\229?\136?\183?\233?\152?\133?\232?\175?\187?\229?\140?\186?\233?\151?\180?\229?\129 .....
```

一番捣腾后，乱码的问题通过设置环境变量得到解决：
```bash
envSetting="env LANG=zh_CN.UTF-8 LC_ALL=zh_CN.UTF-8"

SVNLOOK=/usr/bin/svnlook
MSG=`$envSetting $SVNLOOK log -t "$TXN" "$REPOS" | grep "[a-zA-Z0-9]"`

# 备注长度
SIZE=`echo $MSG | wc -m`

# 提交的备注输出到指定文件里
echo "size:$SIZE message:$MSG" >> /tmp/svn-pre-commit.log
```

# 备注长度统计不准
linux 可以使用 `wc` 来统计字符长度，有几种模式，常用的是按字符数或者按字节数或者行数统计

```bash
# man 手册
$ man wc

NAME
       wc - print newline, word, and byte counts for each file

SYNOPSIS
       wc [OPTION]... [FILE]...
       wc [OPTION]... --files0-from=F

DESCRIPTION
       Print newline, word, and byte counts for each FILE, and a total line if more than one FILE is specified.  With no FILE, or when FILE is -, read stan-
       dard input.

       -c, --bytes
              print the byte counts

       -m, --chars
              print the character counts

       -l, --lines
              print the newline counts
```

通常使用：`hello你好啊` 按字符数计算应该是：`8`
```bash
# 按字符数统计，不是应该是8么，人家自动都+1了
echo "hello你好啊" | wc -m
9

# 按字节数统计，这里一个汉字占用3个字节，最后也自动+1了
echo "hello你好啊" | wc -c
15
``` 

通过多次svn提交实验，hook统计时不管使用 `wc -m` 或者 `wc -c` 都输出 `15`，就是这么神奇，也就是说字符统计不能用，而按字节统计，中英文混合的情况没法统计

实验的时候可以吧 `exit 1` 放到最后一行，这样每次提交都会不成功，然后看日志即可

# python 字符统计
本地环境：`python 2.7.5` 

又是各种折腾，最终好使的是：`len("hello你好啊".decode("UTF-8"))`；而嵌入 shell 脚本里时，这个也是折腾了许久，最后找到个法子：
```bash
SIZE=`python -c "import sys; print len(sys.argv[1].decode(\"UTF-8\"))" "$MSG"`
```

总算能正常的统计了

# 完整版
完整版：限制提交备注不得少于 20 个字符(可中英文混合)
```bash
#!/bin/sh
#author:xu3352@gmail.com
#desc:check commit message length

REPOS="$1"
TXN="$2"
SVNLOOK=/usr/local/bin/svnlook
TIME=`date "+%Y-%m-%d %H:%M:%S"`

# env setting
envSetting="env LANG=zh_CN.UTF-8 LC_ALL=zh_CN.UTF-8"

# commit message content
MSG=`$envSetting $SVNLOOK log -t "$TXN" "$REPOS"`

# chars length
# SIZE=`echo $MSG | wc -m`
SIZE=`python -c "import sys; print len(sys.argv[1].decode(\"UTF-8\"))" "$MSG"`
echo "$TIME - pre-commit - REPOS:$REPOS TXN:$TXN MSG_SIZE:$SIZE - MSG:$MSG" >> /tmp/svn-pre-commit.log

if [ "$SIZE" -lt 20 ];
then
  echo -e "提交内容:\"$MSG\" 不能少于 20 个字!" 1>&2
  exit 1
fi
```
IDEA SVN提交 效果图：     
![](http://on6gnkbff.bkt.clouddn.com/20170811084600_svn-pre-commit-01.png){:width="100%"}

---
参考：
- [svn pre-commit](http://svnbook.red-bean.com/zh/1.6/svn.ref.reposhooks.pre-commit.html)
- [SVN hooks pre-commit python脚本中的中文显示问题](http://www.jianshu.com/p/a6527560bd36)
- [统计UTF-8文件中汉字个数](http://www.cnblogs.com/liyongmou/archive/2011/05/31/2064748.html)

