---
layout: post
title: "网页另存为图片插件:html2canvas"
keywords: "html,image,canvas,html2canvas"
description: "网页另存为图片插件:html2canvas"
tagline: ""
date: '2020-04-15 15:04:10 +0800'
category: javascript
tags: javascript html2canvas
---
> {{ page.description }}

最近总是搞网页上截图的事, 位置还基本固定, 终于找到救星了 --> `htm2canvas` 

# html2canvas 插件

非常强大和好用的一款网页截图插件!!!

官网: [html2canvas](http://html2canvas.hertzen.com/) 

使用方法也非常简单, 官网首页就有代码示例 (右下角直接可以截图)

简单的封装一下: `下载图片` + `拷贝图片`
```html
<script src="https://html2canvas.hertzen.com/dist/html2canvas.js"></script>
<script>
// 直接下载到本地
function download_img(element, name) {
    html2canvas(element, {scale:1, scrollX: 0, scrollY: -window.scrollY}).then(canvas => {
        a = document.createElement('a');
        document.body.appendChild(a);
        a.download = (name || 'download_img') + ".png";
        // a.href = canvas.toDataURL();
        a.href = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        a.click();
    });
}

// 拷贝到剪贴板
function copy_img(element) {
    html2canvas(element, {scale:1, scrollX: 0, scrollY: -window.scrollY}).then(canvas =>
        canvas.toBlob(blob => navigator.clipboard.write([new ClipboardItem({'image/png': blob})]))
    );
}
</script>
```

**配置详解**:
- `scale` - 可以理解为清晰度比例, 例如 Mac Retina屏幕, 浏览器默认为: 2
- `scrollY` - 网页上下滚动偏移量, 防止滚动后图像不全

还有其他很多参数选项设置, 可以参考官方文档

---
参考：
- [html to image js](https://stackoverflow.com/questions/10721884/render-html-to-an-image)
- [copy image to clipboard](https://stackoverflow.com/questions/33175909/copy-image-to-clipboard)
- [html2canvas scrolly](https://github.com/niklasvh/html2canvas/issues/1878)
- [HTML2canvas generates Blurry images](https://stackoverflow.com/questions/22803825/html2canvas-generates-blurry-images)
- [html2canvas 官方文档](https://html2canvas.hertzen.com/configuration)

