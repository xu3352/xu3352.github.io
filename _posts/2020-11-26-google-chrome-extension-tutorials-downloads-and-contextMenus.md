---
layout: post
title: "Chrome浏览器插件开发:文件下载,右键菜单"
keywords: "google,chrome,extension,plugin,downloads,contextMenus,浏览器插件"
description: "Chrome浏览器插件开发:文件下载,右键菜单"
tagline: ""
date: '2020-11-26 23:44:00 +0800'
category: javascript
tags: javascript chrome-extensions
---
> {{ page.description }}

# 文件下载

文件下载: 只需要给出链接地址即可, 如果另存时需要改文件名, 把 `saveAs` 设置为 `true`

对于某些网站的缩略图, 有的可以把部分链接后缀去掉, 就能直接下载原图了!

后台下载: `background.js`
```js
chrome.downloads.download({url:'http://xxx.xxx.com/x/x.jpg', saveAs:true});
```

需要权限: `manifest.json`
```json
{
    "name": "My extension",
    ...
    "permissions": [
        "downloads"
    ],
    ...
}
```

# 右键菜单

后端创建右键菜单: `background.js`
```js
chrome.contextMenus.create({
    title: '下载原图',
    contexts: ['image'],   // image,selection,link...
    onclick: function(info, tab){
        var url = info.srcUrl || '';
        if (!url) return;
        // 转为原图链接后下载
        if (url.contains("alicdn")) url = url.replace(/(\.jpg|\.png)_.*/g, "$1");
        chrome.downloads.download({url:url, saveAs:true});
    }
});
```

需要权限: `manifest.json`
```json
{
    "name": "My extension",
    ...
    "permissions": [
        "contextMenus"
    ],
    ...
}
```

---
参考：
- [文件下载API](https://developer.chrome.com/extensions/downloads){:target='blank'}
- [右键菜单API](https://developer.chrome.com/extensions/contextMenus){:target='blank'}

