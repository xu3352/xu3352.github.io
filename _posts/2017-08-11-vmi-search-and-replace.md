---
layout: post
title: "vim 搜索替换详解"
tagline: ""
description: "非常全面和详细的介绍vim里的搜索替换操作，附带N个小例子！"
date: '2017-08-11 17:49:59 +0800'
category: linux
tags: vim linux
---
> {{ page.description }}

# 语法
语法为:`[addr]s/源字符串/目的字符串/[option]`

全局替换命令为：`:%s/源字符串/目的字符串/g`

`[addr]` 表示检索范围，省略时表示当前行。如：
- `%` 表示整个文件  等同于 `1,$`
- `1,20` 第1行~第20行
- `.,+2` 当前行~往后2行
- `.,$` 当前行~文件尾
- `s` 表示替换操作

`[option]` : 表示操作类型 如：
- `g` 表示全局替换
- `c` 表示进行确认
- `p` 表示替代结果逐行显示（Ctrl + L恢复屏幕）

省略 `option` 时仅对 `每行第一个` 匹配串进行替换

如果在源字符串和目的字符串中出现`特殊字符`，需要用 `\` 转义

# 基础的搜索和替换
`:substitute` 命令按指定文本搜索（可正则匹配），然后替换为指定文本

以：`foo` 替换为 `bar` 为例

命令 | 说明
--- | ---
`:s/foo/bar/` | 当前行替换第一次出现的
`:%s/foo/bar/g` | 全局替换
`:%s/foo/bar/gc` | 全局搜索替换，需要每次确认
`:%s/\<foo\>/bar/gc` | 全局替换，以词组(单词)形式，需要每次确认
`:%s/foo/bar/gci` | 全局，忽略大小写，需确认
`:%s/foo/bar/gcI` | 全局，大小写敏感，需确认


- `g` 表示全局
- `c` 表示每次替换时需要确认     
  `replace with bar (y/n/a/q/l/^E/^Y)?`
  - `y` : yes 要替换
  - `n` : no 本次不替换
  - `a` : all 剩下的全部都替换
  - `q` : quit 退出
  - `l` : last 替换本次后退出
  - `^E` : `CTRL+E` 向上滚动一行，看下面的
  - `^Y` : `CTRL+Y` 向下滚动一行，看上面的

# 区间搜索

命令 | 作用域
--- | ---
`:s/foo/bar/g` | 行内
`:%s/foo/bar/g` | 全文
`:5,12s/foo/bar/g` | 5~12行
`:'a,'bs/foo/bar/g` | 标记a~标记b全部
`:'<,'>s/foo/bar/g` | 纵向编辑选中区域内
`:.,$s/foo/bar/g` | 当前行~最后
`:.,+2s/foo/bar/g` | 当前行~往后2行
`:g/^baz/s/foo/bar/g` | 全部以baz开头的行

当搜索时:
- `.`, `*`, `\`, `[`, `^`, `$` 是元字符
- `+`, `?`, `|`, `&`, `{`, `(`, `)` 必须转译
- `\/` 使用反斜杠+正斜杠搜索正斜杠
- `\t` tab
- `\s` 空白字符 (tab 或者 空格)
- `\n` 换行符
- `\r` 回车
- `[]` 表示一个集合 比如：`[abc]` 匹配只要包含字母 a或b或c 任一一个都行
- `-` 区间 比如：`a-z` 匹配小写字母a到z; `0-9` 匹配数字0到9；`A-Z` 匹配大写字母A到Z
- `[^` 替代 `[` 时表示反向集合匹配  比如：`[^1a-c]` 匹配除了 1,a,b,c 之外的任何字符
- `\{#\}` 重复次数匹配 比如：`/foo.\{2\}` 匹配foo和以下2个字符；`/foo.\{2}` 是等价的；因为`}`关闭时可用不用转译
- `\(foo\)` 分组匹配 `foo`

当替换时:
- `\r` 回车符
- `\n` 换行符
- `\&` &符号
- `\0` 插入整个模式匹配到的文本
- `\1` 插入第一个组匹配到的文本，`\2` 插入第二组，以此类推

其他分隔符:`#`     
`:s#http://www.example.com/index.html#http://example.com/#`

区间替换模式:`\zs` 和 `\ze`    
`:s/Copyright \zs2007\ze All Rights Reserved/2008/`     
等价于:     
`:s/Copyright 2007 All Rights Reserved/Copyright 2008 All Rights Reserved/`     


# 附加示例

命令 | 说明
--- | ---
`:%s/foo/bar/` | 每行第一次出现的替换
`:%s/.*\zsfoo/bar/` | 每行最后一次出现的替换
`:%s/\<foo\>//g` | 删除所有出现的全部单词“foo”
`:%s/\<foo\>.*//` | 删除整个单词“foo”和所有以下文本
`:%s/\<foo\>.\{5}//` | 删除整个单词“foo”的第一个出现以及以下五个字符
`:%s/\<foo\>\zs.*//` | 删除整个单词“foo”后的所有文本
`:%s/.*\<foo\>//` | 删除整个单词“foo”和所有以前的文本
`:%s/.*\ze\<foo\>//` | 删除整个单词“foo”之前的所有文本
`:%s/.*\(\<foo\>\).*/\1/` | 删除整个单词“foo”之前和之后的所有文本
`:%s/\<foo\(bar\)\@!/toto/g` | 用“toto”替换每个出现的“foo”，但foobar除外
`:s/^\(\w\)/\u\1/` | 本行单词首字母转大写 使用`\u` 参考：[切换字符的大小写](http://vim.wikia.com/wiki/Switching_case_of_characters)
`:%s/\(.*\n\)\{5\}/&\r/` | 每个5行插入一行空行

---
参考：
- [翻译来源 Vim Tips Wiki - Search and replace](http://vim.wikia.com/wiki/Search_and_replace#Comments)
- [vim全局替换命令](http://andyss.blog.51cto.com/315552/131652)

