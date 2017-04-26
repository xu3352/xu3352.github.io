---
layout: post
title: "Tomcat JVM性能优化(浅谈jstat)"
date: '2017-02-11 19:47:02'
categories: tomcat jstat
tags: tomcat jstat
---

> Tomcat JVM性能监控，优化

# 常规设置
这个话题太深，我也只懂点皮毛😆
关于怎么调整 JVM 参数的，网上一搜一大把，我最频繁的调整，基本够用了：

```bash
# catalina.sh
JAVA_OPTS="$JAVA_OPTS -server
-Xms2g -Xmx2g
-XX:NewSize=256m -XX:MaxNewSize=256m
-XX:PermSize=120m -XX:MaxPermSize=150m
-XX:+DisableExplicitGC
"
```

- **-Xms** 初始堆的大小（-Xms 和 -Xmx 两个值设置为一样）
- **-XX:NewSize** 新生代对象生成时占用内存的默认值
- **-XX:PermSize** 非堆内存初始值
- **-XX:+DisableExplicitGC** 禁止调用 ```System.gc()```；但jvm的gc仍然有效

# jstat使用
找到你Tomcat的进程ID（PID）
```
$ ps aux|grep tomcat
```

使用JDK自带的工具 jstat 查看JVM gc的情况：
```bash
# 每隔1000毫秒（1秒）输出一次统计信息，一共5次；PID 为你 tomcat 的进程ID
$ jstat -gc PID 1000 5
 S0C    S1C      S0U    S1U      EC       EU        OC         OU       PC     PU      YGC     YGCT    FGC    FGCT     GCT
14400.0 14144.0  0.0    0.0   58816.0   6954.1   174784.0   63340.3   71680.0 71156.5  10928   68.285  497   147.410  215.694
14400.0 14144.0  0.0    0.0   58816.0   6954.1   174784.0   63340.3   71680.0 71156.5  10928   68.285  497   147.410  215.694
14400.0 14144.0  0.0    0.0   58816.0   6956.1   174784.0   63340.3   71680.0 71156.5  10928   68.285  497   147.410  215.694
14400.0 14144.0  0.0    0.0   58816.0   6956.1   174784.0   63340.3   71680.0 71156.5  10928   68.285  497   147.410  215.694
14400.0 14144.0  0.0    0.0   58816.0   6956.1   174784.0   63340.3   71680.0 71156.5  10928   68.285  497   147.410  215.694
```

- **OC** Old代的容量 (字节)
- **OU** Old代目前已使用空间 (字节)
- **PC** Perm(持久代)的容量 (字节)(比如：71680.0/1024=70M)
- **PU** Perm(持久代)目前已使用空间 (字节)
- **YGC** 从应用程序启动到采样时年轻代中gc次数
- **YGCT** 从应用程序启动到采样时年轻代中gc所用时间(s)
- **FGC** 从应用程序启动到采样时old代(full gc)gc次数
- **FGCT** 从应用程序启动到采样时old代(full gc)gc所用时间(s)
- **GCT** 从应用程序启动到采样时gc用的总时间(s)

应该尽量减少FGC次数，不然对应用的影响也就越大了（卡死的感觉）
如果OU接近OC时，那就应该调整：```-Xms 和 -Xmx```。（如果机器内存足够，懒人的做法是可以设置大一点😆，当然过多其实也是浪费）
如果PU接近PC时，应该调整```-XX:PermSize 或 -XX:MaxPermSize```。
可根据自己的情况结合 ```jstat``` 来调整相应的参数，建议 ```tomcat``` 运行了一段时间过后使用 ```jstat``` 统计更好，原因你应该懂的。

# 总结
**总而言之：最终目的就是减少Full GC！！！**


参考：
- [Java系列笔记(4) - JVM监控与调优](http://www.cnblogs.com/zhguang/p/Java-JVM-GC.html)
- [jstat命令详解](http://blog.csdn.net/zhaozheng7758/article/details/8623549)

