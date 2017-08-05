---
layout: post
title: "Mac PNG图片转BMP格式"
tagline: ""
description: "还需要在线转换吗，原来有自带的转换器！<br/>支持将任何图片转换为 `.bmp .png .tiff .jpg` 格式！"
date: '2017-08-05 21:45:15 +0800'
category: mac
tags: mac automator
---
> {{ page.description }}

# Automator
这是什么东东，抗个小钢炮的机器人，咋一看还以为是游戏呢，哈哈

一般人还真注意不到这货的存在，直到一天。。。此处省略xx字。。。

某天需要把一个 png 图片转换为 bmp 图片，发现有好多在线转换的，不过在线的麻烦了，需要上传，然后还要下载，这。。。好吧，干脆找个 app 来解决不就好了么，于是乎继续寻找，一不小心发现了 `Automator`，回头才发现还真有个这么个玩意儿，感觉比较高级呢

# 制作步骤
1. 启动 `Automator`，自动就弹了个框，不知道干嘛的，按`ESC` 或者 点击【完成】按钮
2. 再次点击 `Automator` 图标，又来个弹框，选择【服务】项
![](http://on6gnkbff.bkt.clouddn.com/20170805141727_automator-01.png){:width="100%"}
3. 左侧【操作】里面筛选”类型“，把【更改图片类型】拖入右侧位置
![](http://on6gnkbff.bkt.clouddn.com/20170805141729_automator-02.png){:width="100%"}
4. 弹框表示是否需要创建备份，然后把备份更改掉，选择【添加】按钮（源文件保留）
![](http://on6gnkbff.bkt.clouddn.com/20170805141729_automator-03.png){:width="100%"}
5. “服务”收到选定 选择【图像文件】；拷贝选择一个备份地址（可以选择替换源文件）；至类型 选择【BMP】
![](http://on6gnkbff.bkt.clouddn.com/20170805141729_automator-04.png){:width="100%"}
6. CMD+S 保存服务，命名为：”图片转BMP格式“

# 使用
选择一张图片，右键 -> 【服务】-> 【图片转BMP格式】，然后自动就转换了，神奇吧
![](http://on6gnkbff.bkt.clouddn.com/20170805141730_automator-05.png){:width="100%"}

---
参考：
- [OS X 下快速转换图片格式](https://www.macx.cn/thread-2060748-1-1.html)
- [如何高效的使用Mac？](http://www.jianshu.com/p/defd47135502)

