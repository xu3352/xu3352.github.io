---
layout: post
title: "实用小工具:截图识别OCR"
keywords: "ocr,python,baidu,screenshots,mac"
description: "实用小工具:截图识别OCR; 自己DIY的一个Mac端实用小工具"
tagline: ""
date: '2020-12-18 17:57:47 +0800'
category: python
tags: python ocr baidu alfred
---
> {{ page.description }}

# OCR技术
`OCR（optical character recognition）` 光学字符识别, 通俗点就是把图片里的文字提取出来

目前OCR技术已经非常成熟, 不过要找一个好用的工具, 大多还是要收费的...

需求场景:
1. 截图 
2. 识别截图的文字 
3. 可以直接粘贴文字

# 小工具制作

环境要求: `MacOS` + `Alfred` + `Python3`

截图用微信截图, 或者Mac自带的截图都可以

百度OCR接口调用: `baidu_ocr.py`
```py
# -*- coding: utf-8 -*-
#author:xu3352@gmail.com
#desc: baidu ocr test 

import sys
import time
from aip import AipOcr        #pip install baidu-aip
from PIL import ImageGrab     #pip install pillow (PIL is short for pillow)

APP_ID        = '23176111'
API_KEY       = 'qBvjEId3Ks***udjVg3CZCk'
SECRET_KEY    = 'tyBQyye2x7j1K****xlA0UeHcVPpfm'
client = AipOcr(APP_ID,API_KEY,SECRET_KEY)

content = ''
# 剪贴板
image = ImageGrab.grabclipboard()
if image:
    image.save('screen.png')
    # API调用
    with open('screen.png','rb') as f:
        image = f.read()
        text  = client.basicAccurate(image)
        result= text["words_result"]
        for i in result:
            content = content + i["words"]

# print
if content:
    sys.stdout.write(content);
```

`Alfred` 制作一个 Workflow, 直接调用 `baidu_ocr.py` 即可; 

![desc](/assets/archives/ocr_baidu.png){:width="100%"}


不熟悉的同学可以直接打包下载制作好的: [OCR.alfredworkflow](/assets/archives/OCR.alfredworkflow) 

不过安装之后需要把对应的 `baidu_ocr.py` 路径改一下

# 使用

1. 截图, 工具不限, Mac系统自带的截图, 微信, QQ截图等...
2. 快捷键Afred(我的快捷键为`Cmd+空格`), 输入 `ocr` 回车, 1~2秒后屏幕右上角就会有弹出的通知: 识别的结果内容; 然后直接可粘贴使用


---
参考：
- [其他文章参考](https://cloud.tencent.com/developer/article/1685804){:target='blank'}

