---
layout: post
title: "Magic Thumb 图片缩放预览插件"
tagline: ""
description: "本博客图片大多情况下是缩小展示的，所以有时候看不太清楚，而Magic Thumb就能很好的解决这个问题"
date: '2017-08-06 17:35:58 +0800'
category: javascript
tags: javascript jekyll
---
> {{ page.description }}

# 缩放插件
Google上面找了一些插件，这里有几点要求：
- 可以放大图片查看，不能页面跳转
- 使用上越简单越好
- 开源或可以免费使用的

而最终选择的是：`Magic Thumb`

# 安装 Magic Thumb
下载免费试用版： [Download Free Trial](https://www.magictoolbox.com/static/magicthumb-trial.zip)     
嵌入 CSS 和 JS：
```html
<link href="magicthumb/magicthumb.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="magicthumb/magicthumb.js"></script>
```

使用：
```html
<a href="big.jpg" class="MagicThumb"><img src="small.jpg" alt="" /></a>
```

是不是感觉使用很简单，注意路径哦！

# 嵌入 Markdown
虽然使用已经很简单了，但是嵌入 Jekyll 里，那不还是得把有图片的地方挨个改一遍吗？

这个说实话是真不愿意去改，如果真的要改，Markdown 的语法也不太好操作！
```md
# markdown 图片语法
<a class="MagicThumb" href="http://xxx.com/xxx.png">
![](http://xxx.com/xxx.png){:width="100%"}
</a>

# Jekyll img 解析结果
<a class="MagicThumb" href="http://xxx.com/xxx.png">
    <img src="http://xxx.com/xxx.png" alt="" width="100%">
</a>
```

总之这就是最原始的办法，是不是太麻烦了点？

那么有没有简单的办法呢？比如用 JS 就可以改造 dom 节点，把 img 包装成 Magic Thumb 插件可用使用的样子？

# JS 改造
`assets/js/magicthumb_pre.js`
```javascript
/**
 *  magicthumb_pre.js 对站内的图片预处理
 *  依赖 zepto.min.js 等类jquery库
 *  v1.0 加入 magicthumb.js 可对图片进行缩放
 */
$(function(){
    var index = 0;
    $("img").each(function(){
        var $img = $(this);
        var thumb = (index++ == 0) ? 'id="thumb1"' : 'data-thumb-id="thumb1"';
        $img.before('<a class="MagicThumb" '+ thumb +' href="'+$img.attr("src")+'"></a>');
        $img.prev('.MagicThumb').append( $img );
        // reload all Magic Thumb images
        MagicThumb.refresh();
    });
})
```

幸好有API调用 `MagicThumb.refresh();` 不然就真的悲剧了！

# 嵌入 Jekyll
`_includes/themes/twitter/default.html`
```html
<!-- magicthumb plugin -->
<link type="text/css" rel="stylesheet" href="http://on6gnkbff.bkt.clouddn.com/20170806073349_magicthumb.css"/>
<script type="text/javascript" src="http://on6gnkbff.bkt.clouddn.com/20170806073350_magicthumb.js"></script>
<script type="text/javascript" src="/assets/js/magicthumb_pre.js"></script>
```
![](http://on6gnkbff.bkt.clouddn.com/20170806102645_magic-thumb-01.png){:width="100%"}
如此，Markdown嵌入图片的语法不用改动，而且老的文章也不需要修改，都可以使用Magic Thumb插件了！！！

上一篇文章图片比较多，不妨试试

---
参考：
- [8 Amazing JavaScript Image Zoom Scripts](https://www.intenseblog.com/design/8-amazing-javascript-image-zoom-scripts.html)
- [Magic Thumb - Integration Guide](https://www.magictoolbox.com/magicthumb/integration/)

