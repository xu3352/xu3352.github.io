---
layout: post
title: "Mac挂载可读写的NTFS硬盘/U盘"
keywords: "mac,ntfs"
description: "在Mac上插入一块移动 NTFS 硬盘(或U盘)时, 默认情况下此硬盘是仅可读的; 也就是说只能读取数据, 而不能写入数据"
tagline: ""
date: '2019-05-11 20:47:20 +0800'
category: mac
tags: ntfs mac
---
> {{ page.description }}

# 默认情况

NTFS 格式主要是 Windows 的文件系统格式, 如果在 Mac 下使用时, 默认只可以把文件拷贝出来, 但是无法写入

用过一些APP, 例如: `Paragon NTFS for MAC`, `Tuxera NTFS for Mac`, 不足之处在于要安装后需要重启, 收费, 最后好像还卸载不干净...

例如我的一块移动硬盘, 有2个分区: swapper 和 storehouse

分别使用 `df` 和 `diskutil` 命令进行查看
```bash
$ df -h
Filesystem      Size   Used  Avail Capacity iused               ifree %iused  Mounted on
/dev/disk1s1   234Gi  202Gi   27Gi    89% 2354578 9223372036852421229    0%   /
devfs          192Ki  192Ki    0Bi   100%     664                   0  100%   /dev
/dev/disk1s4   234Gi  3.0Gi   27Gi    10%       5 9223372036854775802    0%   /private/var/vm
map -hosts       0Bi    0Bi    0Bi   100%       0                   0  100%   /net
map auto_home    0Bi    0Bi    0Bi   100%       0                   0  100%   /home
/dev/disk2s1   120Gi   40Gi   80Gi    34%   16631            84099986    0%   /Volumes/swapper
/dev/disk2s2   178Gi  138Gi   40Gi    78%  354782            42125198    1%   /Volumes/storehouse
```
默认会被挂载到 `/Volumes` 目录下, 桌面也能同时看到相应的磁盘图标

```bash
$ diskutil list
/dev/disk0 (internal, physical):
   #:                       TYPE NAME                    SIZE       IDENTIFIER
   0:      GUID_partition_scheme                        *251.0 GB   disk0
   1:                        EFI EFI                     209.7 MB   disk0s1
   2:                 Apple_APFS Container disk1         250.8 GB   disk0s2

/dev/disk1 (synthesized):
   #:                       TYPE NAME                    SIZE       IDENTIFIER
   0:      APFS Container Scheme -                      +250.8 GB   disk1
                                 Physical Store disk0s2
   1:                APFS Volume Macintosh HD            217.4 GB   disk1s1
   2:                APFS Volume Preboot                 24.0 MB    disk1s2
   3:                APFS Volume Recovery                519.6 MB   disk1s3
   4:                APFS Volume VM                      3.2 GB     disk1s4

/dev/disk2 (external, physical):
   #:                       TYPE NAME                    SIZE       IDENTIFIER
   0:     FDisk_partition_scheme                        *320.1 GB   disk2
   1:               Windows_NTFS swapper                 128.8 GB   disk2s1
   2:               Windows_NTFS storehouse              191.2 GB   disk2s2
```

插入硬盘后, 即使已经 [推出] 硬盘了(线还没拔), 同样可以使用 `diskutil` 命令查看到如上内容, 此时是可以使用 `mount` 命令进行挂载的

# 重新挂载磁盘

直接上代码 `ntfs_mount.sh` 
```bash
#!/bin/bash
#author:xu3352@gmail.com
#desc: re-mount NTFS disk as rw type

TMP_SH=/tmp/ntfs_mount_rw_tmp.sh

diskutil list | grep NTFS | awk '{print "umount /Volumes/"$3"\n", "mkdir -p ~/Desktop/"$3"\n", "sudo mount -t ntfs -o rw,auto,nobrowse", "/dev/"$6, "~/Desktop/"$3"\n"}' > $TMP_SH

sudo sh $TMP_SH
```

**步骤详解**:
- 卸载硬盘
- 对于待挂载的磁盘, 如果没有对应的目录, 这需要先创建
- 挂载磁盘到指定的目录


记得给可执行权限: `chmod 755 ntfs_mount.sh`, 执行时需要输入一次密码

# 不足之处

- 首先, 插入硬盘后, 系统会先以只读方式挂载; 需要等待系统挂载完成后, 再执行 `ntfs_mount.sh` 脚本才有效
- 如果手动在桌面右键 [推出] 硬盘后, 桌面会保留硬盘对应的文件夹, 删除时一般还需要输入密码才行

当然, 也是可以做成脚本的: `ntfs_umount.sh`
```bash
#!/bin/bash
#author:xu3352@gmail.com
#desc: umount NTFS disk in Desktop dir

TMP_SH=/tmp/ntfs_umount_tmp.sh
df -h | grep /Desktop/ | awk '{print $9}' > $TMP_SH

grep /Desktop/ $TMP_SH | xargs -n 1 sudo umount
grep /Desktop/ $TMP_SH | xargs -n 1 rm -rf
```

---
参考：
- [Mac 挂载可读写 NTFS 硬盘](https://www.ouyangsong.com/posts/21620/)
- [附件 ntfs_mount.sh](/assets/archives/ntfs_mount.sh)
- [附件 ntfs_umount.sh](/assets/archives/ntfs_umount.sh)

