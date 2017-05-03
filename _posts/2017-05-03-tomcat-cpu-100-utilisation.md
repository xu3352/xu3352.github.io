---
layout: post
title: "Tomcat CPU 100%使用率"
date: '2017-05-03 00:20:00 +0800'
category: linux
tags: java tomcat APM linux
---
> tomcat 刚启动时，cpu刚开始不到10%，几个小时后偶尔会突然到100%，没什么规律

# 困扰
近大半个月总有 CPU 突然100%的情况，紧急办法就是重启 Tomcat 立马恢复正常   
平均一天上发生2~3次，最狠的一晚上5、6次，欲哭无泪。。。     
这两天的临时方案就是通过 [Jenkins 一键重启](//xu3352.github.io/linux/2017/05/01/jenkins-restart-remote-server-tomcat)，省得每次都开电脑，还是手机方便啊

# 各种优化
> 话说过早地优化等于自杀，优化往往都是到最后在考虑了

具体优化方向：
1. ***[New Relic 的 APM](//rpm.newrelic.com/apm) 监控***：  
辅助查看有问题的web请求，慢sql查询，针对性非常强。绝大部分的不合理的地方可以在 APM 里直接体现出来。话说已经从免费版升级到了中级版了，带来的收益比升级几台机器配置或者购买几台服务器划算多了，强烈推荐。
2. ***加缓存***：  
结合APM，大部分查询数据的接口都可以加缓存。请求平均响应时间下降非常明显：由秒级别的降为毫秒级别了，速度提升几倍到几十倍
3. ***慢SQL查询***：  
结合APM，直接可知道哪些sql查询最慢、耗时最多、频率最大。最常见的是加索引（联合索引有时会给你很大的惊喜）或者查询时索引未生效，SQL语法调整，重写之类的。表数据量大的能清理的最好定时任务来清理，或者做个历史备份之类的。这里暂时还没有用到分表、分库、读写分离之类的。
4. ***去掉不是必须的日志输出***（这块占用的资源其实可能并不多，线上环境尽量去掉吧）  
很早之前把疯狂打印日志的单独用 [go 语言搭建了一套](//xu3352.github.io/go/2017/03/19/golang-build-a-web-app)，不过确实有明显改善。
5. ***[JVM优化](//xu3352.github.io/java/2017/02/11/tomcat-jvm-optimization-jstat)***：  
这个很早就优化过，后面配置几乎不用改。反复的使用命令研究即可：`jstat -gc PID 1000 5`

New Relic APM监控(后面单独写文章介绍一下使用心得)：    
Transaction 的四个维度排序：
- 耗时最多的请求
- 平均相应时间最慢的
- 综合评分最不满意的
- 吞吐量最大的

Database 的三个维度排序：
- 耗时最多
- 查询最慢
- 频率最高

# 黔驴技穷
大刀阔斧的优化一通之后，效果也是非常明显，尤其是相应速度这块，可以支撑更大的吞吐量了    
但是好日子不长，业务需求大增的同时凸显出了另一个问题：***CPU时不时的就飙到100%去了，拉都拉不住啊。。。***   
常用的办法：`在CPU 100%的时候反复执行下面的动作观察情况`
```bash
# 然后CPU高的排序, 比如CPU高的java进程号为：5189
top 

# 高CPU进程，按进程ID查看线程 PID:5189
top -H -p 5189

# 记录高CPU的线程ID
# 比如:5362   转16进制:14f2

# 线程堆栈输出到文件
jstack -l 5189 > /tmp/jstack_5189.txt

# 查找 14f2 出现的位置，根据打印的堆栈定位问题
vim /tmp/jstack_5189.txt
```
分析：
在使用 `top -H -p 5189` 的时候，有个现象，并不是某个线程一直占用CPU，而是很多线程排队的，约1s左右就会切换到下一个线程，以至于后面输出到文件里时，之前找到的线程 `5362` 已经没了，蛋疼了。。。统计的样本里面好多 wait 的，当时就以为最大的可能是 wait 导致的，而程序里面有加同步锁(`synchronized`)，然后就想办法能去掉就去掉，能减少作用范围就减少作用范围，优化之后，效果并不明显。

无奈就只好放大招：***加几台服务器，做负载来分流***    
这下还是有明显的改善的，至少频率降低了大半，一天偶尔有1、2次，维持了几天，这几天又开始要爆发的节奏。。。哎，心好累😔    
通过 APM 监控，看 web 请求并没有太大的问题，请求耗时一般都在50ms以下。而且做了缓存之后，数据库表示没压力，问题在哪里呢？每天晚上回去的时候总想着点几只高香，拜拜关二爷😆

# 柳暗花明
用 APM 里自带的 `Thread Profiler` 分析过几次，80%以上的时间都消耗在 `Object.wait()`，不解。。。     
![](//on6gnkbff.bkt.clouddn.com/20170503070231_new-relic-apm-thread-profiler.png){:width="100%"}
没办法，只好还是继续研究 `jstack` 了，里面也是好多 `WAITING` 状态的，不知道代表什么意思，google/百度呗，强大的 [stackoverflow](//stackoverflow.com) 几乎95以上的技术问题都能找到答案，前提是能看懂😆    
[这篇文章](//stackoverflow.com/questions/3780814/apache-tomcat-threads-in-waiting-state-with-100-cpu-utilisation)里提到 `wait on` 应该是 TCP/IP 后台监听线程，问题不在这里。于是把问题转向了 `BLOCKED`。于是开始统计每个状态出现的数量，分析每个状态代表的含义。 
```bash
# 直接统计采集样本里所有的状态并排序，这里重点关注 BLOCKED 状态
$ cat jstack_22582.txt|grep 'java.lang.Thread.State'|sort |uniq -c|sort
   2    java.lang.Thread.State: TIMED_WAITING (sleeping)
   4    java.lang.Thread.State: TIMED_WAITING (parking)
  13    java.lang.Thread.State: TIMED_WAITING (on object monitor)
  19    java.lang.Thread.State: WAITING (on object monitor)
  25    java.lang.Thread.State: WAITING (parking)
  35    java.lang.Thread.State: BLOCKED (on object monitor)
 163    java.lang.Thread.State: RUNNABLE
```
```bash
# 查看每个 BLOCKED 状态后面5行，可以看到业务代码集中到那块
$ cat jstack_22582.txt|grep 'BLOCKED' -A 5

# 按上面出现的较多关键词(比如：***Interface)统计出现的地方和次数，然后集中定位问题
$ cat jstack_22582.txt|grep 'BLOCKED' -A 5|grep '***Interface'|sort|uniq -c
   5    at com.***Interface.***kkk(***Interface.java:431)
  18    at com.***Interface.***new(***Interface.java:356)
   1    at com.***Interface.***new(***Interface.java:359)
   4    at com.***Interface.***ask(***Interface.java:7882)
   1    at com.***Interface.***oad(***Interface.java:8541)
```
把代码都过一遍发现大多是 log4j 的日志输出的地方。   
感觉看到了希望了，那就重构吧：能减少的地方就减少，能去掉的就去掉，能做开关的做开关

# 拨开乌云见青天
改完后就部署看效果，后面还是悲剧了，接着采样分析吧：
```bash
# 发现没有了 `BLOCKED` 了，那么问题很可能不是在这里，只好关注 `RUNNABLE` 了
$ cat jstack_27184.txt|grep 'java.lang.Thread.State'|sort |uniq -c|sort
   2    java.lang.Thread.State: TIMED_WAITING (sleeping)
   5    java.lang.Thread.State: TIMED_WAITING (parking)
   8    java.lang.Thread.State: WAITING (on object monitor)
  13    java.lang.Thread.State: TIMED_WAITING (on object monitor)
  14    java.lang.Thread.State: RUNNABLE
  23    java.lang.Thread.State: WAITING (parking)

# 整理了2个样本里 `RUNNABLE` 相关的业务代码，发现了端倪，`HashMap` 出现的频率非常高
# 这里看第1份样本
$ cat jstack_22582.txt|grep 'RUNNABLE' -A 5

# 统计 `HashMap` 高频率操作地方
$ cat jstack_22582.txt|grep 'RUNNABLE' -A 5|grep 'HashMap.get'|wc -l
      59
$ cat jstack_22582.txt|grep 'RUNNABLE' -A 5|grep 'HashMap.removeEntryForKey'|wc -l
      36
$ cat jstack_22582.txt|grep 'RUNNABLE' -A 5|grep 'HashMap.put'|wc -l
      58 
```
### 罪魁祸首：HashMap
啊，罪魁祸首就是 `HashMap` 相关的操作了。java基础忘光了，`HashMap`不是线程安全的，想到这猛然醒悟啊。更坑的是我还做了个工具类，内存缓存管理的，直接是那 `HashMap` 做的字典，模仿 memcache 操作，本地存取比使用 memcache 方便很多，因为直接就操作内存地址了。现象跟这篇文章([JAVA HASHMAP的死循环](//coolshell.cn/articles/9606.html))提到的 `HashMap` 死循环一样。

### 支持并发的 ConcurrentHashMap
```
直接把代码里的 HashMap 改为 ConcurrentHashMap！！！
ConcurrentHashMap 存取的 key 和 value 不能为 null，否则会报错，提前处理下就可以了
```

### 深刻的教训
```
再次以血的教训提醒大家，HashMap 不是线程安全的！！！
```

# 后话
改完之后第一晚上没问题了，终于可以睡个好觉了，开心😊，后面在观察几天看看。。。

# 附录代码
改造之后的缓存管理工具类：
```java
package com.xxx.common.utils;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 内存缓存管理 (单位分钟)
 * Created by xuyinglong on 16/10/1.
 */
public class CacheUtils {
    private static Map<String, Object> DICT             = new ConcurrentHashMap<String, Object>(20000);            // 数据字典
    private static Map<String, Long>   DICT_EXPIREDTIME = new ConcurrentHashMap<String, Long>(20000);    // 过期字典
    private static long                DEFAULT_MINUTE   = 15;    // 默认过期时间:15分钟

    /** 存 */
    public static boolean set(String key, Object obj) {
        return set(key, obj, DEFAULT_MINUTE);
    }

    /** 存, 指定过期时间 分钟 */
    public static boolean set(String key, Object obj, long minutes) {
        if (obj == null || key == null) return false;

        long time = System.currentTimeMillis() + minutes * 60 * 1000;
        DICT_EXPIREDTIME.put(key, time);
        DICT.put(key, obj);
        return true;
    }

    /** 存, 指定过期时间 分钟 */
    public static boolean set(String key, Object obj, double minutes) {
        if (obj == null || key == null) return false;

        long time = System.currentTimeMillis() + (long) (minutes * 60 * 1000);
        DICT_EXPIREDTIME.put(key, time);
        DICT.put(key, obj);
        return true;
    }

    /** 取 */
    public static Object get(String key) {
        Long time = DICT_EXPIREDTIME.get(key);
        if (time == null) return null;
        // 过期了
        if (time < System.currentTimeMillis()) {
            DICT_EXPIREDTIME.remove(key);
            DICT.remove(key);
            return null;
        }
        return DICT.get(key);
    }

    /** 删 */
    public static boolean delete(String key) {
        DICT_EXPIREDTIME.remove(key);
        DICT.remove(key);
        return true;
    }

    /** 状态:字典数量 */
    public static String status() {
        StringBuilder sb = new StringBuilder();
        sb.append("objects size:").append(DICT.size());
        return sb.toString();
    }

    /** 清理所有过期的内容(可定时任务清理) */
    public static int clearAllExpired() {
        int cnt = 0;
        long now = System.currentTimeMillis();
        Set<String> keys = DICT_EXPIREDTIME.keySet();
        for (String k : keys) {
            long time = DICT_EXPIREDTIME.get(k);
            if (time < now) {
                DICT_EXPIREDTIME.remove(k);
                DICT.remove(k);
                cnt++;
            }
        }
        return cnt;
    }

    /** 清理所有 */
    public static boolean clearAll() {
        DICT_EXPIREDTIME.clear();
        DICT.clear();
        return true;
    }

    /** 是否存在对象 */
    public static boolean exists(String key) {
        return get(key) != null;
    }

    public static void main(String[] args) {
        String key = "hello";
        CacheUtils.set(key, null);

        System.out.println(CacheUtils.get(key));
    }
}
```

参考：
- [Apache Tomcat Threads in WAITING State with 100% CPU utilisation](http://stackoverflow.com/questions/3780814/apache-tomcat-threads-in-waiting-state-with-100-cpu-utilisation)
- [Understanding Thread Dump of Apache Tomcat 6.0.26](http://stackoverflow.com/questions/14460029/understanding-thread-dump-of-apache-tomcat-6-0-26)
- [各种 Java Thread State 第一分析法则](http://www.cnblogs.com/zhengyun_ustc/archive/2013/03/18/tda.html)
- [疫苗：JAVA HASHMAP的死循环](http://coolshell.cn/articles/9606.html)
- [Why does ConcurrentHashMap prevent null keys and values?](http://stackoverflow.com/questions/698638/why-does-concurrenthashmap-prevent-null-keys-and-values)

