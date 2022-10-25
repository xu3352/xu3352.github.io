---
layout: post
title: "Homebrew国内源安装加速"
keywords: "homebrew"
description: "homebrew国内源安装加速"
tagline: ""
date: '2022-10-25 20:02:07 +0800'
category: mac
tags: mac homebrew
---
> {{ page.description }}

# 一键配置脚本
自动配置脚本, 直接运行, 按提示进行操作即可

`/bin/zsh -c "$(curl -fsSL https://gitee.com/cunkai/HomebrewCN/raw/master/Homebrew.sh)"`

```bash
$ /bin/zsh -c "$(curl -fsSL https://gitee.com/cunkai/HomebrewCN/raw/master/Homebrew.sh)"

               开始执行Brew自动安装程序
              [cunkai.wang@foxmail.com]
           ['2022-10-25 20:08:01']['10.13']
        https://zhuanlan.zhihu.com/p/111014448


请选择一个下载brew本体的序号，例如中科大，输入1回车。
源有时候不稳定，如果git克隆报错重新运行脚本选择源。
1、中科大下载源
2、清华大学下载源
3、北京外国语大学下载源
4、腾讯下载源
5、阿里巴巴下载源
请输入序号: 1


  你选择了中国科学技术大学brew本体下载源

！！！此脚本将要删除之前的brew(包括它下载的软件)，请自行备份。
->是否现在开始执行脚本（N/Y） Y

--> 脚本开始执行
 Mac os设置开机密码方法：
  (设置开机密码：在左上角苹果图标->系统偏好设置->用户与群组->更改密码)
  (如果提示This incident will be reported. 在用户与群组中查看是否管理员)
==> 通过命令删除之前的brew、创建一个新的Homebrew文件夹
请输入开机密码，输入过程不显示，输入完后回车
Password:

开始执行
  ---备份要删除的/usr/local/Homebrew到系统桌面....
   ---/usr/local/Homebrew 备份完成
-> 创建文件夹 /usr/local/Homebrew
运行代码 ==> /usr/bin/sudo /bin/mkdir -p /usr/local/Homebrew
此步骤成功
...
...
git version 2.15.2 (Apple Git-101.1)

下载速度觉得慢可以ctrl+c或control+c重新运行脚本选择下载源
==> 从 https://mirrors.ustc.edu.cn/brew.git 克隆Homebrew基本文件

未发现Git代理（属于正常状态）
Cloning into '/usr/local/Homebrew'...
remote: Total 226622 (delta 0), reused 0 (delta 0), pack-reused 226622
Receiving objects: 100% (226622/226622), 60.75 MiB | 9.69 MiB/s, done.
Resolving deltas: 100% (168469/168469), done.
此步骤成功
...
...
--依赖目录脚本运行完成
==> 创建brew的替身
==> 从 https://mirrors.ustc.edu.cn/homebrew-core.git 克隆Homebrew Core
此处如果显示Password表示需要再次输入开机密码，输入完后回车
Cloning into '/usr/local/Homebrew/Library/Taps/homebrew/homebrew-core'...
remote: Enumerating objects: 1300453, done.
remote: Total 1300453 (delta 0), reused 0 (delta 0), pack-reused 1300453
Receiving objects: 100% (1300453/1300453), 583.26 MiB | 19.39 MiB/s, done.
Resolving deltas: 100% (913787/913787), done.
此步骤成功
==> 从 https://mirrors.ustc.edu.cn/homebrew-cask.git 克隆Homebrew Cask 图形化软件
  此处如果显示Password表示需要再次输入开机密码，输入完后回车
Password:
...
...


            Brew本体已经安装成功，接下来配置国内源。

请选择今后brew install的时候访问那个国内镜像，例如阿里巴巴，输入5回车。

1、中科大国内源
2、清华大学国内源
3、北京外国语大学国内源
4、腾讯国内源
5、阿里巴巴国内源
请输入序号: 1
...
...
Your branch is up to date with 'origin/master'.


        Brew自动安装程序运行完成
          国内地址已经配置完成

  桌面的Old_Homebrew文件夹，大致看看没有你需要的可以删除。

              初步介绍几个brew命令
本地软件库列表：brew ls
查找软件：brew search google（其中google替换为要查找的关键字）
查看brew版本：brew -v  更新brew版本：brew update
安装cask软件：brew install --cask firefox 把firefox换成你要安装的

        欢迎右键点击下方地址-打开URL 来给点个赞
         https://zhuanlan.zhihu.com/p/111014448

 安装成功 但还需要重启终端 或者 运行 source /Users/xuyinglong/.zprofile   否则可能无法使用
```

按照提示进行操作即可, 成功后查询一下版本号: `brew -v`

---
参考：
- [【mac】homebrew国内源安装加速](https://www.cnblogs.com/hightech/p/15270915.html){:target='blank'}


