---
layout: post
title: "Shell流程控制：if 分支结构"
tagline: ""
date: '2017-05-20 14:18:52 +0800'
category: linux
tags: if shell linux
---
> Shell流程控制：if 分支结构

# shell 中的判断：if
类似各个编程语言里的 if 判断语句，不过区别也是很大。shell 脚本里的 if 提供了更多的扩展判断，比如:字符串表达式、整型表达式、文件表达式等

# 示例
```bash
x=5
if [ $x = 5 ]; then
    echo "x equals 5."
else
    echo "x does not equal 5."
fi
```

# 测试 test
经常与 if 一块使用的命令是 test。这个 test 命令执行各种各样的检查与比较。 它有两种等价模式：    
`test expression` 和 `[ expression ]`   
这里的 expression 是一个表达式，其执行结果是 true 或者是 false。当表达式为真时，这个 test 命令返回一个零 退出状态，当表达式为假时，test 命令退出状态为1。

# 字符串表达式

| 表达式 | 如果为真... |
| ---- | ---- |
| string | string 不为 null。|
| -n string | 字符串 string 的长度大于零。|
| -z string	| 字符串 string 的长度为零。|
| string1 = string2 <br/> string1 == string2 | string1 和 string2 相同. 单或双等号都可以，不过双等号更受欢迎。|
| string1 != string2 | string1 和 string2 不相同。|
| string1 > string2 | sting1 排列在 string2 之后。|
| string1 < string2 | string1 排列在 string2 之前。|

**注意:** 当与 test 一块使用的时候，这个 > 和 <表达式操作符必须用引号引起来（或者是用反斜杠转义）。如果不这样，它们会被 shell 解释为重定向操作符，造成潜在地破坏结果。

# 整型表达式

| 表达式 | 如果为真... |
| ----- | ------ |
| integer1 -eq integer2  | integer1 等于 integer2. |
| integer1 -ne integer2  | integer1 不等于 integer2. |
| integer1 -le integer2  | integer1 小于或等于 integer2. |
| integer1 -lt integer2  | integer1 小于 integer2. |
| integer1 -ge integer2  | integer1 大于或等于 integer2. |
| integer1 -gt integer2  | integer1 大于 integer2. |

# 文件表达式

| 表达式 | 如果为真 |
| ----- | ------ |
| file1 -ef file2 | file1 和 file2 拥有相同的索引号（通过硬链接两个文件名指向相同的文件）。 |
| file1 -nt file2 | file1新于 file2。 |
| file1 -ot file2 | file1早于 file2。 |
| -b file | file 存在并且是一个块（设备）文件。 |
| -c file | file 存在并且是一个字符（设备）文件。 |
| -d file | file 存在并且是一个目录。 |
| -e file | file 存在。 |
| -f file | file 存在并且是一个普通文件。 |
| -g file | file 存在并且设置了组 ID。 |
| -G file | file 存在并且由有效组 ID 拥有。 |
| -k file | file 存在并且设置了它的“sticky bit”。 |
| -L file | file 存在并且是一个符号链接。 |
| -O file | file 存在并且由有效用户 ID 拥有。 |
| -p file | file 存在并且是一个命名管道。 |
| -r file | file 存在并且可读（有效用户有可读权限）。 |
| -s file | file 存在且其长度大于零。 |
| -S file | file 存在且是一个网络 socket。 |
| -t fd   | fd 是一个定向到终端／从终端定向的文件描述符 。 这可以被用来决定是否重定向了标准输入／输出错误。 |
| -u file | file 存在并且设置了 setuid 位。 |
| -w file | file 存在并且可写（有效用户拥有可写权限）。 |
| -x file | file 存在并且可执行（有效用户有执行／搜索权限）。 |

# 更现代的版本(支持正则)
目前的 bash 版本包括一个复合命令，作为加强的 test 命令替代物。它使用以下语法：  
`[[ expression ]]`  
这里，类似于 test，expression 是一个表达式，其计算结果为真或假。这个`[[ ]]`命令非常 相似于 test 命令（它支持所有的表达式），但是增加了一个重要的新的字符串表达式：    
`string1 =~ regex`  
其返回值为真，如果 string1匹配扩展的正则表达式 regex。这就为执行比如数据验证等任务提供了许多可能性。

# (( )) - 为整数设计
除了 [[ ]] 复合命令之外，bash 也提供了 (( )) 复合命名，其有利于操作整数。
(( ))被用来执行算术真测试。如果算术计算的结果是非零值，则一个算术真测试值为真。
```bash
$ if ((1)); then echo "It is true."; fi
It is true.
$ if ((0)); then echo "It is true."; fi
$
```

# 组合表达式
多个表达式组合使用：AND，OR，和 NOT     

| 操作符 | if (或test) | [[ ]] 和 (( )) |
| ---- | ---- |
| AND | -a | && |
| OR | -o | \|\| |
| NOT | ! | ! |



参考：
- [流程控制：if 分支结构](http://wiki.jikexueyuan.com/project/linux-command/chap28.html)
- [快乐的 Linux 命令行](http://billie66.github.io/TLCL/)
