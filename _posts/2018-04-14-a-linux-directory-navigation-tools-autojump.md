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

# 补充
某些机器上执行报错:
```bash
$ j
  File "/usr/bin/autojump", line 100
    except OSError as ex:
                    ^
SyntaxError: invalid syntax
```

因为 `autojump` 需要 `python` 版本号不低于 `2.6`, 有时可能就得自己安装个高版本的 `python` 了

## python3 安装

一般都会选择安装最新的 `python3`, 然后2个版本共存, 不建议删除原来的 `python2`, 因为其他有依赖的, 比如 `yum`

所以安装好之后一般都是创建软链, 而且 `python3` 自带了 `pip3`

安装 `python3` 步骤:
```bash
# 1. 下载安装包(如果下载不了, 可以手动传)
$ wget https://www.python.org/ftp/python/3.6.1/Python-3.6.1.tgz

# 2. 安装目录创建
$ mkdir -p /usr/local/python3

# 3. 解压
$ tar -zxvf Python-3.6.1.tgz

# 4. 编译
$ cd Python-3.6.1
$ ./configure --prefix=/usr/local/python3

# 5. 执行安装
$ make && make install

# 6. 创建软链
$ ln -s /usr/local/python3/bin/python3 /usr/bin/python3
$ ln -s /usr/local/python3/bin/pip3 /usr/bin/pip3
```

查看 `python` 版本号:
```bash
$ python3 -V

Python 3.6.1
```

## 重新配置 autojump
简单配置一下就可以使用了

```bash
# 1. 修改 autojump 运行环境为 python3
# 查找命令位置
$ which autojump
/usr/bin/autojump

# 把第一行的 python 改为 python3 即可
$ vim /usr/bin/autojump
#!/usr/bin/env python3

# 2. 重新加载配置文件
# 查找配置文件位置(如果不是 /usr/share/autojump/autojump.bash 位置的话)
$ find / -name 'autojump.bash'
/etc/profile.d/autojump.bash

# 重新加载
source /etc/profile.d/autojump.bash
```

# 统计查看
在使用几次 `cd path` 之后, 然后就可以查看统计数据了

可以使用 `jumpstat` 或 `autojump --stat` 来查看每个路径的权重状态
```bash
$ jumpstat
1.0:	/usr/local/nginx/html/xx/xx
2.0:	/
23.0:	/usr/local/nginx
50.0:	/usr/local/nginx/html/xx/xx/xxx
Total key weight: 76. Number of stored paths: 4
```

然后权重也是可以手动调整的:(貌似有的不能调权重 `autojump --help`)
```
# 增加当前目录权重(这个值是要和总权重除的)
j -i 10

# 较少当前目录权重
j -d 10
```

---
参考：
- [linux 超级方便的目录命令行工具：autojump](https://vastxiao.github.io/article/2017/04/14/Linux/autojump_info/)
- [autojump报错:Please source the correct autojump file in your...](https://github.com/wting/autojump/issues/488)
- [Linux安装python3.6](https://www.cnblogs.com/kimyeee/p/7250560.html)

