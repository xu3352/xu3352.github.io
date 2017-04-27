---
layout: post
title: "Alfred开发入门：Hello World！"
date: '2017-01-15 17:49:31'
category: mac
tags: mac alfred tools
---

> Alfred Workflow入门：Hello World！

# 简介
Alfred不用多说，神器一般的存在，谁用谁知道！

# Demo开始
先来个简单的 Demo 吧，比如 `Hello World！` 哈哈   
```
进入 Alfred 设置 -> Workflows：
0. 新加一个Workflow，左侧右下角的“+”号，有模板，例子，空白的选项，选空白吧
1. 添加Inputs -> Keyword：
Keyword：hello
Title:this is my first demo!
2. 添加Actions -> Run Script: 默认的 bash 就可以，然后输入：
Language：/bin/bash
Script：echo “hello world! {query}”
3.1. 加一个Outputs -> Post Notification:
Title:展示结果
Text:{query}
3.2. 加一个Outputs -> Copy to Clipboard:
{query}

4. 把1~3步连线起来就可以了
```

# 试用
好了，一个 Demo 做好了，跑一个看看效果：
```
调起Alfred，输入关键词：hello xu3352，然后回车
可看到通知栏的信息
然后把信息已经存入剪贴板了，CMD + V 粘贴即可

结果如下：
hello world! \ xu3352
```
# 解说
- {query} 是很关键的变量，每一步的 {query} 其实是上一步的结果
- 第2步的：{query} 的值就是：\ xu3352
- 第3步的：{query} 的值就是：hello world! \ xu3352

不清楚为什么我的值会有斜杠和空格，其他脚本接收值的时候需要先把 斜杠和空格 处理掉才能用 ！！！    
我的版本：v2.6(374)

参考：  
- [Alfred workflow开发实例](http://manan.org/2014/12/alfred-workflow-tutorial/)   
- [一个方便计算透明度十六进制值的Alfred WorkFlow](https://ghui.me/post/2016/10/my-first-alfred-workflow/)      
- [Alfred workflow 开发指南](http://myg0u.com/python/2015/05/23/tutorial-alfred-workflow.html)


