---
layout: post
title: "Linux 101 Hacks 第十一章:Bash脚本"
tagline: ""
description: "Linux/Uinx系统下最常用的一种脚本语言。脚本可以直接执行Linux的命令，通常会把一些重复的，或者比较复杂的逻辑放到脚本文件里，这样更加方便的来完成工作"
date: '2017-11-05 16:02:33 +0800'
category: linux
tags: linux linux-command linux-101-hacks ebook
---
> {{ page.description }}

# 84. .bash_* 文件的执行顺序
**涉及到的文件列表**:
- `/etc/profile`
- `~/.bash_profile • ~/.bashrc`
- `~/.bash_login`
- `~/.profile`
- `~/.bash_logout`

**示例1: login shell执行循序**
```bash
# 下面是执行顺序的伪代码
execute /etc/profile
IF ~/.bash_profile exists THEN
    execute ~/.bash_profile
ELSE
    IF ~/.bash_login exist THEN
        execute ~/.bash_login
    ELSE
        IF ~/.profile exist THEN
            execute ~/.profile
        END IF
    END IF 
END IF
```
从交互式shell注销时，将会执行：
```bash
# 伪代码
IF ~/.bash_logout exists THEN
    execute ~/.bash_logout
END IF
```

注意：`/etc/bashrc` 其实是被 `~/.bashrc` 调用执行的
```bash
$ cat ~/.bashrc
if [ -f /etc/bashrc ]; then
. /etc/bashrc
fi
```

**示例2: non-login shell执行循序**
```bash
# 伪代码
IF ~/.bashrc exists THEN
    execute ~/.bashrc
END IF
```
注意：当非交互式shell启动时，它会查找ENV环境变量，并执行ENV变量中提到的文件名值

**示例3: 执行顺序的测试**

测试执行顺序的方法之一是在这些文件中添加不同的PS1值，然后重新登录到shell并查看Linux提示符提取哪个PS1值。 而且，之前我们讨论过如何使用PS1来使你的Linux提示功能和美化
```bash
#1. 在 /etc/profile 添加 PS1 (确保 ~/.bash_profile 没有设置 PS1 哦)
$ grep PS1 /etc/profile
PS1="/etc/profile> "

# "
# 重新登录查看 PS1 提示已经修改了
Last login: Sat Sep 27 16:43:57 2008 from 192.168.1.2
/etc/profile>
```

```bash
# 2. 其他几个文件添加 PS1
/etc/profile> grep PS1 ~/.bash_profile
export PS1="~/.bash_profile> "

/etc/profile> grep PS1 ~/.bash_login
export PS1="~/.bash_login> "

/etc/profile> grep PS1 ~/.profile
export PS1="~/.profile> "

/etc/profile> grep PS1 ~/.bashrc
export PS1="~/.bashrc> "

# [Note: Upon re-login, it executed /etc/profile first and
# ~/.bash_profile next. So, it took the PS1 from
# ~/.bash_profile as shown below. It also did not execute
# ~/.bash_login, as ~/.bash_profile exists]

# 重新登录，可以看到 bash_profile 生效
Last login: Sat Sep 27 16:48:11 2008 from 192.168.1.2
~/.bash_profile>
```

```bash
# 把 bash_profile 文件移走之后看效果
~/.bash_profile> mv .bash_profile bash_profile_not_used

# [Note: Upon re-login, it executed /etc/profile first.
# Since it cannot find ~/.bash_profile, it executed
# ~/.bash_login]

# 可以看到是 bash_login 生效
Last login: Sat Sep 27 16:50:55 2008 from 192.168.1.2
~/bash_login>
```

```bash
# 再把 bash_login 移走
~/.bash_login> mv .bash_login bash_login_not_used

# [Note: Upon re-login, it executed /etc/profile first.
# Since it cannot find ~/.bash_profile and ~/.bash_login, it
# executed ~/.profile]

# 然后是 profile 生效
Last login: Sat Sep 27 16:56:36 2008 from 192.168.1.2
~/.profile>
```

```bash
# 直接执行 bash 将会启动一个 non-login shell，对应调用的 .bashrc 初始化
~/.profile> bash

# [Note: This displays PS1 from .bashrc as shown below.]
~/.bashrc> exit

# [Note: After exiting from non-login shell, we are back to login shell]
~/.profile>
```

**更多**:
- [Execution sequence for .bash_profile, .bashrc, .bash_login, .profile and .bash_logout](http://www.thegeekstuff.com/2008/10/execution-sequence-for-bash_profile-bashrc-bash_login-profile-and-bash_logout/)


# 85.类C的Bash的FOR循环语法
类似C语言的for循环语法（初始化，条件，递增），类似的伪代码如下：
```bash
for (( expr1; expr2; expr3 ))
do
commands
done
```
- `expr1` - 循环执行之前的初始化，初始值设置
- `expr2` - 每次循环执行时的判断，如果值为 true，则执行循环的语句
- `expr3` - 每次循环执行之后的操作，一般是用来递增或者递减的

**示例1: C格式的循环**
```bash
$ cat for10.sh
for (( i=1; i <= 3; i++ ))
do
echo "Random number $i: $RANDOM"
done

$ ./for10.sh
Random number 1: 23320
Random number 2: 5070
Random number 3: 15202
```

**示例2: 无限循环**
```bash
$ cat for11.sh
i=1;
for (( ; ; ))
do
sleep $i
echo "Number: $((i++))"
done

# 别忘了手动终止shell了  Ctrl+C
$ ./for11.sh
Number: 1
Number: 2
Number: 3
```

**示例3: 有2个值的递增**
```bash
$ cat for12.sh
for ((i=1, j=10; i <= 5 ; i++, j=j+5))
do
echo "Number $i: $j"
done

$ ./for12.sh
Number 1: 10
Number 2: 15
Number 3: 20
Number 4: 25
Number 5: 30
```

**更多**:
- [12 Bash For Loop Examples for Your Linux Shell Scripting](http://www.thegeekstuff.com/2011/07/bash-for-loop-examples/)


# 86.调试Shell
**示例1: 不进行调试**
```bash
$ cat filesize.sh
#!/bin/bash
for filesize in $(ls -l . | grep "^-" | awk '{print $5}')
do
  let totalsize=$totalsize+$filesize
done
echo "Total file size in current directory: $totalsize"

$ ./filesize.sh
Total file size in current directory: 652
```

**示例2: 内部开启调试**
```bash
$ cat filesize.sh
#!/bin/bash
set -xv
for filesize in $(ls -l . | grep "^-" | awk '{print $5}')
do
  let totalsize=$totalsize+$filesize
done
echo "Total file size in current directory: $totalsize"


$ ./fs.sh
++ ls -l .
++ grep '^-'
++ awk '{print $5}'
+ for filesize in '$(ls -l . | grep "^-" | awk '\''{print $5}'\'')'
+ let totalsize=+178
+ for filesize in '$(ls -l . | grep "^-" | awk '\''{print $5}'\'')'
+ let totalsize=178+285
+ for filesize in '$(ls -l . | grep "^-" | awk '\''{print $5}'\'')'
+ let totalsize=463+189
+ echo 'Total file size in current directory: 652'
Total file size in current directory: 652
```

**示例3: 执行时开启调试**
```bash
$ bash -xv filesize.sh

# 另外一般常用的开启调试的语法
$ sh -x filesize.sh
```

# 87.引号
**示例: 常规示例**
```bash
# 没有特殊字符
$ echo The Geek Stuff
The Geek Stuff

# 带个分号
$ echo The Geek; Stuff
The Geek
-bash: Stuff: command not found

# 特殊字符转义
$ echo The Geek\; Stuff
The Geek; Stuff
```

**示例2: 单引号**
```bash
$ echo 'Hostname=$HOSTNAME ;  Current User=`whoami` ; Message=\$ is USD'
Hostname=$HOSTNAME ;  Current User=`whoami` ; Message=\$is USD
```

**示例3: 双引号**
```bash
$ echo "Hostname=$HOSTNAME ;  Current User=`whoami` ; Message=\$ is USD"
Hostname=dev-db ;  Current User=ramesh ; Message=$ is USD
```

双引号将移除以下字符的特殊含义：
- `$` - 参数替代
- `   - 2个反引号中间一般是命令行
- `\$` - 美元符号字符
- `\ ́` - 反引号字符
- `\"` - 双引号字符
- `\\` - 反斜杠字符

**更多**:
- [双引号和单引号在shell中有什么不同？](https://xu3352.github.io/linux/2017/04/05/what-the-different-between-double-quotation-and-single-quotation-in-shell)


# 88.Shell读取数据文件字段
数据文件准备 
```bash
$ cat employees.txt
Emma Thomas:100:Marketing
Alex Jason:200:Sales
Madison Randy:300:Product Development
Sanjay Gupta:400:Support
Nisha Singh:500:Sales
```

**制作读取脚本**

以 `:` 为分隔切分字段
```bash
$ vi read-employees.sh
#!/bin/bash
IFS=:
echo "Employee Names:"
echo "---------------"
while read name empid dept
do
  echo "$name is part of $dept department"
done < ~/employees.txt
```

**执行结果**
```bash
$ chmod u+x read-employees.sh
$ ./read-employees.sh

Employee Names:
---------------
Emma Thomas is part of Marketing department
Alex Jason is part of Sales department
Madison Randy is part of Product Development department
Sanjay Gupta is part of Support department
Nisha Singh is part of Sales department
```

