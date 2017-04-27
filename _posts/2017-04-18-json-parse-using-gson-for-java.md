---
layout: post
title:  "Java中使用Gson解析json"
date:   2017-04-18 00:13:00 +0800
category : java
tags: java json gson intellij-idea
---
> Gson来解析json字符串到对象还是非常方便的

# GsonFormat插件
Idea里有个插件 `GsonFormat`，可以直接从 `json` 串快速转换成字段和对象，非常方便。比如从数据库 copy 一行数据的时候选择 `json` 格式，然后用这个插件直接生成字段。

`Gson` 操作非常简单，只需要预先定义好需要转换的对象即可（复杂对象一定注意层级关系），然后直接调用 `Gson.fromJson()` 方法即可。

# 例子
```java
// Car Object
public class Car {
    public String brand = null;
    public int    doors = 0;
}


// Main测试
String json = "{\"brand\":\"Jeep\", \"doors\": 3}";

Gson gson = new Gson();

Car car = gson.fromJson(json, Car.class);
```

# 错误
如果遇到`TokenMgrError`错误情况，则表示解析错误（下面的则是：英文双引号不匹配），把错误堆栈和原始串都打印出来，找到指定的`column`位置附近，看看就知道原因了。这种的会导致无法解析，从源头解决问题应该是最便捷的。
```java
Caused by: com.google.gson.TokenMgrError: Lexical error at line 1, column 1541.  Encountered: "\u3002" (12290), after : ""
Caused by: com.google.gson.TokenMgrError: Lexical error at line 1, column 3838.  Encountered: "^" (94), after : ""
```

参考：
[GSON - Gson](http://tutorials.jenkov.com/java-json/gson.html)

