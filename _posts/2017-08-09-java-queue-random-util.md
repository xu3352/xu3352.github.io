---
layout: post
title: "Java 队列随机工具类"
tagline: ""
description: "队列随机工具类: 按顺序取一个少一个,取完一轮之后,再从头开始取；以达到尽量平均的效果"
date: '2017-08-09 16:24:53 +0800'
category: java
tags: java java-utils
---
> {{ page.description }}

# 随机
某些场景下使用随机达到想要的效果并不理想，比如有时候想尽量每个值都平均一点

示例：0~10的随机数，获取1w次后，打印每个数的随机到的次数：
```java
import java.util.HashMap;
import java.util.Map;

/**
 * Created by xuyinglong on 14-12-23.
 */
public class Test {
    /**
     * 区间随机数 [min, max)
     * @param min 最小值 包含
     * @param max 最大值 不包含
     */
    public static int rand(int min, int max) {
        double r = Math.random();
        return (int) Math.floor(r * (max - min)) + min;
    }

    public static void main(String[] args) {
        Map<Integer, Integer> dict = new HashMap<Integer, Integer>();
        for (int i = 0; i < 10000; i++) {
            // 随机 [0,10)
            int d = rand(0, 10);

            // 次数+1
            Integer cnt = dict.get(d);
            dict.put(d, (cnt == null) ? 0 : ++cnt);
        }
        System.out.println( dict );
    }
}

```

运行一次的结果：
```java
{0=972, 1=974, 2=997, 3=1034, 4=985, 5=988, 6=983, 7=1009, 8=1038, 9=1010}
```

结果大致上还是是比较均匀的

# 尽量平均
但是这种方式随机实际做不到尽可能的平均

举个例子：6个人分一筐橘子，只能按个数分，这个时候丢骰子就不太好了，虽然每个人的概率是一样的，那么就一人拿一个，拿完为止。这样大不了只比比别人少一个而已。

```java
import java.util.ArrayList;
import java.util.List;

/**
 * 队列随机工具类:按顺序取一个少一个,取完一轮之后,再从头开始取
 * Created by xuyinglong on 17/8/9.
 */
public class QueueRandomUtil<T> {
    /** 数据是否存在 */
    public static <T> boolean exists(String key) {
        return CacheUtils.exists(key);
    }

    /** 设置缓存数据 */
    public static <T> boolean set(String key, List<T> list, int minutes) {
        return CacheUtils.set(key, list, minutes);
    }

    /** 随机获取几个数据 */
    public synchronized static <T> List<T> rand(String key, int cnt) {
        List<T> list = (List<T>) CacheUtils.get(key);
        if (ParamUtil.isEmpty(list)) return null;

        // 下标KEY
        String subIndexKey = "QRU_" + key + "_SUBINDEX";
        Integer subIndex = (Integer) CacheUtils.get(subIndexKey);
        if (subIndex == null) subIndex = 0;

        // 按下标其实值获取值
        List<T> data = new ArrayList<T>();
        for (int i = 0; i < cnt; i++) {
            if (subIndex != 0 && subIndex >= list.size()) {
                subIndex = 0;
            }

            data.add(list.get(subIndex));
            subIndex++;
        }
        CacheUtils.set(subIndexKey, subIndex, 60);  // 1h
        return data;
    }

    public static void main(String[] args) throws InterruptedException {
        // 数据准备
        List<String> list = new ArrayList<String>();
        for (int i = 0; i < 10; i++) {
            list.add(i + "");
        }
        System.out.println("原始数据:" + list);

        String key = "hello";
        // 如果数据过期, 需要重新设置数据....
        if (!QueueRandomUtil.exists(key)) {
            QueueRandomUtil.set(key, list, 5);  // 数据重新加载
        }

        // 获取数据测试 10次
        for (int i = 0; i < 10; i++) {
            int cnt = RandomUtil.rand(0, 15);
            List<String> r = QueueRandomUtil.rand(key, cnt);
            Thread.sleep(1 * 1000); // 2s
            System.out.println("index:" + i + "\tcnt:" + cnt + "\tdata:" + r);
        }
    }
}
```

这里利用的缓存机制，把数据列表和下标都存起来了，每次使用的时候按照最后的索引来取数据，如此循环取数据，达到尽量平均的效果！

测试结果:
```java
原始数据:[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
index:0	cnt:9	data:[0, 1, 2, 3, 4, 5, 6, 7, 8]
index:1	cnt:14	data:[9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2]
index:2	cnt:5	data:[3, 4, 5, 6, 7]
index:3	cnt:14	data:[8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1]
index:4	cnt:7	data:[2, 3, 4, 5, 6, 7, 8]
index:5	cnt:5	data:[9, 0, 1, 2, 3]
index:6	cnt:11	data:[4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4]
index:7	cnt:1	data:[5]
index:8	cnt:11	data:[6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6]
index:9	cnt:13	data:[7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
```

`CacheUtils` 是一个内存缓存工具类 请参考：[缓存管理工具类](https://xu3352.github.io/linux/2017/05/02/tomcat-cpu-100-utilisation#附录代码)

---
参考：
- [Tomcat CPU 100%使用率](https://xu3352.github.io/linux/2017/05/02/tomcat-cpu-100-utilisation)

