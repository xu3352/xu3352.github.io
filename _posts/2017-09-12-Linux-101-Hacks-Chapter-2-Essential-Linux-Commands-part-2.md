---
layout: post
title: "Linux 101 Hacks 第二章:基础的Linux命令(第二部分 sed awk vim chmod tail less wget)"
tagline: ""
description: "必不可少的 `linux` 命令, 如: `grep find xargs sort uniq cut stat diff sed awk vim chmod less wget`等等..."
date: '2017-09-02 13:48:32 +0800'
category: linux
tags: linux linux-command linux-101-hacks ebook
---
> {{ page.description }}

# 21. Sed基础-正则查找和替换
这里主要讲解使用替换命令: `s`, 替换命令也行是 `sed` 最常用的命令

语法:    
`sed 'ADDRESSs/REGEXP/REPLACEMENT/FLAGS' filename`      
`sed 'PATTERNs/REGEXP/REPLACEMENT/FLAGS' filename`      
- `s` 表示替换操作
- `/` 分隔符
- `REGEXP` 正则表达式
- `REPLACEMENT` 替换内容

`FLAGS`标识:
- `g` 全部替换
- `n` 数字, 表示第几个进行匹配值会进行替换
- `p` 如果进行替换, 则输出替换之后的内容
- `i` 忽略大小写
- `w` 结果输出到指定文件
- 可以使用不同的分隔符(`@%;:`) 替代`/`

先准备一个测试文件:`thegeekstuff.txt`
```bash
$ cat thegeekstuff.txt
# Instruction Guides
1. Linux Sysadmin, Linux Scripting etc.
2. Databases - Oracle, mySQL etc.
3. Security (Firewall, Network, Online Security etc)
4. Storage in Linux
5. Productivity (Too many technologies to explore, not
much time available)
#  Additional FAQS
6. Windows- Sysadmin, reboot etc.
```

示例1: `s//` 把 "Linux" 替换为 "Linux-Unix", 如果不指定标识符, 那么默认是每行的第一个
```bash
$ sed 's/Linux/Linux-Unix/' thegeekstuff.txt
# Instruction Guides
1. Linux-Unix Sysadmin, Linux Scripting etc.
2. Databases - Oracle, mySQL etc.
3. Security (Firewall, Network, Online Security etc)
4. Storage in Linux-Unix
5. Productivity (Too many technologies to explore, not
much time available)
#  Additional FAQS
6. Windows- Sysadmin, reboot etc.
```

示例2. `s//g` 替换所有
```bash
$ sed 's/Linux/Linux-Unix/g' thegeekstuff.txt
# Instruction Guides
1. Linux-Unix Sysadmin, Linux-Unix Scripting etc.
2. Databases - Oracle, mySQL etc.
3. Security (Firewall, Network, Online Security etc)
4. Storage in Linux-Unix
5. Productivity (Too many technologies to explore, not
much time available)
#  Additional FAQS
6. Windows- Sysadmin, reboot etc.
```

示例3. `s//2` 替换第2个匹配的字符串
```bash
$ sed 's/Linux/Linux-Unix/2' thegeekstuff.txt
# Instruction Guides
1. Linux Sysadmin, Linux-Unix Scripting etc.
2. Databases - Oracle, mySQL etc.
3. Security (Firewall, Network, Online Security etc)
4. Storage in Linux
5. Productivity (Too many technologies to explore, not
much time available)
#  Additional FAQS
6. Windows- Sysadmin, reboot etc.
```

示例4. `s//gpw` 替换全部, 变动的行打印并输出到指定文件
```bash
$ sed -n 's/Linux/Linux-Unix/gpw output' thegeekstuff.txt
1. Linux-Unix Sysadmin, Linux-Unix Scripting etc.
4. Storage in Linux-Unix

$ cat output
1. Linux-Unix Sysadmin, Linux-Unix Scripting etc.
4. Storage in Linux-Unix
```

示例5. "-" 模式匹配, 从"-"往后全部删除(替换为空字符)
```bash
$ sed '/\-/s/\-.*//g' thegeekstuff.txt
# Instruction Guides
1. Linux Sysadmin, Linux Scripting etc.
2. Databases
3. Security (Firewall, Network, Online Security etc)
4. Storage in Linux
5. Productivity (Too many technologies to explore, not
much time available)
#  Additional FAQS
6. Windows
```

示例6: 删除每行的最后 n个字符
```bash
$ sed 's/...$//' thegeekstuff.txt
# Instruction Gui
1. Linux Sysadmin, Linux Scripting e
2. Databases - Oracle, mySQL e
3. Security (Firewall, Network, Online Security e
4. Storage in Li
5. Productivity (Too many technologies to explore, not
much time availab
#  Additional F
6. Windows- Sysadmin, reboot e
```

示例7: 删除注释行
```bash
$  sed -e 's/#.*//' thegeekstuff.txt

1. Linux Sysadmin, Linux Scripting etc.
2. Databases - Oracle, mySQL etc.
3. Security (Firewall, Network, Online Security etc)
4. Storage in Linux
5. Productivity (Too many technologies to explore, not much time available)

6. Windows- Sysadmin, reboot etc.
8. Eliminate Comments and Empty Lines Using sed
```

示例8: 多个命令, 以 `;` 分隔, 第一个命令删除注释行; 第二个命令删除空行
```bash
$ sed -e 's/#.*//;/^$/d'  thegeekstuff.txt
1. Linux Sysadmin, Linux Scripting etc.
2. Databases - Oracle, mySQL etc.
3. Security (Firewall, Network, Online Security etc)
4. Storage in Linux
5. Productivity (Too many technologies to explore, not
much time available)
6. Windows- Sysadmin, reboot etc.
```

示例9: 删除 HTML 标签
```bash
$ sed -e 's/<[^>]*>//g'
This <b> is </b> an <i>example</i>.
This  is  an example.
```

更多:
- [Unix Sed Tutorial: Find and Replace Text Inside a File Using RegEx](http://www.thegeekstuff.com/2009/09/unix-sed-tutorial-replace-text-inside-a-file-using-substitute-command/)
- [Advanced Sed Substitution Examples](http://www.thegeekstuff.com/2009/10/unix-sed-tutorial-advanced-sed-substitution-examples/)

# 22. Awk介绍-打印例子
`awk` 是一种编程语言，可以轻松处理结构化数据和生成格式化的报告

`awk` 主要用于模式扫描和处理。 它搜索一个或多个文件以查看它们是否包含与指定模式匹配的行，然后执行关联的操作

一些主要功能:
- `awk` 将文件视为记录和字段
- `awk` 像常用的编程语言一样, `awk` 有变量, 条件和循环
- `awk` 具备算术和字符串运算符
- `awk` 可以生成格式化的报告
- `awk` 从文件或者标准输入读取, 输出内容到标准输出. 仅适合文本文件

语法:
```bash
awk '/search pattern1/ {Actions}    
     /search pattern2/ {Actions}' file
```
讲解:
- `search pattern` 一个正则表达式
- `Actions` 要执行的语句
- 可以有多个 `search pattern` 和 `Actions`
- `file` 待处理的文件
- `''` 单引号把语句环绕是为了避免 shell 被特殊字符中断

Awk 工作方式:
- 一次只处理一行
- 对于每一行, 它将按照给定的处理命令顺序, 按照指定的模式进行匹配和处理
- 如果没有匹配到, 该行将不会做任何处理
- 如果没有给 `search pattern`, 那么 awk 将对每一行都执行给定的操作
- 如果没有给 `action`, 默认操作是:打印所有匹配到的行
- 如果 `action` 是 `{}`, 将不会执行任何操作, 也不会执行默认的打印操作
- `action` 中的每个语句都应该使用 `;` 分号分隔开

好, 开始准备测试的文件:`employee.txt`
```bash
$ cat employee.txt
100  Thomas  Manager    Sales       $5,000
200  Jason   Developer  Technology  $5,500
300  Sanjay  Sysadmin   Technology  $7,000
400  Nisha   Manager    Marketing   $9,500
500  Randy   DBA        Technology  $6,000
```

示例1:  awk 默认的行为:打印所有的行
```bash
$ awk '{print;}' employee.txt
100  Thomas  Manager    Sales       $5,000
200  Jason   Developer  Technology  $5,500
300  Sanjay  Sysadmin   Technology  $7,000
400  Nisha   Manager    Marketing   $9,500
500  Randy   DBA        Technology  $6,000
```
匹配模式没给, 所有所有行都会被处理      
`print` 没有任何参数将整行都打印

示例2: 打印匹配的行
```bash
$ awk '/Thomas/
> /Nisha/' employee.txt
100  Thomas  Manager    Sales       $5,000
400  Nisha   Manager    Marketing   $9,500
```
上面的例子包含了2个匹配: 'Thomas' 或 'Nisha' 

示例3: 打印特定的字段
```bash
$ awk '{print $2,$5;}' employee.txt
Thomas $5,000
Jason $5,500
Sanjay $7,000
Nisha $9,500
Randy $6,000

$ awk '{print $2,$NF;}' employee.txt
Thomas $5,000
Jason $5,500
Sanjay $7,000
Nisha $9,500
Randy $6,000
```
`awk` 有一些内置变量. 对应每行的记录, 都将以默认的分隔符:"空白字符"进行切分.     
然后存储到 `$n` 变量里.
假如一行有4个列: 
- `$1 $2 $3 $4` 1~4列存储的信息
- `$0` 代表整行
- `NF` 代表最后一列

前置和后置动作 模式
语法:
```bash
BEGIN { Actions }
{ACTION} # Action for everyline in a file
END { Actions }
```
- `#` 注释文本
- `BEGIN { Actions }` 在读取行数据之前将会被执行(前置动作) 
- `END { Actions }` 在读取行数据之后将会被执行(后自动做)

示例4: 打印表头和结束文案
```bash
$ awk 'BEGIN {print "Name\tDesignation\tDepartment\tSalary";}
> {print $2,"\t",$3,"\t",$4,"\t",$NF;}
> END{print "Report Generated\n--------------";
> }' employee.txt
Name	Designation	Department	Salary
Thomas 	 Manager 	 Sales 	 $5,000
Jason 	 Developer 	 Technology 	 $5,500
Sanjay 	 Sysadmin 	 Technology 	 $7,000
Nisha 	 Manager 	 Marketing 	 $9,500
Randy 	 DBA 	 Technology 	 $6,000
Report Generated
--------------
```

示例5: 打印员工ID大于200的员工
```bash
$ awk '$1 >200' employee.txt
300  Sanjay  Sysadmin   Technology  $7,000
400  Nisha   Manager    Marketing   $9,500
500  Randy   DBA        Technology  $6,000
```

示例6: 打印 Technology 部门的员工
```bash
$ awk '$4 ~/Technology/' employee.txt
200  Jason   Developer  Technology  $5,500
300  Sanjay  Sysadmin   Technology  $7,000
500  Randy   DBA        Technology  $6,000
```

示例7: 打印 Technology 员工数量
```bash
$ awk 'BEGIN { count=0;}
> $4 ~ /Technology/ { count++; }
> END { print "Number of employees in Technology Dept =",count;}' employee.txt
Number of employees in Tehcnology Dept = 3
```

更多讨论和例子:
- [Awk Introduction Tutorial – 7 Awk Print Examples](http://www.thegeekstuff.com/2010/01/awk-introduction-tutorial-7-awk-print-examples/)
- [Awk Tutorial: Understand Awk Variables with 3 Practical Examples](http://www.thegeekstuff.com/2010/01/awk-tutorial-understand-awk-variables-with-3-practical-examples/)
- [8 Powerful Awk Built-in Variables – FS, OFS, RS, ORS, NR, NF, FILENAME, FNR](http://www.thegeekstuff.com/2010/01/8-powerful-awk-built-in-variables-fs-ofs-rs-ors-nr-nf-filename-fnr/)
- [7 Powerful Awk Operators Examples (Unary, Binary, Arithmetic, String, Assignment, Conditional, Reg-Ex Awk Operators)](http://www.thegeekstuff.com/2010/02/unix-awk-operators/)
- [AWK Arrays Explained with 5 Practical Examples](http://www.thegeekstuff.com/2010/03/awk-arrays-explained-with-5-practical-examples/)

# 23. Vim编辑器导航基础
导航是文本编辑的重要组成部分. 为了提高效率，您应该在编辑器中注意所有可能的导航快捷方式

`vi / vim` 里的 8种 导航选项:
1. 行导航
2. 屏幕导航
3. 单词导航
4. 特殊导航
5. 段落导航
6. 搜索导航
7. 代码导航
8. 命令行导航 

### 行导航
4种移动方向:
- `k` - 向上
- `j` - 向下
- `i` - 向右
- `h` - 向左

多次移动位置可以在前面加上数字, 比如: `10j` 表示向下移动10行

行内移动:
- `0` - 当前行第一个位置
- `^` - 当前行第一个非空白字符处
- `$` - 但启航末尾位置
- `g_` - 当前行最后一个非空白字符处

### 屏幕导航
- `H` - 当前屏幕的第一行 (head)
- `M` - 当前屏幕中间的一行 (middle)
- `L` - 当前屏幕最后一行 (last)
- `ctrl+f` - 跳转到往前一屏 (forward)
- `ctrl+b` - 跳转到往后一屏 (backwards)
- `ctrl+d` - 跳转到往下半屏位置 (down half)
- `ctrl+u` - 跳转到往上屏位置 (up half)

### 特殊导航
- `N%` - 跳转到文件 N% 百分比位置
- `NG` - 跳转到 N行 位置
- `G` - 文件最后
- `" - 最后关闭文件时, 转到 NORMAL 模式的位置(上次离开文件时位置)
- `^ - 最后关闭文件时, 转到 INSERT 模式的位置(文件最后一次插入字符的位置)
- `gg` - 文件开始位置 

### 单词导航
- `w` - 跳转到下一个 `word`
- `W` - 跳转到下一个 `WORD` 
- `b` - 跳转到上一个 `word`
- `B` - 跳转到上一个 `WORD`
- `e` - 当前 `word` 末尾
- `E` - 当前 `WORD` 末尾

`word` 由一系列字母,数字和下划线组成     
`WORD` 由一系列非空白字符组成, 用空格分隔    

两个的区别比如:
- `192.168.1.1` – 一个 WORD
- `192.168.1.1` – 7个 words

### 段落导航
- `{` - 当前段落开始处, 多次按下时, 跳转到上一段落开始处
- `}` - 当前段路结束处, 多次按下时, 跳转到下一段落开始处

### 搜索导航
- `/pattern` - 按正则模式搜索并跳转到 下一个 匹配的位置; 按 `n` 跳转到下个出现的位置, 按 `shift+n` 上个出现的位置
- `?pattern` - 按正则模式搜索并跳转到 上一个 匹配的位置
- `*` - 按光标当前 `word` 搜索并调整到 下一个 匹配的位置
- `#` - 按光标当前 `word` 搜索并调整到 上一个 匹配的位置

### 代码导航
- `%` - 括号配对, 寻找括号的另一半; 比如:`{}`, `[]`, `()`

### 命令行导航
- `:n` - 命令模式下, 跳转到第 n 行
- `vim +10 /etc/passwd` - 打开文件并跳转到第 10 行位置
- `vim +/install README` - 打开文件并跳转到第一次匹配的 `install` 位置119.128.112.160
- `vim +?bug README` - 打开文件跳转到最后一次出现的 `bug` 的位置

更多讨论和例子:
- [8 Essential Vim Editor Navigation Fundamentals](http://www.thegeekstuff.com/2009/03/8-essential-vim-editor-navigation-fundamentals/)
- [Vim search and replace – 12 powerful find and replace examples](http://www.thegeekstuff.com/2009/04/vi-vim-editor-search-and-replace-examples/)
- [How To Add Bookmarks Inside Vim Editor](http://www.thegeekstuff.com/2009/02/how-to-add-bookmarks-inside-vi-and-vim-editor/)
- [Vi and Vim Macro Tutorial: How To Record and Play](http://www.thegeekstuff.com/2009/01/vi-and-vim-macro-tutorial-how-to-record-and-play/)
- [Vim Editor: How to Correct Spelling Mistakes Automatically](http://www.thegeekstuff.com/2009/03/vim-editor-how-to-correct-spelling-mistakes-automatically/)

# 24. Chmod命令
3种角色:
- `u` 用户 
- `g` 用户组
- `o` 其他
- `a` 代表所有的3种角色

3种全新:
- `r` 读权限 (4)
- `w` 写权限 (2)
- `x` 可执行权限 (1)

如果不了解 linux 文件属性, 请看这里:[鸟哥私房菜 - Linux文件属性](http://cn.linux.vbird.org/linux_basic/0210filepermission.php#filepermission_perm)

示例:
```bash
# 1. 给 文件/文件夹 加单个权限
$ chmod u+x filename

# 2. 给 文件/文件夹 加多个权限
$ chmod u+r,g+x filename

# 3. 删除权限
$ chmod u-rx filename

# 4. 给所有角色加权限
$ chmod a+x filename

# 5. 同步权限
$ chmod --reference=file1 file2

# 6. 目录递归设置权限
$ chmod -R 755 directory-name/

# 7. 给所有子目录设置可执行权限(如果有多个子目录和文件同时存在, 仅目录会设置可执行权限)
# 注意:如果文件的 `go` 角色都已经有执行权限了, 那么 `u` 角色也将会被设置为可执行权限
$ chmod u+X *
```

更多:
- [7 Chmod Command Examples for Beginners](http://www.thegeekstuff.com/2010/06/chmod-command-examples/)
- [Beginners Guide to File and Directory Permissions ( umask, chmod, read, write, execute )](http://www.thegeekstuff.com/2010/04/unix-file-and-directory-permissions/)

# 25. Tail命令 多个文件查看
通常我们动态的查看日志都是直接使用命令:`tail -f log_file`, 而如果想看两个文件的呢, 那么开2个终端不就好了么?

第一种方式, 自己做个脚本:
```bash
$ vi multi-tail.sh
#!/bin/sh
# When this exits, exit all back ground process also.
trap 'kill $(jobs -p)' EXIT
# iterate through the each given file names,
for file in "$@"
do
     # show tails of each in background.
     tail -f $file &
done

# wait .. until CTRL+C
wait
```
然后使用: `./multi-tail.sh error_log access_log`

第二种方式: 标准的 tail 命令方式
```bash
$ tail -f /var/log/syslog -f /var/log/auth.log
```
更多: [3 Methods To View tail -f output of Multiple Log Files in One Terminal](http://www.thegeekstuff.com/2009/09/multitail-to-view-tail-f-output-of-multiple-log-files-in-one-terminal/)

# 26. Less命令 
`less` 命令主要用于文件浏览 (而不是使用编辑器打开并查看)

`less` 和 `more` 命令类似, 但是比 `more` 命令更加强大, 支持 往前/往后 查看; 而且 `less` 不是整个文件全部加载的, 所以在查看大文件的时候比较有用;

搜索导航:(正向)
- `/pattern` - 按正则 `pattern` 搜索并跳转到 下一个 出现的位置
- `n` - 下一个 匹配(上次的`pattern`)的位置
- `N` - 上一个 匹配的位置

逆向导航:
- `?pattern` - 按正则 `pattern` 搜索并跳转到 上一个 出现的位置
- `n` - 上一个 匹配(上次的`pattern`)的位置
- `N` - 下一个 匹配的位置

屏幕导航:
- `CTRL + F` - 往下 一屏幕
- `CTRL + B` - 往上 一屏幕
- `CTRL + D` - 往下 半屏幕
- `CTRL + U` - 往上 半屏幕
- `空格` - 往下 一屏幕(常用)

行导航:
- `j` - 往下 一行 (同 `↑`)
- `k` - 往上 一行 (同 `↓`)
- `20j` - 往下 20行
- `20k` - 往上 20行
- `CTRL+G` - 显示当前文件名以及行，字节和百分比统计信息

其他导航:
- `G` - 文件最后位置
- `gg` - 文件开始位置
- `q` 或 `ZZ` - 退出 `less`

在 `less` 查看中模拟 `tail -f`
- `F` - 查看过程中, 按下 `F` 就可以达到类似 `tail -f` 动态查看日志的效果

其他有用的选项:
- `v` - 使用默认的编辑器编辑当前文件
- `h` - 帮助文档(查查手册之类的很有用)
- `&pattern` - 仅展示匹配的行

标记导航:
- `ma` - 标记当前位置为字母 `a`
- `a - 调整到标记 `a` 的位置

多个文件查看:
方式1:文件名作为参数
```bash
$ less file1 file2
```
方式2: 使用命令模式打开另个文件
```bash
$ less file1
:e file2
```

多个文件模式下: 切换文件
- `:n` - 下一个文件
- `:p` - 上一个文件

更多信息:
- [Less Command: 10 Tips for Effective Navigation](http://www.thegeekstuff.com/2010/02/unix-less-command-10-tips-for-effective-navigation/)
- [Open & View 10 Different File Types with Linux Less Command](http://www.thegeekstuff.com/2009/04/linux-less-command-open-view-different-files-less-is-more/)

# 27. Wget例子 
`wget` 是在网络上下载文件的最佳选择

10多个实用例子:
```bash
#示例1: 单个文件下载, 存储到当前目录
$ wget http://www.openss7.org/repos/tarballs/strx25-0.9.2.1.tar.bz2

# 示例2: 下载后改名
$ wget -O taglist.zip http://www.vim.org/scripts/download_script.php?src_id=7701

# 示例3: 控制下载速度
$ wget --limit-rate=200k http://www.openss7.org/repos/tarballs/strx25-0.9.2.1.tar.bz2

# 示例4: 断点续传支持(大文件适用)
$ wget -c http://www.openss7.org/repos/tarballs/strx25-0.9.2.1.tar.bz2

# 示例5: 后台下载 (大文件合适)
$ wget -b http://www.openss7.org/repos/tarballs/strx25-0.9.2.1.tar.bz2
Continuing in background, pid 1984.
Output will be written to 'wget-log'.

# 示例6: 伪装 User-Agent 选项
$ wget --user-agent="Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9.0.3) Gecko/2008092416 Firefox/3.0.3" URL-TO-DOWNLOAD

# 示例7: 检查下载链接是否可用 (200 表示可用)
$ wget --spider download-url
Spider mode enabled. Check if remote file exists.
HTTP request sent, awaiting response... 200 OK
Length: unspecified [text/html]
Remote file exists and could contain further links,
but recursion is disabled -- not retrieving.

# 示例5: 设置重试次数 (默认重试20次)
$ wget --tries=75 DOWNLOAD-URL

# 示例6: 批量下载
$ cat > download-file-list.txt
URL1
URL2
URL3
URL4
$ wget -i download-file-list.txt

# 示例7: 下载整个网站
$ wget --mirror -p --convert-links -P ./LOCAL-DIR WEBSITE-URL
# –mirror : 开启镜像模式
# -p : 下载所有可用的文件
# –convert-links : 下载之后链接转换为本地链接
# -P ./LOCAL-DIR : 指定目录存储所有文件

# 示例8: 排除指定类型文件
$ wget --reject=gif WEBSITE-TO-BE-DOWNLOADED

# 示例9: 日志信息输出到文件
$ wget -o download.log DOWNLOAD-URL

# 示例10: 文件超过指定大小, 则放弃下载 (仅适用于递归下载)
$ wget -Q5m -i FILE-WHICH-HAS-URLS

# 示例11: 仅下载指定类型文件
$ wget -r -A.pdf http://url-to-webpage-with-pdfs/

# 示例12: FTP 下载
$ wget ftp-url
$ wget --ftp-user=USERNAME --ftp-password=PASSWORD DOWNLOAD-URL
```
更多参考:
- [Wget Download Guide With 15 Examples](http://www.thegeekstuff.com/2009/09/the-ultimate-wget-download-guide-with-15-awesome-examples/)

---
其他参考：
- [Linux 101 Hacks 官网 - The Geek Stuff](http://www.thegeekstuff.com/)
- [grep 命令系列：grep 中的正则表达式](https://linux.cn/article-6941-1.html)
- [Linux Shell 1>/dev/null 2>&1 含义](http://blog.csdn.net/ithomer/article/details/9288353)

