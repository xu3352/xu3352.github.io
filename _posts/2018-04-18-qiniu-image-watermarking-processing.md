---
layout: post
title: "七牛云-图片水印处理"
tagline: ""
description: "从七牛云拉取的图片加上自己的水印处理, 顺便对比一下文件的MD5值"
date: '2018-04-18 22:12:44 +0800'
category: linux
tags: qiniu python javascript Base64 linux
---
> {{ page.description }}

# 文字水印
```bash
watermark/2
         /text/<encodedText>
         /font/<encodedFontName>
         /fontsize/<fontSize>
         /fill/<encodedTextColor>
         /dissolve/<dissolve>
         /gravity/<gravity>
         /dx/<distanceX>
         /dy/<distanceY>
```

| 参数名称  |  必填 | 说明 |
| /text/eHUzMzUy | 是 |  水印文字内容（经过URL安全的Base64编码） |
| /font/shruti |  |  水印文字字体（经过URL安全的Base64编码），默认为黑体，详见支持[字体列表](https://support.qiniu.com/hc/kb/article/112878/?ref=developer.qiniu.com)      **注意：中文水印必须指定中文字体** |
| /fontsize/500   |  |   水印文字大小，单位: 缇 ，等于1/20磅，默认值是240缇，参考DPI为72 |
| /fill/d2hpdGU=   |  |   水印文字颜色，RGB格式，可以是颜色名称（例如 red）或十六进制（例如 #FF0000），参考[RGB颜色编码表](http://www.rapidtables.com/web/color/RGB_Color.htm)，默认为黑色。经过URL安全的Base64编码 |
| /dissolve/90   |  |  透明度，取值范围1-100，默认值100（完全不透明） |
| /gravity/SouthEast  |  |  水印位置，参考水印位置参数表，默认值为SouthEast（右下角） |
| /dx/20   |  |  横轴边距，单位:像素(px)，默认值为10 |
| /dy/80   |  |  纵轴边距，单位:像素(px)，默认值为10 |

看个示例:看到右下角加的 `xu3352` 了没
```bash
https://odum9helk.qnssl.com/4c0aa36a9aafb42adeb9e9c173c62a13?watermark/2/text/eHUzMzUy/font/5a6L5L2T/fontsize/500/fill/d2hpdGU=/dissolve/100/gravity/SouthEast/dx/20/dy/80
```
![示例](https://odum9helk.qnssl.com/4c0aa36a9aafb42adeb9e9c173c62a13?watermark/2/text/eHUzMzUy/font/5a6L5L2T/fontsize/500/fill/d2hpdGU=/dissolve/100/gravity/SouthEast/dx/20/dy/80){:width="100%"}

# JS Base64
```javascript
// 直接调用
str = "The quick brown fox jumps over the lazy dog";
b64 = btoa(unescape(encodeURIComponent(str)));
dstr = decodeURIComponent(escape(window.atob(b64)));
console.log(str);
console.log(b64);
console.log(dstr);
```

如此, 水印内容可以直接在页面使用JS动态生成

# 文件MD5校验
```python
import os
import hashlib

def md5sum(filename):
        """
        用于获取文件的md5值
        :param filename: 文件名
        :return: MD5码
        """
        if not os.path.isfile(filename):  # 如果校验md5的文件不是文件，返回空
            return
        myhash = hashlib.md5()
        f = open(filename, 'rb')
        while True:
            b = f.read(8096)
            if not b:
                break
            myhash.update(b)   
        f.close()
        return myhash.hexdigest()

print(md5sum('/Users/xuyinglong/Downloads/base64.html'));
```
这个和在线文件MD5校验工具的值是一致的, 没毛病

同一张图片使用不同的水印后进行MD5检查, 可以发现并不一样了

---
参考：
- [七牛云-图片水印处理-文字水印](https://developer.qiniu.com/dora/manual/1316/image-watermarking-processing-watermark#2)
- [How can you encode a string to Base64 in JavaScript?](https://stackoverflow.com/questions/246801/how-can-you-encode-a-string-to-base64-in-javascript)
- [Online Tools - MD5 File Checksum](https://emn178.github.io/online-tools/md5_checksum.html)
- [Python3之hashlib](https://www.cnblogs.com/wang-yc/p/5616663.html)

