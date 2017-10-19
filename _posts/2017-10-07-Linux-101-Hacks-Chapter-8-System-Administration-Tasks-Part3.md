---
layout: post
title: "Linux 101 Hacks 第八章:系统管理任务(三:重启、远程同步、开机启动服务、防火墙)"
tagline: ""
description: ""
date: '2017-10-07 20:26:38 +0800'
category: linux
tags: linux linux-command linux-101-hacks ebook
---
> {{ page.description }}

# 65.sysrq安全重启Linux
神奇的 `sysrq` 组合键是Linux内核中的一套按键组合，允许用户执行一些列的命令，而不管系统当前状态如何

它通常用于恢复或者重启计算机，而不会破坏文件系统，按键组合通常为：

`Alt + SysRq + commandkey`

大多数系统中，`SysRq` 为 `printscreen` [按键](http://jingyan.baidu.com/article/48a42057ca55c1a9242504c7.html)

首先需要启用 `sysrq`：
```bash
$ echo "1" > /proc/sys/kernel/sysrq
```

`commandkey` 可用的列表：
- `k` - kill 所有当前虚拟控制台上运行的所有进程
- `b` - 立即重新启动系统，而不卸载分区或同步
- `e` - 将 SIGTERM 发送到除 init 之外的所有进程
- `m` - 控制台打印内存信息
- `i` - 将 SIGKILL 信号发送到除 init 之外的所有进程
- `r` - 将键盘从原始模式（X11等程序使用的模式）切换到XLATE模式
- `s` - 同步所有挂载的文件系统
- `t` - 将当前任务及其信息的列表输出到控制台
- `u` - 以只读模式重新安装所有挂载的文件系统
- `o` - 立即关闭系统
- `p` - 将当前寄存器和标志打印到控制台
- `0~9` - 设置控制台日志级别，控制哪些内核消息将打印到控制台
- `f` - 调用 oom_kill 来杀死需要更多内存的进程
- `h` - 显示帮助

同样可以是用另一种方式来触发操作：重启系统
```bash
$ echo "b" > /proc/sysrq-trigger
```

要执行挂起的Linux计算机的安全重新启动，请执行以下操作。 这将避免在下次重新启动期间的fsck。 即按下Alt + SysRq + 指定的字母。
- `r` - unRaw 
- `e` - tErminate
- `k` - kill
- `s` - Sync
- `u` - Unmount
- `b` - reBoot

更多: [Safe Reboot Of Linux Using Magic SysRq Key](http://www.thegeekstuff.com/2008/12/safe-reboot-of-linux-using-magic-sysrq-key/)

# 66.parted分区命令
***警告***:<font color="red">此命令慎用，如果你不知道他是做什么的话！磁盘上的数据丢了可就不好玩了</font>

`parted`是一个GNU实用程序，用于操纵硬盘分区，可以添加、删除和编辑分区，也可以复制分区

示例1: 选择硬盘进行分区
```bash
# 如果没有参数，默认选择第一块硬盘
$ parted
GNU Parted 2.3
Using /dev/sda
Welcome to GNU Parted! Type 'help' to view a list of commands.
(parted)
To choose a different hard disk, use the select command as shown below.
(parted) select /dev/sdb
```
如果没有找到硬盘，将会报错：
```bash
Error: Error opening /dev/sdb: No medium found
Retry/Cancel? y
```

示例2: 使用 `print` 展示所有分区信息
```bash
(parted) print
Model: ATA WDC WD5000BPVT-7 (scsi)
Disk /dev/sda: 500GB
Sector size (logical/physical): 512B/4096B
Partition Table: msdos
Number  Start   End     Size    Type      Filesystem Flags
 1      1049kB  106MB   105MB   primary   fat16      diag
 2      106MB   15.8GB  15.7GB  primary   ntfs       boot
 3      15.8GB  266GB   251GB   primary   ntfs
 4      266GB   500GB   234GB   extended
 5      266GB   269GB   2682MB  logical   ext4
 7      269GB   270GB   524MB   logical   ext4
 8      270GB   366GB   96.8GB  logical   lvm
 6      366GB   370GB   3999MB  logical   linux-swap(v1)
 9      370GB   500GB   130GB   logical   ext4
```

示例3: 使用 `mkpart` 创建主分区

语法：`mkpart primary START END`
```bash
(parted) mkpart primary 106 16179
```
单位为：MB，上面也就是15G

也可以在分区上启用启动选项，Linux 为主分区保留 1~4 或 1~3个分区号，扩展分区从 5号开始
```bash
(parted) set 1 boot on
```

示例4: 使用 `mkpart` 创建逻辑分区

创建之前可以先查看一下分区信息
```bash
(parted) print
Model: ATA WDC WD5000BPVT-7 (scsi)
Disk /dev/sda: 500GB
Sector size (logical/physical): 512B/4096B
Partition Table: msdos

Number  Start   End     Size    Type      Filesystem Flags
 1      1049kB  106MB   105MB   primary   fat16      diag
 2      106MB   15.8GB  15.7GB  primary   ntfs       boot
 3      15.8GB  266GB   251GB   primary   ntfs
 4      266GB   500GB   234GB   extended
 5      266GB   316GB   50.0GB  logical   ext4
 6      316GB   324GB   7999MB  logical   linux-swap(v1)
 7      324GB   344GB   20.0GB  logical   ext4
 8      344GB   364GB   20.0GB  logical   ext2
``` 
创建一块新的逻辑分区 127G
```bash
(parted) mkpart logical 372737 500000
```

再次查看：
```bash
(parted) print
Model: ATA WDC WD5000BPVT-7 (scsi)
Disk /dev/sda: 500GB
Sector size (logical/physical): 512B/4096B
Partition Table: msdos

Number  Start   End     Size    Type      Filesystem Flags
 1      1049kB  106MB   105MB   primary   fat16      diag
 2      106MB   15.8GB  15.7GB  primary   ntfs       boot
 3      15.8GB  266GB   251GB   primary   ntfs
 4      266GB   500GB   234GB   extended
 5      266GB   316GB   50.0GB  logical   ext4
 6      316GB   324GB   7999MB  logical   linux-swap(v1)
 7      324GB   344GB   20.0GB  logical   ext4
 8      344GB   364GB   20.0GB  logical   ext2
 9      373GB   500GB   127GB   logical
```

**示例5**: `mkfs` 在分区上面创建文件系统

如果使用 `fdisk` 命令对硬盘进行分区，则需要退出 `fdisk` 实用程序，并使用 `mkfs` 外部程序在分区上创建文件系统

但是使用 `parted` 实用程序，还可以创建文件系统。使用 `parted` 的 `mkfs` 命令在分区上创建一个文件系统。 在执行此操作时，您应该小心，因为分区中的所有现有数据将在文件系统创建过程中丢失。 支持的文件系统分为 `ext2 mips fat16 fat32 linux-swap reiserfs(如果安装了libreiserfs)`

```bash
(parted) print
Model: ATA WDC WD5000BPVT-7 (scsi)
Disk /dev/sda: 500GB
Sector size (logical/physical): 512B/4096B
Partition Table: msdos

Number  Start   End     Size    Type      Filesystem Flags
 1      1049kB  106MB   105MB   primary   fat16      diag
 2      106MB   15.8GB  15.7GB  primary   ntfs       boot
 3      15.8GB  266GB   251GB   primary   ntfs
 4      266GB   500GB   234GB   extended
 5      266GB   316GB   50.0GB  logical   ext4
 6      316GB   324GB   7999MB  logical   linux-swap(v1)
 7      324GB   344GB   20.0GB  logical   ext4
 8      344GB   364GB   20.0GB  logical   ext4
 9      364GB   500GB   136GB   logical   ext4
```

这里把 第8个分区的文件系统从 `ext4` 改为 `ext2`
```bash
(parted) mkfs
Warning: The existing file system will be destroyed and
all data on the partition will be lost. Do you want to
continue?
Yes/No? y
Partition number? 8
File system type?  [ext2]? ext2
```

再次查看分区信息
```bash
(parted) print
Model: ATA WDC WD5000BPVT-7 (scsi)
Disk /dev/sda: 500GB
Sector size (logical/physical): 512B/4096B
Partition Table: msdos
Number  Start   End     Size    Type      Filesystem Flags
 1      1049kB  106MB   105MB   primary   fat16      diag
 2      106MB   15.8GB  15.7GB  primary   ntfs       boot
 3      15.8GB  266GB   251GB   primary   ntfs
 4      266GB   500GB   234GB   extended
 5      266GB   316GB   50.0GB  logical   ext4
 6      316GB   324GB   7999MB  logical   linux-swap(v1)
 7      324GB   344GB   20.0GB  logical   ext4
 8      344GB   364GB   20.0GB  logical   ext2
 9      364GB   500GB   136GB   logical   ext4
```

**示例6**: `mkpartfs` 创建分区时同时创建文件系统

执行前先把分区信息展示一下
```bash
(parted) print
Model: ATA WDC WD5000BPVT-7 (scsi)
Disk /dev/sda: 500GB
Sector size (logical/physical): 512B/4096B
Partition Table: msdos
Number  Start   End     Size    Type      Filesystem Flags
 1      1049kB  106MB   105MB   primary   fat16      diag
 2      106MB   15.8GB  15.7GB  primary   ntfs       boot
 3      15.8GB  266GB   251GB   primary   ntfs
 4      266GB   500GB   234GB   extended
 5      266GB   316GB   50.0GB  logical   ext4
 6      316GB   324GB   7999MB  logical   linux-swap(v1)
 7      324GB   344GB   20.0GB  logical   ext4
 8      344GB   364GB   20.0GB  logical
```

创建一个 127G的`fat32`逻辑分区
```bash
(parted) mkpartfs logical fat32 372737 500000
```

最后的第9编号就是刚刚创建的分区了
```bash
(parted) print
Model: ATA WDC WD5000BPVT-7 (scsi)
Disk /dev/sda: 500GB
Sector size (logical/physical): 512B/4096B
Partition Table: msdos
Number  Start   End     Size    Type      Filesystem Flags
 1      1049kB  106MB   105MB   primary   fat16      diag
 2      106MB   15.8GB  15.7GB  primary   ntfs       boot
 3      15.8GB  266GB   251GB   primary   ntfs
 4      266GB   500GB   234GB   extended
 5      266GB   316GB   50.0GB  logical   ext4
 6      316GB   324GB   7999MB  logical   linux-swap(v1)
 7      324GB   344GB   20.0GB  logical   ext4
 8      344GB   364GB   20.0GB  logical
 9      373GB   500GB   127GB   logical   fat32      lba
```

**示例7**: 使用 `resize` 重新分配分区大小
```bash
(parted) resize 9
Start?  [373GB]? 373GB
End?  [500GB]? 450GB
```
再次查看（<font color="red">危险动作哦，小心你的数据!!!</font>）
```bash
(parted) print
Model: ATA WDC WD5000BPVT-7 (scsi)
Disk /dev/sda: 500GB
Sector size (logical/physical): 512B/4096B
Partition Table: msdos
Number  Start   End     Size    Type      Filesystem Flags
 1      1049kB  106MB   105MB   primary   fat16      diag
 2      106MB   15.8GB  15.7GB  primary   ntfs       boot
 3      15.8GB  266GB   251GB   primary   ntfs
 4      266GB   500GB   234GB   extended
 5      266GB   316GB   50.0GB  logical   ext4
 6      316GB   324GB   7999MB  logical   linux-swap(v1)
 7      324GB   344GB   20.0GB  logical   ext4
 8      344GB   364GB   20.0GB  logical
 9      373GB   450GB   77.3GB  logical   fat32      lba
```

**示例8**: 使用 `cp` 分区数据拷贝

`p` 就是 `print` 的简写
```bash
(parted) p
Model: ATA WDC WD5000BPVT-7 (scsi)
Disk /dev/sda: 500GB
Sector size (logical/physical): 512B/4096B
Partition Table: msdos

Number  Start   End     Size    Type      Filesystem Flags
 1      1049kB  106MB   105MB   primary   fat16      diag
 2      106MB   15.8GB  15.7GB  primary   ntfs       boot
 3      15.8GB  266GB   251GB   primary   ntfs
 4      266GB   500GB   234GB   extended
 5      266GB   316GB   50.0GB  logical   ext4
 6      316GB   324GB   7999MB  logical   linux-swap(v1)
 7      324GB   344GB   20.0GB  logical   ext4
 8      344GB   364GB   20.0GB  logical   ext2
 9      373GB   450GB   77.3GB  logical   fat32      lba
10      461GB   500GB   39.2GB  logical   ext2
```

在分区拷贝之前，建议把来源和目标分区都 `unmount` 处理，下面的例子为把8分区的内容复制到10分区

先来看一下2个分区的内容
```bash
$ mount /dev/sda8 /mnt
$ cd /mnt
$ ls -l
total 52
-rw-r--r-- 1 root root    0 2011-09-26 22:52 part8
-rw-r--r-- 1 root root   20 2011-09-26 22:52 test.txt

$ umount /mnt
$ mount /dev/sda10 /mnt
$ cd /mnt
$ ls -l
total 48
-rw-r--r-- 1 root root    0 2011-09-26 22:52 part10
```

开始拷贝分区
```bash
(parted) cp 8 10
growing file system... 95%      (time left 00:38) 
```

再次查看10号分区内容
```bash
$ mount /dev/sda10 /mnt
$ cd /mnt
$ ls -l
total 52
-rw-r--r-- 1 root root    0 2011-09-26 22:52 part8
-rw-r--r-- 1 root root   20 2011-09-26 22:52 test.txt
```
注意：如果拷贝两边的文件系统不一致，那么拷贝的结果就是源的分区文件系统（比如从ext2拷贝到ext4，拷贝完成目标分区就变成ext2格式了）

**示例9**: 使用 `rm` 从硬盘删除一个分区

删除第9分区
```bash
(parted) rm
Partition number? 9
```

查看效果
```bash
(parted) print
Model: ATA WDC WD5000BPVT-7 (scsi)
Disk /dev/sda: 500GB
Sector size (logical/physical): 512B/4096B
Partition Table: msdos
Number  Start   End     Size    Type      Filesystem Flags
 1      1049kB  106MB   105MB   primary   fat16      diag
 2      106MB   15.8GB  15.7GB  primary   ntfs       boot
 3      15.8GB  266GB   251GB   primary   ntfs
 4      266GB   500GB   23GB   extended
 5      266GB   316GB   50.0GB  logical   ext4
 6      316GB   324GB   7999MB  logical   linux-swap(v1)
 7      324GB   344GB   20.0GB  logical   ext4
 8      344GB   364GB   20.0GB  logical   ext2 
```

更多: [9 Linux Parted Command Examples – mkpart, mkpartfs, resize partitions](http://www.thegeekstuff.com/2011/09/parted-command-examples/)

# 67.rsync命令实例
`rsync` 代表远程同步，通常用于备份(文件和目录)的操作

**重要特性**:
- `速度` - 首次是全量同步，后面就是增量同步了(有变动的)，这样就比较快了 
- `安全性` -  允许在传输过程中使用ssh协议对数据进行加密
- `带宽较小` - 在发送和接收端分别使用数据块的压缩和解压缩
- `权限` - 不需要特殊的权限来安装和执行

语法：`rsync options source destination`    
`source` 和 `destination` 可以是本地或者远程地址；如果是远程地址的话，需要加上 账号、服务器IP、路径

**实例1**: 本地2个目录同步
```bash
$ rsync -zvr /var/opt/installation/inventory/ /root/temp
building file list ... done
sva.xml
svB.xml
.
sent 26385 bytes  received 1098 bytes  54966.00 bytes/sec
total size is 44867  speedup is 1.63
```
**详解**:
- `-z` - 开启压缩 
- `-v` - 详情模式 
- `-r` - 表示递归执行(文件和子文件夹所有...)

`sync` 默认是不维护原始文件的时间戳的
```bash
$ ls -l /var/opt/installation/inventory/sva.xml /root/temp/sva.xml
-r--r--r-- 1 bin  bin  949 Jun 18  2009 /var/opt/installation/inventory/sva.xml
-r--r--r-- 1 root bin  949 Sep  2  2009 /root/temp/sva.xml
```

**实例2**: 使用 `rsync -a` 同步数据后维护时间戳
```bash
# 执行同步
$ rsync -azv /var/opt/installation/inventory/ /root/temp/
building file list ... done
./
sva.xml
svB.xml
.
sent 26499 bytes  received 1104 bytes  55206.00 bytes/sec
total size is 44867  speedup is 1.63 

# 同步后进行查看
$ ls -l /var/opt/installation/inventory/sva.xml /root/temp/sva.xml
-r--r--r-- 1 root  bin  949 Jun 18  2009 /var/opt/installation/inventory/sva.xml
-r--r--r-- 1 root  bin  949 Jun 18  2009 /root/temp/sva.xml
```

`-a`代表打包模式，涵盖的内容有:
- 递归模式
- 保留符号连接
- 保留权限
- 保留时间戳
- 保留用户和用户组

**实例3**: 只同步一个文件
```bash
$ rsync -v /var/lib/rpm/Pubkeys /root/temp/Pubkeys

sent 42 bytes  received 12380 bytes  3549.14 bytes/sec
total size is 12288  speedup is 0.99
```

**实例4**: 同步本地文件到远程服务器
```bash
$ rsync -avz /root/temp/ thegeekstuff@192.168.200.10:/home/thegeekstuff/temp/
Password:
building file list ... done
./
rpm/
rpm/Basenames
rpm/Conflictname
sent 15810261 bytes  received 412 bytes  2432411.23 bytes/sec
total size is 45305958 speedup is 2.87
```

**实例5**: 同步远程服务器文件到本地
```bash
$ rsync -avz thegeekstuff@192.168.200.10:/var/lib/rpm /root/temp
Password:
receiving file list ... done
rpm/
rpm/Basenames
.
sent 406 bytes  received 15810230 bytes  2432405.54 bytes/sec
total size is 45305958  speedup is 2.87
```

**更多**:
- [How to Backup Linux? 15 rsync Command Examples](http://www.thegeekstuff.com/2010/09/rsync-command-examples/)
- [6 rsync Examples to Exclude Multiple Files and Directories using exclude-from](http://www.thegeekstuff.com/2011/01/rsync-exclude-files-and-folders/)

# 68.chkconfig命令示例
`chkconfig` 命令用于设置、查看或修改系统启动期间自动启动的服务

[Linux的运行级别相关](http://blog.csdn.net/monkey_d_meng/article/details/5573580)

**示例1**: Shell脚本检查服务启动状态(是否配置了启动项)
```bash
# 检查服务是否配置到了启动项里
$ vi check.sh
chkconfig network && echo "Network service is configured"
chkconfig junk && echo "Junk service is configured"

$ ./check.sh
Network service is configured

# 检查指定的级别
$ vi check1.sh
chkconfig network --level 3 && echo "Network service is configured for level 3"

$ ./check1.sh
Network service is configured for level 3
```

**示例2**: 查看启动服务的当前状态
```bash
# 展示所有启动服务
$ chkconfig --list
abrtd 0:off  1:off   2:off   3:on    4:off   5:on    6:off
acpid 0:off  1:off   2:off   3:off   4:off   5:off   6:off
atd   0:off  1:off   2:off   3:on    4:on    5:on    6:off
...


# 过滤出级别为3的
$ chkconfig --list | grep 3:on

# 过滤指定名称的服务
$ chkconfig --list | grep network
```

**示例3**: 向启动项添加新服务
```bash
# 比如把 iptables 加入到启动项
$ chkconfig --list | grep iptables

$ chkconfig --add iptables

$ chkconfig --list | grep iptables
iptables       0:off   1:off   2:on    3:on    4:on    5:on    6:off
```
`chkconfig --add` 默认会把级别为: 2, 3, 4, 5的都开启, 如果服务不存在，你应该先把服务安装到系统里

**示例4**: 从启动项删除一个服务
```bash
$ chkconfig --list | grep ip6tables
ip6tables  0:off  1:off  2:off  3:on  4:off  5:off  6:off

$ chkconfig --del ip6tables
$ chkconfig --list | grep ip6tables
```

**示例5**: 开启/关闭一个服务的运行级别
```bash
# 关闭 nfsserver 5级别的启动
$ chkconfig --level 5 nfsserver off

# 可以多个一起关闭/开启
$ chkconfig --level 35 nfsserver off
```

**示例6**: 在 `rc.d` 子目录下的脚本文件

当使用 `chkconfig` 添加活删除一个服务时，实际的影响的是 `/etc/rc.d` 的子目录，当添加一个服务时，实际上是在指定级别的目录下创建了对于的符号链接(就跟windows的快捷方式一样)，删除服务时，也就是把符号链接删除掉了

```bash
$ chkconfig --list | grep xinetd
xinetd   0:off  1:off  2:off  3:on   4:off  5:on   6:off
xinetd based services:

$ cd /etc/rc.d/rc3.d
$ ls | grep xinetd
K08xinetd
S14xinetd

$ cd /etc/rc.d/rc5.d
$ ls | grep xinetd
K08xinetd
S14xinetd
```
`xinetd` 有两个文件，以`K`开头的表示在关闭的时候使用(K 表示 kill)；而`S`就是表示启动了(S 表示 start)

**示例7**: 添加服务对应 `rcx.d` 目录的变更
```bash
# 以 nfsserver 为例
$ chkconfig  --list | grep nfsserver
nfsserver  0:off  1:off  2:off  3:off  4:off  5:off  6:off

$ ls /etc/rc.d/rc3.d | grep nfsserver
$ ls /etc/rc.d/rc5.d | grep nfsserver


# 添加到启动项
$ chkconfig --add nfsserver
nfsserver  0:off  1:off  2:off  3:on   4:off  5:on   6:off

$ cd  /etc/rc.d/rc3.d
$ ls -l | grep nfsserver
lrwxrwxrwx 1 root root 12 2011-06-18 00:52 K08nfsserver -> ../nfsserver
lrwxrwxrwx 1 root root 12 2011-06-18 00:52 S14nfsserver -> ../nfsserver

$ cd /etc/rc.d/rc5.d
$ ls -l | grep nfsserver
lrwxrwxrwx 1 root root 12 2011-06-18 00:52 K08nfsserver -> ../nfsserver
lrwxrwxrwx 1 root root 12 2011-06-18 00:52 S14nfsserver -> ../nfsserver

# 关闭5级别后的效果
$ chkconfig --level 5 nfsserver off
$ ls /etc/rc.d/rc5.d  | grep nfsserver
```
上面的例子可以看出来，启动项的添加和删除其实就是符号链接的创建和删除

**更多**: [7 Linux chkconfig Command Examples – Add, Remove, View, Change Services](http://www.thegeekstuff.com/2011/06/chkconfig-examples/)


# 69.如何设置anacron
`anacron` 是针对台式机和笔记本电脑的定时服务(`cron`一般用于服务器的定时服务)

`anacron` 与 `cron` 区别：      
举个例子，比如你的笔记本做了一个 `cron` 定时备份的任务，但是你的笔记本 23:00 的时候并没有开机，所以定时任务就不会执行，但是如果使用 `anacron` 做相同的定时配置的话，那么及时错过了定时任务的时间点，定时任务在开机后也会被执行的

**anacrontab 格式**      
就如同 `cron` 有 `/etc/crontab` 一样， `anacron` 有 `/etc/anacrontab`，`anacron` 格式如下：
```bash
period   delay   job-identifier   command
```
**详解**:
- `period` - 时间间隔；单位:天，1表示一天，7就是一周，30就是一个月了 
- `delay` - 延时时间；单位:分钟，表示机器启动后，执行定时任务之前中间等待的分钟数
- `job-identifier` - 任务标示，每个任务最好都是对应一个唯一文件名，记录执行作业最后一次的日期 比如:`cat /var/spool/anacron/cron.daily`
- `command` - 执行任务的脚本，自定义的脚本要使用全路径！！！

**示例**: 一个常规的备份任务
```bash
# 比如：每7天执行一次备份任务 `/home/sathiya/backup.sh`
$ cat /etc/anacrontab
7       15      test.daily      /bin/sh /home/sathiya/backup.sh
```

`START_HOURS_RANGE` 和 `RANDOM_DELAY`:
- `START_HOURS_RANGE` - 默认值为：`3-22`，表示 3:00 到 22:00 点 
- `RANDOM_DELAY` - 随机延时，默认值为：`45`，表示会在定时任务的 `delay` 加上 `0~45`之间的一个随机值

**Cron Vs Anacron**:

Cron | Anacron
:-|:-
最小单位为分钟，可以准时执行 | 最小单位为天
任何用户都可以设置 | 仅root用户
系统24x7小时运行，系统如果挂掉，错过的任务不在执行 | 不要求系统24x7运行，如果系统挂掉，当启动之后还可以接着跑任务
针对服务器设计 | 针对台式机或笔记本
按点执行(小时:分钟) | 延时后必定执行

**更多**: [Cron Vs Anacron: How to Setup Anacron on Linux (With an Example)](http://www.thegeekstuff.com/2011/05/anacron-examples/)

# 70.IPTables Rules Examples


