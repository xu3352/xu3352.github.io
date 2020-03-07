---
layout: post
title: "网页打印自定义设置"
keywords: "webpage,printing"
description: "网页打印自定义设置"
tagline: ""
date: '2020-03-07 14:10:03 +0800'
category: work
tags: chrome work
---
> {{ page.description }}

系统环境: `Mac`
浏览器: `Chrome`

# 弹出打印页面

通常有两种方式:
- 浏览器菜单: [文件] -> [打印...]   默认的快捷键: `Cmd+P`(Mac) or `Ctrl+P`(Windows)
- 在网页中, 直接[右键] -> [打印...]

如果想打印部分内容, 则可以先用鼠标选中, 然后 [右键] -> [打印...]

有打印机的, 则可以对打印机进行相应的设置; 没有打印机的, 也可以另存为 `PDF` 文件, 当然也是可以进行设置

这里以 Mac 系统的 Chrome 浏览器为例, 设置里做出修改, 就会提现到预览页面, 这样可以快速的调整到我们想要的效果

![网页PDF打印设置](/assets/archives/wegpage-print-fs8.png){:width="500px"}


# Javascript打印

调用打印非常简单: `window.print()`

如果不想整个页面全部都打印, 有2个方案: (都是通过`iframe`来实现的)
- 自定义一个后台页面, 把想要的数据传过去, 样式都设置好, 然后造一个 `iframe`, 把 `src` 链接设置好就行了
- 不创建后台页面, 直接 `iframe` 直接使用 `DOM` 方式创建, 然后把需要的 `Element` 拷贝一份过去

各有优缺点:
- 第一个方式: 稳定, 但是要多弄一个后台页面
- 第二种方式: 不稳定, 但是比较通用, 主要体现在样式补全 和 图片不加载上, 样式可以考虑使用内联样式, 或者把样式一起拷贝过去; 图片不加载还没整明白...(即使在当前页面已经加载完成, 拷贝到iframe里就不行...)

这里给个第二种方式的代码, 有兴趣可以研究研究:
 
```js
// 含jquery
function printElement(e) {
    // https://stackoverflow.com/questions/6500962/how-to-print-only-a-selected-html-element
    var ifr = document.createElement('iframe');
    ifr.style='height: 0px; width: 0px; position: absolute; top: -1000px'
    document.body.appendChild(ifr);

    $(e).clone().show().appendTo(ifr.contentDocument.body);
    ifr.contentWindow.print();

    setTimeout(function () {
        ifr.parentElement.removeChild(ifr);
    }, 5000);
}
```

# 快捷打印

如果想在打印的时候跳过预览: `--kiosk-printing` (`Windows`的加到快捷方式中的exe后面, 记得前面留个空格)

如果想打印之后自动关闭: 加个延时, 然后调用 `window.close()`

```js
// 含jquery
$(function(){
    window.print();

    setTimeout(function () {
        window.opener = null;
        window.open('','_self');
        window.close();
    }, 3000);
});
```


