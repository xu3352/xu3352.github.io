---
layout: post
title: "Linux 101 Hacks 第一章:强大的 CD 命令"
tagline: ""
description: "`cd` 是 `unix` 系统最常用的命令之一, 本章的6个 `cd` 命令技巧将极大的提高在终端切换目录的效率"
date: '2017-09-01 14:56:30 +0800'
category: linux
tags: linux linux-command linux-101-hacks ebook
---
> {{ page.description }}

# 1.使用CDPATH定义CD初始目录
如果非常频繁的使用 `cd` 到某个子目录中, 这个时候可以设置 `CDPATH` 环境变量来快速的切换目录, 而不需要给出父级目录的全路径了
```bash
$ pwd
/home/ramesh
$ cd mail
-bash: cd: mail: No such file or directory
# 默认会在当前目录查找 mail 目录, 如果没有, 则会报错

$ export CDPATH=/etc
$ cd mail
/etc/mail
# 设置CDPATH后, cd 会在当前和 /etc 目录下查找 mail 目录, 如果有重名的, 优先当前目录

$ pwd
/etc/mail
```
如果想永久生效, 可以在 `~/.bash_profile` 进行配置, 比如:
```bash
export CDPATH=.:~:/etc:/var
```

以下几种情况会很适用:
- Oracle DBA 通常工作目录都是在 $ORACLE_HOME, 所以可以设置:CDPATH=$ORACLE_HOME
- Unix 系统管理员常用目录一般为 /etc
- 开发者一般是自己的项目目录, 比如: /home/projects
- 后端用户默认的其实就是直接的 home 目录: `~` (默认的)

不过有个缺点, 就是在使用 `cd` 的时候, 按`tab`自动补齐时, 不能只能是当前目录的会补全, 差点以为设置这个不好使呢...

# 2.使用CD别名
想从一个层级很深的目录返回时, 通常需要使用: `cd ..` 或者 `cd ../../` 之类的很多次
```bash
$ mkdir -p
/tmp/very/long/directory/structure/that/is/too/deep

$ cd /tmp/very/long/directory/structure/that/is/too/deep
$ pwd
/tmp/very/long/directory/structure/that/is/too/deep

$ cd ../../../../
$ pwd
/tmp/very/long/directory/structure
```

这里有几种别名方式可以参考:     
第一种是使用 `..n`
```bash
alias ..="cd .."
alias ..2="cd ../.."
alias ..3="cd ../../.."
alias ..4="cd ../../../.."
alias ..5="cd ../../../../.."
```
第二种是使用 `...`
```bash
alias ..="cd .."
alias ...="cd ../.."
alias ....="cd ../../.."
alias .....="cd ../../../.."
alias ......="cd ../../../../.."
```
第三种是使用 `cdn`
```bash
alias cd1="cd .."
alias cd2="cd ../.."
alias cd3="cd ../../.."
alias cd4="cd ../../../.."
alias cd5="cd ../../../../.."
```
在看到这个 `ebook` 之前, 其实我已经使用了第二种方式了, 看个人习惯

# 3.一个命令实现 mkdir+cd 的效果
有时候创建一个文件夹之后, 总是会进入到新建的文件夹
```bash
$ mkdir -p /tmp/subdir1/subdir2/subdir3
$ cd /tmp/subdir1/subdir2/subdir3

$ pwd
/tmp/subdir1/subdir2/subdir3
```
可以在 `~/.bash_profile` 加个方法, 直接调用就可以了
```bash
$ vim ~/.bash_profile
function mkdircd () { 
    mkdir -p "$@" && eval cd "\"\$$#\"";
}
```
重新加载一般环境文件 `source ~/.bash_profile`, 这样就可以立马生效了
```bash
$ mkdircd /tmp/subdir1/subdir2/subdir3
$ pwd
/tmp/subdir1/subdir2/subdir3
```
原来还可以在 `~/.bash_profile` 这里定义方法, 然后控制台直接就可以调用了, 好神奇!!!

在我的认知里是可以做个脚本调用的, 但是能否达到效果的就不好说了

# 4.两个目录间切换
可使用 `cd -` 在最近使用的两个目录中进行切换
```bash
$ cd /tmp/very/long/directory/structure/that/is/too/deep
$ cd /tmp/subdir1/subdir2/subdir3

$ cd -
$ pwd /tmp/very/long/directory/structure/that/is/too/deep

$ cd -
$ pwd /tmp/subdir1/subdir2/subdir3

$ cd -
$ pwd /tmp/very/long/directory/structure/that/is/too/deep
```
这个倒是经常使用, 非常棒!

# 5.目录堆栈操作
可以使用目录堆栈把目录放进去, 以先进后出的形式获取目录:
- dirs : 展示目录堆栈
- pushd : 把目录 push 到堆栈里
- popd : 把目录从堆栈里移走, 并 `cd` 到目录里

```bash
$ dirs
~

$ mkdir /tmp/dir1
$ mkdir /tmp/dir2
$ mkdir /tmp/dir3

$ cd /tmp/dir1
$ pushd .
$ cd /tmp/dir2
$ pushd .
$ cd /tmp/dir3
$ pushd .

$ dirs
/tmp/dir3 /tmp/dir3 /tmp/dir2 /tmp/dir1
```
第一个目录是当前目录, 而目录堆栈实际是:
```bash
/tmp/dir3
/tmp/dir2
/tmp/dir1
```

使用 `popd` 取目录堆栈的目录
```bash
$ cd
$ popd
/tmp/dir3 /tmp/dir2 /tmp/dir1
$ popd
/tmp/dir2 /tmp/dir1
$ popd
/tmp/dir1
$ popd
-bash: popd: directory stack empty
```

# 6.自动更正错误的目录名称
使用 `shopt -s cdspell` 开启错误更正开关, 如果老是敲错目录名称的话, 这个就有帮助了
```bash
$ cd /etc/mall
-bash: cd: /etc/mall: No such file or directory

$ shopt -s cdspell

$ cd /etc/mall
/etc/mail
```

---
参考：
- [Linux 101 Hacks 官网 - The Geek Stuff](http://www.thegeekstuff.com)
