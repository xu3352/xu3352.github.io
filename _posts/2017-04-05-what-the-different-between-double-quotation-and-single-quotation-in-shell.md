---
layout: post
title:  "双引号和单引号在shell中有什么不同？"
date:   2017-04-05 22:45:00 +0800
category: linux
tags: shell linux
---
> linux shell中 " "(双引号)与 ' '(单引号)的区别

```bash
    你在shell prompt（shell 提示）后面敲打键盘、直到按下enter的时候，你输入的文字就是command line（命令行）了，然后shell才会以进程方式执行你所提交的命令。但是，你又可知道：你在command line输入的每一个文字，对shell来说，有什么类别之分呢？

简单而言，command line的每一个charactor（字符）分为如下两种：
  *literal（文字）：也就是普通纯文字，对shell来说没有特殊功能。
  *meta（元字符）：对shell来说，具有特定功能的保留字。
literal没有什么好说的，凡是 abcd、123456 等这些“文字”都是literal。但是meta却常使我们困惑。事实上，前两章我们在command line中已碰到两个几乎每次都会碰到的meta：
   *IFS（交换字段分隔符）：由  三者之一组成（我们常用space）。
   *CR（回车键）：由产生。
IFS是用来拆分command line的每一个词（word）用的，因为shell command line是按词来处理的。而CR则是用来结束command line用的，这也是为何我们敲命令就会执行的原因。除了IFS和CR外，常用的meta还有：
= ：  设定变量。
$ ：  做变量或运算替换(请不要与 shell prompt 搞混了)。
> ：  重定向 stdout（标准输出standard out）。
< ：  重定向 stdin（标准输入standard in）。
|：   管道命令。
& ：  重定向 file descriptor （文件描述符），或将命令置于后台执行。
( )： 將其內的命令置于 nested subshell （嵌套的子shell）执行，或用于运算或命令替换。
{ }： 將其內的命令置于 non-named function（未命名函数） 中执行，或用在变量替换的界定范围。
; ：  在前一个命令结束时，而忽略其返回值，继续执行下一個命令。
&& ： 在前一個命令结束时，若返回值为 true，继续执行下一個命令。
|| ： 在前一個命令结束时，若返回值为 false，继续执行下一個命令。
!：   执行 history 列表中的命令
....
假如我们要在command line中将这些保留元字符的功能关闭的话，就要用到 quoting (引用)处理了。
在bash中，我们常用的 quoting有如下三种方法：
   *hard quote：''（单引号），凡在hard quote中的所有meta均被关闭。
   *soft quote：""（双引号），在soft quote中的大部分meta都会被关闭，但某些保留（如$）。
   *escape：\ （反斜线），只有紧接在escape（跳脱字符）之后的单一meta才被关闭。

下面的例子將有助于我们对 quoting 的了解：

       $ A=B C        # 空白键未被关闭，作为IFS 处理。
       $ C: command not found. 
       $ echo $A

       $ A="B C"        # 空白键已被关闭，仅作空白符号处理。
       $ echo $A
       B C

在第一次设定 A 变量时，由于空白键没有被关闭，command line 将被解读为：
* A=B 然后碰到，再执行 C 命令
在第二次设定 A 变量时，由于空白键置于 soft quote 中，因此被关闭，不再作为 IFS ：
* A=BC
事实上，空白键无论在 soft quote 还是在 hard quote 中，均会被关闭。Enter 鍵亦然：
       $ A='B
       > C
       > '
       $ echo "$A"
       B
       C

在上例中，由于  被置于 hard quote 当中，因此不再作为 CR 字符來处理。
这里的  单纯只是一个断行符号(new-line)而已，由于 command line 并沒得到 CR 字符，
因此进入第二個 shell prompt (PS2，以 > 符号表示)，command line 并不会结束，
直到第三行，我们输入的  并不在  hard quote 里面，因此并沒被关闭，
此时，command line 碰到 CR 字符，于是结束、交给 shell 來处理。

上例的  要是被置于 soft quote 中的话， CR 也会同样被关闭：
       $ A="B
       > C
       > "
       $ echo $A
       B C

然而，由于 echo $A 时的变量沒置于 soft quote 中，因此当变量替换完成后并作命令行重组时， 会被解释为 IFS ，而不是解释为 New Line 字符。

同样的，用 escape 亦可关闭 CR 字符：
       $ A=B\
       > C\
       >
       $ echo $A
       BC

上例中，第一个  跟第二个  均被 escape 字符关闭了，因此也不作为 CR 來处理，
但第三个  由于没有被跳脱，因此作为 CR 结束 command line 。
但由于  鍵本身在 shell meta 中的特殊性，在 \ 跳脱后面，仅仅取消其 CR 功能，而不会保留其 IFS 功能。

您或许发现光是一个  鍵所产生的字符就有可能是如下这些可能：
CR
IFS
NL(New Line)
FF(Form Feed)
NULL
...

至于 soft quote 跟 hard quote 的不同，主要是对于某些 meta 的关闭与否，以 $ 來作说明：
       $ A=B\ C
       $ echo "$A"
       B C
       $ echo '$A'
       $A

在第一个 echo 命令行中，$ 被置于 soft quote 中，將不被关闭，因此继续处理变量替换，
因此 echo 將 A 的变量值输出到屏幕，也就得到  "B C" 的结果。
在第二个 echo 命令行中，$ 被置于 hard quote 中，则被关闭，因此 $ 只是一个 $ 符号，
并不会用來作变量替换处理，因此结果是 $ 符号后面接一个 A 字母：$A 。

---------------------------------------------------------
练习与思考：以下两条命令输出的结果分别是什么？
       $ A=B\ C
       $ echo '"$A"'        # 最外面的是单引号
       $ echo "'$A'"        # 最外面的是双引号
```

参考:   
- [linux shell中的单引号与双引号的区别(看完就不会有引号的疑问了)](http://lspgyy.blog.51cto.com/5264172/1282107)    
- [双引号与单引号的区别到底是什么呢？？](http://bbs.chinaunix.net/thread-2076396-1-1.html)


