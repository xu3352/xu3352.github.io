---
layout: post
title: "Chrome浏览器插件开发:进阶"
keywords: "google,chrome,extension,plugin"
description: "Chrome浏览器插件开发进阶 包括: `脚本注入访问变量`,`插件前后端通信`,`跨域请求`,`本地存储`,`iframe注入`,`tab页控制`"
tagline: ""
date: '2019-09-03 14:10:05 +0800'
category: javascript
tags: javascript chrome-extensions
---
> {{ page.description }}

# 入门示例
网上已经有很多的示例了, 基础语法和配置都有的, 可以自行 Google/百度 一下就好

**找了两篇比较详细的**:
- [【干货】Chrome插件(扩展)开发全攻略](https://www.cnblogs.com/liuxianan/p/chrome-plugin-develop.html)
- [一篇文章教你顺利入门和开发chrome扩展程序（插件）](https://juejin.im/post/5c135a275188257284143418)

这里给出一个简单的示例: [下载](/assets/archives/chrome_extension_test.zip)

**示例文件结构**:
```
├── manifest.json       #核心配置文件
├── popup.html          #点击插件图标的弹出页面
├── popup.js
├── background.js       #后端js
├── content_scripts.js  #前端(插件沙盒环境)注入的js
├── inject.js           #向原始页面注入的本地js
├── jquery-3.4.1.min.js
└── smile.png
```

# 脚本注入访问变量
由于前端(`content_scripts.js`)不能访问原始页面的变量/函数, 但是DOM是共享; 利用这点可以间接的获取到原始页面变量的值

具体做法是在 `前端` 通过 DOM 载入外部的JS, 而新载入的JS成为了原始网页的一部分, 自然就能访问到全局的变量以及函数, 然后把想要的数据内容序列化(`JSON.stringify()`), 并存储到页面; 那么 `前端` 直接就可以从 DOM 把数据取出来, 反序列化(`JSON.parse()`)后就可以使用了

`content_scripts.js`
```js
// 注入外部js
// 假如原始页面没有jquery, 那么也可以手动注入
function loadJs(url) {
    var s = document.createElement('script');
    s.src = url;
    document.body.appendChild(s);
}
loadJs('//ajax.aspnetcdn.com/ajax/jQuery/jquery-3.4.1.min.js');
```

```js
// 载入本地(插件内)的js
function loadLocalJs(files) {
    for (var i = 0; i < files.length; i++) {
        var s = document.createElement('script');
        s.src = chrome.extension.getURL(files[i]);
        document.body.appendChild(s);
    }
}
// loadLocalJs(['jquery-3.4.1.min.js', 'inject.js']);
loadLocalJs(['inject.js']);
```

`inject.js`
```js
// 最好先检查一下变量, 防止报错
function page_var_save() {
    console.log("================ page_var_save...");
    if ("undefined" == typeof g_config) return;

    var data = g_config;
    var j = JSON.stringify(data);
    console.log(j);
    var d = document.createElement('div');
    d.id = "var-shadow";
    d.style = "display:none;";
    d.appendChild(document.createTextNode(j));
    document.body.appendChild(d);
}

// 加个延时, 方便看结果
setTimeout(function() {
    page_var_save();
}, 3000);
```

安装插件后, 打开淘宝首页, 在控制台就能看到效果了

# 插件前后端通信

`content_scripts.js` 给 `background.js` 发送消息:
```js
function send_message(data) {
    var param = {type: 'message', data: data};
    chrome.runtime.sendMessage(param, function(response) {
        console.log("send_message log:" + response);
    });
}
```

`background.js` 接收到消息, 处理后返回结果:
```js
// message listener ======================================================
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    // console.log('data:' + JSON.stringify(request.data));
    if (request.type == "message") {
        var data = request.data;
        // do something...
        sendResponse('bg got it...');
    } 
    // 等待 sendResponse 把数据返回
    return true;
});
```

`content_scripts.js` / `popup.js` 向 `background.js` 后端之间消息通信的方式是一样

而 `background.js` 后端 向 `content_scripts.js` 发送消息时, 需要指定具体的 `tabId`, 可以通过 `chrome.tabs.query` 的 [参数选项](https://developer.chrome.com/extensions/tabs#method-query) 来过滤出目标 `tabId` 

`background.js`
```js
chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
    chrome.tabs.sendMessage(tabs[0].id, {type: "open_dialog_box", msg: "hello"}, function(response) {});  
});

// 如果想通过 url 来匹配过滤的话, 可以这样写
chrome.tabs.query({url: "*://*.baidu.com/*"}, function(tabs){
    chrome.tabs.sendMessage(tabs[0].id, {type: "open_dialog_box", msg: "hello"}, function(response) {});  
});
```

接收消息的方式都是一样的, 参考 `background.js` 接收消息的方式, 更多示例可参考官方文档: [Chrome Extensions - Message Passing](https://developer.chrome.com/extensions/messaging)

# 跨域请求

插件如果需要跟服务器进行交互, 如果在 `前端` 用 jquery 直接发起一个 ajax 请求, 那么可能会遇到两个问题:
- `Mixed Content: The page at 'https://xxx.xxx.com/' was loaded over HTTPS...`{: style="color:red;"}
- `Cross-Origin Read Blocking (CORB) blocked cross-origin response http://xxx.xxx.com/ with MIME type text/html...`{: class="warning"}

通常需要跟服务端交互的可以放到 `background.js` 里完成, 这样第一个问题就解决了

第二个是跨域的问题, 请求可以被服务端接收到, 但是浏览器会拒绝返回结果, 导致 ajax 的回调没有值. 如果是单向请求没所谓, 如果要请求数据下来就不行了; 这时需要服务端对 Response 进行设置, 把响应的请求头改一下: `Access-Control-Allow-Origin: *`

`content_scripts.js`
```js
function send_detail_log() {
    var param = {type: 'send_detail_log', data: {}};
    chrome.runtime.sendMessage(param, function(response) {
        console.log("send_detail_log log:" + JSON.stringify(response));
    });
}
```

`background.js` 
```js
// message listener ======================================================
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    // console.log('data:' + JSON.stringify(request.data));
    if (request.type == "message") {
        var data = request.data;
        // do something...
        sendResponse('bg got it...');
    } else if (request.type == "send_detail_log") {
        // jquery post request
        var param = request.data;
        $.post('http://host/path/detail_log', param, function(data){
            sendResponse(data);
        });
    }
    // 等待 sendResponse 把数据返回
    return true;
});
```

服务端如果是 `flask` 的话, 那么参考下面的代码: 
```python
def allow_origin(data):
    """ 允许跨域请求 """
    resp = None
    if type(data).__name__ == 'dict':
        resp = jsonify(data)
    else:
        resp = Response(data)
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp
```

# 本地存储

要使用 `chrome.storage` API 需要在 `manifest.json` 的 `permissions` 里先进行设置

```js
// 本地取值
function get_local_datas() {
    chrome.storage.local.get(["g_status", "g_cnt"], function(result) {
        var g_status = result["g_status"] || 0;
        var g_cnt = result["g_cnt"] || 0;
        console.log("load_local_datas: " + g_status + ", " + g_cnt);
        // do something...
    });
}

/**
 * 本地存值
 * dict = {key: value}
 */
function set_local_data(dict) {
    chrome.storage.local.set(dict);
}
```

`content_scripts.js` 和 `background.js` 和 `popup.js` 的调用方式是一样的; 但取值的时候只能在回调里处理结果

# iframe注入

这个在 `manifest.json` 里设置就可以
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

关键是需要把 `all_frames` 设置为 `true`

# tab页控制

由于前端 `content_scripts.js` 不能访问 `chrome.tabs.*` 的 API, 所以需要放到 `background.js`(或`popup.js`) 来处理

`content_scripts.js`
```js
function close_tab() {
    chrome.runtime.sendMessage({type: "close_tab"});
}

function open_tab(url) {
    chrome.runtime.sendMessage({type: "open_tab_url", url: url});
}

function change_tab(url) {
    chrome.runtime.sendMessage({type: "change_tab_url", url: url});
}
```

`background.js`
```js
// message listener ======================================================
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type == "close_tab") {
        chrome.tabs.remove(sender.tab.id);
    } else if (request.type == "open_tab_url") {
        var url = request.url;
        chrome.tabs.create({url: url, active: false}); //打开tab后不激活tab
    } else if (request.type == "change_tab_url") {
        var tabId = sender.tab.id;
        var url = request.url;
        chrome.tabs.update(tabId, {url: url});
    }
    // 等待 sendResponse 把数据返回
    return true;
});
```

# 其他API

`popup.js` 可以用注入的方式调用前端 `content_scripts.js` 的代码

`popup.js`
```js
function injectFrontScript(code) {
    chrome.tabs.executeScript(null, {code:code});
}

$(document).ready(function(){
    $("#test").click(function(){
		var msg = $("#msg").val();
        injectFrontScript("front_test('"+msg+"')");
    });
});
```

`content_scripts.js`
```js
function front_test(msg) {
    console.log('front_test...: ' + msg);
}
```

更多的 API 当然是要去翻翻官方文档了

---
参考：
- [官网API首页:Chrome APIs](https://developer.chrome.com/extensions/api_index)
- [开发者指南- Google Chrome 扩展程序开发文档（非官方中文版）](https://crxdoc-zh.appspot.com/extensions/devguide)
- [如何实现网页和Chrome插件之间的通信](http://unclechen.github.io/2018/06/09/%E5%A6%82%E4%BD%95%E5%AE%9E%E7%8E%B0%E7%BD%91%E9%A1%B5%E5%92%8CChrome%E6%8F%92%E4%BB%B6%E4%B9%8B%E9%97%B4%E7%9A%84%E9%80%9A%E4%BF%A1/)
- [Blocked by CORS policy: The 'Access-Control-Allow-Origin' - Mean Stack](https://www.digitalocean.com/community/questions/blocked-by-cors-policy-the-access-control-allow-origin-mean-stack)
- [Google Chrome Extension - Script Injections](https://stackoverflow.com/questions/10527625/google-chrome-extension-script-injections/10529675)
- [How do I set response headers in Flask?](https://stackoverflow.com/questions/25860304/how-do-i-set-response-headers-in-flask)
- [Chrome Extension 开发总结（二）：通信机制](https://www.ruphi.cn/archives/407/)

