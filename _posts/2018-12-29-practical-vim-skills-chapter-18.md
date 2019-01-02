---
layout: post
title: "Vim实用技巧进阶(第18章:按项目搜索grep,vimgrep) - Practical.Vim.2nd.Edition"
keywords: "vim,practical-vim,grep,ack,vimgrep,实用技巧"
description: "Practical.Vim.2nd.Edition 实用技巧进阶 第18章:按项目搜索grep,vimgrep"
tagline: "Tip 109~111"
date: '2018-12-29 11:27:03 +0800'
category: linux
tags: vim practical-vim linux

---
> {{ page.description }}

# 第18章 按项目搜索:grep,vimgrep

Vim 的搜索命令非常适合按模式查找文件中所有出现的匹配项. 但是, 如果我们现在整个项目中进行查找呢? 这样就必须扫描多个文件. 按传统来说, 它是专用的 Unix 工具: `grep`

本章将介绍 Vim 自己的 `:grep` 命令, 它允许我们在 Vim 内部调用外部程序. 虽然此命令默认调用系统的 `grep`(如果可用), 但它可以轻松定制: 将任务外包给其他专用程序, 例如 `ack`

使用外部程序的一个缺点是它们的正则表达式语法可能与Vim搜索的语法不兼容. 但 Vim 提供了 `:vimgrep` 命令, 它允许我们使用 Vim 内置搜索引擎按模式对多个文件进行搜索. 不过是有代价的: 处理速度并不像专用程序那么快


## Tip 109 Vim内调用grep
{: #tip109}
> Call grep Without Leaving Vim

Vim 的 `:grep` 命令充当外部 `grep`(或类似 grep) 程序的包装器. 使用此包装器, 我们可以让 grep 在不离开 Vim 的情况下按模式搜索多个文件, 然后还可以使用 quickfix 列表来导航匹配到的结果

首先, 我们将逐步完成 grep 和 Vim 独立运行的工作流程, 而不互相通信. 在考虑解决这些问题的基础解决方案之前, 我们将使用此方法检查不足之处

#### 使用命令行的grep
> Using grep from the Command Line

假设我们正在使用 Vim 工作, 然后需要找到当前目录下所有文件中的 *\"Waldo\"* 单词, 退出 Vim, 然后执行以下的脚本: (随书源码的 `grep` 目录, 文末可下载源码)
```bash
➾ $ grep -n Waldo *
❮ department-store.txt:1:Waldo is beside the boot counter.
   goldrush.txt:6:Waldo is studying his clipboard.
   goldrush.txt:9:The penny farthing is 10 paces ahead of Waldo.
```

默认情况下, `grep` 为每个匹配打印一行输出, 显示匹配行的内容和文件名. `-n` 表示把行号打印出来

那么对于这个输出结果可以做什么呢? 我们可以把它当做一个表格来对待, 对于结果列表的每一行, 可以打开文件并指定行号. 例如, 指定第9行打开 *goldrush.txt* 文件, 可以这样:
```bash
➾ $ vim goldrush.txt +9
```

当然, 我们的工具可以比这更好的集成

#### Vim内部调用grep
> Calling grep from Inside Vim

Vim 的 `:grep` 命令是外部 `grep` 程序的包装器(参考 *:h :grep*). 所以, 可以在 Vim 里直接执行:
```vim
➾ :grep Waldo *
```

在幕后, Vim 帮我们在shell中执行了 `grep -n Waldo *`, 没有打印 grep 的输出, 但做了更有用的事情. Vim 解析了结果并构造了一个 quickfix 列表. 因此, 我们可以使用 `:cnext` / `:cprev` 命令来进行导航, 更多的导航命令参考 [第17章:Quickfix编译代码和导航错误](https://xu3352.github.io/linux/2018/12/21/practical-vim-skills-chapter-17)

即使我们简单的调用 `:grep Waldo *`, Vim 自动的包含了 `-n` 标志, 告诉 grep 把行号一起输出. 这就是为什么当我们使用 quickfix 列表导航时, Vim 可以直接定位到匹配的行

假设我们想忽略大小写的进行 grep 匹配, 那么需要加一个 `-i` 标志:
```vim
➾ :grep -i Waldo *
```

在幕后, Vim 执行的是 `grep -n -i Waldo *`. 注意 `-n` 标志是默认存在的. 如果我们想调整它的行为, 可以以相同的方式把其他任何标志传给 `grep`


## Tip 110 定制grep程序
{: #tip110}
> Customize the grep Program

Vim 的 `:grep` 命令其实就是外部 `grep` 程序的包装器. 我们可以通过操作 `'grepprg'` 和 `'grepformat'` 两个设置来自定义 Vim 委派任务的方式. 首先, 我们将检查默认值, 然后调整它们来将搜索任务外包给其他合适的程序

#### Vim默认的grep设置
> Vim’s Default grep Settings

`'grepprg'` 设置指定当 Vim 的 `:grep` 命令执行时在 shell 中执行什么内容(参考 *:h \'grepprg\'*). 而 `'grepformat'` 设置则告诉 Vim 如何解析 `:grep` 命令执行的结果(参考 *:h \'grepformat\'*). 在 Unix 系统中, 默认的设置为:
```vim
grepprg="grep -n $* /dev/null"
grepformat="%f:%l:%m,%f:%l%m,%f  %l%m"
```

`grepprg` 中的 `$*` 表示一个占位符: 它将被替换为 `:grep` 命令后的所有参数

`'grepformat'` 设置是一个包含标记的字符串, 用来描述由 `:grep` 返回的输出. 字符串中特殊的标记与 `'errorformat'` 相同, 在 [Tip 108 自定义外部的编译器-Nodelint输出来填充Quickfix](https://xu3352.github.io/linux/2018/12/21/practical-vim-skills-chapter-17#nodelint%E8%BE%93%E5%87%BA%E6%9D%A5%E5%A1%AB%E5%85%85quickfix) 中已经介绍过. 完整的标记列表可以参考 *:h errorformat*

来看看默认的 *%f:%l:%m* 格式与下面的 grep 输出相比较:
<pre>
department-store.txt:1:Waldo is beside the boot counter.
goldrush.txt:6:Waldo is studying his clipboard.
goldrush.txt:9:The penny farthing is 10 paces ahead of Waldo.
</pre>

`%f` 表示文件名(如 *department-store.txt* 或 *goldrush.txt*), `%l` 表示行号, `%m` 表示匹配行的内容

`'grepformat'` 字符串可以包含由逗号分隔的多个格式. 默认值匹配 *%f:%l:%m* 或 *%f %l%m*. Vim 将使用匹配到 `:grep` 输出的第一种格式

#### :grep调用ack
> Make \':grep\' Call ack

`ack` 是一种专门针对程序员的 `grep` 替代方案. 如果你想了解它与 grep 的差异, 可以去它的官网看看 [http://betterthangrep.com](http://betterthangrep.com)

首先, 我们需要安装 `ack`, `Ubuntu` 安装如下:
```bash
➾ $ sudo apt-get install ack-grep
➾ $ sudo ln -s /usr/bin/ack-grep /usr/local/bin/ack
```

第一个命令是安装程序, 安装之后就可以使用 `ack-grep` 进行调用. 第二个命令则是创建了一个系统连接, 然后就可以简单的直接调用 `ack` 了

在 Mac OS X 上, 可以使用 Homebrew 进行安装 ack:
```bash
➾ $ brew install ack
```

下面我们来看看如何定制 `'grepprg'` 和 `'grepformat'` 设置, 以便 `:grep` 来调用 `ack`. 默认情况下, `ack` 单独一行来展示文件名, 然后是每个匹配的行号以及内容, 如下所示:
```bash
➾ $ ack Waldo *
❮ department-store.txt
  1:Waldo is beside the boot counter.

  goldrush.txt
  6:Waldo is studying his clipboard.
  9:The penny farthing is 10 paces ahead of Waldo.
```

通过使用 `--nogroup` 开关运行 `ack`, 可以轻松的使其类似于 `grep -n` 的输出:
```bash
➾ $ ack --nogroup Waldo *
❮ department-store.txt:1:Waldo is beside the boot counter.
   goldrush.txt:6:Waldo is studying his clipboard.
   goldrush.txt:9:The penny farthing is 10 paces ahead of Waldo.
```

此输出与 `grep -n` 的格式匹配了. 并且由于 Vim 默认的 `'grepformat'` 字符串知道如何解析它, 所以不需要更改它. 因此, 使用 `ack` 替代 `grep` 最简单的就是设置 `'grepprg'` 即可:
```vim
➾ :set grepprg=ack\ --nogroup\ $*
```

#### Ack跳转指定行和列
> Make ack Jump to Line and Column

`ack` 还有另一个技巧. 使用 `--column` 选项运行时, `ack` 将输出行号和列号:
```bash
➾ $ ack --nogroup --column Waldo *
❮ department-store.txt:1:1:Waldo is beside the boot counter. 
  goldrush.txt:6:1:Waldo is studying his clipboard. 
  goldrush.txt:9:41:The penny farthing is 10 paces ahead of Waldo.
```

如果我们可以通过调整 `'grepformat'` 选项来提取列号的信息, 那么我们就可以跳转到每个匹配的精确位置, 而不仅仅只是跳转到匹配的行上. 使用下面的设置就能简单的搞定:
```vim
➾ :set grepprg=ack\ --nogroup\ --column\ $*
➾ :set grepformat=%f:%l:%c:%m
```

`%c` 项可以匹配行号

#### 可选的grep插件
> Alternative grep Plugins

使用 Vim 可以轻松地将多文件搜索外包到外部程序. 我们只需要更改 `'grepprg'` 和 `'grepformat'` 设置, 然后执行 `:grep` 即可. 并且我们的结果会写入到 quickfix 列表中. 无论实际调用哪个程序, 界面几乎一样

但是还是有一些重要的差别. `grep` 使用 POSIX 正则表达式, 而 `ack` 使用 `Perl` 正则表达式. 如果 `:grep` 在后台调用 `ack`, 那么就会增加一层误导. 你不想创建一个自定义的 `:Ack` 命令来进行搜索么? 

`Ack.vim` 插件遵循这个策略, `fugitive.vim` 也是如此, 它添加了一个定制的 `:Ggrep` 命令来调用 `git-grep`. 我们可以安装几个这样的插件, 因为每个插件都创建了一个自定义命令, 而不是覆盖 `:grep` 命令. 所以他们可以共存而不会发生冲突. 我们不必坚持使用同一个类似grep的程序, 而应该选择最合适的那个来完成手里的工作

**两个插件的链接**: [Ack.vim](https://github.com/mileszs/ack.vim) 和 [fugitive.vim](https://github.com/tpope/vim-fugitive)


## Tip 111 Vim内置的vimgrep
{: #tip111}
> Grep with Vim’s Internal Search Engine

`:vimgrep` 命令允许我们使用 Vim 内置的正则表达式引擎来搜索多个文件

作为示例, 这里使用 `grep/quotes` 目录下的文件, 可以在文末的随书源码中找到. 目录包含以下文件, 以及对应的内容:
<pre>
quotes/
  clock.txt
  Don't watch the clock; do what it does. Keep going.

  tough.txt
  When the going gets tough, the tough get going.

  where.txt
  If you don't know where you are going,
  you might wind up someplace else.
</pre>

每个文件都至少包含一个以上的 *going* 单词, 我们可以在 Vim 中使用 `:vimgrep` 搜索每个文件:
```vim
➾ :vimgrep /going/ clock.txt tough.txt where.txt
❮ (1 of 3): Don't watch the clock; do what it does. Keep going.
➾ :cnext
❮ (2 of 3): When the going gets tough, the tough get going.
➾ :cnext
❮ (3 of 3): If you don't know where you are going,
```

`:vimgrep` 命令把每个匹配的行的内容都填充到了 quickfix 列表. 然后就可以使用 `:cnext` 和 `:cprev` 命令进行导航了 (更多参考 [Tip 106 查看Quickfix列表](https://xu3352.github.io/linux/2018/12/21/practical-vim-skills-chapter-17#tip106))

*tough.txt* 文件包含了2个 *going* 单词, 但是 `:vimgrep` 命令只把匹配到了第一个. 如果在匹配模式后加上 `g` 标志, 那么 `:vimgrep` 将会匹配所有的, 而不仅仅是每行的第一个:
```vim
➾ :vim /going/g clock.txt tough.txt where.txt
❮ (1 of 4): Don't watch the clock; do what it does. Keep going.
```

这次 quickfix 列表就有 *going* 单词的全部4个出现的条目. 这个也许正好提醒你 `:substitute` 替换命令的工作方式: 默认情况下, 只影响每行的第一个匹配项, 但是如果指定了 `g` 标志符, 那么将会影响每行的所有匹配项. 所以, 当使用 `:substitute` 和 `:vimgrep` 命令时, 不要忘记了指定 `g` 标志符

#### 指定要查看的文件
> Specifying Which Files to Look Inside

`:vimgrep` 命令的语法格式(参考 *:h :vimgrep*):
```vim
:vim[grep][!] /{pattern}/[g][j] {file} ...
```

`{file}` 参数不能为空, 它可以是文件名, 通配符, 反引号表达式, 或者他们的任意组合. 每种用来填充参数列表的技术都可以在这里使用. (参考 [Tip 38 用参数列表将缓冲区分组-填充参数列表](https://xu3352.github.io/linux/2018/10/23/practical-vim-skills-chapter-6#tip38))

在前面的示例中, 我们单独把每个文件都拼写出来了, 使用通配符也能达到同样的效果:
```vim
➾ :vim /going/g *.txt
❮ (1 of 4): Don't watch the clock; do what it does. Keep going.
```

除了能够使用 `*` 和 `**` 通配符之外, 我们还可以使用 `##` 符号, 该符号被扩展为表示参数列表中每个文件的名称(参考 *:h cmdline-special*). 这样就有可替代的工作流程了. 首先, 把需要的文件填充到参数列表, 然后运行 `:vimgrep` 遍历参数列表中的每个文件 

```vim
➾ :args *.txt
➾ :vim /going/g ##
❮ (1 of 4): Don't watch the clock; do what it does. Keep going.
```

这种方式看起来要麻烦一点, 因为分别执行了2个 Ex 命令. 但是也许你会更喜欢这样使用 `:vimgrep`, 因为它可以分别解决2个问题: 指定搜索哪些文件, 以及使用哪种匹配模式? 填充参数列表之后, 我们可以根据需要随时使用 `:vimgrep` 命令来进行重用那组文件

#### 先文件内搜索, 再按项目
> Search in File, Then Search in Project

我们可以把搜索模式字段留空, 这样 `:vimgrep` 就能重用上次的搜索字段了. 同样的技巧也适用于 `:substitute` 替换命令(在 [Tip 91 重用上次搜索模式](https://xu3352.github.io/linux/2018/12/03/practical-vim-skills-chapter-14#tip91) 中已经介绍过), `:global` 命令也是一样. 如果我们想在多个文件进行正则表达式搜索, 这就很方便. 所以, 可以先在当前文件把搜索表达式写好并测试好, 然后再使用相同的搜索模式执行 `:vimgrep` 命令. 例如: 想要在当前文件用正则同时搜索 *don't* 和 *Don't*:
```vim
➾ /[Dd]on't
➾ :vim //g *.txt
❮ (1 of 2): Don't watch the clock; do what it does. Keep going.
```

这里主要的优点在于: `:vimgrep` 使用了搜索命令相同的搜索模式. 如果我们想要使用 `:grep` 对同一模式进行项目范围的搜索, 那么就必须先将其转换为 POSIX 正则表达式. 对于简单的模式比较容易, 不过, 复杂的你就不会想执行此操作了. 例如 [Tip 85 用搜索历史创建复杂搜索](https://xu3352.github.io/linux/2018/11/21/practical-vim-skills-chapter-13#tip85) 的示例就比较复杂 (由于 `:grep` 可以是外包给外部程序的, 所以正则表达式的规范可能不一致, 所以就需要转换)

#### 搜索历史和:vimgrep
> Search History and :vimgrep

下面的命令可能会经常使用, 它用来搜索参数列表中的每个文件:
```vim
➾ :vim //g ##
❮ (1 of 2): Don't watch the clock; do what it does. Keep going.
```

使用此命令需要注意的一点是, 它始终使用参数列表和搜索历史记录当前的值(最后一次搜索记录). 如果稍后我们重复此命令, 他可能会有不同的行为, 这就取决于我们的参数列表和历史记录中的内容了

或者, 我们可以按 `<C-r>/` 来填充搜索字段中上次搜索模式的值, 两种搜索结果都相同, 但我们的命令的历史记录会有所不同
```vim
➾ :vim /<C-r>//g ##
```

如果你认为稍后可能需要重新运行相同的 `:vimgrep` 命令, 那么在命令历史中保留该模式就会很有用了

---
- 随书源码: [Practical.Vim.2nd.Edition 源码包](/assets/archives/20181106092815_dnvim2-code.zip)
- [维基百科-正则表达式](https://zh.wikipedia.org/wiki/%E6%AD%A3%E5%88%99%E8%A1%A8%E8%BE%BE%E5%BC%8F)
- [正则表达式流派简介及差异:PCRE和POSIX(BRE和ERE)规范](http://www.4e00.com/blog/linux/2016/01/21/posix-bre-and-ere-regular-expression.html)
- [正则表达式“派别”简述(POSIX标准和PCRE标准)](https://liujiacai.net/blog/2014/12/07/regexp-favors/)

