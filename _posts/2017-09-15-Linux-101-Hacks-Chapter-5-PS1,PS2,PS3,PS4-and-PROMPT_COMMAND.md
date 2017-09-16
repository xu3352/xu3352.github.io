---
layout: post
title: "Linux 101 Hacks 第五章:PS1,PS2,PS3,PS4和提示命令"
tagline: ""
description: "Linux终端个性化设置:`PS1,PS2,PS3,PS4 和 PROMPT_COMMAND`"
date: '2017-09-15 21:32:59 +0800'
category: linux
tags: linux linux-command linux-101-hacks ebook
---
> {{ page.description }}

# 38. PS1-默认的交互提示
Linux 默认的终端交互提示是可以被修改为展示某些比较有用的信息的

比如默认的`PS1`: `\s-\v\$`, 即展示 shell 名称和对应的版本号

我们可以修改为: `用户名@ 主机名 当前工作目录名`
```bash
-bash-3.2$  export PS1="\u@\h \w> "

ramesh@dev-db ~> cd /etc/mail

ramesh@dev-db /etc/mail>
```

`PS1` 详解:
- `\u` - 用户名
- `\h` - 主机名
- `\w` - 目录全路径 (如果是 home 目录, 则显示为`~`)

注意 `PS1` 最后有个空格, 可读性更加好一点

想要永久生效, 那么可以吧 `PS1` 设置到 `.bash_profile` 或者 `.bashrc` 文件里
```bash
ramesh@dev-db ~> vi ~/.bash_profile
export PS1="\u@\h \w> "
```

# 39. PS2–连续交互式提示
一个命令可以使用 `\`结尾 链接多行的方式进行书写

而每行默认的提示符则为: `> `, 这里我们可以修改 `PS2` : `continue-> ` 进行修改
```bash
ramesh@dev-db ~> myisamchk --silent --force --fast --update-state \
> --key_buffer_size=512M --sort_buffer_size=512M \
> --read_buffer_size=4M --write_buffer_size=4M \
> /var/lib/mysql/bugs/*.MYI

ramesh@dev-db ~> export PS2="continue-> "

ramesh@dev-db ~> myisamchk --silent --force --fast --update-state \
continue-> --key_buffer_size=512M --sort_buffer_size=512M \
continue-> --read_buffer_size=4M --write_buffer_size=4M \
continue-> /var/lib/mysql/bugs/*.MYI
```
如果你觉得是否可以增加可读性呢?

# 40. PS3–选择命令提示符
在一个循环选择的脚本中, 可以设置 `PS3` 来定制提示语

先看看没有设置 `PS3` 的例子:
```bash
ramesh@dev-db ~> cat ps3.sh
select i in mon tue wed exit
do
  case $i in
    mon) echo "Monday";;
    tue) echo "Tuesday";;
    wed) echo "Wednesday";;
    exit) exit;;
esac done

ramesh@dev-db ~> ./ps3.sh
1) mon
2) tue
3) wed
4) exit
#? 1
Monday
#? 4
```

设置 `PS3` 之后:
```bash
ramesh@dev-db ~> cat ps3.sh
PS3="Select a day (1-4): "
select i in mon tue wed exit
do
  case $i in
    mon) echo "Monday";;
    tue) echo "Tuesday";;
    wed) echo "Wednesday";;
    exit) exit;;
esac done

ramesh@dev-db ~> ./ps3.sh
1) mon
2) tue
3) wed
4) exit
Select a day (1-4): 1
Monday
Select a day (1-4): 4
```
是不是感觉不错, 嘿嘿

# 41. PS4-前缀跟踪输出提示
`PS4` 仅当 shell 脚本使用 debug 模式(`set -x`)时的显示提示

未设置 `PS4` 的示例:
```bash
ramesh@dev-db ~> cat ps4.sh
set -x
echo "PS4 demo script"
ls -l /etc/ | wc -l
du -sh ~

ramesh@dev-db ~> ./ps4.sh
++ echo 'PS4 demo script'
PS4 demo script
++ ls -l /etc/
++ wc -l
243
++ du -sh /home/ramesh
48K     /home/ramesh
```

设置 `PS4` 之后的示例:
```bash
ramesh@dev-db ~> cat ps4.sh
export PS4='$0.$LINENO+ '
set -x
echo "PS4 demo script"
ls -l /etc/ | wc -l
du -sh ~

ramesh@dev-db ~> ./ps4.sh
../ps4.sh.3+ echo 'PS4 demo script'
PS4 demo script
../ps4.sh.4+ ls -l /etc/
../ps4.sh.4+ wc -l
243
../ps4.sh.5+ du -sh /home/ramesh
48K     /home/ramesh
```

详解:
- `$0` - 执行的脚本
- `$LINENO` - 当前执行脚本的行号

这个调试 shell 的时候感觉还是非常不错的

# 42. PROMPT_COMMAND
在显示 `PS1` 之前会执行 `PROMPT_COMMAND` 设置的脚本内容

```bash
ramesh@dev-db ~> export PROMPT_COMMAND="date +%H:%M:%S"
22:08:42
ramesh@dev-db ~>
```
如果你想把 `PROMPT_COMMAND` 内容和 `PS1` 显示到一行, 那么可以使用 `echo -n` 实现
```bash
ramesh@dev-db ~> export PROMPT_COMMAND="echo -n [$(date +%H:%M:%S)]"
[22:08:51]ramesh@dev-db ~>
```
测试时, 如果时间不变的话, 可以用下面的方式试试:      
`export PROMPT_COMMAND='echo -n [$(date +%H:%M:%S)]'`

如果自己测试的话, 可以先看一下 `echo $PROMPT_COMMAND` 原来的值是什么, 到时候好改回来

更多讨论: [Bash Shell: Take Control of PS1, PS2, PS3, PS4 and PROMPT_COMMAND](http://www.thegeekstuff.com/2008/09/bash-shell-take-control-of-ps1-ps2-ps3-ps4-and-prompt_command/)

# 43. PS1定制Bash提示符
### 显示 "用户名@主机名 目录"
```bash
-bash-3.2$ export PS1="\u@\h \W> "

ramesh@dev-db ~> cd /etc/mail
ramesh@dev-db mail>
```

### 提示符显示当前时间
设置 `PS1` 的时候, 可以使用 `$(linux_command)` 的方式, 设置为任何可以执行的 linux 命令

下面的示例则直接使用的 `$(date)` 来显示当前时间
```bash
ramesh@dev-db ~> export PS1="\u@\h [\$(date +%H:%M:%S)]> "

ramesh@dev-db [11:09:56]>
```

其等价于:
```bash
ramesh@dev-db ~> export PS1="\u@\h [\t]> "

ramesh@dev-db [12:42:55]>
```

也可以使用 `\@` 来展示带当前时间, 格式为: `12-hour am/pm`
```bash
ramesh@dev-db ~> export PS1="[\@] \u@\h> "

[04:12 PM] ramesh@dev-db>
```

### 提示符中显示任何命令的输出

```bash
ramesh@dev-db ~> kernel_version=$(uname -r)
ramesh@dev-db ~> export PS1="\!|\h|$kernel_version|\$?> "

473|dev-db|2.6.25-14.fc9.i686|0>
```

详解:
- `\!` - 输入过的命令历史总数量
- `\h` - 主机名
- `$kernel_version` - 内核版本号 `uname -r` 执行的结果
- `\$?` - 最后一次命令执行状态
- 多个输出使用 `|` 竖线进行分隔开

### 自定义属于自己的PS1
前面的例子已经讲解了如何正确的设置 `PS1`, 这里把各个选项都整理出来:
- `\a` - ASCII bell 字符 (07) 
- `\d` - 日期, 格式:`Weekday Month Date` 格式 (比如: "Tue May 26")
- `\D{format}` - 格式将会传给 `strftime(3)`, 而结果将会回填到提示符中; 大括号是必须的, 如果没有内容, 将会设置为本地时区展示方式
- `\e` - ASCII escape(转译)字符  
- `\h` - 主机名第一段
- `\H` - 主机名
- `\j` - 当前 shell 管理的任务数量
- `\l` - 终端设备简称
- `\n` - 换行
- `\r` - 回车 
- `\s` - 执行脚本的简称, 即 `$0` 的简称
- `\t` - 当前时间 24小时制 `HH:MM:SS` 格式
- `\T` - 当前时间 12小时制 `HH:MM:SS` 格式
- `\@` - 当前时间 12小时制 am/pm 格式
- `\A` - 当前时间 24小时制 `HH:MM` 格式
- `\u` - 当前用户的用户名
- `\v` - 当前 bash 的版本号 (例如:2.00)
- `\V` - 当前 bash 版本号+补丁版本号 (如:2.00.0)
- `\w` - 当前的工作目录, 如果是 $HOME 目录, 则显示为 `~`
- `\W` - 当前工作目录简称, $HOME 目录展示为 `~`
- `\!` - `history` 命令记录的数量
- `\#` - 当前命令行的行号
- `\$` - 好像是区分是否为 root 用户的, root 用户为 `#`, 其他用户为 `$`
- `\nnn` - 8进制数 nnn 对应的字符 
- `\\` - 反斜线
- `\[` - 一串非打印的字符, 可以嵌入终端控制顺序到提示中
- `\]` - 非打印字符的结束处

示例1. 在 `PS1` 中使用 `function`
```bash
ramesh@dev-db ~> function httpdcount {
> ps aux | grep httpd | grep -v grep | wc -l 
> }

ramesh@dev-db ~> export PS1="\u@\h [`httpdcount`]> "
ramesh@dev-db [12]>
```

如果想永久的生效, 那么可以把 `function` 定义到 `~/.bash_profile` 或者 `~/.bashrc`
```bash
$ vi .bash_profile
function httpdcount {
  ps aux | grep httpd | grep -v grep | wc -l
}
export PS1='\u@\h [`httpdcount`]> '
```
可以使用 `pgrep httpd | wc –l` 替代 `ps aux | grep httpd | grep -v grep | wc –l`

示例2: 在`PS1` 中使用 shell 脚本
统计当前目录的大小
```bash
ramesh@dev-db ~> cat ~/bin/totalfilesize.sh
for filesize in $(ls -l . | grep "^-" | awk '{print $5}')
do
  let totalsize=$totalsize+$filesize
done
echo -n "$totalsize"

ramesh@dev-db ~> export PATH=$PATH:~/bin
ramesh@dev-db ~> export PS1="\u@\h [\$(totalfilesize.sh) bytes]> "
ramesh@dev-db [534 bytes]> cd /etc/mail
ramesh@dev-db [167997 bytes]>

```
另一种统计的方式: 
```bash
ramesh@dev-db ~> cat ~/bin/totalfilesize.sh
ls -l | awk '/^-/ { sum+=$5 } END { printf sum }'
```

# 44. PS1定制Bash提示符 彩色版
示例1. 更改提示的字体颜色
```bash
#  淡蓝色
$ export PS1="\e[0;34m\u@\h \w> \e[m "

# 黑蓝色
$ export PS1="\e[1;34m\u@\h \w> \e[m "
```
详解:
- `\e[` - 颜色设置开始
- `x:ym` - 颜色代码
- `\e[m` -  颜色设置结束 

颜色代码:
- Black 0;30
- Blue 0;34
- Green 0;32
- Cyan 0;36
- Red 0;31
- Purple 0;35
- Brown 0;33

使用 `1` 替换 `0` 就是暗色了

永久生效设置: `~/.bash_profile 或 ~/.bashrc`
```bash
$ vi ~/.bash_profile
STARTCOLOR='\e[0;34m';
ENDCOLOR="\e[0m"
export PS1="$STARTCOLOR\u@\h \w> $ENDCOLOR"
```

示例2: 修改提示背景色
和修改提示字体颜色类似
```bash
# 浅灰色
$ export PS1="\e[47m\u@\h \w> \e[m "
```

示例3. 背景色和字体一起修改
```bash
$ export PS1="\e[0;34m\e[47m\u@\h \w> \e[m "
```
永久生效: `~/.bash_profile or ~/.bashrc`
```bash
$ vi ~/.bash_profile
STARTFGCOLOR='\e[0;34m';
STARTBGCOLOR="\e[47m"
ENDCOLOR="\e[0m"
export PS1="$STARTFGCOLOR$STARTBGCOLOR\u@\h \w> $ENDCOLOR"
```

这几个色值可以尝试一下: `\e[40m` ~ `\e[47m`

示例3: 多个颜色设置
```bash
$ vim ~/.bash_profile
function prompt {
  local BLUE="\[\033[0;34m\]"
  local DARK_BLUE="\[\033[1;34m\]"
  local RED="\[\033[0;31m\]"
  local DARK_RED="\[\033[1;31m\]"
  local NO_COLOR="\[\033[0m\]"
  case $TERM in
    xterm*|rxvt*)
      TITLEBAR='\[\033]0;\u@\h:\w\007\]'
      ;;
    *)
      TITLEBAR=""
      ;;
  esac
  PS1="\u@\h [\t]> "
  PS1="${TITLEBAR}\
  $BLUE\u@\h $RED[\t]>$NO_COLOR "
  PS2='continue-> '
  PS4='$0.$LINENO+ '
}

# 重新加载一遍, 和 source 一样
$. ./.bash_profile

$ prompt
ramesh@dev-db [13:02:13]>
```
这里看不到效果, 可以自己试一下

示例4. 使用 `tput` 修改颜色提示
```bash
$ export PS1="\[$(tput bold)$(tput setb 4)$(tput setaf 7)\]\u@\h:\w $ \[$(tput sgr0)\]"
```

`tput` 颜色功能:
- `tput setab [1-7]` - Set a background color using ANSI escape 设置ANSI转译后的背景颜色
- `tput setb [1-7]` - Set a background color 设置背景色
- `tput setaf [1-7]` - Set a foreground color using ANSI escape 置ANSI转译后的字体颜色
- `tput setf [1-7]` - Set a foreground color 设置字体颜色

`tput` 文本模式功能:
- `tput bold` - Set bold mode 粗体
- `tput dim` - turn on half-bright mode 半亮
- `tput smul` - begin underline mode 下划线开始
- `tput rmul` - exit underline mode 下划线结束
- `tput rev` - Turn on reverse mode 反转(相反)模式
- `tput smso` - Enter standout mode (bold on rxvt) 输入突出模式 
- `tput rmso` - Exit standout mode 输入突出模式
- `tput sgr0` - Turn off all attributes 关闭所有属性

`tput` 颜色 code:
- `0` – Black  黑色
- `1` – Red 红色
- `2` – Green 绿色
- `3` – Yellow 黄色
- `4` – Blue 蓝色
- `5` – Magenta 品红色
- `6` – Cyan 青色
- `7` - White 白色

 更多:
- [Bash Shell PS1: 10 Examples to Make Your Linux Prompt like Angelina Jolie](http://www.thegeekstuff.com/2008/09/bash-shell-ps1-10-examples-to-make-your-linux-prompt-like-angelina-jolie/)
- [9 UNIX / Linux tput Examples: Control Your Terminal Color and Cursor](http://www.thegeekstuff.com/2011/01/tput-command-examples/)

