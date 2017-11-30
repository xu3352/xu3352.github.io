---
layout: post
title: "U盘安装CentOS7.ISO"
tagline: ""
description: "几经波折, 终于折腾好使了......"
date: '2017-11-29 21:18:28 +0800'
category: linux
tags: linux centos mac usb iso
---
> {{ page.description }}

# 前言
几个月前, 淘到了一台高配的PC机(windows的), 本来是拿来做内网的服务器的, 一直放着没管, 前几天准备把Linux系统安装, 折腾了几个小时U盘启动盘制作, 各种不好使.... 今天终于搞好了, 坑还是挺多的

预想的是拿来Docker的, 大多的服务都提供了Docker的镜像, 所以使用起来应该非常方便的, 我选择的是CentOS7, 内核有可能还得升级一下

# 制作U盘启动盘
各种Google, 百度, 大多都是说用UltraISO把CentOS7的镜像写入到U盘, 各种尝试, 反正最后是没好使吧...

## CentOS镜像下载
[CentOS7下载地址](https://www.centos.org/download/), 我这里选择的是:[CentOS-7-x86_64-DVD-1708.iso](http://mirrors.aliyun.com/centos/7/isos/x86_64/CentOS-7-x86_64-DVD-1708.iso)

由于下载的ISO镜像有4.2G大小, 所以建议U盘比4G大就行, 不过在使用UltraISO时, U盘的文件系统格式的问题: 
- FAT格式 - 不支持大于4G的单个文件
- NTFS格式 - mac系统支持不好(默认是不能写入的), 用其他工具也可以进行写入, 写入过后windows下好像又识别不了了...
- exFAT格式 - 后来科普到的, 对windows和mac支持得比较好, 但是windows下不能格式化...

## 镜像写入U盘
折腾了好久无果, 几天后偶然在知乎上发现CentOS官网使用U盘安装的[网页](https://wiki.centos.org/HowTos/InstallFromUSBkey), 人家都建议使用: `dd` 命令了, 好吧, 还是官网的靠谱阿

既然使用 `dd` 命令, 那就不用windows了, mac几个命令就能搞定了, 参考:[在MAC下使用ISO制作Linux的安装USB盘](https://linux.cn/article-1471-1.html)

需要注意的是:
- 将ISO镜像转换为DMG格式
- U盘的设备名别搞错了, 别把自己硬盘数据搞没了: `diskutil list` 查看U的设备名
- 卸载U盘(不是推出) : `diskutil umountDisk /dev/disk1` (假如U盘是 /dev/disk1)
- 镜像DMG写入到U盘: `sudo dd if=linux.dmg of=/dev/rdisk1 bs=1m` (<font color="red">假如U盘是 /dev/disk1, 千万别搞错了</font>)
- 写入完成后会提示:“此电脑不能读取能插入的磁盘”, 这里选择直接推出即可

# 安装CentOS7
U盘启动盘已经准备好了, 下面就是进行安装了

## 修改BIOS, 这只启动顺序优先级
默认情况下, 一般都是硬盘优先启动的, 所以这里需要调整一下启动的优先级, 选择USB最先启动就行, 保存后重启电脑

一般是启动的时候按:`ESC F2 F10 F12 DEL`之类的按键, 我好想是按的: `F2` 或者 `DEL` 好使的

## 启动参数修改
U盘启动后, 会出现如下界面: 直接选择安装CentOS7可能会失败, 这里需要对参数进行修改

![U盘开机图](http://linux.vbird.org/linux_basic/0157installcentos7/centos7_01.jpg){:width="100%"}

按下 Tab键, (可以看到默认是以LABEL名称来的, 不过名称过长, 估计是这个问题导致的), 把内容修改为:
```bash
vmlinuz initrd=initrd.img linux dd quiet
```
然后会看到如下页面: 这里U盘对应的设备名是 `sdc1`
![](//on6gnkbff.bkt.clouddn.com/20171130053733_QQ20171130-133703.png){:width="100%"}

找到U盘对应的设备, 然后:`CTRL+ALT+DEL` 重启, 再次来到安装界面, 同样是按 Tab键 对参数进行修改:
```bash
vmlinuz initrd=initrd.img inst.stage2=hd:/dev/sdc1 quiet
```

## 语言选择
然后回车开始安装, 如果成功的进入到了选择语言界面就表示可以进行安装设置了

![](http://linux.vbird.org/linux_basic/0157installcentos7/centos7_04.jpg){:width="100%"}

建议选择默认的英文版, 因为选择过一次简体中文的GNOME安装, 部分路径中包含空格...(静态IP设置的时候发现的) 

## 硬盘分区
选择下图的:安装目的地, 进入磁盘分区, 挂载目录的设置
![](http://linux.vbird.org/linux_basic/0157installcentos7/centos7_05.jpg){:width="100%"}

选择对应的硬盘(不是安装盘哦, 多块硬盘的话需要注意一下), 然后进行分区
![](http://linux.vbird.org/linux_basic/0157installcentos7/centos7_12.jpg){:width="100%"}

把已经分配后的全部删除掉, 空间就全部回收回来了, 然后重新分配:
- `/boot` - 启动区域, 1G应该就可以的
- `BIOS Boot` - 不用输入, 自动就是2M
- `swap` - 可以参考内存大小来, 高配基本是用不上这个的, 可以设置为内存的1~2倍大小
- `/data` - 数据资料区, 看个人喜好设置了
- `/` - 最后一个设置, 这里不用输入大小, 默认会分配剩余所有可用的空间

下面是我的设置:
![](http://on6gnkbff.bkt.clouddn.com/20171130060653_1000.png){:width="100%"}

## 图形化界面选择
默认是最小化安装的, 不带图形界面, 有图形界面还是要方便一点, 比如用浏览器查点东西之类

这里选择的是 `包含GUI的服务器`, 右侧会有附加的组件, 需要的话就可以勾上

# 其他
网络和主机名称也可以进行设置

如果没有其他的, 那么就开始安装吧, 估计需要等30分钟左右, 开始安装时, 可以设置root的初始密码

安装完成后, 重启, 启动之后还有一些简单的设置, 按照提示来即可, 一个是License, 勾上即可, 一个是设置一个普通的用户, 然后就进入系统了

---
参考：
- [知乎上的一个链接:How to Set Up a USB Key to Install CentOS](https://wiki.centos.org/HowTos/InstallFromUSBkey)
- [在MAC下使用ISO制作Linux的安装USB盘](https://linux.cn/article-1471-1.html)
- [鸟哥的Linux 私房菜-安装CentOS7.x](http://linux.vbird.org/linux_basic/0157installcentos7.php)
- [CentOS 7.0系统安装配置图解教程](http://www.osyunwei.com/archives/7829.html)

