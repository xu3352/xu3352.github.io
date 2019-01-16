---
layout: post
title: "Vim实用技巧进阶(第10章:拼写检查) - Practical.Vim.2nd.Edition"
keywords: "vim,practical-vim,spell-checker,实用技巧"
description: "Practical.Vim.2nd.Edition 实用技巧进阶 第19章:Vim拼写检查和修复错字"
tagline: "Tip 120~123"
date: '2019-01-15 15:48:11 +0800'
category: linux
tags: vim practical-vim linux

---
> {{ page.description }}

# 第20章 拼写检查
> Find and Fix Typos with Vim’s Spell Checker

Vim 的拼写检查功能可以轻松找到并纠正拼写错误. 在 [Tip 120 拼写检查你的工作](#tip120) 中将介绍 常规模式 下操作拼写检查程序, 在 [Tip 123 插入模式下修复拼写错误](#tip123) 中则是插入模式下操作拼写检查程序

Vim 通常只附带英文的拼写文件, 但很容易安装其他拼写文件. 在 [Tip 121 使用备用拼写字典](#tip121) 中我们将切换美式和英式的英语. 如果一个单词被标记为拼写错误, 将其添加到拼写文件是一件简单的事情, 我们将在 [Tip 122 拼写文件中添加单词](#tip122) 中介绍到


## Tip 120 拼写检查你的工作
{: #tip120}
> Spell Check Your Work

启用拼写检查后, Vim 会标记不在拼写文件中的单词. 我们可以在拼写错误之间快速跳转并让 Vim 建议更正

示例文案 *spell_check/yoru-moustache.txt*
<pre>
Yoru mum has a moustache.
</pre>

第一个单词明显拼写错误了. 我们可以让 Vim 启用内置的拼写检查来高亮标记它:
```vim
➾ :set spell
```

单词 *\"Yoru\"* 现在应该被 *SpellBad* 语法高亮进行标记了. 通常, 此单词将用红色虚线加下划线展示, 但它的外观取决于当前的颜色配置方案

默认情况下, Vim 会根据英文字典单词检查拼写. 在 [Tip 121 使用备用拼写字典](#tip121) 中将介绍如何定制它. 但现在我们使用默认值

#### 操作拼写检查
> Operate Vim’s Spell Checker

我们可以使用 `[s` 和 `]s` 命令在标记的单词之间向前或向后跳转(参考 `:h ]s`{:.vimhelp}). 当光标地位到拼写错误的单词上, 我们可以调用 `z=` 命令让 Vim 给出一份推荐的集合(参考 `:h z=`{:.vimhelp}). 截图为触发 `z=` 前后的展示:

![拼写检查前/后](/assets/archives/vim-spell-check-01.png){:width="90%"}

这是可以按下 `1<CR>` 来替换拼写错误的单词. 如果列表没有我们想要的, 那么可以按 `<Esc>` 取消. 

我们可以通过在 `z=` 命令前加个计数前缀来跳过提示, 该指令指示 Vim 使用编号的建议单词. 如果我们确信第一个建议是正确的, 那么运行 `1z=` 就可以一次性修复它了.

写作的时候, 可以把草稿和拼写检查分开做. 写作时可以禁用拼写检查, 以免每次都被标记. 最后, 在启用拼写检查的情况下审核最终的文档, 并修复标记的拼写错误

下面是基本的常规模式下拼写检查命令:

Command | effect
----    | ----
`]s`    | 跳转到下个拼写错误
`[s`    | 跳转到上个拼写错误
`z=`    | 当前单词的推荐集合
`zg`    | 添加单词到拼写文件
`zw`    | 从拼写文件删除当前单词
`zug`   | 反转(撤销) `zg` 或 `zw`, 对当前单词
{: .table-multi-text}

`zg`, `zw` 和 `zug` 命令将在 [Tip 122 拼写文件中添加单词](#tip122) 中介绍到


## Tip 121 使用备用拼写字典
{: #tip121}
> Use Alternate Spelling Dictionaries

Vim 的拼写检查支持区域性的英语变体. 那么就得了解如何指定区域以及如何获取其他语言的拼写词典

当启用 Vim 的拼写检查器, 默认它会和英文字典进行对比. 我们可以通过修改 `'spelllang'` 选项来改变它(参考 `:h 'spelllang'`{:.vimhelp}). 这不是全局设置, `'spelllang'` 始终是缓冲区本地设置. 这意味着可以同时处理两个或多个文档, 如果是双语的, 那么每一个文档都可以使用不同的拼写文件

#### 指定语言的区域变体
> Specify a Regional Variant of a Language

Vim 的拼写文件支持几种不同地区的英语变体. 默认的 *spelllang=en* 设置将允许拼写在任何英语地区都可以接受的单词. 不管是写 *\"moustache\"*(英式) 或 *\"mustache\"*(美式) 的, Vim 拼写检查器都可以通过

我们可以设置仅支持美式的拼写:
```vim
➾ :set spell
➾ :set spelllang=en_us
```

这个设置, \"moustache\" 就会被标记为拼写错误, 但是 \"mustache\" 则没问题. 其他支持的地区包括: *en_au*, *en_ca*, *en_gb* 以及 *en_nz*. 更多请参考 `:h spell-remarks`{:.vimhelp}

#### 获取其他语言的拼写文件
> Obtain Spell Files for Other Languages

Vim 附带了英语拼写文件, 但此 URL 上的拼写文件可用于其他多种语言: [http://ftp.vim.org/vim/runtime/spell/](http://ftp.vim.org/vim/runtime/spell/) (没用中文的 :( ... 估计是词之间没有间隔... )

如果我们尝试启用系统上没有的拼写文件, Vim 会为我们提取并按照它:
```vim
➾ :set spell
➾ :set spelllang=fr
❮ Cannot find spell file for "fr" in utf-8 
  Do you want me to try downloading it? 
  (Y)es, [N]o:
➾ Y
❮ Downloading fr.utf-8.spl
  In which directory do you want to write the file:
  1. /Users/drew/.vim/spell
  2. /Applications/MacVim.app/Contents/Resources/vim/runtime/spell
  [C]ancel, (1), (2):
```

此功能有名为 *spellfile.vim* 的插件提供, 该插件为 Vim 自带的(参考 `:h spellfile.vim`{:.vimhelp}). 要让他好使, 需要在 *~/.vimrc* 中至少有以下两行:
```vim
set nocompatible 
plugin on
```


## Tip 122 拼写文件中添加单词
{: #tip122}
> Add Words to the Spell File

Vim 的拼写字典并不全面, 但是可以通过在拼写文件中添加单词来增强它们

Vim 有时会错误的把一些词标记为拼写错误, 是因为该词未收录在词典中. 我们可以使用 `zg` 命令(参考 `:h zg`{:.vimhelp})把光标处的词添加到拼写文件来教 Vim 识别该词

Vim 还提供了一个互补的 `zw` 命令, 可以把光标处的单词标记为拼写错误. 事实上, 此命令允许我们从拼写文件中删除单词. 如果我们无意中触发了 `zg` 或 `zw` 命令, 这就可能会意外的添加或删除拼写文件中的单词. Vim 为这种情况提供了专用的 `zug` 撤销命令, 它可以恢复对光标下单词的 `zg` 或 `zw` 命令的操作

Vim 在拼写文件中记录添加到字典的单词, 以便它们在其他会话中也可以使用. 拼写文件的名称是用语言和文件编码命名的

例如, 如果我们正在使用UTF-8编码的文件, 并且拼写检查器使用英语词典, 则使用 `zg` 命令添加的单词将会记录在名为 `~/.vim/spell/en.utf-8.add` 的文件中

#### 为专业术语创建一个拼写文件
> Create a Spell File for Specialist Jargon

使用 `'spellfile'` 选项可以指定 Vim `zg` 和 `zw` 命令添加或删除单词的文件路径(参考 `:h 'spellfile'`{:.vimhelp}). Vim 还允许同时指定多个拼写文件, 这意味着我们可以维护多个单词列表

此书就包含了许多的未记录在英文词典里的词汇, 包括 Vim 命令(例如 `ciw`)和设置(例如 `'spelllang'`). 然而如果不想 Vim 将其标记为拼写错误的词, 那么就得告诉 Vim 需要识别这些词. 所以, 有必要维护一个单独的 Vim 术语的单词列表. 然后在任何有关 Vim 的地方加载使用它

*spell_check/spellfile.vim*
```vim
setlocal spelllang=en_us
setlocal spellfile=~/.vim/spell/en.utf-8.add
setlocal spellfile+=~/books/practical_vim/jargon.utf-8.add
```

*~/.vim/spell/en.utf-8.add* 是默认的路径, Vim 的 `zg` 命令添加单词用的. 而 *~/books/practical_vim/jargon.utf-8.add* 则是用来保存 Vim 专业术语用的

对于拼写检查器标记为错误的每个单词, 现在就有2种选择了, 一个是按 `2zg` 来添加到自定义的 Vim 专业术语列表里, 或 `1zg` 添加到默认的单词列表里


## Tip 123 插入模式修复拼写错误
{: #tip123}
> Fix Spelling Errors from Insert Mode

Vim 的拼写自动补全功能允许我们不用脱离插入模式就可以修复拼写错误

想象一下: 我们刚刚已经输入了一行内容, 然后发现前面有几个拼写错误的单词, 这时应该怎么做呢?

#### 准备
> Preparation

这里需要先把拼写检查器启用:
```vim
➾ :set spell
```

#### 常用方式:切到常规模式
> The Usual Way: Switch to Normal Mode

要修复错误, 我们可以切换到常规模式, 然后 `[s` 命令跳转到前面拼写错误的地方, 然后使用 `1z=` 来进行修复. 之后我们可以按 `A` 命令切回到插入模式, 然后继续编辑

#### 快速模式:使用拼写补全
> The Fast Way: Use Spelling Autocompletion

然而, 我们可以在插入模式使用 `<C-x>s` 命令来修复此错误, 它会触发一个特殊的自动补全(参考 `:h compl-spelling`{:.vimhelp}). 我们也可以使用更容易的输入 `<C-x><C-s>`. 下图为触发 `<C-x>s` 命令前/后的效果, 注意是在插入模式下:

![插入模式下的拼写自动补全](/assets/archives/vim-spelling-autocompletion.png){:width="70%"}

此自动补全的单词列表其实和 [Tip 120 拼写检查你的工作](#tip120) 中使用 `z=` 命令是相同的推荐列表

当触发自动补全命令时, Vim 通常是给光标处单词提供补全的推荐列表. 但本示例的 `<C-x>s`, Vim 会从光标处往前扫描, 然后停留在有拼写错误的单词处, 然后它会构建一个推荐列表并弹出一个补全的菜单供我们选择, 如同我们在 [Tip 113 自动补全弹出菜单](https://xu3352.github.io/linux/2019/01/03/practical-vim-skills-chapter-19#tip113) 中选择一样

当一行包含多个拼写错误的单词时, `<C-x>s` 命令就非常实用. 在之前的示例中, 如果我们运行 *:set spelllang=en_us*, 那么 \"moustache\" 也会标记为拼写错误. 从插入模式开始, 光标位于行的末尾, 我们可以通过按 `<C-x>s` 2次来修复这2个拼写错误. 亲自尝试一下, 它会很棒的!!!


