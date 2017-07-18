---
layout: post
title: "APM 快速找到代码里的BUGS"
tagline: "Errors or Exceptions"
description: "知道了是什么问题，就可以思考怎么解决了！忧伤的是：大多时候不知道是什么问题！！！而 APM 可以快速定位哪块代码有问题，再也不用摸着石头过河了"
date: '2017-07-18 10:34:04 +0800'
category: monitor
tags: APM new-relic monitor
---
> {{ page.description }}

# 定位问题
如何定位代码里的问题？
- 看现象 - 时间、地点、人物、场景、操作步骤等 如果问题可以复现，那还好说；更多情况是别人描述的，能描述清楚还好，否则就是连猜带蒙
- 经验 - 经验是条捷径，有时候也得慎重一点，也容易被误导
- 看日志 - 最常见的排查错误方式，前端可以看浏览器控制台，后端直接就看日志文件
- 分析 - 综合前三者得出结论，不确定时尽量想办法验证你的结论

# 第三只眼睛
监控就好比是“第三只眼睛”，就像二郎神、三眼乌鸦一样

Java里的错误，一般会直接打印到控制台，所以晕倒问题查控制台基本是第一件事，然后一通：`cat` `tail` `grep` `less` 命令组合拳打下来，基本上也能确定那块业务逻辑，哪行代码报错了，再然后当然就是缕代码逻辑了，再不行就本地 Debug 走一把，大多情况都能找到问题

APM Error Analytics监控：最大的好处就是把收集错误这块做的很好，他可以告诉你一段时间内有多少个错误，错误的次数，错误消息是什么，哪行业务逻辑代码报错的

# APM Error Monitor
自从用了 APM，找报错的地方就容易多了，一看报表，你就懂了
整体情况：多少种错误，次数，错误比例，错误排行
![](http://on6gnkbff.bkt.clouddn.com/20170718040013_apm-error-analytics-01.png){:width="100%"}

错误详情：哪个请求、异常类、异常消息、哪个时段、错误次数
![](http://on6gnkbff.bkt.clouddn.com/20170718040014_apm-error-analytics-02.png){:width="100%"}

单个 Error 例子：哪个时间，哪个请求，哪台主机，哪行代码抛出的异常，错误堆栈信息(默认贴心的隐藏了框架代码)
![](http://on6gnkbff.bkt.clouddn.com/20170718040014_apm-error-analytics-03.png){:width="100%"}

是不是感觉吊炸天了 ^_^...

真心好用，谁用谁知道

---
[New Relic APM监控]({{ site.url }}/tags.html#APM-ref)

