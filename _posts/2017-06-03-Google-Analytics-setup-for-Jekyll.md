---
layout: post
title: "Jekyll 安装 Google分析"
tagline: ""
date: '2017-06-03 12:40:11 +0800'
category: blog
tags: google blog
---
> Jekyll 安装 Google分析

文章写完了，有时候想知道有多少人看了，那些文章看的人最多，都分布在哪些地方，是搜索来的呢、还是直接进入的等等数据？这个时候有个人帮你统计就好了，`Google Analytics` 就是专门做这个的。国内就是百度统计了。

# Google Analytics账户
如果你没有 `Google Analytics` 账户，那么你需要先 [注册](https://analytics.google.com/analytics/web/provision?authuser=0#provision/SignUp/) 一个了，如果已经有 `Google Analytics` 账户，可以根据网站生成一个 tracking ID（跟踪ID），然后把 `Google Analytics` 提供的一段通用的 JavaScript 代码嵌入网站页面就可以开启统计了

# 安装代码
GA 的 JS 代码是需要嵌入每一个页面的，幸运的是 Jekyll 有公共的模板，只需要加入公共的模板里面，所有页面自动就包含进去了

## 默认主题：Minima
Jekyll(3.4.2) 默认的主题是：minima，这个主题其实已经包含了 Google Analytics，只需要在 `_config.xml` 里定设置tracking ID：`google_analytics` 即可
```bash
# 查看 jekyll 版本
$ bundle exec jekyll -version
jekyll 3.4.2

# minima 主题的相关文件目录 （Mac版）
$ open $(bundle show minima)
```

Minima 主题目录结构
```
 ├── LICENSE.txt
 ├── README.md
 ├── _includes
 │   ├── disqus_comments.html
 │   ├── footer.html
 │   ├── google-analytics.html
 │   ├── head.html
 │   ├── header.html
 │   ├── icon-github.html
 │   ├── icon-github.svg
 │   ├── icon-twitter.html
 │   └── icon-twitter.svg
 ├── _layouts
 │   ├── default.html
 │   ├── home.html
 │   ├── page.html
 │   └── post.html
 ├── _sass
 │   ├── minima
 │   │   ├── _base.scss
 │   │   ├── _layout.scss
 │   │   └── _syntax-highlighting.scss
 │   └── minima.scss
 └── assets
     └── main.scss
```

可以看到 `google-analytics.html` 就是我们我们需要的 JavaScript 模板，此文件的引用是在 `head.html` 里，而且已经区分了线上环境；而 `head.html` 包含在了 `default.html` 页面。

`google-analytics.html` 清单(Google Analytics生成的代码一样，所以就不用改动了)：
```html
<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
  {% raw %}
  ga('create', '{{ site.google_analytics }}', 'auto');
  ga('send', 'pageview');
  {% endraw %}
</script>
```
这里的 `site.google_analytics` 变量是全局 `tracking ID` 变量，在 `_config.xml` 里设置即可

## Twitter主题
由于我使用的是 Twitter 主题，而且可以使用多种统计，设置起来大同小异，不过记住一点即可：`所有页面都需要包含 GA 的 JavaScript 代码片段`

引用结构：
- 文章模板：`_includes/themes/twitter/default.html`
- 网站统计：`_includes/JB/analytics`
- GA统计：`_includes/JB/analytics-providers/google`
- tracking_id 的设置：在 `_config.yml` 文件里

`_includes/JB/analytics-providers/google` 代码清单：（这里的代码不是最新的，拿最新的 GA 替换一下既可以）
```javascript
<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
  {% raw %}
  ga('create', '{{ site.JB.analytics.google.tracking_id }}', 'auto');
  ga('send', 'pageview');
  {% endraw %}
</script>
```

`_config.yml` google统计：(provider 填写 google，tracking_id 填写你的网站的跟踪ID)
```yaml
  # Settings for analytics helper
  # Set 'provider' to the analytics provider you want to use.
  # Set 'provider' to false to turn analytics off globally.
  #
  analytics :
    provider : google
    gauges :
        site_id : 'SITE ID'
    google :
        tracking_id : 'UA-123456-1'
    getclicky :
      site_id :
    mixpanel :
        token : '_MIXPANEL_TOKEN_'
    piwik :
        baseURL : 'myserver.tld/piwik' # Piwik installation address (without protocol)
        idsite : '1'                   # the id of the site on Piwik
```

其他的主题也是大同小异

Have a good day ^_^

---
参考：
- [Google Analytics setup for Jekyll](https://michaelsoolee.com/google-analytics-jekyll/)
- [Jekyll Themes](https://jekyllrb.com/docs/themes/)

