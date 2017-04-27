---
layout: post
title: "Jekyll安装Twitter主题包"
date: '2017-04-26 20:47:00 +0800'
categories: blog
tags: jekyll theme
---

> Jekyll美化，安装一个能瞅对眼的主题

# Twitter Theme
主题虽多，但能符合自己胃口的就少了，NB的人都是自己造一个😆。找来找去，发现 twitter 的这个主题整体看起来比较简洁，包含了分类，页面，标签，评论，统计等东东。东西还是非常全的，就试试吧，总比默认的看着舒服点。

# 安装 jekyll-bootstrap
```bash
# 需要先安装这个 Jekyll-Bootstrap 
$ git clone https://github.com/plusjade/jekyll-bootstrap.git
$ cd jekyll-bootstrap

# 关联到自己的 github.io
$ git remote set-url origin git@github.com:xu3352/xu3352.github.io.git

# 然后把自己的文章拉下来，应该是会冲突的，我之前没使用过其他主题，这些文件有冲突：_config.yml Gemfile Gemfile.lock index.md .gitignore，手动解决一下吧
$ git pull

# 跑起来看看效果 或 bundle exec jekyll serve
$ jekyll serve
```

# 安装 twitter 主题
```bash
# 自带的没有这个得劲
$ rake theme:install git="https://github.com/jekyllbootstrap/theme-twitter.git"
```

# 切换主题
```bash
# 如果安装了其他 bootstrap 主题，可以切换哦
rake theme:switch name="the-program"
```

# 语法高亮 css 修改
Twitter 的代码渲染还是有点坑，看起来着实不爽，纠结了好久之后，发现生成的 html dom 结构并没有改变，哈哈，也就是说是 css 没支持，那么把原来好使 css 拿过来用就可以了。

1. 把 code 背景色去掉
```css
/** code{background-color:#fee9cc;color:rgba(0, 0, 0, 0.75);padding:1px 3px;} */
code{color:rgba(0, 0, 0, 0.75);padding:1px 3px;}
```

2. 在```assets/themes/twitter/css/1.4.0/bootstrap.css``` 文件最后追加原先的语法高亮支持
```css
/** Syntax highlighting styles */
.highlight { background: #fff; }
.highlighter-rouge { background: #eef; }
.highlighter-rouge .highlight { background: #eef; }
.highlight .c { color: #998; font-style: italic; }
.highlight .err { color: #a61717; background-color: #e3d2d2; }
.highlight .k { font-weight: bold; }
.highlight .o { font-weight: bold; }
.highlight .cm { color: #998; font-style: italic; }
.highlight .cp { color: #999; font-weight: bold; }
.highlight .c1 { color: #998; font-style: italic; }
.highlight .cs { color: #999; font-weight: bold; font-style: italic; }
.highlight .gd { color: #000; background-color: #fdd; }
.highlight .gd .x { color: #000; background-color: #faa; }
.highlight .ge { font-style: italic; }
.highlight .gr { color: #a00; }
.highlight .gh { color: #999; }
.highlight .gi { color: #000; background-color: #dfd; }
.highlight .gi .x { color: #000; background-color: #afa; }
.highlight .go { color: #888; }
.highlight .gp { color: #555; }
.highlight .gs { font-weight: bold; }
.highlight .gu { color: #aaa; }
.highlight .gt { color: #a00; }
.highlight .kc { font-weight: bold; }
.highlight .kd {font-weight: bold;}
.highlight .kp { font-weight: bold; }
.highlight .kr { font-weight: bold; }
.highlight .kt { color: #458; font-weight: bold; }
.highlight .m { color: #099; }
.highlight .s { color: #d14; }
.highlight .na { color: #008080; }
.highlight .nb { color: #0086B3; }
.highlight .nc { color: #458; font-weight: bold; }
.highlight .no { color: #008080; }
.highlight .ni { color: #800080; }
.highlight .ne { color: #900; font-weight: bold; }
.highlight .nf { color: #900; font-weight: bold; }
.highlight .nn { color: #555; }
.highlight .nt { color: #000080; }
.highlight .nv { color: #008080; }
.highlight .ow { font-weight: bold; }
.highlight .w { color: #bbb; }
.highlight .mf { color: #099; }
.highlight .mh { color: #099; }
.highlight .mi { color: #099; }
.highlight .mo { color: #099; }
.highlight .sb { color: #d14; }
.highlight .sc { color: #d14; }
.highlight .sd { color: #d14; }
.highlight .s2 { color: #d14; }
.highlight .se { color: #d14; }
.highlight .sh { color: #d14; }
.highlight .si { color: #d14; }
.highlight .sx { color: #d14; }
.highlight .sr { color: #009926; }
.highlight .s1 { color: #d14; }
.highlight .ss { color: #990073; }
.highlight .bp { color: #999; }
.highlight .vc { color: #008080; }
.highlight .vg { color: #008080; }
.highlight .vi { color: #008080; }
.highlight .il { color: #099; }
```

# 其他
运行 ```jekyll serve``` 如果报错```“Liquid Exception: Failed to get header.”```，需要把 ```_config.yml``` 文件中的：
```highlighter: pygments``` 修改为 ```highlighter: rouge```
```bash
# 记得先安装 rouge
gem install rouge
```


参考：
- [快速使用jekyll bootstrap主题](http://codecly259.github.io/hexo-blog/2016/05/17/2016-02-2016-02-20-use-jekyll-bootstrap/)
- [Jekyll Bootstrap Theme](http://themes.jekyllbootstrap.com/preview/twitter/)
- [Jekyll Themes](https://jekyllrb.com/docs/themes/)
- [Error running 'jekyll serve': "Liquid Exception: Failed to get header."](https://teamtreehouse.com/community/error-running-jekyll-serve-liquid-exception-failed-to-get-header)

