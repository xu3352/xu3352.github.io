---
layout: post
title: "Jquery fancybox 图片预览插件"
tagline: ""
description: "`Fancybox` 一个效果非常棒的图片预览插件"
date: '2018-10-19 20:55:01 +0800'
category: javascript
tags: fancybox jquery javascript
---
> {{ page.description }}

话说这是我用过的第3个图片预览插件了:
1. `Magic Thumb`
1. `A Big Image` 
1. `fancybox`

# fancybox
直接上 Demo 看效果: `funcybox.html`
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>FuncyBox Test</title>

    <!-- Add jQuery library -->
    <script type="text/javascript" src="http://code.jquery.com/jquery-latest.min.js"></script>
    <!-- Add fancyBox -->
    <link rel="stylesheet" href="http://fancyapps.com/fancybox/source/jquery.fancybox.css?v=2.1.7" type="text/css" media="screen" />
    <script type="text/javascript" src="http://fancyapps.com/fancybox/source/jquery.fancybox.pack.js?v=2.1.7"></script>
</head>
<body>
    <h1>FuncyBox Test</h1>

    <div>
        js/css/png/gif 资源:
        <pre>
        wget http://fancyapps.com/fancybox/source/jquery.fancybox.pack.js
        wget http://fancyapps.com/fancybox/source/jquery.fancybox.css

        wget http://fancyapps.com/fancybox/source/fancybox_sprite.png
        wget http://fancyapps.com/fancybox/source/fancybox_loading.gif
        wget http://fancyapps.com/fancybox/source/blank.gif
        wget http://fancyapps.com/fancybox/source/fancybox_overlay.png
        wget http://fancyapps.com/fancybox/source/fancybox_sprite@2x.png
        wget http://fancyapps.com/fancybox/source/fancybox_loading@2x.gif
        </pre>    
    </div>

    <div>
        <h3>图集1</h3>
        <a class="fancybox" rel="gallery1" href="http://farm2.staticflickr.com/1669/23976340262_a5ca3859f6_b.jpg" title="Twilight Memories (doraartem)">
            <img src="http://farm2.staticflickr.com/1669/23976340262_a5ca3859f6_m.jpg" alt="" />
        </a>
        <a class="fancybox" rel="gallery1" href="http://farm2.staticflickr.com/1459/23610702803_83655c7c56_b.jpg" title="Electrical Power Lines and Pylons disappear over t.. (pautliubomir)">
            <img src="http://farm2.staticflickr.com/1459/23610702803_83655c7c56_m.jpg" alt="" />
        </a>

        <h3>图集2</h3>
        <a class="fancybox" rel="gallery2" href="http://farm2.staticflickr.com/1617/24108587812_6c9825d0da_b.jpg" title="Morning Godafoss (Brads5)">
            <img src="http://farm2.staticflickr.com/1617/24108587812_6c9825d0da_m.jpg" alt="" />
        </a>
        <a class="fancybox" rel="gallery2" href="http://farm4.staticflickr.com/3691/10185053775_701272da37_b.jpg" title="Vertical - Special Edition! (cedarsphoto)">
            <img src="http://farm4.staticflickr.com/3691/10185053775_701272da37_m.jpg" alt="" />
        </a>
    </div>
</body>

<script type="text/javascript">
    $(document).ready(function() {
        $(".fancybox").fancybox();
    });
</script>
</html>
```
上面是分了2个图集, 如果想合成一个图集, 把 `gallery2` 改成 `gallery1` 就行; 即:名字一样的一组


# 插件更换
在 [ABigImage](https://xu3352.github.io/blog/2018/04/30/abigimage-a-jquery-plugin-for-viewing-images) 里之前已经详细介绍过了, 这里就不再赘述了

大致步骤: 
- 把 `js/css/png/gif` 下载到本地
- 图片和 `css` 要放一块
- 引入 `js/css` 资源文件 
- 初始化 js 调整

# 效果图集

![图1](http://farm2.staticflickr.com/1669/23976340262_a5ca3859f6_b.jpg){:width="60%"}
![图2](http://farm2.staticflickr.com/1459/23610702803_83655c7c56_b.jpg){:width="60%"}
![图3](http://farm2.staticflickr.com/1617/24108587812_6c9825d0da_b.jpg){:width="60%"}
![图4](http://farm4.staticflickr.com/3691/10185053775_701272da37_b.jpg){:width="60%"}

---
参考：
- [官网(介绍/示例/文档) - fancyBox2](http://fancyapps.com/fancybox/)
- [发现图片预览插件的网站 - AloneMonkey](http://www.alonemonkey.com/)

之前的2个插件:
- [Jquery ABigImage 图片预览插件](https://xu3352.github.io/blog/2018/04/30/abigimage-a-jquery-plugin-for-viewing-images)
- [Magic Thumb 图片缩放预览插件](https://xu3352.github.io/javascript/2017/08/06/magic-thumb-plugin)

