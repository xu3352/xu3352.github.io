---
layout: post
title: "JavaScript自定义Jekyll内容导航边栏"
date: '2017-04-28 19:33:00 +0800'
categories: blog
tags: jekyll javascript blog
---
> DIY自己想要的东西

# 为什么需要文章导航
好文章一定是排版不错的，各级标题当然是必须的。如果文章内容比较长，所有的H1标题汇总起来好比文章目录啦，一眼看去就知道大概内容了，清晰明了

# 分析 Jekyll 生成的 HTML
一般写点博客之类的，文章结构都不会太复杂，为了是文章阅读起来更加简单、清晰、明了，一般会加一些 H1 一级标题。
liquid 把 markdown 转译成 html 之后，结构比较规律，我们只需要把 H1 一级标题收集到一起，然后做成一个边栏列表，展示出来即可
结构图如下：
![DOM结构图](http://on6gnkbff.bkt.clouddn.com/20170428131614_jekyll-post-html-dom-structure.png){:width="100%"}

# 选择 JavaScript 动态生成
操作 HTML 自然是首选 JavaScript，直接操作 DOM 把我们想要的内容都展示出来就可以了。
万能的 js 现在不仅仅限制在浏览器什么跑了，还有 NB 的 Node.js。

# zepto.js (类jquery框架)
原生的 js 和 框架都可以用。框架的优势是对 js 做了封装，使用起来简单，方便，各种浏览器的兼容等。
为什么选zepto.js框架呢？ [下载zepto.js](http://www.css88.com/doc/zeptojs_api/#download)
- 类jquery框架，语法跟jquery几乎一样，用起来方便，我相信你肯定知道 jquery 的
- zepto 代码少，体积比 jquery 小很多

# 开始 DIY
下载 `zepto.min.js` 文件，路径放这里吧：`assets/js/zepto.min.js`    
新建DIY的js文件：`assets/js/post_nav.js`
## post_nav.js V1.0
```javascript
/**
 *  Jekyll-Twitter-Theme 文章H1标题预览插件
 *  依赖 zepto.min.js 等类jquery库
 */

// 边栏root [Published, Tags]
var $sideBar = $("ul.tag_box").parent();

var array = $("h1");
if (array.length > 1) {
    var dom =  '<ul class="post_nav">'
    for (var i = 0; i < array.length; i++) {
        var $h1 = $(array[i]);
        if ($h1.attr("id") != null) {
            // console.log( $h1.text() )
            dom += '    <li><a style="color:#999" href="#'+ $h1.attr("id") +'">'+ $h1.text() +'</a></li>';
        }
    }
    dom += '</ul> ';

    // append dom
    $sideBar.append('<h4>Content List</h4>');
    $sideBar.append(dom);
}
```
## post_nav.js v1.1
```javascript
/**
 *  Jekyll-Twitter-Theme 文章H1标题预览插件
 *  依赖 zepto.min.js 等类jquery库
 *  v1.0 仅支持展示H1
 *  v1.1 支持H1~H6，小标题自动往后缩进
 */

/** 获取 H1~H6 所有元素 */
function getHeadlineTags() {
    var arrays = [];
    $("*[id]").each(function(){
        var tagName = $(this).prop("tagName");
        if ($.inArray(tagName, hs) >= 0) {
            // console.log(tagName)
            arrays.push($(this));
        }
    });
    return arrays;
}

/** 判断元素标题等级H1~H6，返回0~5，如果不是H1~H6，则返回-1 */
function getHeadlineLevel(h) {
    var tagName = $(h).prop("tagName");
    return $.inArray(tagName, hs);
}

/** 生成目录列表 */
function generateContentList(array) {
    if (array.length > 1) {
        var dom =  '<ul class="post_nav">'
        for (var i = 0; i < array.length; i++) {
            var $h1 = $(array[i]);
            var level = getHeadlineLevel( $h1 );
            var li_style = level <= 0 ? '': ' style="margin-left:'+(level*12)+'px"';
            dom += '<li'+li_style+'><a style="color:#999" href="#'+ $h1.attr("id") +'">'+ $h1.text() +'</a></li>';
        }
        dom += '</ul> ';

        // 边栏root [Published, Tags]
        var $sideBar = $("ul.tag_box").parent();

        // append dom
        $sideBar.append('<h4>Content List</h4>');
        $sideBar.append(dom);
    }
}

// H1~H6 标签名数组
var hs = ["H1", "H2", "H3", "H4", "H5", "H6"];
// 找到所有 H1~H6 
var array = getHeadlineTags();
// 生成 Content List
generateContentList(array);

```


# 嵌入 Jekyll 页面
由于我使用的是 Twitter 主题的，我把两个 js 文件的引入放到了这里：`_includes/themes/twitter/default.html`
只要是文章公共调用的模板里就可以了，已确保每篇文章都能加载到就行
```html
    ... 其他代码 ...
    
    {% if page.layout == 'post' %}
    <!-- diy js -->
    <script type="text/javascript" src="/assets/js/zepto.min.js"></script>
    <script type="text/javascript" src="/assets/js/post_nav.js"></script>
    {% endif %}
  </body>
</html>
```

# 效果图
![成品图](http://on6gnkbff.bkt.clouddn.com/20170428131613_jekyll-conent-navigation-preview.png){:width="100%"}


参考：
- [Zepto.js API 中文版](http://www.css88.com/doc/zeptojs_api/)
- [jQuery: Get selected element tag name](http://stackoverflow.com/questions/5347357/jquery-get-selected-element-tag-name)
- [jquery array contains](https://api.jquery.com/jQuery.inArray/)
