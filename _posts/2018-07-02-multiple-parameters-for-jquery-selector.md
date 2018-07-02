---
layout: post
title: "Jquery 选择器多个参数见过没?"
tagline: ""
description: ""
date: '2018-07-02 12:09:48 +0800'
category: javascript
tags: jquery javascript
---
> {{ page.description }}

# 示例
这个是 [Github:makryl/ABigImage](https://github.com/makryl/ABigImage) 图片预览插件的一段代码 (在移动端表现也很棒!)
```javascript
$('a.abigimage').abigimage({
    bottomCSS: {
        fontSize: '2em',
        textAlign: 'center'
    },
    onopen: function (target) {
        var text = $('img', target).attr('alt');
        this.bottom.html(text);
    }
});
```
`jquery` 最强大的就是 `css` 选择器了, 可以快速的定位到元素

但是 `$('img', target)` 这样的还是第一次注意到, 赶紧去查查...

# 详解
`StackoverFlow` 找到答案, 以下2段代码效果是一样的:(看完是不是瞬间就明白了, 哈哈)
```javascript
$('img', target)

$(target).find('img')
```

再来个例子
```javascript
$('div.foo').click(function() {
  $('span', this).addClass('bar');
  // it will find span elements that are
  // descendants of the clicked element (this)
});
```
这种情况, 使用 `$(expr, context)` 就比 `$(context).find(expr)` 简洁一点, 嗯, 涨姿势了...

---
参考：
- [Multiple Parameters for jQuery selector?](https://stackoverflow.com/questions/2672034/multiple-parameters-for-jquery-selector)
- [Jquery ABigImage 图片预览插件](https://xu3352.github.io/blog/2018/04/30/abigimage-a-jquery-plugin-for-viewing-images)
- [Github:makryl/ABigImage](https://github.com/makryl/ABigImage)
