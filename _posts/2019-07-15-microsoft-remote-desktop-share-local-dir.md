---
layout: post
title: "Mac设置Windows远程桌面的共享文件夹"
keywords: "mac,remote-desktop"
description: "连接VPS(Windows)时, 传文件就需要用到共享目录了"
tagline: ""
date: '2019-07-15 11:37:25 +0800'
category: mac
tags: mac
---
> {{ page.description }}

# 微软远程桌面
本地 `Microsoft Remote Desktop` 版本为 `8.0.7`

# 使用

1.创建一个远程桌面连接

![连接VPS设置](/assets/archives/remote-desktop-01-fs8.png){:width="65%"}

2.设置共享目录

![共享本地文件目录](/assets/archives/remote-desktop-02-fs8.png){:width="65%"}

# 注意事项 
- 添加多个目录时好像不太好使 (删除之前的目录, 添加新的目录)
- 如果切换共享目录不好使, 可以点 [...] 进行修改目录


