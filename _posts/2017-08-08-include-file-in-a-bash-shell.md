---
layout: post
title: "Shell脚本嵌入另一个Shell脚本"
tagline: ""
description: "Shell脚本里嵌入另一个Shell脚本，关键是环境变量是共享的！"
date: '2017-08-08 22:46:02 +0800'
category: linux
tags: linux shell
---
> {{ page.description }}

# bash嵌套
今天把 Jenkins 部署的 Shell 脚本重构了一下，发现好多都是重复的操作，如果公共的地方加点东西，那么全部都得修改一遍，所以灵机一动，还真有方便的法子！

重复的代码就要重构，做成公共的，方便别人调用！关键是改一个地方，所以调用的地方都生效！

Shell 脚本里执行另一个脚本直接使用 `sh` 执行即可，但是环境变量是否能共享呢？

试过就知道了，答案是不能！当然也可以以参数形式传递过去，但是有更方便的方法：`source`

这就好比直接把代码嵌入到当前脚本一样了，前面定义的变量也是可以直接使用的，这点尤其重要！

语法：
```bash
# 引入一个可执行的 shell 文件
source FILE

# 另一种用法
. FILE
```
两个是一样的效果！

# source
`source` 一般都是修改了某环境文件后，需要及时生效是使用的
```bash
# 查询手册
$ help source
source: source filename [arguments]
    Execute commands from a file in the current shell.

    Read and execute commands from FILENAME in the current shell.  The
    entries in $PATH are used to find the directory containing FILENAME.
    If any ARGUMENTS are supplied, they become the positional parameters
    when FILENAME is executed.

    Exit Status:
    Returns the status of the last command executed in FILENAME; fails if
    FILENAME cannot be read.
```
这里引入的文件即使没有可执行权限一样可以执行。

---
参考：
- [Shell 文件包含](http://wiki.jikexueyuan.com/project/shell-tutorial/shell-file-contains.html)
- [How to include file in a bash shell script](https://stackoverflow.com/questions/10823635/how-to-include-file-in-a-bash-shell-script)

