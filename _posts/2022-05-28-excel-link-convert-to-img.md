---
layout: post
title: "Excel技巧干货，如何批量快速将图片链接转换为图片"
keywords: "office wps"
description: "Excel技巧干货，如何批量快速将图片链接转换为图片"
tagline: ""
date: '2022-05-28 16:31:43 +0800'
category: office
tags: office 
---
> {{ page.description }}

# 操作步骤
1. 替换成HTML代码
2. 转换的代码全部拷贝出去, 粘贴到文本编辑器里
3. 然后再拷贝, 再粘贴回来 (数量多需要等待一会儿)
4. 最后再调整行高, 行宽

# 核心代码
```js
="<table><img src="&C2&" height=50 width=50></table>"
```

- `C2` 代表单元格 C2 的链接地址, 然后双节单元格右下脚, 就会自动填充剩余的单元格了
- `height` 图片高50像素, 行高可以设置为一致的
- `width` 图片宽度, 列宽

---
参考：
- [Excel技巧干货，如何批量快速将图片链接转换为图片](https://zhuanlan.zhihu.com/p/364053098){:target='blank'}

