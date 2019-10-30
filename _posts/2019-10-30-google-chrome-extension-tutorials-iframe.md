---
layout: post
title: "Chrome浏览器插件开发:iframe多层嵌套"
keywords: "google,chrome,extension,plugin,iframe"
description: "Chrome浏览器插件, 在多层级嵌套下的使用"
tagline: ""
date: '2019-10-30 15:29:17 +0800'
category: javascript
tags: javascript chrome-extensions
---
> {{ page.description }}

# iframe注入

上一篇已经介绍过了如何在 iframe 注入 js 文件, 重点是在 `manifest.json` 的 `content_scripts` 每个匹配项最后加上 `"all_frames":true`
```js
    "content_scripts": [
        {
            // "matches": ["*://*.taobao.com/*"],
            "matches": ["<all_urls>"],
            "js": ["jquery-3.4.1.min.js", "content_scripts.js"],
            "run_at": "document_end"
        }, {
            "matches": ["*://*.iframe_src.com/*"],
            "js": ["jquery-3.4.1.min.js", "content_scripts.js"],
            "run_at": "document_end",
            "all_frames":true
        }
    ],
```

也就是说, 我们可以为每一个有需要的 iframe 都注入特定的 js, 来完成特定的工作

# iframe嵌套情况

例如有下面 iframe 嵌套的情况: 页面之间还有交互操作, 那么用什么方式来处理最合适呢?

- top : 最外层页面
	- list : 详情页面
		- filter : 筛选页面

1. 如果有跨域问题, 那么可以通过上面的方式进行注入, 然后都跟插件 `background` 通信, 进而完成交互操作 (好像也可以使用 `window.postMessage`)

2. iframe地址都是同一个域名下, 不存在跨域问题:
	1. 用纯 js 操作
        - 获取 iframe 的 document 可以使用: 
            - `iframe.contentDocument || iframe.contentWindow.document`
        - 获取元素: 
            - `document.querySelector("input")`  返回找到的第一个元素
            - `document.querySelectorAll("input")` 返回 NodeList 数组
        - 在 iframe 获取父级页面的 document 可以使用: `window.parent.document`
	2. 用 jquery 操作
        - 获取 iframe 的 jquery 实例: `var $iframe = $("#iframeId").contents();`
        - 获取 iframe 的元素: `$iframe.find("#name")`
        - 获取 iframe 获取父级页面的元素: `$("#msg_top", window.parent.document)`

还是使用 jquery 方便, 因为我们可以自己注入 jquery


参考: 
- [Get IFrame's document, from JavaScript in main document](https://stackoverflow.com/questions/3999101/get-iframes-document-from-javascript-in-main-document)
- [jQuery/JavaScript: accessing contents of an iframe](https://stackoverflow.com/questions/364952/jquery-javascript-accessing-contents-of-an-iframe)
- [how to access iFrame parent page using jquery?](https://stackoverflow.com/questions/726816/how-to-access-iframe-parent-page-using-jquery)

