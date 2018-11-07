---
layout: post
title: "Vim实用技巧进阶(第9章:文件相互跳转导航) - Practical.Vim.2nd.Edition"
keywords: "vim,practical-vim,navigate,实用技巧"
description: "Practical.Vim.2nd.Edition 实用技巧进阶 第9章:文件相互跳转导航"
tagline: "Tip 56~59"
date: '2018-10-30 10:34:51 +0800'
category: linux
tags: vim practical-vim linux
---
> {{ page.description }}

# 第9章 文件相互跳转导航
> Navigate Between Files with Jumps

## Tip 56 遍历跳转列表
{: #tip56}
> Traverse the Jump List

*Vim* 在跳转之前和之后记录我们的位置，并提供一些命令来回溯我们的步骤

在WEB浏览器中通常会有两个按钮(一个后退,一个前进)对网页的跳转, 而 *Vim* 也有类似的功能:
- `<C-o>` - 后退, 跳转到上一个位置
- `<C-i>` - 前进, 后退之后就可以往前了    

这两个命令可以在 *跳转列表* 之间进行遍历

查看 *跳转列表*:
```
➾ :jumps
❮ jump line col file/text
    4    12   2 <recipe id="sec.jump.list">
    3   114   2 <recipe id="sec.change.list">
    2   169   2 <recipe id="sec.gf">
    1   290   2 <recipe id="sec.global.marks">
>
Press Enter or type command to continue
```

那么 *跳转位置* 是如何定义的呢?
> Any command that changes the active file for the current window can be described as a jump.

任何更改当前窗口的活动文件的命令都可以描述为跳转

例如使用 *:edit* 命令打开一个文件进行编辑时, 可以按 `<C-o>` 和 `<C-i>` 来回在2个文件之间进行切换

- 按 `[count]G` 跳转到指定行是 *跳转*, 而 上/下 (`k`/`j`) 一行的则不是
- 按 一句话 和 一段话移动操作是 *跳转*, 而 字符 和 词 则不是

按照经验, 大步的移动可以被归类为跳转, 而小步的移动只是移动

Command                                                    | Effect
----                                                       | ----
`[count]G`                                                 | 行跳转
/pattern`<CR>` 或 ?pattern`<Cr>`                           | 跳转到 下一个/上一个 匹配的 *pattern* 位置
`n` / `N`                                                  | 同上
`%`                                                        | 跳转到 配对的括号位置 *()* *[]* *{}* *<>*
`(` / `)`                                                  | 跳转到 前/后 一句内容
`{` / `}`                                                  | 跳转到 前/后 一段内容
`H` / `M` / `L`                                            | 跳转到 上/中/下 屏幕
`gf`                                                       | 跳转到 光标处的文件
`<C-]>`                                                    | 跳转到 光标处关键词定义的地方
<code class="highlighter-rouge">`{mark}</code> / `'{mark}` | 跳转到 标记 / 标记非空白行首 位置

`<C-o>` 和 `<C-i>` 命令本身就不是一个移动动作(motion); 不能在可视化模式下选择文本, 也不能在操作待定模式下使用

*操作待定模式* (Operator-Pending mode) 操作符(d/c/y) + 等待的移动动作(motion)

例如命令: `diw` (Operator + Motion = Action) 移动的动作可以是 *aw* *iW* *ip* 等等

*Vim* 可以维持多个跳转列表; 切分窗口(含标签页)都有自己的跳转列表, 当前活动的窗口仅能看到自己的跳转列表

*映射 Tab 键时需要注意*: 

在插入模式下, 按 `<C-i>` 其实和按 `<Tab>` 键效果是一样的. 所以如果打算重新映射 `<Tab>` 键时, 需要考虑到 `<C-i>` 一样会生效, 反之亦然. 

跳转列表的一个缺点就是只能单向遍历

## Tip 57 遍历变更列表
{: #tip57}
> Traverse the Change List

*Vim* 会记录当前文档每次变更时光标的位置, 并提供命令撤销/重做对文档的修改, 也可以对修改的历史记录进行遍历

*撤销/重做 命令*:
- `u` - 撤销变更
- `<C-r>` - 撤销的变更重做

<pre>
➾ :changes
❮ change line col text 
      3     1   8 Line one
      2     2   7 Line two
      1     3   9 Line three
>
Press ENTER or type command to continue
</pre>

*遍历变列表*:
- `g;` - 跳转到 *向前遍历* 变更位置, 不修改文档
- `g,` - 跳转到 *向后遍历* 变更位置, 不修改文档

**标记最后一次的修改**:
- <code class="highlighter-rouge">`.</code> - 跳转到 最后一次 变更的位置
- <code class="highlighter-rouge">`^</code> / `gi` - 跳转到 最后一次 退出插入模式的位置, 并进入插入模式 (<span class="red">非常实用</span>)

*Vim* 在编辑会话中维护每个缓冲区的更改列表; 不同的是, 为每个窗口创建单独的跳转列表

**手册**:
- *:h changelist*
- *:h `.*
- *:h `^*
- *:h gi*

## Tip 58 打开光标处的文件
{: #tip58}
> Jump to the Filename Under the Cursor

*Vim* 将文档中的文件名视为一种 *超链接*. 如果配置正确, 我们可以使用 `gf` 命令转到光标下的文件名

进入本书附属源码(文末有下载链接)的 *jumps* 目录, 文件列表如下:
<pre>
practical_vim.rb
practical_vim/
  core.rb
  jumps.rb
  more.rb
  motions.rb
</pre>

无插件模式启动*vim*:
<pre>
➾ $ cd code/jumps
➾ $ vim -u NONE -N practical_vim.rb
</pre>

*practical_vim.rb* 什么都没做, 仅仅是引入了 *core.rb* 和 *more.rb* 文件的代码:

<pre>
require 'practical_vim/core'
require 'practical_vim/more'
</pre>

当光标定位到 *practi- cal_vim/core* 后, 按下 `gf` 我们将会得到如下错误:
<pre>
E447: Can’t find file ‘practical_vim/core’ in path.
</pre>
{: style="color:darkred;"}

*Vim* 试图打开 *practical_vim/core*, 但是文件并不存在; 不过加了 *.rb* 后缀的 *practical_vim/core.rb* 是存在的; 而 *suffixesadd* 选项就可以在 *Vim* 找不到文件时加上指定的后缀 *.rb* 再进行尝试

**指定文件扩展名**: *suffixesadd* 可以指定多个扩展名
<pre>
:set suffixesadd+=.rb
</pre>

再次使用 `gf` 命令时, 我们就可以打开光标处对应的文件了; 试试打开 *more.rb* 文件, 此文件里面还有引入其他文件, 同样可以使用 `gf` 命令打开. 

每次我们使用 `gf` 命令时, *Vim* 会记录到跳转列表里, 我们可以使用 `<C-o>` 来返回之前的文件

**指定文件查找目录**:

在上面示例中, 我们打开的文件都是相对于 *当前工作目录* 的; 如果是第三方的库呢, 比如说 *rubygem*? 

<pre>
➾ :set path?
❮ path=.,/usr/include,,
</pre>

*path 详解*:
- `.` - 表示 当前文件 所在目录
- `/usr/include` - 这个很明显了
- `空` - 两个 `,,` 中间的空 就表示 当前工作目录

在比较大的项目里, 配置多个目录到 `path` 就会比较有用了

Tim Pope’s [bundler.vim](https://vimawesome.com/plugin/bundler-vim) 是一个可以把 *Gemfile* 里的目录自动加入到 *path* 里 (*Ruby* 就很实用了)

**手册**:
- *:h gf*
- *:h 'suffixesadd'*
- *:h 'path'*

## Tip 59 全局标记文件跳转
{: #tip59}
> Snap Between Files Using Global Marks

标记语法 `m{letter}`
- `m[a-z]` - 小写字母的, 创建一个可以在当前文件(缓冲区)进行跳转的标签
- `m[A-Z]` - 大写字母的, 创建一个可以全局的标签, 可以在多个文件之前跳转

跳转语法 <code class="highlighter-rouge">`{letter}</code>

默认情况下, 全局标记是可以再多个编辑会话中访问的; 也就是说当你创建一个全局标记后, 你再用 *Vim* 打开任意一个文件, 都可以通过 <code class="highlighter-rouge">`{letter}</code> 跳回标记处 (<span class="red">方便吧</span>)

**编码之前设置全局标记**:

全局标记在多个文件切换时非常有用; 例如我们先查找所有函数为 `fooBar()` 的代码:

<pre>
➾ :vimgrep /fooBar/ **
</pre>

默认情况下, *:vimgrep* 命令会跳转到第一个匹配的位置, 所以一般就会跳转到另一个文件了, 这种情况下, 我们可以使用 `<C-o>` 跳转回来

但是如果我们代码里面有很多包含 *fooBar* 的地方呢, 我们可以使用 `:cw` 调出 *quickfix* 全部匹配的列表, 切换多次后我们想回到最开始的地方, `<C-o>` 要跳转很多次才可以, 这个时候如果在我们执行 *:vimgrep* 命令之前有一个全局标记就完美了

不过全局标记需要提前设置好才可以, 所以那些场景适合需要多加练习

比如能产生 *quickfix* 提示窗口的 *:grep* *:vimgrep* *:make* 命令之前创建全局标签就是个不错的习惯, 类似的命令还有 *:args* 和 *argdo*

记住了, 全局标记一个可以设置 26 个(所有大写字母), 如果碰到想要快速跳回的地方, 不放先设置一个全局的标记

**手册**:
- *:h m*
- *:h `*
- *:h 'viminfo'*

---
- [Practical-Vim 源码下载地址](http://media.pragprog.com/titles/dnvim2/code/dnvim2-code.zip)
- [vimgrep 搜索总结](https://blog.csdn.net/zqiang_55/article/details/30715961)

