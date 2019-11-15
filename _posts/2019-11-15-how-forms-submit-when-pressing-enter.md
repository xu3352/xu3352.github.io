---
layout: post
title: "按下Enter回车键提交Form表单?"
keywords: "js,javascript"
description: "最近遇到按下Enter回车键后, Form表单重复提交的问题, 该好好了解一下其中的机制了..."
tagline: ""
date: '2019-11-15 20:53:33 +0800'
category: javascript
tags: javascript
---
> {{ page.description }}

# 提交表单

一般的管理后台都会有按条件筛选数据的查询, 而通常情况下都会有个按钮来触发查询的操作, 最常用的表单元素:
- 文本框
- 下拉框
- 复选框
- 单选框

为了更加便捷的进行查询, 那么一般会在以下两种情况触发查询操作:
- 文本框 输入文本, 然后按下 `Enter` 回车键
- 下拉/复选/单选框 有变动

前者绑定 `keypress` 事件, 并在 `event.which == 13` 时表示回车; 后者绑定 `change` 事件; 然后用JS触发提交事件 `$("#formId").submit()` 即可


# Enter提交表单

最近遇到一个 表单重复 提交的问题, 最后找到原因是:
1. 文本框 绑定了事件, 按 `Enter` 回车后提交表单
2. 表单只有一个 文本框 (隐藏`hidden`的不算), 按回车也提交了表单

第二个是自己搞了个小页面, 测试出来的, 后来找到一篇文章, 很好的解释了一些其他的情况下表单是如何提交的, 这里先给出最后的结论:

- 按下 `Enter` 时，如果 `<form>` 要触发 `submit` 事件，要符合两种情况之一：只有一个输入框（可以没有提交按钮），或者至少有一个提交按钮。`<input type="submit">` 和 `<button>` 都可以看成是提交按钮。jQuery 的 submit() API 也对此有所提及。

- 达到第一条触发 `submit` 的条件后，不管是按提交按钮，还是按下 `Enter` ，`<form>` 都会执行一样的流程：先触发按钮的 `click` 事件（如果有按钮），然后触发 `submit` 事件。这算是提交的标准流程。

- 但如果提交按钮有多个，`<form>` 会把第一个出现的按钮作为默认提交按钮，按下 `Enter` 触发 `click` 事件时，也只会触发这一个按钮的事件。想触发其他按钮的 `click` 事件，只能去手动点击。

更详细的测试结果在最后的参考链接中找到


---
参考：
- [Press Enter to Submit 背后的那些事](http://david-chen-blog.logdown.com/posts/177766-how-forms-submit-when-pressing-enter)

