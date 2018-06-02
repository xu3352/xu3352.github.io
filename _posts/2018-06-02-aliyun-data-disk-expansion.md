---
layout: post
title: "阿里云:扩容数据盘Linux"
tagline: ""
description: "一次阿里云数据盘扩容的过程中的小插曲"
date: '2018-06-02 14:09:23 +0800'
category: linux
tags: aliyun linux
---
> {{ page.description }}

# 磁盘
阿里云主机默认会有个系统盘(现在默认是40G,SSD的), 然后可以单独购买数据盘, 大小自己输入, 反正比较便宜先买了100G的

新买的数据盘是需要自己进行分区/格式化后挂载的, 详细过程参考:[Linux 格式化和挂载数据盘](https://help.aliyun.com/document_detail/25426.html?spm=5176.2020520165.120.d25426.1c727029nDQeCo)

# 磁盘扩容
由于存储的文件比较多, 100G满了, 这个时候可以选择扩容或者新买一块数据盘, 当然直接扩容就好了

扩容的详细过程请<span style="color:red">仔细</span>参考:[扩容数据盘_Linux](https://help.aliyun.com/document_detail/25452.html?spm=5176.2020520165.120.d25452.2fff7029SYirV6)

这里说一下注意事项:
1. 需要在 <span style="color:red">在控制台上重启实例</span>, 终端重启不好使!!!(说的就是我)
2. 停掉使用数据盘的服务
3. 卸载数据盘, 如果卸载不掉, 可以使用 `fuser -m -v /dev/vdb1` 查看哪些进程占用, `kill` 掉
4. 删除原分区, 并新建分区: `fdisk /dev/vdb1` 然后按 `d n p 1`, 两次回车, 最后记得 `wq` 保存
5. 检查文件系统
```bash
e2fsck -f /dev/vdb1 # 检查文件系统
resize2fs /dev/vdb1 # 变更文件系统大小
```
6. 重新挂载数据盘 `mount /dev/vdb1 /data`

# 相关命令
查看文件系统使用率
```bash
$ df -h
Filesystem      Size  Used Avail Use% Mounted on
/dev/vda1        40G  5.5G   32G  15% /
/dev/vdb1      1008G  101G  857G  11% /data
```

查看分区表详情
```bash
$ fdisk -l
Disk /dev/vda: 42.9 GB, 42949672960 bytes
255 heads, 63 sectors/track, 5221 cylinders, total 83886080 sectors
Units = sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disk identifier: 0x000da36d

   Device Boot      Start         End      Blocks   Id  System
/dev/vda1   *        2048    83884031    41940992   83  Linux

Disk /dev/vdb: 1099.5 GB, 1099511627776 bytes
2 heads, 8 sectors/track, 134217728 cylinders, total 2147483648 sectors
Units = sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disk identifier: 0xc7ca31df

   Device Boot      Start         End      Blocks   Id  System
/dev/vdb1            2048  2147483647  1073740800   83  Linux
```
`Disk /dev/vdb: 1099.5 GB, 1099511627776 bytes` 这里就是数据盘的总大小, 扩容后如果不在控制台重启, 这里是不会变的!!!

# 其他
另外, 如果实在有解决不了的问题, 可以提交工单, 不过这个也得花一定的时间排队...

提交工单的时候会先让你选是哪类的问题, 尽量选对应的, 最后都会有一个热门知识点, 这里有经常问题的问答!!! 很多时候这里就会有答案了

---
参考：
- [阿里云- Linux 格式化和挂载数据盘](https://help.aliyun.com/document_detail/25426.html?spm=5176.2020520165.120.d25426.1c727029nDQeCo)
- [阿里云- 扩容数据盘_Linux](https://help.aliyun.com/document_detail/25452.html?spm=5176.2020520165.120.d25452.2fff7029SYirV6)

