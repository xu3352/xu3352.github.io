---
layout: post
title: "Linux 101 Hacks 第七章:命令行历史"
tagline: ""
description: "Linux的命令输入都是有历史痕迹的；掌握了 history 的用法，可以大幅度的提高命令的输入效率；分分钟变大神，哈哈"
date: '2017-09-19 21:03:38 +0800'
category: linux
tags: linux linux-command linux-101-hacks ebook
---
> {{ page.description }}

# 52.History命令示例
当你经常使用Linux命令行时, 有效利用历史可以提升生产力

示例1: 使用 CTRL+R 搜索命令历史

可以根据关键词进行搜索, 然后立即执行命令, 非常强大和方便
```bash
# 按下组合键: CTRL+R
$ CTRL+R

# 输入关键词 'httpd'
(reverse-i-search)`httpd‘: service httpd stop

# 按方向键之后可以进行编辑
$ service httpd start
```

示例2: 4种方式重新执行之前的命令
4种方式:
- `↑` - 方向键:向上, 可以选择最后几次输入的命令; 向上之后可以按 `↓` 向下的箭头选择
- `!!` - 直接回车会执行会后一次的命令
- `!-1` - 表示倒数第一个命令. 数字可以修改, 倒数第n个命令
- `CTRL+P` - 直接回显示为最后一次的命令

示例3: 在历史总选择一个特定的命令执行
```bash
$ history | more
       1  service network restart
       2  exit
       3  id
       4  cat /etc/redhat-release

# 表示执行第4个, 正序的第4个, 前面的 !-1 表示 倒数第一个
$ !4
cat /etc/redhat-release
```

示例4: 以特定的key执行一个历史里的命令

比如我们之前查询过的命令: `ps aux | grep tomcat`
```bash
$ !ps
ps aux | grep tomcat
```

示例5: 清空历史命令
```bash
$ history -c
```

示例6: 历史命令截取替换

```bash
$ ls anaconda-ks.cfg
anaconda-ks.cfg

# 使用上个命令的最后一个参数
$ vi !!:$
vi anaconda-ks.cfg

# 使用上个命令的第一个参数
$ vi !^
vi anaconda-ks.cfg
```
详解：
- `!!:$` 表示上一个命令的最后一个参数
- `!^` 表示上个命令的第一个参数

示例7: 替换指定的参数
```bash
$ cp ~/longname.txt ~/long-filename.txt ~/other-file.txt

# 上个cp命令中的第2个参数
$ ls -l !cp:2
ls -l ~/long-filename.txt

# 上个cp命令中的最后一个参数
$ ls -l !cp:$
ls -l ~/other-file.txt
```
说明：
- `!cp:2` 表示上个历史命令里以 `cp` 开头的命令, 截取第2个参数
- `!cp:$` 表示上个历史命令里以 `cp` 开头的命令，截取最后一个参数

# 53.历史命令相关环境变量
示例1: 用 HISTTIMEFORMAT 展示时间戳
```bash
$ export HISTTIMEFORMAT='%F %T '

$ history | more
       1  2008-08-05 19:02:39 service network restart
       2  2008-08-05 19:02:39 exit
       3  2008-08-05 19:02:39 id
       4  2008-08-05 19:02:39 cat /etc/redhat-release
```

可以使用别名快速查看最近的命令行：`hisroty [n]`
```bash
alias h1='history 10'
alias h2='history 20'
alias h3='history 30'
```

示例2: 控制历史命令记录的总数量
```bash
$ vi ~/.bash_profile

HISTSIZE=450
HISTFILESIZE=450
```
一般来讲历史命令多一点比较好，这个就看个人喜好了

示例3: HISTFILE 修改历史命令存储文件
默认的历史命令存储在：`~/.bash_history` 文件里，不过也是可以修改的
```bash
$ vi ~/.bash_profile
HISTFILE=/root/.commandline_warrior
```

示例4: HISTCONTROL 消除历史命令里连续重复的项
```bash
# 默认的
$ pwd
$ pwd
$ pwd
$ history | tail -4
       44  pwd
       45  pwd
       46  pwd
       47  history | tail -4

# 去除连续重复的项目
$ export HISTCONTROL=ignoredups
$ pwd
$ pwd
$ pwd
$ history | tail -3
       56  export HISTCONTROL=ignoredups
       57  pwd
       58  history | tail -4
```

示例5: HISTCONTROL 去除所有的重复项
```bash
$ export HISTCONTROL=erasedups
$ pwd
$ service httpd stop
$ history | tail -3
       38  pwd
       39  service httpd stop
       40  history | tail -3

$ ls -ltr
$ service httpd stop
$ history | tail -6
       35  export HISTCONTROL=erasedups
       36  pwd
       37  history | tail -3
       38  ls –ltr
       39  service httpd stop
       40  history | tail -6
```
重复的命令默认保留最后一次的

示例6: HISTCONTROL 强制不记录特定方式输入的命令
```bash
$ export HISTCONTROL=ignorespace
$ ls –ltr
$ pwd
$  service httpd stop
$ history | tail -3
       67  ls –ltr
       68  pwd
       69  history | tail -3
```

示例7: HISTSIZE 禁用历史记录
```bash
$ export HISTSIZE=0

# history
```
长度设置为0就相当于禁用历史记录了

示例8: HISTIGNORE 忽略指定的命令
```bash
$ export HISTIGNORE="pwd:ls:ls –ltr:"
$ pwd
$ ls
$ ls -ltr
$ service httpd stop
$ history | tail -3
       79  export HISTIGNORE=”pwd:ls:ls -ltr:”
       80  service httpd stop
       81  history
```

# 54.历史命令扩展示例
使用历史命令扩展可以非常方便的执行之前的命令，或者修改特定的地方后在执行，大大的提高了操作效率。扩展以：`!` 开始
title:
- `!!` - 重复执行上一个命令
- `!10` - 执行第10个历史命令（10表示在历史命令里记录的编号）
- `!-2` - 指定倒数第2个命令
- `!string` - 执行以 `string` 开头的命令（最近的命令开始匹配）
- `!?string` - 执行包含 `string` 字符串的命令（最近的命令开始匹配）
- `^str1^str2^` - 把上一个命令总的 `str1` 替换为 `str2` 后执行
- `!!:$` - 获取上个命令总的最后一个参数 (`!$` 和 `!:$` 也是同样的效果)
- `!string:n` - 获取以 `string` 开头的命令（最近的命令开始匹配）中的第`n`个参数

示例1: `!?string` 示例
```bash
$ /usr/local/apache2/bin/apachectl restart
$ !apache
-bash: !apache: event not found

$ !?apache
/usr/local/apache2/bin/apachectl restart
```
这里应该使用包含，而不是前缀

示例2: `^str1^str2^` 示例
```bash
$ ls /etc/sysconfig/network
$ ^ls^vi
vi /etc/sysconfig/network
```
这个示例不太合适，因为直接 `vi !$` 就可以了, 但是某些情况就非常合适了

示例3: `!!:$` 示例
```bash
$ cp /etc/passwd /home/ramesh/passwd.bak
$ vi !!:$
vi /home/ramesh/passwd.bak

$ vi !:$
vi /home/ramesh/passwd.bak

$ vi !$
 vi /home/ramesh/passwd.bak
```

示例4: `!string:n` 示例
```bash
$ tar cvfz ~/sysconfig.tar.gz /etc/sysconfig/*
$ ls -l !tar:2
ls -l ~/sysconfig.tar
```
取上个命令中的第2个参数


隔了一段时间没更新了，今日补全这篇文章（2017.09.30）

