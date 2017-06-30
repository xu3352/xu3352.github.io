---
layout: post
title: "使用APM监控JVM的GC情况"
tagline: ""
description: "近期遇到 tomcat 不稳定的情况，经过排查，初步确定是 JVM 频繁的 FULLGC 的导致的"
date: '2017-06-28 16:20:07 +0800'
category: monitor
tags: gc java tomcat APM new-relic
---
> {{ page.description }}

# 异常反馈
首先是收到了异常的反馈，然后看一下 tomcat 日志，再一看 APM  的 JVM 监控，看到 Tomcat 服务基本已经挂掉了，频繁的 FULLGC 导致服务基本不可用，还好有做负载，用 jstat 命令可以看到 JVM的老年代已经满了，所以导致频繁的 FULLGC，临时方案，把 JVM 内存调大后重启解决了问题

# 根本原因
JVM 不够用的现象已经出现过2~3次了，临时方案就是直接调整了 JVM 参数，然后重启 tomcat 搞定       
使用 `jstat` 其实可以看到 OC 和 OU 基本一样了，也就是老年代的使用基本接近老年代的容量了，那么，JVM 老年代为什么不够用了呢，是因为有大量对象不被释放，而且不断的有新生代的对象转移到老年代里     

就像这里的 OC 和 OU 已经一样了大了：（OU:老年代使用量 OC:老年代容量）
![jstat使用截图](http://on6gnkbff.bkt.clouddn.com/20170630105946_jvm-jstat-gc-info.png){:width="100%"}

细想一下，现在的内存缓存工具类使用越来越多，调用频繁的接口也是用到了。由于这个是静态 Map 做的，所以存到这里的对象不会被 GC 清理掉，怀疑是这里有问题，所以在 quartz 里配置了一个定时任务，定时的把过期的对象清理掉。部署之后的效果：清理10w对象大约花了几到几十毫秒，所以不担心频繁的清理的问题。而后面的 JVM 老年代撑满的问题也解决了。

清理调用方法：`CacheUtils.clearAllExpired()` [CacheUtils代码](https://xu3352.github.io/linux/2017/05/02/tomcat-cpu-100-utilisation#附录代码)

# APM监控图表
New Relic 的 APM 的 JVM 监控图表：可以看到 jvm 已经停止服务(红了一片表示没有上传apm日志)，频繁的GC，CPU也很高，服务提供正常的服务
![apm jvm监控图1](http://on6gnkbff.bkt.clouddn.com/20170629141126_jvm-monitor-01-01.png){:width="100%"}

tomcat 重启前后的 GC情况图表：
![apm jvm监控图2](http://on6gnkbff.bkt.clouddn.com/20170629141137_jvm-monitor-02-02.png){:width="100%"}

---
参考：
- [Tomcat JVM性能优化(浅谈jstat)](https://xu3352.github.io/java/2017/02/11/tomcat-jvm-optimization-jstat)
- [Tomcat CPU 100%使用率](https://xu3352.github.io/linux/2017/05/02/tomcat-cpu-100-utilisation)
