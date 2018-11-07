---
layout: post
title: "Vim实用技巧进阶(第4章:可视化模式) - Practical.Vim.2nd.Edition"
tagline: "Tip 20~26"
keywords: "vim,practical-vim,可视化模式"
description: "Practical.Vim.2nd.Edition 实用技巧进阶: 第4章-可视化模式"
date: '2018-10-20 00:19:17 +0800'
category: linux
tags: vim practical-vim linux 
---
> {{ page.description }}


# 第4章 可视模式
> Visual Mode

批量编辑 或者 纵向编辑模式 有时可以极大的提高工作效率

## Tip 20 Grok可视化模式
{: #tip20}
> Grok Visual Mode

`Grok` : 通过感觉意会

## Tip 21 定义视觉选择
{: #tip21}
> Define a Visual Selection

Command         | Effect
`v`             | 切换为可视化模式:以字符为单位
`V`             | 切换为可视化模式:以行为单位
`<C-v>`         | 切换为可视化模式:以块为单位
`gv`            | 切换为可视化模式:上次的重启开启
`<Esc>` / `C-[` | 切换为常规模式
`o`             | 可视化模式下:跳转到高亮文本的另一头

## Tip 22 重复行可视化模式命令
{: #tip22}
> Repeat Line-wise Visual Commands

示例为一段 python 代码格式的缩进, 先设置一下: (确保一个缩进为4个空格)

`:set shiftwidth=4 softtabstop=4 expandtab`
<pre>
def fib(n):
    a, b = 0, 1
    while a < n:
print a,
a, b = b, a+b
fib(42)
</pre>

先缩进, 然后重复

Keystrokes | Buffer Contents
{start}    | def fib(n):<br>&nbsp;&nbsp;&nbsp;&nbsp;a, b = 0, 1<br>&nbsp;&nbsp;&nbsp;&nbsp;while a < n:<br><code class="cursor">p</code>rint a,<br>a, b = b, a+b<br>fib(42)<br>
`Vj`       | def fib(n):<br>&nbsp;&nbsp;&nbsp;&nbsp;a, b = 0, 1<br>&nbsp;&nbsp;&nbsp;&nbsp;while a < n:<br><code class="highlighter-rouge">print a,</code><br><code class="highlighter-rouge"><code class="cursor">a</code>, b = b, a+b</code><br>fib(42)<br>
`>.`       | def fib(n):<br>&nbsp;&nbsp;&nbsp;&nbsp;a, b = 0, 1<br>&nbsp;&nbsp;&nbsp;&nbsp;while a < n:<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<code class="cursor">p</code>rint a,<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;a, b = b, a+b<br>fib(42)<br>
{:.table-multi-text}


这里的2次缩进 `>.` 也可以用 `2>` 替代; 不过推荐用第一种方式, 不用数数, 参考: [Tip 11](https://xu3352.github.io/linux/2018/10/16/practical-vim-skills#tip11)

## Tip 23 尽量优先可视命令操作符
{: #tip23}
> Prefer Operators to Visual Commands Where Possible

可视模式下操作更加直观, 但是有个短板, 就是使用 `.` 命令时表现得不太好

链接内的文本转大写:
```html
<a href="#">one</a>
<a href="#">two</a>
<a href="#">three</a>
```

Keystrokes | Buffer Contents
{start}    | <code class="cursor"><</code>a href=\"#\">one</a><br><a href=\"#\">two</a><br><a href=\"#\">three</a>
`vit`      | <a href=\"#\"><code class="highlighter-rouge">on<code class="cursor">e</code></code></a><br><a href=\"#\">two</a><br><a href=\"#\">three</a>
`U`        | <a href=\"#\"><code class="cursor">O</code>NE</a><br><a href=\"#\">two</a><br><a href=\"#\">three</a>
`j.`        | <a href=\"#\">ONE</a><br><a href=\"#\"><code class="cursor">T</code>WO</a><br><a href=\"#\">three</a>
`j.`        | <a href=\"#\">ONE</a><br><a href=\"#\">TWO</a><br><a href=\"#\"><code class="cursor">T</code>HRee</a>
{: style="font-family:Courier;"}

`it` 表示标签内的所有内容 (`:h it`); 可视化模式下的 `U` 表示转大写 (`:h v_U`)

然而我们使用 `.` 命令重复之前的操作时, 最后一行的5个字母只有前3个转大写了 (`:h visual-repeat`)

可视化模式下按 `U` 有个等价的常规模式命令: `gU{motion}` (`:h gU`), 这里的2个组合字母可以看做是一个命令:`转大写`

所以把上面的示例里的 `vitU` 改成 `gUit` 后, 后面两行使用 `.` 命令时就达到了我们的预期了 

同理: `gu{motion}` 表示转小写   可视化模式下按 `u` 也是转小写

## Tip 24 可视化模式编辑表格
{: #tip24}
> Edit Tabular Data with Visual-Block Mode

把下面的文案做成看起来像表格的样子
<pre>
Chapter            Page
Normal mode          15
Insert mode          31
Visual mode          44
</pre>

![做成表格的样子](http://p9fggfk3y.bkt.clouddn.com/20181020155844_vim-edit-tabula-data-with-visual-mode.png)

感受到竖向编辑的强大了没? (IDE里几乎必备的一个功能)

说明:
- `<C-v>{motion}` - <kbd>Ctrl + v</kbd> 开启可视化块编辑模式; 然后选择目标块
- `x...` - <kbd>x</kbd>删除竖向的一列空格; 后面3个 `.` 删除后续的3列空格
- `gv` - 重新选中我们最后一次的可视化模式区域
- `r|` - 当前字符替换为竖线
- `yyp` - 复制一行
- `Vr-` - 选择当前行, 字符替换为 "-"

## Tip 25 纵向编辑
{: #tip25}
> Change Columns of Text 

直接来示例吧
<pre>
.one     a{ background-image: url('/images/sprite.png');  }
li.two   a{ background-image: url('/images/sprite.png');  }
li.three a{ background-image: url('/images/sprite.png');  }
</pre>

![纵向编辑示例](http://p9fggfk3y.bkt.clouddn.com/20181020162507_vim-change-columns-of-text.png){:width="100%"}

当我们选中区域, 按下 <kbd>c</kbd> 进入插入模式时, 这个时候只有 `第一行` 是正在进行修改的, 但我们编辑完成, 按 <kbd>Esc</kbd> 返回常规模式时, 会把变更应用到所有行

## Tip 26 可视化模式追加数据
{: #tip26}
> Append After a Ragged Visual Block

把下面的 `javascript` 代码追加 `;` 结束符号
<pre>

var foo = 1
var bar = 'a'
var foobar = foo + bar

</pre>

Keystrokes                       | Buffer Contents
{start}<br><br>*Normal mode*     | var foo = <code class="cursor">1</code><br>var bar = 'a'<br>var foobar = foo + bar
`<C-v>jj$`<br><br>*Visual-Block* | var foo = `1`<br>var bar = `'a'`<br>var foobar` = foo + bar`<code class="cursor">&nbsp;</code>
`A;`<br><br>*Insert model*       | var foo = 1;<code class="cursor">&nbsp;</code><br>var bar = 'a'<br>var foobar = foo + bar
`<Esc>`<br><br>*Normal mode*     | var foo = <code class="cursor">1</code>;<br>var bar = 'a';<br>var foobar = foo + bar;
{: .table-multi-text}

在 <kbd>Ctrl + v</kbd> 可视化块模式 下:
- `I` - 插入一段字符
- `A` - 追加字符 (每行结尾长度不一致时, 通常先使用 `$` 定位到行尾)
- `r` - 替换为单个字符
- `c` / `s` - 替换为一段字符
- `x` - 删除字符

---
参考：
- [等宽字体样式 - 字体笔记 - 阮一峰的网络日志](http://www.ruanyifeng.com/blog/2008/06/typography_notes.html)
