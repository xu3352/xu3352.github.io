---
layout: post
title: "IntelliJ IDEA SVN import 导入项目图文介绍"
keywords: "idea,svn"
description: "Mac版的 IntelliJ IDEA SVN import 项目导入图文介绍"
tagline: ""
date: '2019-12-11 15:11:30 +0800'
category: ide
tags: intellij-idea svn ide
---
> {{ page.description }}

直接上图文步骤, IDEA 版本号: `IntelliJ IDEA 2017.2.5`

# 导入步骤

1.菜单 `[VCS]` -> `[Import into Version Control]` -> `[Import into Subversion...]`
![](/assets/archives/svn-import-01-fs8.png){:width="100%"}

2.先在SVN上, 创建项目仓库目录: 选中目标目录, 然后右键 `[New]` -> `[Remote Folder...]` -> `[Import]`
![](/assets/archives/svn-import-02-fs8.png){:width="100%"}

3.输入仓库名称, 加上提交备注信息, 然后点 `[OK]`
![](/assets/archives/svn-import-03-fs8.png){:width="100%"}

4.仓库目录创建完成后, 直接选中仓库目录, 然后点击 `[Import]`
![](/assets/archives/svn-import-04-fs8.png){:width="100%"}

5.选择需要导入的本地项目目录
![](/assets/archives/svn-import-05-fs8.png){:width="100%"}

6.核对信息, 输入提交备注, 然后点 `[Ok]` 即可
![](/assets/archives/svn-import-06-fs8.png){:width="100%"}

# 其他

导入成功后, 可以再svn远程仓库刷新看到新导入的项目文件

但本地要想执行 `[更新/提交]` 操作, 则需要重新 `checkout` 一遍, 参考上一篇文章即可

**参考**:
- [IntelliJ IDEA SVN checkout 图文介绍](https://xu3352.github.io/ide/2019/11/26/IntelliJ-IDEA-SVN-checkout)


