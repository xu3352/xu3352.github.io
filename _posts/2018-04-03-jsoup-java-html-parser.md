---
layout: post
title: "Jsoup:Java的HTML解析器"
tagline: ""
description: "一款处理HTML的Java库; 提供非常强大的API和类似Jquery选择器的方法来解析HTML"
date: '2018-04-03 16:26:22 +0800'
category: java
tags: jsoup java
---
> {{ page.description }}

# Jsoup简介
一款非常强大的处理HTML的Java库

以前拿来解析过HTML文档, 如果你经常用jquery, 那么用起来就会非常顺手了, 最近发现这个其实已经自带发送请求这块, 而且还是比较完善的...

# 发送http请求
这里来个简单的示例
```bash
Document doc = Jsoup.connect("http://example.com/hello.html")  
  .followRedirects(true)
  .ignoreContentType(true)
  .data("query", "Java")  
  .userAgent("Mozilla")  
  .cookie("auth", "token")  
  .referrer("http://example.com")
  .header("key", "value")
  .timeout(3000)  
  .post(); 
```

**详解**:
- `followRedirects` - 如果页面重定向了, 这个可以自动跳转到目标页面
- `ignoreContentType` - 可以忽略返回 header 中的 `Content-Type` 值, 某些情况下很有用
- `data` - `post` 请求时的数据, 有好几个重载的方法, kv 或 `map` 的应该最常用
- `userAgent` - 可快捷的设置请求 header 的 `User-Agent` 值
- `cookie` - 可快捷的设置请求 header 的 `cookie` 值
- `referrer` - 可快捷的设置请求 header 的 `referer` 值
- `header` - 其他请求 header 的值可单独设置
- `timeout` - 超时设置
- `post` - 支持 `post` 和 `get` 方法, 另外还有 `execute()` `request()` `response()` 方法

你能想到的使用方式, 人家应该都想到了  :) 

更多的方法请查看对应的[Connection API文档](https://jsoup.org/apidocs/org/jsoup/Connection.html)

# 解析数据
最舒服的就是可以使用JS和类似jquery选择器的写法了

主要的类结构图
```bash
java.lang.Object
    org.jsoup.nodes.Node
        org.jsoup.nodes.Element
            org.jsoup.nodes.Document
```

由于 `Document` 继承自 `Element`; 而 `Element` 继承自 `Node`; 所以 `Document` 拥有最多的方法数量, 我们只单独看一下我觉得最厉害的 `select` 函数

```bash
# 这里相当于是集合
Elements es = document.select(".content .content-article");

# 这里是一个元素, 如果没有一个元素的话可能报错的哦
Element e = document.select(".content .content-article").get(0);
```

`select` 传的参数就是就是jquery的选择器, 这个可以帮你快速的定位到你想要的HTML标签

`Elements` 是一个集合, 同样也提供 `select` 方法的!

**获取到对应的HMTL标签元素后, 获取数据的方法 (Element)**:
- `text()` - 获取标签对应的文本内容
- `attr("href")` - 获取标签对应的 `href` 属性
- `html()` - 把标签内的所有HTML内容返回
- `hasAttr("src")` - 判断标签是否包含 `src` 属性
- `hasClass("rowColor")` - 判断标签是否包含 `rowColor` class类

更多的方法请查阅[Element API文档](https://jsoup.org/apidocs/org/jsoup/nodes/Element.html)


---
参考：
- [Jsoup官网:示例/下载/API文档](https://jsoup.org/)
- [Jsoup简介——使用Java抓取网页数据](https://blog.csdn.net/allen315410/article/details/40115479)

