---
layout: post
title: "JS保存网页HTML到本地"
keywords: "javascript,html"
description: "JS保存网页HTML到本地"
tagline: ""
date: '2022-07-30 13:57:20 +0800'
category: javascript
tags: javascript
---
> {{ page.description }}

# 直接上代码
可指定的节点进行保存

```html
<!DOCTYPE html>
<html>
<head>
　　<meta charset="UTF-8">
　　<title>网页HTML存本地</title>
　　<script src="http://libs.baidu.com/jquery/1.9.0/jquery.js"></script>
</head>
<body>
    <div id="content">
        网页HTML存本地
    </div>
　　 <a id="saveBtn" href="#">保存文件</a>
</body>
<script>
    function download_html(obj) {
      var ev = document.createEvent("MouseEvents");
      ev.initMouseEvent(
          "click", true, false, window, 0, 0, 0, 0, 0
          , false, false, false, false, 0, null
      );
      obj.dispatchEvent(ev);
    }

    function export_raw(name, data) {
      var urlObject = window.URL || window.webkitURL || window;
      var export_blob = new Blob([data]);
      var save_link = document.createElementNS("http://www.w3.org/1999/xhtml", "a")
      save_link.href = urlObject.createObjectURL(export_blob);
      save_link.download = name;
      download_html(save_link);
    }

    // 保存网页到本地
    $("body").on("click", "#saveBtn", function(){
         var html = $("#content")[0].outerHTML;
         export_raw('content.html', html);
    })
</script>
</html>
```

---
参考：
- [JS实现保存当前网页HTML到本地](https://www.jianshu.com/p/ee5e2963f243){:target='blank'}

