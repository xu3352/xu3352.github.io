---
layout: post
title: "Liquid Exception: Invalid Date: '\"{time} +0800\"' is not a valid datetime"
tagline: ""
description: "今天把 Jekyll 玩坏了，应该是 jekyll 从 3.4.3 升级到 3.5.1 后 liquid 日期函数处理兼容问题导致的"
date: '2017-08-09 21:07:51 +0800'
category: blog
tags: jekyll liquid blog
---
> {{ page.description }}

# 缘由
最初是因为本地的一遍文章推送到 github 之后不显示。

于是就 google 了一下，猜想应该是时区的问题，于是就想法子怎么统一一下环境，然后开始更新本地的组建：
```bash
# 单独更新 github-pages
bundle update github-pages
# 或者全部更新所有组建
bundle update

# 使用 gem 单独更新
gem update github-pages
```
后来发现没有安装 `github-pages` 于是就安装：`gem install github-pages`，依赖一大堆。。。

好嘛，当我更新完之后，重启 Jekyll 的时候，报错了：
```java
Configuration file: /Users/xuyinglong/blog/_config.yml
            Source: /Users/xuyinglong/blog
       Destination: /Users/xuyinglong/blog/_site
 Incremental build: disabled. Enable with --incremental
      Generating...
  Liquid Exception: Invalid Date: '"{time} +0800"' is not a valid datetime. in /_layouts/post.html
             ERROR: YOUR SITE COULD NOT BE BUILT:
                    ------------------------------------
                    Invalid Date: '"{time} +0800"' is not a valid datetime.
```

# 悲剧开始
继续 Google，然后各种折腾，没好使。。。有的是 date 为空，有的是文章放错了目录

于是准备着把刚刚新安装的组建都卸载了，幸好控制台还能看到刚刚新安装的是哪些，于是就挨个卸载了一遍（50个gem...），然后开始回滚 `Gemfile.lock` 到更新之前，嗯，好使了

# 找到问题
应该是不小心 `bundle update` 更新之后， 发现 `Gemfile.lock` 里 Jekyll 版本变升级后又出现了该问题，于是反复尝试几次过后，确定是Jekyll版本升级导致的问题

至于正在的原因，好吧，其实我是个小白

按理说不应该啊，`Liquid` 语法都是一样的，那么应该就是 `ruby datetime` 格式化的时候有问题了，于是尝试了自定义的格式化，发现好使了

# 修复问题
自定义 Date 格式：两个效果是一样的，但是后者不再报错了
```diff
{% raw %}
diff --git a/_includes/themes/twitter/post.html b/_includes/themes/twitter/post.html
index 4385da0..9ff0c05 100644
--- a/_includes/themes/twitter/post.html
+++ b/_includes/themes/twitter/post.html
@@ -27,7 +27,7 @@

   <div class="span4">
     <h4>Published</h4>
-    <div class="date"><span>{{ page.date | date_to_long_string }}</span></div>
+    <div class="date"><span>{{ page.date | date:"%d %B %Y" }}</span></div>

   {% unless page.tags == empty %}
     <h4>Tags</h4>
{% endraw %}
```
日期格式化语法与：[strftime](http://strftime.net/) 一样，这个可以可视化的操作，很方便

---
参考：
- [用Jekyll创建博客本地正常，上传到GitHub后不能显示文章列表？](https://segmentfault.com/q/1010000004584816/a-1020000004586702)
- [Setting up your GitHub Pages site locally with Jekyll](https://help.github.com/articles/setting-up-your-github-pages-site-locally-with-jekyll/)
- [Liquid Exception. Invalid Date](https://github.com/jekyll/jekyll/issues/2003)

