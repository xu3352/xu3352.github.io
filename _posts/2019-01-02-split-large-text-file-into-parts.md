---
layout: post
title: "将txt大文件切分成多个小文件"
keywords: "linux,split,file"
description: "将text大文件切分成多个小文件"
tagline: ""
date: '2019-01-02 17:48:34 +0800'
category: linux
tags: split linux
---
> {{ page.description }}

# 缘由

之前遇到个小需求: 把一个10w的 txt 的数据文件按每批 5000 条进行分组, 总共也就是20个小文件

想到 `head` + `tail` 好像就能搞定: 
```bash
# head + tail 分批, 5000条一批
head -5000 xxx.txt | tail -5000 > xxx_5k_1.txt
head -10000 xxx.txt | tail -5000 > xxx_5k_2.txt
head -15000 xxx.txt | tail -5000 > xxx_5k_3.txt
....
```

于是乎就拼接了 20 条命令行, 但是每行都手动改又麻烦了点, 后来就用 python 按模板生成:
```bash
$ python
Python 2.7.10 (default, Oct  6 2017, 22:29:07)
[GCC 4.2.1 Compatible Apple LLVM 9.0.0 (clang-900.0.31)] on darwin
Type "help", "copyright", "credits" or "license" for more information.
>>> for i in range(1, 21):
...     print("head -{} xxx.txt | tail -5000 > xxx_5k_{}.txt".format(i*5000, i))
...
head -5000 xxx.txt | tail -5000 > xxx_5k_1.txt
head -10000 xxx.txt | tail -5000 > xxx_5k_2.txt
head -15000 xxx.txt | tail -5000 > xxx_5k_3.txt
......
head -90000 xxx.txt | tail -5000 > xxx_5k_18.txt
head -95000 xxx.txt | tail -5000 > xxx_5k_19.txt
head -100000 xxx.txt | tail -5000 > xxx_5k_20.txt
```

然后拷贝出来直接执行就可以

shell 脚本也能按模板生成的, 只是先前不太熟悉(囧):
```bash
$ for i in {1..20}
for> do
for> echo "head -$((i*5000)) xxx.txt | tail -5000 > xxx_5k_${i}.txt"
for> done
```

或者一行也行:
```bash
$ for i in `seq 1 20`; do echo "head -$((i*5000)) xxx.txt | tail -5000 > xxx_5k_${i}.txt"; done
```

`注意`{:.warning}: 把 `echo` 和对应的双引号去掉, 直接就可以跑的, 模板也不用了


# shell脚本

后来寻思脚本也能搞呀, 于是就捣腾起来, 后来发现也没那么容易, 直接上脚本吧

*file_split.sh*
```bash
#!/bin/sh
#author:xu3352@gmail.com  
#desc: 按指定数量分批切割文件

echo "usage: ./file_split.sh filepath size"

FILE=$1
SIZE=$2

# 数据总条数, 去掉wc前面的空格
ROWS=`cat $FILE | wc -l | sed 's/ //g'`

# 向下取整数(floor)
FLOOR=$(( $ROWS/$SIZE  ))

# 向上取整数(ceil)
CEIL=`echo "if ( $ROWS%$SIZE  ) $ROWS/$SIZE+1 else $ROWS/$SIZE" | bc`

# 文件名前缀
FILE_PREFIX=${FILE%.*}

echo "file:$FILE prefix:$FILE_PREFIX size:$SIZE rows:$ROWS FLOOR:$FLOOR CEIL:$CEIL"

# 先按整除的迭代
for i in `seq 1 $FLOOR`; do
    LOAD_CNT=$((i*$SIZE))
    echo "head -$LOAD_CNT $FILE | tail -$SIZE > ${FILE_PREFIX}_${SIZE}_$i.txt"
    # execute split file
    head -$LOAD_CNT $FILE | tail -$SIZE > ${FILE_PREFIX}_${SIZE}_$i.txt
done

# 如果最后还有余数
if [[ $FLOOR != $CEIL ]]; then
    LEFT_ROWS=$(( $ROWS - $FLOOR*$SIZE ))
    echo "tail -$LEFT_ROWS $FILE > ${FILE_PREFIX}_${LEFT_ROWS}_$CEIL.txt"
    tail -$LEFT_ROWS $FILE > ${FILE_PREFIX}_${LEFT_ROWS}_$CEIL.txt
fi

```

使用方法:
```bash
$ ./file_split.sh xxx.txt 5000
```

**关键点**:
- 需要计算要分成多少个文件, 所以需要统计文件的总行数
- 需要考虑是否整除的情况, 例如文件总共10w条, 如果按 3w 条一个分组, 那么最后将剩余 1w 条
- 用文件名前缀+编号的方式来命名新生产的文件

# split命令

好, 重点来了, 话说人家自带了切分文件的工具呀... 而且强大到没朋友, 最开始的示例只需要:
```bash
$ split -l 5000 xxx.txt xxx_new_
```
切分后的文件为: *xxx_new_aa*, *xxx_new_ab*, *xxx_new_ac* ...

Linux下的使用文档: (Mac下的split选项不太一样, 参考 `man split`)
```
$ split --help
用法：split [选项]... [输入 [前缀]]
将输入内容拆分为固定大小的分片并输出到"前缀aa"、"前缀ab",...；
默认以 1000 行为拆分单位，默认前缀为"x"。如果不指定文件，或
者文件为"-"，则从标准输入读取数据。

长选项必须使用的参数对于短选项时也是必需使用的。
  -a, --suffix-length=N 指定后缀长度为N (默认为2)
  -b, --bytes=大小      指定每个输出文件的字节大小
  -C, --line-bytes=大小 指定每个输出文件里最大行字节大小
  -d, --numeric-suffixes    使用数字后缀代替字母后缀
  -l, --lines=数值      指定每个输出文件有多少行
      --verbose     在每个输出文件打开前输出文件特征
      --help        显示此帮助信息并退出
      --version     显示版本信息并退出

SIZE 可以是一个可选的整数，后面跟着以下单位中的一个：
KB 1000，K 1024，MB 1000*1000，M 1024*1024，还有 G、T、P、E、Z、Y。
```

有个小缺憾, 就是文件命名不太满意, 不带文件后缀, 默认以 *aa*, *ab*, *ac* ... 形式命名 
```bash
$ split -l 5000 xxx.txt xxx_new_

# 批量重命名
$ n=1; for f in xxx_new_*; do mv $f xxx_new_$n.txt; ((n+=1)); done
```

---
参考：
- [bash shell for循环1到100](https://blog.csdn.net/wzy_1988/article/details/8674535)
- [Convert a float to the next integer up as opposed to the nearest?](https://unix.stackexchange.com/questions/168476/convert-a-float-to-the-next-integer-up-as-opposed-to-the-nearest)
- [How to increment a variable in bash?](https://askubuntu.com/questions/385528/how-to-increment-a-variable-in-bash)
- [How to split a large text file into smaller files with equal number of lines?](https://stackoverflow.com/questions/2016894/how-to-split-a-large-text-file-into-smaller-files-with-equal-number-of-lines)
- [linux shell 字符串操作详解 （长度，读取，替换，截取，连接，对比，删除，位置）](https://blog.csdn.net/dongwuming/article/details/50605911)

