---
layout: post
title: "Bash数组教程与15个例子"
tagline: ""
description: "最近常用 Bash 的数组, 这里来个使用总结 (主要是搜到一篇文章感觉还不错, 整理一下)"
date: '2017-08-23 23:02:46 +0800'
category: linux
tags: shell linux tutorial
---
> {{ page.description }}

数组是包含多个值的集合, 这些值可能是相同类型或不同类型. 对数组的长度没有最大限制. 数组索引以零开头

注意每个例子中脚本的可执行权限, 比如: `chmod 755 arraymanipXX.sh`

# 1.声明数组并分配值
声明语法:`name[index]=value`     
- `name` 是数组的名字
- `index` 必须是>=0的整数(可以是表达式), 可以使用 `declare -a arrayname` 来显示声明一个数组

```bash
$ cat arraymanip01.sh
#! /bin/bash
Unix[0]='Debian'
Unix[1]='Red hat'
Unix[2]='Ubuntu'
Unix[3]='Suse'

echo ${Unix[1]}

$ ./arraymanip01.sh
Red hat
```
数组取值: `${name[index]}`

# 2.声明并初始化数组
语法:`declare -a arrayname=(element1 element2 element3)`
```bash
$ cat arraymanip02.sh
declare -a Unix=('Debian' 'Red hat' 'Red hat' 'Suse' 'Fedora');
Unix02=('Debian' 'Red hat' 'Red hat' 'Suse' 'Fedora');
```
显示和常用的声明和初始化方式

# 3.打印整个数组
如果 `index` 是 `@` 或 `*` 的话, 所有元素都会被引用到
```bash
$ cat arraymanip03.sh
declare -a Unix=('Debian' 'Red hat' 'Red hat' 'Suse' 'Fedora');
echo ${Unix[@]}

$ ./arraymanip03.sh
Debian Red hat Ubuntu Suse
```

# 4.数组的长度
语法: `${#arrayname[@]}`  其实就是变量的长度: `${#var}`
```bash
$ cat arraymanip04.sh
declare -a Unix=('Debian' 'Red hat' 'Suse' 'Fedora');
echo ${#Unix[@]} #数组长度
echo ${#Unix}    #第一个元素(Debian)的长度

$ ./arraymanip04.sh
4
6
```
# 5.数组中第n个元素的长度
语法: `${#arrayname[index]}`
```bash
$ cat arraymanip05.sh
Unix=('Debian' 'Red hat' 'Suse' 'Fedora');
echo ${#Unix[0]}   #第一个元素(Debian)的长度 等价于 ${#Unix}
echo ${#Unix[1]}   #第二个元素(Red hat)的长度

$ ./arraymanip05.sh
6
7
```

# 6.数组子集
```bash
$ cat arraymanip06.sh
Unix=('Debian' 'Red hat' 'Ubuntu' 'Suse' 'Fedora' 'UTS' 'OpenLinux');

echo ${Unix[@]:2}   # 第3个元素~最后所有元素
echo ${Unix[@]:3:2} # 第4个元素~往后2个元素(含第4)

$ ./arraymanip06.sh
Ubuntu Suse Fedora UTS OpenLinux
Suse Fedora
```

# 7.数组元素内容截取
其实就是变量内容截取一样的: `${var:start:length}`       
`var` 等同于数组里的某个元素 `Unix[index]`
```bash
$ cat arraymanip07.sh
#! /bin/bash
Unix=('Debian' 'Red hat' 'Ubuntu' 'Suse' 'Fedora' 'UTS' 'OpenLinux');
echo ${Unix[2]:0:4}

$ ./arraymanip07.sh
Ubun
```

# 8.搜索和替换数组元素
其实也是变量内容替换一样的: `${var/find/replace}`
```bash
$ cat arraymanip08.sh
#!/bin/bash
Unix=('Debian' 'Red hat' 'Ubuntu' 'Suse' 'Fedora' 'UTS' 'OpenLinux');

echo ${Unix[@]/Ubuntu/SCO Unix}
echo ${Unix[@]/e/E}

$ ./arraymanip08.sh
Debian Red hat SCO Unix Suse Fedora UTS OpenLinux
DEbian REd hat Ubuntu SusE FEdora UTS OpEnLinux
```

# 9.数组增加元素
```bash
$ cat arraymanip09.sh
#!/bin/bash

Unix=('Debian' 'Red hat' 'Ubuntu' 'Suse' 'Fedora' 'UTS' 'OpenLinux');
echo ${Unix[@]}  

Unix=("${Unix[@]}" "AIX" "HP-UX")   # 增加2个元素
echo ${Unix[@]}

Unix[20]=hello    # index 超过数组长度的自动追加到数组最后
echo ${Unix[@]}

$ ./arraymanip09.sh
Debian Red hat Ubuntu Suse Fedora UTS OpenLinux
Debian Red hat Ubuntu Suse Fedora UTS OpenLinux AIX HP-UX
Debian Red hat Ubuntu Suse Fedora UTS OpenLinux AIX HP-UX hello
```
所以 `var[index]` 可以用来替换或者增加数组元素

# 10.数组删除元素
```bash
$ cat arraymanip10.sh
#!/bin/bash
Unix=('Debian' 'Red hat' 'Ubuntu' 'Suse' 'Fedora' 'UTS' 'OpenLinux');
echo ${Unix[@]}

unset Unix[3]  # 删除第4个元素'Suse'

echo ${Unix[@]}

$ ./arraymanip10.sh
Debian Red hat Ubuntu Suse Fedora UTS OpenLinux
Debian Red hat Ubuntu Fedora UTS OpenLinux
```

# 11.删除整个数组
```bash
$ cat arraymanip11.sh
#!/bin/bash
Unix=('Debian' 'Red hat' 'Ubuntu' 'Suse' 'Fedora' 'UTS' 'OpenLinux');
echo ${#Unix[@]}

unset Unix  # 删除所有元素(清空数组)
echo ${#Unix[@]}

$ ./arraymanip11.sh
7
0
```

# 12.模式删除数组元素
把老的数组中的元素, 模糊匹配后替换为空(删除), 然后赋值给了新的数组
```bash
$ cat arraymanip12.sh
#!/bin/bash
declare -a Unix=('Debian' 'Red hat' 'Ubuntu' 'Suse' 'Fedora');
declare -a patter=( ${Unix[@]/Red*/} )
echo ${patter[@]}

$ ./arraymanip12.sh
Debian Ubuntu Suse Fedora
```

# 13.复制数组
```bash
$ cat arraymanip13.sh
#!/bin/bash
Unix=('Debian' 'Red hat' 'Ubuntu' 'Suse' 'Fedora' 'UTS' 'OpenLinux');
Linux=("${Unix[@]}")
echo ${Linux[@]}

$ ./arraymanip13.sh
Debian Red hat Ubuntu Fedora UTS OpenLinux
```

# 14.数组合并
```bash
$ cat arraymanip14.sh
#!/bin/bash
Unix=('Debian' 'Red hat' 'Ubuntu' 'Suse' 'Fedora' 'UTS' 'OpenLinux');
Shell=('bash' 'csh' 'jsh' 'rsh' 'ksh' 'rc' 'tcsh');

UnixShell=("${Unix[@]}" "${Shell[@]}")
echo ${UnixShell[@]}  # 打印合并后的数组
echo ${#UnixShell[@]} # 合并后数组的数量

$ ./arraymanip14.sh
Debian Red hat Ubuntu Suse Fedora UTS OpenLinux bash csh jsh rsh ksh rc tcsh
14
```

# 15.文件内容加载到数组中
```bash
$ cat logfile
Welcome
to
thegeekstuff
Linux
Unix

$ cat loadcontent.sh
#!/bin/bash
filecontent=( `cat "logfile" `)

for t in "${filecontent[@]}"
do
    echo $t
done
echo "Read file content!"

$ ./loadcontent.sh
Welcome
to
thegeekstuff
Linux
Unix
Read file content!
```

---
参考：
- [原文 - The Ultimate Bash Array Tutorial with 15 Examples](http://www.thegeekstuff.com/2010/06/bash-array-tutorial)
- [Working with Arrays in Linux Shell Scripting – Part 8](https://www.tecmint.com/working-with-arrays-in-linux-shell-scripting/)
- [shell数组小结 ](http://bbs.chinaunix.net/thread-1779167-1-1.html)
- [Shell变量(字符串)操作](https://xu3352.github.io/linux/2017/08/22/linux-shell-extracts-file-names-and-directory-names#使用-)

