---
layout: post
title: " Linux 101 Hacks 第九章:安装软件包"
tagline: ""
description: "Linux常用的几种软件包管理工具：`yum rpm apt-*` 以及 源码包的使用和示例"
date: '2017-10-20 14:22:18 +0800'
category: linux
tags: linux linux-command linux-101-hacks ebook
---
> {{ page.description }}

# 71.yum命令示例
安装，删除和更新软件包是Linux上的典型活动。 大多数Linux发行版提供了一些包管理器实用程序。 例如，apt-get，dpkg，rpm，yum等

在某些Linux发行版上，yum是默认的包管理器

`yum` 是 `Yellowdog Updater Modified` 的缩写

**示例1: yum 安装一个软件包**

安装语法：`yum install packagename`, 会自动解决(安装)依赖的软件包
```bash
$ yum install postgresql.x86_64
Resolving Dependencies
Install       2 Package(s)
Is this ok [y/N]: y
Running Transaction
Installing : postgresql-libs-9.0.4-5.fc15.x86_64  1/2
Installing : postgresql-9.0.4-5.fc15.x86_64       2/2
```

如果不想有交互的提示(每次都选择`y`)，可以这样使用:
```bash
$ yum -y install postgresql.x86_64
```

**示例2: yum 卸载一个软件包**
```bash
$ yum remove  postgresql.x86_64
Package postgresql.x86_64 0:9.0.4-5.fc15 will be erased
Is this ok [y/N]: y
Running Transaction
  Erasing    : postgresql-9.0.4-5.fc15.x86_64       1/1
```

**示例3: 升级一个已存在的软件包**
```bash
$ yum update postgresql.x86_64
```

**示例4: 使用关键词搜索待安装的软件包**

语法：`yum search keyword`
```bash
$ yum search firefox
Loaded plugins: langpacks, presto, refresh-packagekit
============== N/S Matched: firefox ======================
firefox.x86_64 : Mozilla Firefox Web browser
gnome-do-plugins-firefox.x86_64
mozilla-firetray-firefox.x86_64
mozilla-adblockplus.noarch : Mozilla Firefox extension
mozilla-noscript.noarch : Mozilla Firefox extension
```
这里子匹配了软件包的名称和概要信息，使用`search all`匹配所有信息

**示例5: 展示额外的信息**

语法：`yum info package`
```bash
$ yum info samba-common.i686
Loaded plugins: langpacks, presto, refresh-packagekit
Available Packages
Name        : samba-common
Arch        : i686
Epoch       : 1
Version     : 3.5.11
Release     : 71.fc15.1
Size        : 9.9 M
Repo        : updates
Summary     : Files used by both Samba servers and clients
URL         : http://www.samba.org/
License     : GPLv3+ and LGPLv3+
Description : Samba-common provides files necessary for
both the server and client
```

**更多**: [15 Linux Yum Command Examples – Install, Uninstall, Update Packages](http://www.thegeekstuff.com/2011/08/yum-command-examples/)

# 72.rpm命令示例
`RPM` 命令用于在Linux系统上安装，卸载，升级，查询，列出和检查RPM软件包

`RPM` 是 `RedHat Package Manager` 的缩写

使用root权限，您可以使用rpm命令和适当的选项来管理RPM软件包

**示例1: 使用 `rpm -ivh` 安装软件包**
```bash
$ rpm -ivh MySQL-client-3.23.57-1.i386.rpm
Preparing...################################### [100%]
   1:MySQL-client############################## [100%]
```
**参数详解**:
- `-i` - 安装软件包
- `-v` - 详细信息 
- `-h` - 解压的时候打印出哈希值

**MySQL-client-3.23.57-1.i386.rpm详解**:
- `MySQL-client` - 软件包名
- `3.23.57` - 版本号 
- `1` - 发布号
- `i386` - x86架构，32位

同样的，可以在在 `Debian` 使用 `dpkg`，`Solaris` 使用 `pkgadd`，`HP-UX` 使用 `depot` 来安装软件包

**示例2: 使用 `rpm -qa` 查询软件包**
```bash
# -q 表示查询；-a 表示全部已安装的
$ rpm -qa
cdrecord-2.01-10.7.el5
bluez-libs-3.7-1.1
setarch-2.0-1.1
.
.

# 可以配合 grep 过滤指定的关键词
$ rpm -qa | grep 'cdrecord'
```

**示例3: 使用 `rpm -q` 按包名(全名)指定查询**
```bash
$ rpm -q MySQL-client
MySQL-client-3.23.57-1

$ rpm -q MySQL
package MySQL is not installed
```

**示例4: 查询包名时按指定的格式打印**
```bash
$ rpm -qa --queryformat '%{name-%{version}-%{release} %{size}\n'
cdrecord-2.01-10.7 12324
bluez-libs-3.7-1.1 5634
setarch-2.0-1.1 235563
.
.
```

**示例5: 使用 `rpm -qf` 查询一个文件属于哪个软件包**
```bash
$ rpm -qf /usr/bin/mysqlaccess
MySQL-client-3.23.57-1
```

**示例6: 使用 `rpm -qdf` 查找软件包对应的文档**
```bash
# -d 表示文档
$ rpm -qdf /usr/bin/mysqlaccess
/usr/share/man/man1/mysql.1.gz
/usr/share/man/man1/mysqlaccess.1.gz
/usr/share/man/man1/mysqladmin.1.gz
/usr/share/man/man1/mysqldump.1.gz
/usr/share/man/man1/mysqlshow.1.gz
```

**示例7: 使用 `rpm -qip` 查询安装包的使用文档**
```bash
# -i 表示查看信息；-p 指定包名
$ rpm -qip MySQL-client-3.23.57-1.i386.rpm
Name        : MySQL-client Relocations: (not relocatable)
Version     : 3.23.57   Vendor: MySQL AB
Release     : 1         Build Date: Mon 09 Jun 2003
Install Date:           Build Host: build.mysql.com
Group       : Applications/Databases
Size        : 5305109   License: GPL / LGPL
Signature   : (none)
Packager    : Lenz Grimmer
URL         : http://www.mysql.com/
Summary     : MYSQL - Client
Description : This package is a standard MySQL client.
```

**示例8: 使用 `rpm -qlp` 列出软件包里的所有文件**
```bash
# -q 表示查询；-l 表示罗列包内文件列表；-p 指定包名
$ rpm -qlp ovpc-2.1.10.rpm
/usr/bin/mysqlaccess
/usr/bin/mysqldata
/usr/bin/mysqlperm
.
.
/usr/bin/mysqladmin
```

**示例9: 使用 `rpm -qRp` 查询包的所有依赖的软件包**
```bash
$ rpm -qRp MySQL-client-3.23.57-1.i386.rpm
/bin/sh
/usr/bin/perl
```

**更多**: [RPM Command: 15 Examples to Install, Uninstall, Upgrade, Query RPM Packages](http://www.thegeekstuff.com/2010/07/rpm-command-examples/)


# 73.apt-*  命令示例
基于Debian的系统（包括Ubuntu）使用`apt-*` 命令来管理命令行中的包

**示例1: 使用 `apt-cache search` 按包名进行搜索**
```bash
# 可以看出来是支持正则匹配了
$ apt-cache search ^apache2$
apache2 - Apache HTTP Server metapackage
```

**示例2: `dpkg -l` 查询软件包是否已经安装**
```bash
# 如果没有结果，表示没有安装
$ dpkg -l | grep -i apache
```

**示例3: `apt-get install` 安装软件包**
```bash
$ sudo apt-get install apache2
[sudo] password for ramesh:

The following NEW packages will be installed:
  apache2 apache2-mpm-worker apache2-utils
  apache2.2-common libapr1 libaprutil1 libpq5

0 upgraded, 7 newly installed, 0 to remove and 26 not upgraded.
```

**示例4: `apt-get remove` 卸载软件包**
```bash
$ sudo apt-get remove apache2

# 或者
$ sudo apt-get purge apache2
```

**更多**: [How To Manage Packages Using apt-get, apt-cache, apt-file and dpkg Commands ( With 13 Practical Examples )](http://www.thegeekstuff.com/2009/10/debian-ubuntu-install-upgrade-remove-packages-using-apt-get-apt-cache-apt-file-dpkg/)

# 74.源码包安装
有时候可能需要下载源码来进行安装一个软件

源码安装的时候，一般都会提供 `INSTALL` 或 `README` 文档的，建议都先阅读一下这两个文件

不过源码包安装比较烦人的一点就是如果遇到有依赖的时候，需要自己先把依赖的包安装好，大多同学这一步就会被搞得七晕八素的

**示例1: 下载和解压一个源码包**
```bash
$ tar xvfz application.tar.gz

$ tar xvfj application.tar.bz2
```
典型的源码包基本都是 `*.tar.gz` 或 `*.tar.bz2` 格式的

更多的可以看 [第六章的归档和压缩](https://xu3352.github.io/linux/2017/09/16/Linux-101-Hacks-Chapter-6-Archive-and-Compression)

**示例2: Configure编译前的配置**
```bash
$ cd application
$ ./configure --help

# 这一步一般可以配置很多参数，比如安装到那里，使用哪些参数进行配置等
$ ./configure
```
进入解压后的文件夹，查看配置帮助文档，然后使用默认选项进行配置

**示例3: Make and Install 编译和安装**
```bash
# 编译
$ make

# 编译后进行安装
$ make install
```


