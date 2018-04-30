---
layout: post
title: "Jquery ABigImage 图片预览插件"
tagline: ""
description: "原来的 `Magicthumb` 插件有个bug, 多个图片点后面的图片进行预览时, 文章里的图片会消失; 另外感觉 `ABigImage` 要舒服一点"
date: '2018-04-30 14:01:38 +0800'
category: blog
tags: javascript jquery-plugin jekyll blog
---
> {{ page.description }}

# ABigImage 插件
[老版本的Demo](https://www.jqueryscript.net/demo/Minimal-jQuery-Image-Viewer-with-Image-Preloading-ABigImage/)

新版本的直接到 `Github` 上下载最新的就行: [Github:makryl/ABigImage](https://github.com/makryl/ABigImage)

把 `abigimage.jquery.min.js` 和 `abigimage.jquery.min.css` 存到本地, 然后找几个图片试试
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
</head>
<link href="./abigimage.jquery.min.css" rel="stylesheet" type="text/css">
<body>
<p>
    <a href="img/1-big.jpg"><img src="img/1-small.jpg" alt="First image"></a>
    <a href="img/2-big.jpg"><img src="img/2-small.jpg" alt="Second image"></a>
    <a href="img/3-big.jpg"><img src="img/3-small.jpg" alt="Third image"></a>
</p>
</body>
<script src="https://code.jquery.com/jquery-2.0.3.min.js"></script>
<script src="./abigimage.jquery.min.js"></script>
<script>
    $(function() {
        $('a[href$=".png"]').abigimage({
            bottomCSS: {
                fontSize: '2em',
                textAlign: 'center'
            },
            onopen: function (target) {
                this.bottom.html(
                    $('img', target).attr('alt')
                );
            }
        });
    });
</script>
</html>
```

# 替换插件
`_includes/themes/twitter/default.html` 对比:
```diff
diff --git a/_includes/themes/twitter/default.html b/_includes/themes/twitter/default.html
index 68f39f6..2d23c3b 100644
--- a/_includes/themes/twitter/default.html
+++ b/_includes/themes/twitter/default.html
@@ -60,14 +60,14 @@

     {% if page.layout == 'post' %}
     <!-- diy js -->
-    <script type="text/javascript" src="/assets/js/zepto.min.js"></script>
+    <script type="text/javascript" src="/assets/js/jquery-3.3.1.min.js"></script>
     <script type="text/javascript" src="/assets/js/post_nav.js"></script>
     <script type="text/javascript" src="/assets/js/sidebar_wide_narrow.js"></script>

-    <!-- magicthumb plugin -->
-    <link type="text/css" rel="stylesheet" href="/assets/css/magicthumb.css"/>
-    <script type="text/javascript" src="/assets/js/magicthumb.js"></script>
-    <script type="text/javascript" src="/assets/js/magicthumb_pre.js"></script>
+    <!-- abigimage plugin -->
+    <link type="text/css" rel="stylesheet" href="/assets/css/abigimage.jquery.min.css"/>
+    <script type="text/javascript" src="/assets/js/abigimage.jquery.min.js"></script>
+    <script type="text/javascript" src="/assets/js/abigimage.init.js"></script>
     {% endif %}
   </body>
 </html>
```

**说明**:
- `zepto.min.js` 换成了 `jquery-3.3.1.min.js` (不然提示找不到JQuery)
- `magicthumb.css` 换成了 `abigimage.jquery.min.css`
- `magicthumb.js` 换成了 `abigimage.jquery.min.js`
- `magicthumb_pre.js` 换成了 `abigimage.init.js`

`abigimage.init.js` 内容:
```javascript
/**
 *  abigimage.init.js 对站内的图片预处理
 *  依赖 jquery
 */
$(function(){
    // 预处理
    $("img").each(function(){
        var $img = $(this);
        $img.before('<a class="abigimage" href="'+$img.attr("src")+'"></a>');
        $img.prev('.abigimage').append( $img );
    });

    // 初始化插件
    $('a.abigimage').abigimage({
        bottomCSS: {
            fontSize: '2em',
            textAlign: 'center'
        },
        onopen: function (target) {
            this.bottom.html(
                $('img', target).attr('alt')
            );
        }
    });
})
```

# 样式调整
由于该插件在本博客顶部被遮挡, 所以把插件的顶部放到底部, 小改造一下:

打开 `abigimage.jquery.min.css` 文件

把 `.abigimage-top{top:0;` 改为 `.abigimage-top{bottom: 2.5em;`


最后来个效果图:
![效果图](http://on6gnkbff.bkt.clouddn.com/20180430063633_jquery-abigimage-plugin-viewing-image.png){:width="100%"}


---
参考：
- [老版本:jQuery ABigImage Example](https://www.jqueryscript.net/demo/Minimal-jQuery-Image-Viewer-with-Image-Preloading-ABigImage/)
- [新版本:Github:makryl/ABigImage](https://github.com/makryl/ABigImage)
- [Magic Thumb 图片缩放预览插件](https://xu3352.github.io/javascript/2017/08/06/magic-thumb-plugin)

