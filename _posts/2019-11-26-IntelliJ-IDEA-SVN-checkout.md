---
layout: post
title: "IntelliJ IDEA SVN checkout 图文介绍"
keywords: "idea,svn"
description: "Mac版的 IntelliJ IDEA SVN checkout/update 图文介绍"
tagline: ""
date: '2019-11-26 14:02:35 +0800'
category: ide
tags: intellij-idea svn ide
---
> {{ page.description }}

# IDEA SVN

首先, 本地的SVN应该是很早之前手动安装, IDEA里设置的位置:

![](/assets/archives/idea-svn-fs8.png){:width="100%"}

# SVN checkout步骤

1. 菜单 `[VCS]` -> `[Checkout from Version Control]` -> `[Subversion]`
![](/assets/archives/svn-checkout-01-fs8.png){:width="100%"}

2. 选择指定的 `[项目]` 目录 (新仓库可以点上面的+号创建) -> `[Checkout]`
![](/assets/archives/svn-checkout-02-fs8.png){:width="100%"}

3. 弹出框里指定存放位置, 当日是 IDEA 的工作区了 -> `[Open]`
![](/assets/archives/svn-checkout-03-fs8.png){:width="100%"}

4. 这里有3个推荐的目录, 选择工作区的下一级即可 -> `[OK]`
![](/assets/archives/svn-checkout-04-fs8.png){:width="100%"}

5. 指定Format格式, 一般默认就好 -> `[OK]`
![](/assets/archives/svn-checkout-05-fs8.png){:width="100%"}

6. 这里提示是否要新建一个工作区 -> `[No]` (如果选的[Yes], 那么会新弹出一个工作区)
![](/assets/archives/svn-checkout-06-fs8.png){:width="100%"}

到这里, checkout 操作就完成了, 但是还不能更新代码, 需要后续配置

# 配置项目

项目代码 checkout 之后, 如果不配置到 IDEA 项目列表中, 是无法对其进行 `[更新]/[提交]` 等操作的

注意事项, IDEA 里的: 
- `Project` 对应 `Eclipse` 的 `Workspace`, 即工作区
- `Module` 对应 `Eclipse` 的 `Project`, 即项目, 也就是我们通常所说的项目

1. 创建项目(Module)
![](/assets/archives/svn-checkout-07-fs8.png){:width="100%"}

2. 由于代码是 Python 的, 所以这里默认即使 `Python`
![](/assets/archives/svn-checkout-08-fs8.png){:width="100%"}

3. 输入项目名
![](/assets/archives/svn-checkout-09-fs8.png){:width="100%"}

4. 是否覆盖, 选 `[Yes]` 即可
![](/assets/archives/svn-checkout-10-fs8.png){:width="100%"}

5. 最后, 在 `[9:Version Control]` -> `[Subversion Working Copies Information]` 栏就可以看到我们的项目信息 (默认快捷键: <kbd>Cmd+9</kbd>)
![](/assets/archives/svn-checkout-11-fs8.png){:width="100%"}


# 更新代码

更新代码有两种方式

1. 按单个 Module 项目更新: `[项目]`右键 -> `[Subversion]` -> `[Update Directory...]`
![](/assets/archives/svn-update-01-fs8.png){:width="100%"}

2. 按整个工作区已配置的项目: 菜单栏 `[VCS]` -> `[Update Project...]` (快捷键 <kbd>Cmd+T</kbd>)
![](/assets/archives/svn-update-02-fs8.png){:width="100%"}


