---
layout: post
title: "Java浮点计算金额精度问题"
keywords: "java,float,precision,money "
description: "Java浮点计算金额精度问题"
tagline: ""
date: '2022-02-22 10:54:56 +0800'
category: java
tags: java java-utils
---
> {{ page.description }}

# 直接上代码
```java
package xxxx;

import java.math.BigDecimal;

/**
 * MoneyUtil 金额的 加/减/乘/除
 * 由于 double 精度无法保证, 用 BigDecimal 处理
 * @author xuyinglong
 */
public class MoneyUtil {

    /** d1+d2 */
    public static double add(double d1, double d2) {
        BigDecimal a1 = new BigDecimal(Double.toString(d1));
        BigDecimal b1 = new BigDecimal(Double.toString(d2));
        double d = a1.add(b1).doubleValue();
        return d;
    }

    /** 多个累加 a + b + ... + n */
    public static double adds(double... args) {
        double sum = 0.0;
        for (int i = 0; i < args.length; i++) {
            sum = add(sum, args[i]);
        }
        return sum;
    }

    /** d1-d2 */
    public static double sub(double d1, double d2) {
        BigDecimal a1 = new BigDecimal(Double.toString(d1));
        BigDecimal b1 = new BigDecimal(Double.toString(d2));
        return a1.subtract(b1).doubleValue();
    }

    /** d1*d2 */
    public static double mul(double d1, double d2) {
        BigDecimal bd1 = new BigDecimal(Double.toString(d1));
        BigDecimal bd2 = new BigDecimal(Double.toString(d2));
        return bd1.multiply(bd2).doubleValue();
    }

    /** d1/d2 */
    public static double div(double d1, double d2, int scale) {
        if (d2 == 0) return 0.0;
        BigDecimal bd1 = new BigDecimal(Double.toString(d1));
        BigDecimal bd2 = new BigDecimal(Double.toString(d2));
        return bd1.divide(bd2, scale, BigDecimal.ROUND_HALF_UP).doubleValue();
    }
}
```

还有个简单点的方案, 直接用整形, 精确到分, 加法/减法/乘法基本没问题, 除法简单处理一下就行了


