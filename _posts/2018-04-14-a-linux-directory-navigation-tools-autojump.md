---
layout: post
title: "Linux目录快速切换工具之:autojump"
tagline: ""
description: "对于经常使用控制台的人来说绝对是一大利器!"
date: '2018-04-14 22:19:30 +0800'
category: linux
tags: autojump linux
---
> {{ page.description }}

# 安装
Centos/Redhat上安装autojump:
```bash
# 安装
$ sudo yum -y install autojump
```

放入 `~/.bashrc` 文件最后位置
```bash
$ vim ~/.bashrc

. /usr/share/autojump/autojump.bash
```

相当于: `source /usr/share/autojump/autojump.bash`

然后重新加载文件:
```bash
$ source ~/.bashrc
```

# 使用
用法: `j keyword`

`keyword` 为目录关键词, 可以模糊匹配

在使用 `cd path` 之后会自动记录到库里, 使用次数越多, 优先级越高

`/usr/share/autojump/autojump.bash` 内置了几个方法, 常用的当然就是: `j` 


---
参考：
- [linux 超级方便的目录命令行工具：autojump](https://vastxiao.github.io/article/2017/04/14/Linux/autojump_info/)
- [autojump报错:Please source the correct autojump file in your...](https://github.com/wting/autojump/issues/488)

