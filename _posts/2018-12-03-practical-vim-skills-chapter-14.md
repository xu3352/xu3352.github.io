---
layout: post
title: "Vim实用技巧进阶(第14章:替换) - Practical.Vim.2nd.Edition "
tagline: "Tip 88~97"
keywords: "vim,practical-vim,substitution,实用技巧"
description: "Practical.Vim.2nd.Edition 实用技巧进阶 第14章:替换"
date: '2018-12-03 22:40:41 +0800'
category: linux
tags: vim practical-vim linux

---
> {{ page.description }}

# 第14章 替换
> Substitution

你可能认为 替换(substitute)命令 仅用于简单的查找和替换操作, 但实际上, 它是最强大的 *Ex* 命令之一. 到本章末尾, 我们将了解 替换命令 可以扮演从简单到复杂的所有角色.

后面我们将看一些提示和技巧, 它们允许我们通过重用最后一个搜索模式来更快地编写替换命令. 我们还将研究一种特殊情况, Vim 允许我们在确认替换之前对每个匹配进行确认. 我们将学习如何在不打字的情况下补全替换字段, 我们将测试替换字段中可用的一些特殊行为. 我们还将学习如何在不同范围内重复最后一次替换命令, 而无需重新键入整个命令.

我们可以在替换字段中执行 Vim 脚本表达式. 我们将研究一个高级示例, 利用它来对一系列数字匹配并执行算术运算. 然后我们将学习如何使用单个替换命令互换两个(或更多)单词.

最后我们将看到几种在多个文件中搜索和替换的策略


## Tip 88 替换命令
{: #tip88}
> Meet the Substitute Command

*:substitute* 命令很复杂. 除了要提供搜索模式和替换文本之外, 还需要指定执行的范围. 另外, 还可以提供额外的标识符来调整其行为

*substitute* 命令允许我们查找和替换一个文本块, 语法如下:
<pre>
:[range]s[ubstitute]/{pattern}/{string}/[flags]
</pre>

替换命令有很多个部分组成. 对于 *[range]* 的使用和其他 *Ex* 命令一样, 我们在 [Tip 28. 区间执行命令](https://xu3352.github.io/linux/2018/10/21/practical-vim-skills-chapter-5#tip28) 已经深入的介绍过了. 而 *{pattern}* 则在 [第12章.匹配模式和匹配文本](https://xu3352.github.io/linux/2018/11/08/practical-vim-skills-chapter-12) 中已详细介绍过

#### 标志位调整替换行为

我们可以使用 *flags* 来调整替换命令的行为. 理解 *flag* 的最佳方式就是在实际使用中看效果, 下面介绍几种 *flag* (完整的 *flag* 请参考 *:h :s_flags*)

**几种常用的 flag 标志符**:
- `g` - 让替换命令应用到全局, 而不是仅改变第一个匹配项. 在 [Tip 89. 查找和替换](#tip89) 详细介绍
- `c` - 替换前需要确认或拒绝修改, 在 [Tip 90. 观察每次替换](#tip90) 中详细介绍
- `n` - 禁止替换行为, 此功能可用于统计匹配文本的数量. 在 [Tip 86. 统计匹配计数](https://xu3352.github.io/linux/2018/11/21/practical-vim-skills-chapter-13#tip86) 中已经介绍过
- `e` - 忽略错误信息. 例如搜索没有匹配项时, 替换命令会提示一个错误信息 "E486: Pattern not found."
- `&` - 告知 Vim 重用上一次替换命令中的相同标志. 在 [Tip 93. 重复上次替换命令](#tip93) 中详细介绍

#### 替换字段的特殊字符

在 [第12章.匹配模式和匹配文本](https://xu3352.github.io/linux/2018/11/08/practical-vim-skills-chapter-12) 中我们已经知道输入搜索模式时某些字符是有特殊意义的. 而替换字段也是有一些特殊字符的. 在文档 *:h sub-replace-special* 中可以找到所有的特殊字符, 下面的列表是一些特别强调的:

Symbol           | Represents
----             | ----
`\r`             | 插入回车(而不是`\n`)
`\t`             | 插入 tab 键
`\\`             | 插入反斜杠 `\`
`\1`             | 插入第一个子匹配
`\2`             | 插入第二个只匹配 (依次到 \9)
`\0`             | 插入整个匹配的文本
`&`              | 插入整个匹配的文本
`~`              | 使用上次的 {string} 替换文本
`\={Vim script}` | 执行 {Vim脚本} 表达式, 把结果结果作为 {string} 替换文本
{: .table-multi-text}

`\r` `\t` 和 `\\` 不用过多说明了. 在 [Tip 93. 重复上次替换命令](#tip93) 中将会介绍 `~` 的用法, 同时也会学习到几种快捷方式更快的来重复调用替换命令. 而 `\1` 和 `\2` 将会在 [Tip 94. 重新排列CSV字段](#tip94) 详细介绍

`\={Vim script}` 就非常强大了. 它可以执行一段 Vim 脚本, 而得到结果作为替换的文本 *{string}* 来使用. 在后续的 [Tip 95. 替换时执行算术运算](#tip95) 和 [Tip 96. 两个词互换](#tip96) 中会有相关的示例


## Tip 89 查找和替换
{: #tip89}
> Find and Replace Every Match in a File

默认情况下, 替换命令只作用于当前行的第一个匹配项. 如果想要替换文件当中的所有的匹配项, 那么就得指定作用的区间和使用 `g` 标志

*substitution/get-rolling.txt*
<pre>
When the going gets tough, the tough get going.
If you are going through hell, keep going.
</pre>

这里我们想把所有的 *going* 替换为 *rolling* 单词. 首先, 我们启用 *hlsearch* 选项来实时高亮显示匹配到的内容 (参考 [Tip 81. 高亮匹配内容](https://xu3352.github.io/linux/2018/11/21/practical-vim-skills-chapter-13#tip81))
<pre>
➾ :set hlsearch
</pre>

而最简单的方式, 就是直接把搜索模式 {pattern} 和替换文本 {string} 放到替换命令中:

Keystrokes       | Buffer Contents
----             | ----
:s/going/rolling | <code class="cursor">W</code>hen the rolling gets tough, the tough get <code class="visual">going</code>. <br/> If you are <code class="visual">going</code> through hell, keep <code class="visual">going</code>.
{: .table-multi-text}

可以看到 Vim 只是把第一个 *going* 替换为 *rolling*, 而剩下的都没变. 

为了好理解原因, 可以把文件理解为一个沿 x轴(按字符列,从左到右) 和 y轴(按行,从上到下) 的二维面板. 默认情况下, 替换命令仅作用于当前行的第一个匹配项. 那么如何来扩展 x轴 和 y轴 的范围呢?

为了扩展 横轴 我们需要包含 `g` 标志符. 这代表 全局(global), 这个名字有点误导人. 有人可能认为此标识符应该是指在整个文件中起作用, 但实际上它只是在当前行起作用(*globally within the current line*). 如果你还记得 Vim 是行编辑器 *ed*(一个原生的 Unix 文本编辑器) 的后代, 那就能更好的理解了

按下 `u` 来撤销之前的修改, 这次我们使用 `/g` 标志来进行替换:

Keystrokes         | Buffer Contents
----               | ----
:s/going/rolling/g | <code class="cursor">W</code>hen the rolling gets tough, the tough get rolling.  <br>If you are <code class="visual">going</code> through hell, keep <code class="visual">going</code>.
{: .table-multi-text}

这次第一行的2处的 *going* 都被替换掉了, 不过仍然还有没改的地方. 那么如何扩展到 纵轴 至整个文件呢?

答案是:在替换命令前加个区间. 如果使用 `%` 前缀, 则表示整个文件(影响每一行):

Keystrokes          | Buffer Contents
----                | ----
:%s/going/rolling/g | When the rolling gets tough, the tough get rolling.  <br/><code class="cursor">I</code>f you are rolling through hell, keep rolling.
{: .table-multi-text}

替换命令仅仅是众多 *Ex* 命令中的一个, 所有的 *Ex* 命令都可以指定一个区间作来起作用. 在 [Tip 28. 区间执行命令](https://xu3352.github.io/linux/2018/10/21/practical-vim-skills-chapter-5#tip28) 已经详细介绍过

总结一下, 如果我们先查找替换当前文件中所有的目标, 我们就得明确的告诉替换命令要对整个 x轴 和 y轴 都要进行处理. `g` 标志符处理水平轴, 而 `%` 则处理垂直轴

这些细节细节很容易. 在 [Tip 93. 重复上次替换命令](#tip93) 中会介绍一些重复替换命令的技术


## Tip 90 盯住每次替换
{: #tip90}
> Eyeball Each Substitution

找到所有的匹配项并盲目的使用替换命令进行替换有时候并不总是好用. 有时我们需要查看每次匹配项来决定是否需要替换. 这个时候就需要用到 `c` 标识符了

*the_vim_way/1_copy_content.txt*
<pre>
...We're waiting for content before the site can go live...
...If you are content with this, let's go ahead with it...
...We'll launch as soon as we have the content...
</pre>
第1行和第3行的 *content* 需要替换为 *copy*, 第二行的则不变

还记得 [Tip 5. 手动查找和替换](https://xu3352.github.io/linux/2018/10/16/practical-vim-skills#tip5) 的示例么? 我们无法直接使用查找和替换来把 *content* 全部改为 *copy*, 而是使用 点命令来解决的问题. 不过, 我们也可以使用 `c` 标志符的替换命令:
<pre>
➾ :%s/content/copy/gc
</pre>

`c` 标志符会让 Vim 在每次要进行替换的时候提示询问 *\"replace with copy?\"* 然后我们可以选择 `y` 同意修改 或 选择 `n` 放弃本次修改. 

本示例中, 我们只需要按下 `yny` 即可把第1行和第3行进行修改, 而第2行不进行修改. 

`c` 标志询问的答案不止2种, 而是 *\"y/n/a/q/l/^E/^Y\"*

Keystrokes | Buffer Contents
----       | ----
`y`        | *yes* 替换本次修改
`n`        | *no* 放弃本次修改
`q`        | *quit* 退出替换
`l`        | *last* 本次为最后一次替换, 然后退出
`a`        | *all* 替换本次和剩下的所有项
`<C-e>`    | 向上滚动屏幕
`<C-y>`    | 向下滚动屏幕
{: .table-multi-text}

更多信息参考帮助手册 *:h :s_c*

#### 讨论

不同寻常的是, 键盘上的大多数按键在 Vim 替换确认模式中不起任何作用. 只有 `<Esc>` 键是返回到常规模式, 其他的则不行

从好的方面来说, 这使我们能够用最少的按键来完成任务. 另一方面, 其他大部分按键的所有功能都无法使用. 相比之下, 如果使用 点命令([Tip 5. 手动查找和替换](https://xu3352.github.io/linux/2018/10/16/practical-vim-skills#tip5)), 那就可以在常规模式下完成修改. 其他按键也能按期望的运作

2种方式都可行, 这取决于你的决定

## Tip 91 重用上次搜索模式
{: #tip91}
> Reuse the Last Search Pattern

将替换命令的搜索字段留空会让 Vim 重用上次的搜索模式. 这个可以用来简化我们的工作流程

现实的情况是: 当要执行一个替换命令时, 需要敲很多字符. 首先要指定一个区间, 然后填写搜索模式和替换文本字段, 最后可能还要加上某些必要的标志符. 敲的东西多了, 就越容易出错了

好消息是: 我们可以把搜索字段留空, Vim 就会使用上次的搜索模式了

还记得之前 [Tip 85. 用搜索历史创建复杂搜索](https://xu3352.github.io/linux/2018/11/21/practical-vim-skills-chapter-13#tip85) 非常复杂的替换命令:
<pre>
➾ :%s/\v'(([^']|'\w)+)'/“\1”/g
</pre>

相当于下面2个分开的命令
<pre>
➾ /\v'(([^']|'\w)+)'
➾ :%s//“\1”/g
</pre>

所以呢? 无论如何, 我们都需要输入完整的搜索模式, 对吧? 这不是重点. 替换命令包括两个步骤: 写好一个完整的搜索模式 和 设计一个合适的替换字符串. 这种方式可以使得这2个任务解耦

编写一个复杂的正则表达式时, 通常需要进行多次尝试才能正确的匹配. 如果我们通过替换命令来测试匹配的模式, 那么每次执行都将对文档进行修改, 这就太乱了. 而执行搜索命令则不会对文档进行修改, 因此可以更方便的进行尝试, 在 [Tip 85. 用搜索历史创建复杂搜索](https://xu3352.github.io/linux/2018/11/21/practical-vim-skills-chapter-13#tip85) 小节中, 我们看到了构建正则表达式的有效工作流程. 分离这两个任务可以让工作流程更加的清晰. 

另外, 谁说非得敲一遍搜索模式的. 在 [Tip 87. 用选中文本搜索](https://xu3352.github.io/linux/2018/11/21/practical-vim-skills-chapter-13#tip87) 小节中, 我们加一点 Vim 脚本来重写了可视化模式的 `*` 命令. 这个映射可以在可视化模式下选择目标文本, 然后按 `*` 键来进行搜索. 然后我们就可以使用留空的搜索字段来运行替换命令, 这样就能对选中的文本进行快捷的替换了. <span class="success">懒是一种美德!</span>

#### 并不总是合适

并不是所有的情况都不需要填写搜索字段, 例如下面例子: 把文件所有行的换行符替换为逗号:
<pre>
➾ :%s/\n/,
</pre>

这种情况就不用把替换命令分为两部分来单独处理了, 一个命令就搞定了

#### 命令历史的瓜葛

还有一种情况要考虑, 将搜索字段留空时在历史记录中会是一个不完整的记录. 搜索模式保存着在 Vim 搜索历史中, 而替换命令则保存在 Ex 命令历史中(参考 *:h cmdline-history*). 解耦搜索和替换任务会导致两条信息存在不同的地方, 如果后面想重用替换命令, 可能会有点麻烦.

如果需要在历史记录中调用完整形式的替换命令, 则可以把搜索字段填好. 在命令行中按 `<C-r>/` 会将最后的搜索模式从搜索寄存器中粘贴出来. 下面的示例就能补全一个完整的替换命令
```bash
➾ :%s/<C-r>//“\1”/g
```

有时将替换命令的搜索字段留空会很方便, 有时这不是. 尝试两种方式, 根据场景使用你认为最合理的


## Tip 92 使用寄存器替换
{: #tip92}
> Replace with the Contents of a Register

如果替换文本已存在文档中, 那么就没有必要再敲一遍替换文本了, 可以先把它拷贝到寄存器里, 然后在输入替换文本时粘贴使用. 也可以通过值或引用来使用寄存器的内容. 

在 [Tip 91. 重用上次搜索模式](#tip91) 中看到当把替换命令的搜索字段留空时, Vim 会自动使用上次的搜索模式. 那么你可能认为替换字段留空也是重用上次的替换文本, 但事实并非如此. 相反, 如果把替换字段留空, 那么会把所有匹配文本替换为空字符串, 相当于把搜索匹配文本全部删除了.

#### 值传递

我们可以使用 `<C-r>{register}` 来插入寄存器里的内容. 假如已经拷贝(yank)了内容, 然后想在替换命令的替换字段进行粘贴:
```bash
➾ :%s//<C-r>0/g
```

当敲下 `<C-r>0` 时, Vim 会把 0寄存器(yank寄存器) 的内容粘贴出来. 这使得我们在执行替换命令前可以进行检查. 多数情况下, 这个方法很好用, 但是有些情况会有问题.

如果 0寄存器 内的文本包含了一些特殊字符(例如 `&` 或 `~`), 那么在替换字段中是有特殊含义的, 这个时候我们就得进行转义处理. 此外, 如果 0寄存器 的内容如果包含多行文本, 那么它也不适合命令行使用. 

为了避免这些问题, 我们可以简单地将引用传递给寄存器放到替换字段. 

#### 引用传递

假设我们已经拷贝(yank)了多行文本(文本已存到了 0寄存器 内), 然后想把内容填充到替换命令的替换字段处, 那么可以这样:
<pre>
➾ :%s//\=@0/g
</pre>

在替换字段中, `\=` 可以让 Vim 执行一段 Vim 脚本表达式. 在 Vim 脚本中, 我们可以使用 `@{register}` 方式来引用寄存器的内容. `@0` 会返回 yank寄存器 的内容, 而 `@"` 则返回 匿名寄存器 的内容. 所以 `:%s//\=@0/g` 则是使用 yank寄存器 的内容来替换上次搜索的匹配项

#### 对比

先看下面的替换命令:
<pre>
➾ :%s/Pragmatic Vim/Practical Vim/g
</pre>

对比下面的一组命令:
<pre>
➾ :let @/='Pragmatic Vim' 
➾ :let @a='Practical Vim' 
➾ :%s//\=@a/g
</pre>

`:let @/='Pragmatic Vim'` 是用编程的方式来设置搜索模式. 它和 `/Pragmatic Vim<CR>` 执行的效果是一样的 (不同点在于前者不会在搜索历史中创建一条记录)

同样的, `:let @a='Practical Vim'` 则是把内容存到了 a寄存器. 最终的效果与手动的在可视化模式下选择 *Practical Vim* 文本, 然后按下 `"ay` 键是一样的. 都是把 *Practical Vim* 存到了 a寄存器.

两个替换命令执行的结果一样: 把所有的 *Pragmatic Vim* 替换为 *Practical Vim*. 想想每种方法有什么不同之处.

第一个替换命令, 会在命令历史中保存一条 `:%s/Pragmatic Vim/Practical Vim/g` 执行记录. 在后面的编辑过程中, 如果又需要重复本次的替换命令, 那么我们可以在命令历史中找到它, 并可以直接执行.

第二个替换命令, 则会在命令历史中保存一条 `:%s//\=@a/g` 执行记录. 看起来有点神秘, 不是吗?

当第一次运行此替换命令时, 搜索模式为 *Pragmatic Vim*, 而 a寄存器 的内容为 *Practical Vim*. 然而过一段时间后, 当前的搜索模式可能已经变过很多次了, 而 a寄存器 的内容也可能已经存为其他内容了. 所以如果重复执行 `:%s//\=@a/g` 命令, 那么可能会导致意想不到的效果.

我们也可以利用此特点. 先搜索想要的文本, 然后把需要替换的文本存入 a寄存器. 再次执行 `:%s//\=@a/g` 命令, 刚好就能达到我们的替换目的, 它会使用准备好的 `@\` 和 `@a` 内容进行搜索和替换. 如果还有其他的需要替换的, 那么只需重复上面的步骤, 先搜索, 然后把替换文本存 a寄存器, 再执行 `:%s//\=@a/g` 命令即可. (是不是有种函数传参的感觉)

动手试试吧, 你可以会喜欢上它, 也可能讨厌它. 不过这是个非常巧妙的技巧.

## Tip 93 重复上次替换命令
{: #tip93}
> Repeat the Previous Substitute Command

有时候我们可能需要修改替换命令的范围, 也可能在第一次尝试的时候犯小错误, 或者只是想在不同的缓冲区重新运行命令. 一些快捷方式可以轻松的重复替换命令.

#### 当前行改为整个文件执行

假设我们执行了下面的命令(当前行执行):
<pre>
➾ :s/target/replacement/g
</pre>

后来发现有点问题, 需要加上前缀 `%` 执行整个文件. 那么我们可以按 `g&` (参考 *:h g&*), 重用上次的命令以扩展到整个文件, 其效果和下面运行的一致:
<pre>
➾ :%s//~/&
</pre>

此命令效果如下:
- 使用相同的标志
- 相同的替换字符串
- 上次的搜索命令
- 但是范围改为了全文件的 `%`

换句话说, `g&` 命令重复了最后一次替换命令, 只是区间换成了整个文件

下次当你发现需要将上次的替换命令改为整个文件执行时, 不妨试试 `g&` 命令

#### 修改替换命令区间

示例代码 *substitution/mixin.js*
```js
mixin = {
    applyName: function(config) {
        return Factory(config, this.getName());
    },
}
```

假设我们想改为:
```js
mixin = {
    applyName: function(config) {
        return Factory(config, this.getName());
    },
    applyNumber: function(config) {
        return Factory(config, this.getNumber());
    },
}
```

新的 *applyNumber* 方法和已有的非常相似. 所以我们可以先复印一份, 然后再使用替换命令把 *Name* 改为 *Number*. 先看下面的错误示范:
![tip93 复印和全部替换](/assets/archives/vim-substitution-mixin-01.png){:width="100%"}

由于使用了 `%` 符号作为范围, 所以所有的 *Name* 给替换为了 *Number*. 而实际上我们只想替换第二个函数的几行.

别担心, 我们可以非常简单的撤销并修复此问题:
![tip93 局部替换](/assets/archives/vim-substitution-mixin-02.png){:width="100%"}

`gv` 命令可以再次选中最后一次可视化命令选择的区域(参考 [Tip 21. 定义视觉选择](https://xu3352.github.io/linux/2018/10/19/practical-vim-skills-chapter-4#tip21)), 当我们在可视化模式下按 `:` 键时, 命令行会提示为 `:'<,'>` 正好就是 *Ex* 命令执行所需要的选中行的区间

而 `:&&` 命令需要说明一下, 因为第一个 `&` 和第二个 `&` 符号的含义是不同的. 第一个 `:&` 组合为 *Ex* 命令, 功能为重复最后一次替(*:substitute*)换命令(参考 *:h :&*), 而第二个 `&` 则表示使用前一个替换命令的标志符

#### 讨论

我们可以为 `:&&` 命令指定一个新的区间来重跑替换命令. 这样就不用考虑最后一次使用的区间范围了. `:&&` 自身只作用于当前行. 而 `:'<,'>&&` 则作用于可视化选中的区间, `:%&&` 则作用于整个文件. 正如前面提到的 `g&` 命令就是 `:%&&` 的快捷方式了

#### 修复 & 命令

`&` 命令是 `:s` 替换命令的代名词, 它可以重复执行最后一次的替换命令. 不幸的是, 如果我们使用了标识符的话, 那么 `&` 命令会忽略它们, 这可能导致和之前的替换效果完全不同

而 `&` 如果可以触发 `:&&` 命令就非常有用了. 因为它保留了标识符, 所以替换的效果更加一致. 所以可以创建一组映射来修复常规模式和可视化模式的 `&` 命令:
```vim
nnoremap & :&&<CR>
xnoremap & :&&<CR>
```


## Tip 94 重新排列CSV字段
{: #tip94}
> Rearrange CSV Fields Using Submatches

本小节我们将看到如何在替换字段中引用从搜索模式中捕获的子匹配

下面的 CSV 文件包含3列: *last name,first name,email* 

*substitution/subscribers.csv*
<pre>
last name,first name,email
neil,drew,drew@vimcasts.org
doe,john,john@example.com
</pre>

现在想重新安排一下列的顺序, 先后为: *email,first name,last name*, 可以使用替换命令:
```bash
➾ /\v^([^,]*),([^,]*),([^,]*)$
➾ :%s//\3,\2,\1
```

`[^,]` 匹配除了英文逗号的其他所有字符, 所以 `([^,]*)` 匹配零到多个非英文逗号的字符串, 并作为一个子匹配进行捕获(参考 [Tip 76. 使用括号捕获子匹配](https://xu3352.github.io/linux/2018/11/08/practical-vim-skills-chapter-12#tip76)). 我们重复3次以捕获 CSV 文件中的3个字段

我们可以使用 `\n` 的形式来引用这些子匹配. 所以在替换字段中, `\1` 就表示 *last name* 字段, `\2` 表示 *first name* 字段, `\3` 表示 *email* 字段. 将每一行切分成单个字段后, 就可以重新排列成我们想要的顺序了, 即: `\3,\2\,1` 依次代表 *email, first name, last name*

运行替换命令之后, 得到如下的结果:
<pre>
email,first name,last name
drew@vimcasts.org,drew,neil
john@example.com,john,doe
</pre>


## Tip 95 替换时执行算术运算
{: #tip95}
> Perform Arithmetic on the Replacement

替换字段可以是简单的文本字符串, 也可以是一个 Vim 脚本表达式, 而表达式最终的运行结果作为替换的文本来使用. 因此, 单个命令就能把HTML文档中的H标签(H1到H6)提升一个等级

示例HTML文档内容如下 *substitution/headings.html*
```html
<h2>Heading number 1</h2>
<h3>Number 2 heading</h3>
<h4>Another heading</h4>
```

我们想提升每个标签的等级, 例如把 `<h2>` 改为 `<h1>`, `<h3>` 改为 `<h2>`, `<h4>` 改为 `<h3>` 等等. 换句话说, 想把所有 HTML 的 H标签 中的数字减1

我们将套用替换命令来完成此项工作. 通常的想法是: 先编写一个与HTML的H标签数字部分匹配的搜索模式. 然后再写一个替换命令, 使用 Vim 脚本表达式来把捕获的数字部分减1. 运行替换命令的时候, 我们对整个文件范围(`%`)使用全局标志(`g`), 这样所有的 HTML 的 H标签将会被一个命令所修改

#### 定制搜索模式
> The Search Pattern

由于只想修改 H标签 中的数字部分, 所以只需要匹配到标签中的数字即可. 其他的数字则并不是我们想要的, 所以需要匹配以 `<h` 或 `</h` 开始的数字:
<pre>
➾ /\v\<\/?h\zs\d
</pre>

`\zs` 项允许我们精准的匹配. 简单的说, `h\zs\d` 可以匹配到 h字符和一个数字(h1, h2, h3等). `\zs` 的位置表示 h 本身将被排除在匹配之外, 即使它是匹配模式中的一部分(在 [Tip 78. 标注匹配的边界](https://xu3352.github.io/linux/2018/11/08/practical-vim-skills-chapter-12#tip78) 中对 `\zs` 和 `\ze` 做了详细的介绍). 我们的搜索模式看起来比较复杂, 因为不仅仅需要匹配 h1 和 h2, 而且还要匹配 `<h1`, `</h1`, `<h2`, `</h2` 等情况

执行结果后, 你可以看到只有 h标签后的数字被高亮显示了, 而独立的数字则没有, 效果如下:

<pre>
&lt;h<code class="visual">2</code>&gt;Heading number 1&lt;/h<code class="visual">2</code>&gt;
&lt;h<code class="visual">3</code>&gt;Number 2 heading&lt;/h<code class="visual">3</code>&gt;
&lt;h<code class="visual">4</code>&gt;Another heading&lt;/h<code class="visual">4</code>&gt;
</pre>

#### 定制替换命令
> The Substitute Command

目标是想在替换命令的替换字段内执行算术运算. 为了做到这个, 就必须得使用 Vim 脚本表达式. 我们可以调用 *submatch(0)* 函数来获取当前的匹配项. 由于我们的搜索只匹配一个数字, 所以 *submatch(0)* 会返回一个数字. 因此我们执行算术的减1后的结果来当做替换文本

<pre>
➾ :%s//\=submatch(0)-1/g
</pre>

运行上面的替换命令后, 可以得到如下的结果:
```html
<h1>Heading number 1</h1>
<h2>Number 2 heading</h2>
<h3>Another heading</h3>
```


## Tip 96 两(多)个词互换
{: #tip96}
> Swap Two or More Words

我们可以设计一个替换命令, 通过表达式寄存器和Vim脚本字典来将一个词和另一个词进行位置互换(所有匹配的位置)

示例文本 *substitution/who-bites.txt*
<pre>
The dog bit the man.
</pre>

例如想把 *dog* 和 *man* 的位置进行互换. 我们可以用一些列的 yank 和 put 命令进行操作(如同 [Tip 62. 寄存器替换选中的文本-2个词互换](https://xu3352.github.io/linux/2018/11/01/practical-vim-skills-chapter-10#2%E4%B8%AA%E8%AF%8D%E4%BA%92%E6%8D%A2)). 但这里考虑一下如何使用替换命令来执行此操作

这里有个天真的解决方案:
<pre>
➾ :%s/dog/man/g
➾ :%s/man/dog/g
</pre>

第一个命令把 *dog* 替换成了 *man*, 于是得到如下结果:
<pre>
the man bit the man.
</pre>
然后, 第二个命令则会把2处的 *man* 替换为 *dog*, 于是得到如下结果:
<pre>
the dog bit the dog.
</pre>
显然, 这个还需要做更多的尝试(两次不行, 再来一次是可以解决的, 想想2个变量如何互换值, 加个临时变量呗)

两步的解决方案并不好, 所以我们需要一次替换命令就能通过的方式. 用来同时匹配 *dog* 和 *man* 的搜索匹配简单一点(可以先想一想), 难点在于编写一个能够接受一个词并返回另一个词的表达式. 那么先来解决难点的部分.

#### 返回另一个词

我们不用去创建一个函数来完成此任务. 可以用一个简单的 key-value 字典数据结构来搞定. 在 Vim 中按下面的命令执行:
<pre>
➾ :let swapper={"dog":"man","man":"dog"}
➾ :echo swapper["dog"]
❮ man
➾ :echo swapper["man"]
❮ dog
</pre>

当把 *dog* 传给 swapper 字典时, 它会返回 *man*, 反之亦然

#### 匹配2个词

弄清楚我们需要的搜索模式了吗? 答案如下:
```vim
➾ /\v(<man>|<dog>)
```

此搜索模式简单的把 *man* 和 *dog* 放到一起匹配了. 括号可以捕获匹配的文本的, 替换的时候会引用到.

#### 合并

把搜索和替换合并到一起. 首先运行搜索命令, 它会把所有匹配到的 *dog* 和 *man* 都高亮的显示出来. 然后我们运行替换命令, 把搜索字段留空就能简单的重用上次的搜索模式了(参考 [Tip 91. 重用上次搜索模式](#tip91))

为了进行替换, 我们得写一点 Vim 脚本. 这就需要在替换字段中使用 `\=` 项. 这次, 我们不打算创建一个字典的变量, 而是直接内联创建一次即可使用.

通常我们可以使用 `\1`, `\2` (以此类推) 来引用捕获的文本. 但在 Vim 脚本中, 我们必须通过调用 *submatch()* 函数来获取捕获的文本 (参考 *:h submatch()* ). 

最终所有命令合并到一起就是:
```vim
➾ /\v(<man>|<dog>)
➾ :%s//\={"dog":"man","man":"dog"}[submatch(1)]/g
```

#### 讨论

其实这个例子并不是很好. 我们把 *man* 和 *dog* 都敲了3遍. 显然, 本示例文档中如果我们手动的修改这2个单词还要快一点. 但是如果文档很大, 而要处理的文本也很多, 这时这种额外的努力很快就会有可观的回报了. 注意, 这个技巧可以很容易把三个或更多的词进行一次性的替换.

本例仍然存在过多打字的问题. 在多写些Vim脚本, 我们就可以编写一个自定义的命令, 可以有更友好的交互来完成重复性的替换工作. 但此不在本书考虑范围内, 可以参考 [Abolish.vim](https://github.com/tpope/vim-abolish) 获取灵感

#### Abolish.vim : 增压替换命令 

本书作者推荐一款叫 *Abolish* 的[插件](https://vimawesome.com/plugin/abolish-vim), 它增加了自定义的命令 *:Subvert*(或简写的 *:S*), 这就像增压版本的替换命令. 使用此插件来交换 *man* 和 *dog* 的话只需要运行:
<pre>
➾ :%S/{man,dog}/{dog,man}/g
</pre>

除了输入更少之外, 而且更加灵活. 除了能将 *man* 和*dog* 互换之外, 它还能把 *MAN* 和 *DOG*, *Man* 和 *Dog* 互换(注意字母大小写). 本示例仅仅是展示了此插件的皮毛, 还有其他更加强大的功能有待你的发掘

## Tip 97 多文件的查找和替换
{: #tip97}
> Find and Replace Across Multiple Files

替换命令只能对当前文件进行操作. 那么如果我们想对整个项目都进行相同的替换应该如何做呢? 虽然这种情况很常见, 但 Vim 却没有包含用于项目范围查找和替换的专用命令. 不过可以通过组合一些与 quickfix 列表一起运行的 Vim 原始命令来获得此功能

作为演示, 我们将使用 *refactor-project* 作为目录(可以在随书源码中找到), 它包含以下文件, 以及对应的内容:

<pre>
refactor-project/
  about.txt
  Pragmatic Vim is a hands-on guide to working with Vim.

  credits.txt
  Pragmatic Vim is written by Drew Neil.

  license.txt
  The Pragmatic Bookshelf holds the copyright for this book.

  extra/
    praise.txt
    What people are saying about Pragmatic Vim...

    titles.txt
    Other titles from the Pragmatic Bookshelf...
</pre>

每个文件都包含了单词 *Pragmatic*, 现在想把所有的 *Pragmatic Vim* 替换为 *Practical Vim*. 而 *Pragmatic Bookshelf* 不进行修改.

如果想跟着练习的话, 可以下载随书的[源码](/assets/archives/20181106092815_dnvim2-code.zip), 在打开 Vim 之前, 先切换到 *./substitution/refactor-project* 目录.

本次工作需要用到一个叫 `:cfdo` 的命令, 而它是在 Vim `7.4.858`{:.warning} 版本中引入的, 如果你的 Vim 版本比较老, 那么就需要先升级一下了

#### 替换命令

我们先来设计替换命令. 需要的是匹配 *Pragmatic Vim* 中的 *Pragmatic*, 但是 *Pragmatic Bookshelf* 中的除外. 那么这种模式匹配可以解决:
<pre>
➾ /Pragmatic\ze Vim
</pre>

使用 `\ze` 项可以后面的 *Vim* 排除在匹配外(参考 [Tip 78. 标注匹配的边界](https://xu3352.github.io/linux/2018/11/08/practical-vim-skills-chapter-12#tip78)), 而替换命令就简单了:
<pre>
➾ :%s//Practical/g
</pre>

接下来就得想办法怎么在整个项目中执行此替换命令. 接下来分为2个步骤. 首先需要对目标模式执行项目范围的搜索, 然后对这些文件中返回匹配的地方进行替换

#### 项目级别的搜索 :vimgrep

使用 *:vimgre* 命令可以用来作为项目级别的搜索(参考 Tip 111. Vim内置的Grep搜索). 由于使用的 Vim 内置搜索引擎, 我们可以重用相同的搜索模式:
```vim
➾ /Pragmatic\ze Vim
➾ :vimgrep // **/*.txt
```

此命令的搜索字段由两个斜杠留空, 也就是使用最后的搜索模式. 然后使用 `**/*.txt` 通配符来告诉 *vimgrep* 对当前目录下所有以 *.txt* 结尾的文件进行搜索

#### 项目级别的替换 :cfdo

*vimgrep* 返回的每个匹配都记录在 *quickfix* 列表中(在 第17章 中会详细介绍). 可以使用 *:copen* 命令来打开的 *quickfix* 窗口查看结果. 但我们希望对 *quickfix* 列表中出现的每个文件执行替换命令, 而不是一次一个的遍历结果. 那么就可以使用 *:cfdo* 命令(参考 *:h :cfdo*)

在执行 *:cfdo* 命令前, 需要先把 *hidden* 设置开启:
<pre>
➾ :set hidden
</pre>

这个选项可以让我们在文件之间切换而不用先进行保存. 在 [Tip 38. 用参数列表将缓冲区分组](https://xu3352.github.io/linux/2018/10/23/practical-vim-skills-chapter-6#tip38) 已经介绍过

现在我们就可以对 *quickfix* 列表中的所有文件执行替换命令了:
<pre>
➾ :cfdo %s//Practical/gc
</pre>

这里的 `c` 标志是可选的, 这可以让我们在替换之前先浏览匹配项, 然后确认是否需要替换(参考 [Tip 90. 盯住每次替换](#tip90)). 最后把所有的修改进行保存:
<pre>
➾ :cfdo update
</pre>

*:update* 命令是仅把有变动的文件进行保存(参考 *:h update*)

小提示, 最后的两个命令可以合并成一个:
<pre>
➾ :cfdo %s//Practical/g | update
</pre>

`|` 符号在 Vim 命令行和shell的命令行中有所不同. 在 *Unix* 中, 管道字符将标准输出从一个命令传递到下一个命令的标注输入(创建一个管道"pipeline"), 而在 Vim 中, `|` 只是命令的分隔符, 等同于shell中的分号. 更多信息请参考 *:h :bar*

#### 总结

完整的命令如下:
```vim
➾ /Pragmatic\ze Vim
➾ :vimgrep // **/*.txt
➾ :cfdo %s//Practical/gc
➾ :cfdo update
```

我们首先编写一个搜索模式并检查它能否在当前缓冲区可用. 然后使用 *:vimgrep* 对整个项目范围进行相同的搜索, 而结果会填充到 *quickfix* 列表. 然后使用 *:cfdo* 命令对 *quickfix* 列表中的所有文件执行替换和保存命令

---
- [Practical.Vim.2nd.Edition 源码包](/assets/archives/20181106092815_dnvim2-code.zip)

