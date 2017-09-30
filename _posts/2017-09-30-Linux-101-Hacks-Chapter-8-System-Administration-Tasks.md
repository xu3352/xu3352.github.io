---
layout: post
title: "Linux 101 Hacks 第八章:系统管理任务(第一部分)"
tagline: ""
description: "Linux系统方面的管理，涉及命令包括：`fdisk mke2fsk mount tune2fs mkswap useradd passwd groupadd ssh ssh-copy-id crontab mkfs rsync chkconfig iptables `"
date: '2017-09-30 20:56:29 +0800'
category: linux
tags: linux linux-command linux-101-hacks ebook
---
> {{ page.description }}

系统管理相关的命令，基本都是 `root` 用户才有权限，这里的示例说明就不一一说明了(细心的同学会发现命令前面始终是`$`符号，一般情况是表示非`root`用户的；而如果是 `#` 开头的话，开起来就是注释的感觉了)

# 55.fdisk分区
`注意：`***这种工具就要谨慎操作了，如果想要自己动手演示，建议找个新的硬盘或者废弃的硬盘，别把系统搞崩溃了。。。***

`fdisk` 常用的5种方式：
- `n` - 新建分区
- `d` - 删除已有的分区
- `p` - 打印分区信息
- `w` - 写入分区（保存）
- `q` - 退出分区工具

示例1: 创建分区
创建一个 `/dev/sda1` 主分区
```bash
$ fdisk /dev/sda
Command (m for help): p

Disk /dev/sda: 287.0 GB, 287005343744 bytes
255 heads, 63 sectors/track, 34893 cylinders
Units = cylinders of 16065 * 512 = 8225280 bytes

Device Boot  Start   End      Blocks   Id  System

Command (m for help): n 
Command action
    e extended
    p primary partition (1-4)
p

Partition number (1-4): 1
First cylinder (1-34893, default 1):
Using default value 1
Last cylinder or +size or +sizeM or +sizeK (1-34893,
default 34893):
Using default value 34893

Command (m for help): w
The partition table has been altered!

Calling ioctl() to re-read partition table.
Syncing disks.
```

示例2: 确认分区已经创建成功
```bash
$ fdisk /dev/sda
Command (m for help): p

Disk /dev/sda: 287.0 GB, 287005343744 bytes
255 heads, 63 sectors/track, 34893 cylinders
Units = cylinders of 16065 * 512 = 8225280 bytes

Device Boot  Start         End      Blocks   Id  System
/dev/sda1        1       34893   280277991   83  Linux

Command (m for help): q
```

更多: [7 Linux fdisk Command Examples to Manage Hard Disk Partition](http://www.thegeekstuff.com/2010/09/linux-fdisk/)

# 56.mke2fsk分区格式化
磁盘分区过后并不能直接使用，而是需要先格式化。如果在这个阶段查看磁盘信息，将会得到错误的信息

```bash
$ tune2fs -l /dev/sda1

tune2fs 1.35 (28-Feb-2004)
tune2fs: Bad magic number in super-block while trying to
open /dev/sda1

Couldn't find valid filesystem superblock.
```

使用 `mke2fs` 分区：
```bash
$ mke2fs /dev/sda1 
```
参数:
- `-m 0` - root用户存储块比例，默认为：5%，这里设置为0 
- `-b 4096` - 存储块大小（字节），有效值为：`1024`，`2048`，`4096` 

```bash
$ mke2fs -m 0 -b 4096 /dev/sda1
mke2fs 1.35 (28-Feb-2004)
Filesystem label=
OS type: Linux
Block size=4096 (log=2)
Fragment size=4096 (log=2)
205344 inodes, 70069497 blocks
0 blocks (0.00%) reserved for the super user
First data block=0
Maximum filesystem blocks=71303168
2139 block groups
32768 blocks per group, 32768 fragments per group
96 inodes per group
Superblock backups stored on blocks:
32768, 98304, 163840, 229376, 294912, 819200, 884736,
1605632, 2654208, 4096000, 7962624, 11239424, 20480000,
23887872

Writing inode tables: done
Writing superblocks and filesystem accounting information:
done

This filesystem will be automatically checked every 32
mounts or 180 days, whichever comes first.  Use tune2fs -c
or -i to override.
```
以上为创建 `ext2` 文件系统，这个基本很少用了，目前大多应该是 `ext3` 文件系统的：
```bash
$ mkfs.ext3 /dev/sda1 

# 或者
$ mke2fs –j /dev/sda1
```

# 57.mount挂载分区
分区格式化完成后，需要挂载到系统对应的文件夹中来使用
创建文件夹后进行挂载
```bash
$ mkdir /home/database

$ mount /dev/sda1 /home/database
```

如果想重启系统后进行自动挂载，可以在 `/etc/fstab` 入口进行设置：
```bash
$ /dev/sda1 /home/database ext3 defaults 0 2 
```

# 58.使用tune2fs精细化调整
使用 `tune2fs –l /dev/sda1` 查看文件系统：(大概是这个样子)
```bash
$ tune2fs -l /dev/sda1
tune2fs 1.41.12 (17-May-2010)
Filesystem volume name:   <none>
Last mounted on:          /home/database
Filesystem UUID:          b904daa5-dbf8-4ba7-89f8-fd14a2d34834
Filesystem magic number:  0xEF53
Filesystem revision #:    1 (dynamic)
Filesystem features:      has_journal ext_attr resize_inode dir_index filetype needs_recovery extent flex_bg sparse_super huge_file uninit_bg dir_nlink extra_isize
Filesystem flags:         signed_directory_hash
Default mount options:    user_xattr acl
Filesystem state:         clean
Errors behavior:          Continue
Filesystem OS type:       Linux
Inode count:              51200
Block count:              204800
Reserved block count:     10240
Free blocks:              168949
Free inodes:              51178
First block:              1
Block size:               1024
Fragment size:            1024
Reserved GDT blocks:      256
Blocks per group:         8192
Fragments per group:      8192
Inodes per group:         2048
Inode blocks per group:   256
Flex block group size:    16
Filesystem created:       Sat Jan 19 19:25:56 2013
Last mount time:          Mon Aug 28 15:04:17 2017
Last write time:          Mon Aug 28 15:04:17 2017
Mount count:              261
Maximum mount count:      -1
Last checked:             Sat Jan 19 19:25:56 2013
Check interval:           0 (<none>)
Lifetime writes:          35 MB
Reserved blocks uid:      0 (user root)
Reserved blocks gid:      0 (group root)
First inode:              11
Inode size:	          128
Journal inode:            8
Default directory hash:   half_md4
Directory Hash Seed:      a5031479-6dde-4963-868d-55549aabd8cc
Journal backup:           inode blocks
```

同样可以使用 `tune2fs` 调整 `ex2/ext3` 文件系统的参数，比如想修改文件系统卷名称：
```bash
$ tune2fs -l /dev/sda1 | grep volume
Filesystem volume name:   /home/database

$ tune2fs -L database-home /dev/emcpowera1
tune2fs 1.35 (28-Feb-2004)

$ tune2fs -l /dev/sda1 | grep volume
Filesystem volume name:   database-home
```

# 59.创建交换区文件系统

未完待续...


