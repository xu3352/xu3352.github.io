---
layout: post
title: "Jekyll Twitter Bootstrap主题 内容宽屏和窄屏插件"
tagline: ""
description: "由于默认的主题内容展示区域太窄了, 做个js可以一键加宽的"
date: '2017-08-13 03:20:26 +0800'
category: blog
tags: jekyll javascript blog
---
> {{ page.description }}

# 缘由
由于本博客主题是基于 Twitter Bootstrap Theme的, 在大点的屏幕展示文章时会显得内容很窄(笔记本还好), 而右侧的边栏占用了部分空间, 下拉的之后更是总空白一片, 于是就想着能否把内容全部铺满, 把右侧边栏隐藏或者右移处理

既然之前都搞了个 js 插件, 在边栏把文章目录都展示出来了, 这个当然也是可以搞的, 嘿嘿...

# 准备
先使用 `chrome` 或者 `firefox` 使用控制台模式, 简单的实验修改样式或者属性, 把达到效果的参数都记录下来, 到时候插件里使用

浏览器控制台也是可以直接写 js 操作 dom, 可以先写个原型 demo 出来, 大致的步骤出来了, 最终组合成 js 插件, 然后反复雕琢到自己满意就行了

热插拔: 安装就生效, 卸载就回到原始状态, 没有其他影响!

# javascript 插件
插件: `assets/js/sidebar_wide_narrow.js`
```javascript
/**
 * content wide or narrow screen modle plugin
 * author xu3352@gmail.com
 * 依赖 zepto.min.js 等类jquery库
 * v1.0
 */
$(function(){
    var titles = ["☞ WideScreen Model", "☜ NarrowScreen Model"];

    // add a switch to sidebar
    var $sideBar = $("ul.tag_box").parent();
    var s = '<h4 class="sidebar-switch" is-narrow="true" style="color:#0069a0;cursor:pointer;" title="Click to Switch.">'+titles[0]+'</h4>';
    $sideBar.append( s );

    // init setting
    $(".span4").css("position","fixed")
               .css("margin-top","-10px");

    // switch event for full or narrow model
    $(".content").on("click", ".sidebar-switch", function(){
        var $s = $(this);
        var isNarrowModel = ($s.attr("is-narrow") == "true");
        if (isNarrowModel) {
            $(".span10").attr("class", "span14");
            $(".span4").css("margin-left","40px");
            $(".tag_box a").css("background","#eef");
            $s.text(titles[1]);
        } else {
            $(".span14").attr("class", "span10");
            $(".tag_box a").css("background","#eee");
            $s.text(titles[0]);
        }
        $s.attr("is-narrow", !isNarrowModel);
    });
})

```
默认:窄屏模式, 右侧边栏改为了浮动模式, 页面上下滚动时不受影响; 切换宽屏模式后, 文章内容占领边栏的区域, 边栏区域则向右平移了

绑定事件用 `.on` 方法, 应该该节点是后面造出来的, 直接使用 `.click` 事件绑定是不好使的

# jekyll 配置
在主题模板里直接引入JS插件即可: `_includes/themes/twitter/default.html`
```diff
diff --git a/_includes/themes/twitter/default.html b/_includes/themes/twitter/default.html
index dbefb46..5ef58dc 100644
--- a/_includes/themes/twitter/default.html
+++ b/_includes/themes/twitter/default.html
@@ -61,6 +61,7 @@
     <!-- diy js -->
     <script type="text/javascript" src="/assets/js/zepto.min.js"></script>
     <script type="text/javascript" src="/assets/js/post_nav.js"></script>
+    <script type="text/javascript" src="/assets/js/sidebar_wide_narrow.js"></script>

     <!-- magicthumb plugin -->
     <link type="text/css" rel="stylesheet" href="/assets/css/magicthumb.css"/>
```
依赖 `zepto` (类似`jquery`), 所以放到其下面一点才好使!

# 效果
成品见右侧边栏, 可以点击试试效果

---
参考：
- [JavaScript自定义Jekyll内容导航边栏](https://xu3352.github.io/blog/2017/04/28/jekyll-diy-your-side-bar-of-content-navigation-with-javascript)
- [jQuery on() 方法](http://www.runoob.com/jquery/event-on.html)

