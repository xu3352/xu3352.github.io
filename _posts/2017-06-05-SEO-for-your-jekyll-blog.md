---
layout: post
title: "Jekyll SEO优化"
tagline: ""
description: "SEO优化可以让搜索引擎跟好的抓取你的blog网页，提高网站的权重，更有利于搜索推广"
date: '2017-06-05 14:56:31 +0800'
category: blog
tags: jekyll blog
---
> {{ page.description }}

# Jekyll SEO
看到一篇 Jeky SEO 优化的文章，自己也是按照这种方式做了一下 SEO 优化，这里也分享一下

## 1.不使用默认的标题
默认的文章标题是不包含网站标题的，这里可以修改：`default.html`
```html
{% raw %}<title>{% if page.title %}{{ page.title }} - {{ site.title }}{% else %}{{ site.title }}{% endif %}</title>{% endraw %}
```

## 2.所有页面使用 description meta 标签
默认的模板里可能没有，那么需要自己设置：`default.html`
(一些主题已经有的模板里已经了，只需在文章的 yaml 头加一个字段：`description`即可)
```html
{% raw %}<meta name="description" content="{{ site.description }}">{% endraw %}
```

## 3.所有页面使用 rel=author meta 标签
关联 google+ 的个人主页：`default.html`
```html
<link rel="author" href="https://plus.google.com/+yinglongxu"/>
```

## 4.生成 sitemap 
这个有利于搜索引擎爬取你网站的结构页面，只需要在 `_config.xml` 文件里加上 `jekyll-sitemap` gem 插件
```yaml
gems:
  - jekyll-sitemap
```

## 5.添加 robots.txt 文件
在网站根目录下创建：`robots.txt` 文件，直接指向 sitemap 就可以
```
# www.robotstxt.org/
# www.google.com/support/webmasters/bin/answer.py?hl=en&answer=156449

User-agent: *
Sitemap: https://xu3352.github.io/sitemap.xml
```

# 最后
部分信息需要换成自己的，比如 google+账号 和 robots.txt 文件里的一些内容     

---
参考：
- [SEO for your Jekyll blog](http://vdaubry.github.io/2014/10/21/SEO-for-your-Jekyll-blog/)
- [5 Common SEO Mistakes with Web Page Titles](http://sixrevisions.com/content-strategy/5-common-seo-mistakes-with-web-page-titles/)
- [Meta Description Tag - Learn SEO](http://moz.com/learn/seo/meta-description)
- [How to Implement the Rel=”Author” Tag – A Step by Step Guide](http://www.vervesearch.com/blog/how-to-implement-the-relauthor-tag-a-step-by-step-guide/)

