---
layout: post
title: "Vim实用技巧进阶(第16章:ctags索引和导航) - Practical.Vim.2nd.Edition"
keywords: "vim,practical-vim,ctags,实用技巧"
description: "Practical.Vim.2nd.Edition 实用技巧进阶 第16章:ctags源码索引和导航"
tagline: "Tip 102~104"
date: '2018-12-16 11:11:33 +0800'
category: linux
tags: vim practical-vim linux

---
> {{ page.description }}

# 第16章 ctags源码索引和导航
> Index and Navigate Source Code with ctags

*ctags* 是一个外部程序, 它能扫描代码库并生产关键词索引. 它最初是在 Vim 中构建的, 但在 Vim 第6版之后, 它独立了出来成为了一个单独的项目. 现在, Vim 与 ctags 紧密集成显而易见

Vim 的 ctags 可以让我们快速跳转到函数和类的定义的地方, 从而可以在代码中快速的进行导航. 我们将在 [Tip 104 标签命令导航到关键词定义处](#tip104) 中看到是如何做到的. 而第二个好处是, 我们可以利用 ctags 生成的结果来进行自动补全, 在 [Tip 114 Understand the Source of Keywords-Tag Files] 中会有相关介绍

除非 Vim 知道哪里能查找到最新的索引文件, 否则标签导航和自动补全功能是没法正常工作的. 在 [Tip 103 配置使用ctags](#tip103) 中将展示如何配置 Vim 的 ctags. 但首选, 我们需要知道如何安装和运行 ctags

## Tip 102 遇见ctags
{: #tip102}
> Meet ctags

要使用 Vim 标签导航的功能, 就必须先安装ctags. 然后我们将学习如何执行程序并理解它生成的索引

#### 安装Exuberant ctags
> Installing Exuberant Ctags

Linux 用户应该能通过他们的包管理器获得 ctags. 如: Ubuntu 安装如下:
<pre>
➾ $ sudo apt-get install exuberant-ctags
</pre>

OS X 附带一个名为 ctags 的 BSD 程序. `注意`{:.warning}: 这与 Exuberant Ctags 不同. 你必须自己安装 Exuberant Ctags. 使用 homebrew 安装:
<pre>
➾ $ brew install ctags
</pre>

检查 ctags 是否安装成功:
<pre>
➾ $ ctags --version
❮ Exuberant Ctags 5.8, Copyright (C) 1996-2009 Darren Hiebert
   Compiled: Dec 18 2010, 22:44:26
   ...
</pre>

如果你没有看到上面的提示消息, 那么可能需要修改 *$PATH*. 确保 */usr/local/bin* 优先级比 */usr/bin* 高 

(`温馨提示`{:.warning}: 找到环境配置文件, 一般是 ~/.bashrc , ~/.zshrc, /etc/profile 等地方, 导入 PATH 时, 把 */usr/local/bin* 放到 */usr/bin* 之前即可, 最后记得 source 重新加载)

#### ctags 创建代码库索引
> Indexing a Codebase with ctags

我们可以在命令行手动调用 ctags 创建索引, 它需要传一个或多个文件的路径作为参数. 随书[源代码](http://127.0.0.1:4000/assets/archives/20181106092815_dnvim2-code.zip)中包括一个有三个 Ruby 文件组成的演示程序. 运行 ctags:
```vim
➾ $ cd code/ctags
➾ $ ls
❮ anglophone.rb francophone.rb speaker.rb
➾ $ ctags *.rb
➾ $ ls
❮ anglophone.rb francophone.rb speaker.rb tags
```

注意 ctags 创建了一个叫 tags 的纯文本文件. 它包含了ctags解析出来的三个源文件中关键词的索引

#### 剖析标签文件
> The Anatomy of a tags File

来看看刚刚创建的 tags 文件:
```
!_TAG_FILE_FORMAT    2    /extended format; --format=1 will not append ;" to lines/
!_TAG_FILE_SORTED    1    /0=unsorted, 1=sorted, 2=foldcase/
!_TAG_PROGRAM_AUTHOR    Darren Hiebert    /dhiebert@users.sourceforge.net/
!_TAG_PROGRAM_NAME    Exuberant Ctags    //
!_TAG_PROGRAM_URL    http://ctags.sourceforge.net    /official site/
!_TAG_PROGRAM_VERSION    5.8    //
Anglophone    anglophone.rb    /^class Anglophone < Speaker$/;"    c
Francophone    francophone.rb    /^class Francophone < Speaker$/;"    c
Speaker    speaker.rb    /^class Speaker$/;"    c
initialize    speaker.rb    /^  def initialize(name)$/;"    f    class:Speaker
speak    anglophone.rb    /^  def speak$/;"    f    class:Anglophone
speak    francophone.rb    /^  def speak$/;"    f    class:Francophone
speak    speaker.rb    /^  def speak$/;"    f    class:Speaker
```

tags 文件以一些元数据的行开始. 然后每行列出一个关键词, 以及在源代码中定义的关键词的文件名和地址. 关键词按字母排序, 因此 Vim (或其他文本编辑器)可以通过二进制搜索快速定位它们.

##### 关键词按模式寻址, 而不是行号
> Keywords Are Addressed by Pattern, Not by Line Number

tags 文件格式规范声明该地址可以是任何 Ex 命令. 可以选择使用绝对的行号, 例如: 我们可以使用Ex命令 *:42* 将光标跳转到第42行. 但仔细想想这种方式其实非常脆弱. 只需要在源文件第一行新加一行, 那么每个地址都会产生一行的偏差了

因此, ctags 使用搜索命令来定位每个关键词(如果你不信那个搜索是Ex命令, 试试 *:/pattern*). 这种方式就比使用行号更加可靠, 但是仍然不够完美. 如果说搜索出来的关键词有多个匹配结果, 那该怎么办呢?

这种情况不应该出现, 搜索模式可以匹配生成唯一地址所需的代码行数. 只要行的长度不超过512个字符, 标记文件将保持与 vi 向后兼容. 当然, 随着搜索模式的变长, 这种方式也会变得越来越脆弱 

##### 被元数据标记的关键词
> Keywords Are Tagged with Metadata

经典的 tags 文件格式仅需要3个以 Tab 分隔的字段: 关键词, 文件名, 地址. 但是扩展过的格式允许在最后提供元数据等额外的字段. 本实例中, 我们看到 *Anglophone*, *Francophone*, *Speaker* 关键词被标记为了 *c*(class) 类. 而 *initialize*, *speak* 被标记为了 *f*(function) 函数.

##### 扩展ctags或使用兼容的标签生成器
> Extending ctags or Using a Compatible Tag Generator

ctags 可以扩展为开箱即用的语言. 通过使用 `--regex`, `--langdef`, `--langmap` 选项, 我们可以定义正则表达式来创建简单的规则来索引任何语言的关键词. 我们也可以选择放入C语言来编写解析器. 用C语言编写的解释器往往比用正则表达式的解析器更好. 所以, 如果你使用大型的代码库, 则可能会有很大的差别(效率么?)

除了扩展 ctags 之外, 另一种选择是创建一个专用工具来索引你选择的语言. 例如, gotags 就是 Go 语言的 ctags 标签生成器. 它由 [Go](https://github.com/jstemmer/gotags) 语言本身实现. 它生成的格式和 ctags 一样, 因此它可以和 Vim 无缝结合

tags 标签文件格式没有任何的特别的点: 就是纯文本的. 任何人都可以编写脚本来生成 Vim 理解的标签文件


## Tip 103 配置使用ctags
{: #tip103}
> Configure Vim to Work with ctags

如果我们想使用 Vim 的 ctag 导航命令, 那么就必须确保 tags 文件更新到最新, 并且 Vim 需要知道从哪里找到它

#### Vim加载Tags文件
> Tell Vim Where to Find the Tags File

*\'tags\'* 选项明确了 Vim 查找 tags 标签文件的位置(参考 `:h 'tags'`). 选项中的 `./` 表示当前活动文件的路径. 我们可以检查默认值:
<pre>
➾ :set tags?
❮ tags=./tags,tags
</pre> 

按照此设置, Vim 会在查找 `当前文件目录` 和 `工作目录` 下的tags文件. 在某些情况下, 如果第一个tags标签文件匹配到了, 那么 Vim 就不会去第二个文件查找了(参考 `:h tags-option`). 使用 Vim 默认的设置, 我们可以在项目的每个子目录中保存一份 tags 文件. 或者也可以简单的在项目根目录下创建一个全局的 tags 文件

如果你经常运行 ctags 来更新索引到最新, 那么你的 tags 标记文件(或多个标记文件) 就能在使用源码时能够显示出来. 为了保持提交历史的整洁, 需要在源码版本控制库里忽略掉这些 tags 文件

#### 生成Tags文件
> Generate the tags File

正如我们在 [Tip 102 遇见ctags - 创建代码库索引](#ctags-创建代码库索引) 中看到的, ctags 可以在命令行中执行. 但是我们没有必要退出 Vim 来重新生成 tags 文件

##### 手动执行ctags
> Simple Case: Execute ctags Manually

我们可以按照如下命令调用 ctags :
<pre>
➾ :!ctags -R
</pre>

从 Vim 当前工作目录开始, 此命令会递归所有的子目录, 对每个文件创建索引. 而最终生成的 tags 文件会存到当前目录下

如果小改一下命令, 比如加上 `--exclude=.git` 或 `--languages=-sql` 等选项, 那么整个的敲一遍就比较麻烦. 那么创建一个快捷键映射将是个不错的选择:
```vim 
➾ :nnoremap <f5> :!ctags -R<CR>
```

这样我们就可以按 `<F5>` 键来重新构建索引了. 但是我们仍然需要记住定期来生成tags文件. 那么现在来考虑一些自动化此过程的选项

##### 文件保存时自动执行ctags
> Automatically Execute ctags Each Time a File is Saved

Vim 的自动命令功能可以让我们在每次事件发生时调用指定的命令. 例如: 缓冲区的创建, 打开, 写入文件等. 所以可以创建一个自动命令, 每次保存文件时来调用 ctags 命令:
```vim
➾ :autocmd BufWritePost * call system("ctags -R")
```

这样每当我们保存单个文件时, 都可以自动重建整个源代码的索引了

##### 用版本控制钩子自动执行ctags
> Automatically Execute ctags with Version Control Hooks

大多数的版本控制系统都提供了钩子(hooks), 允许我们执行脚本以响应存储库上的事件. 所以我们可以再每次提交代码时重建 tags 索引. 

在 [Effortless Ctags with Git](http://tbaggery.com/2011/08/08/effortless-ctags-with-git.html)(Git轻松使用ctags) 中, *Tim Pope* 演示了如何为 *post-commit*, *post-merge*, *post-checkout* 等事件设置钩子. 此方案的优点在于它使用全局钩子, 因此不需要在系统配置每个单独的存储库

#### 讨论
> Discussion

给源码建索引的每种策略都有其优缺点. 手动解决方案最简单, 但必须记住重新生成索引, 不然它可能就不是最新的了

每次保存时使用自动命令调用ctags可以确保我们的tags文件始终是最新的, 但有一定的成本. 对于小量代码, 运行ctags所花费的时间可能难以察觉, 但对于较大的项目, 延迟可能会中断我们的工作流程. 此外, 此技术对于编辑器外部文件发生的任何事情都是不可见的

所以, 每次提交代码时重建索引能达到很好的平衡. 当然, tags文件可能与我们的工作副本不一致, 但是错误是不可容忍的. 我们正在编辑的代码是我们最不想使用标签导航的. `请记住, tags文件里的关键词使用搜索命令寻址`{:.warning}(参考 [剖析标签文件](#剖析标签文件)), 这会使它们在变化时相当稳定


## Tip 104 标签导航关键词定义处
{: #tip104}
> Navigate Keyword Definitions with Vim’s Tag Navigation Commands

Vim 的 ctags 集成将我们代码中的关键词转换为一种超链接, 允许我们快速跳转到其定义的地方. 后续我们将介绍普通模式下的 `<C-]>` 和 `g<C-]>` 命令以及它们的配套的 Ex 命令

#### 跳转到关键词定义处
> Jump to a Keyword Definition

按下 `<C-]>` 就能将光标从当前光标处的关键词跳转到其定义的地方:

*./ctags/anglophone.rb*

![标签关键词导航](/assets/archives/vim-ctags-navigate-01.png){:width="70%"}

上面示例中, Anglophone 类的定义恰好在同一个缓冲区里, 但是如果我们将光标移动到 Speaker 关键词上, 并调用相同的命令, 那么我们将切换到定义该类的缓冲区:

![标签关键词导航](/assets/archives/vim-ctags-navigate-02.png){:width="70%"}

当我们以这种方式浏览我们的代码时, Vim 会保留访问过的历史记录. `<C-t>` 命令相当于标签历史的后退按钮. 如果我们现在按下它, 他会从 Speaker 定义处跳回到 Anglophone 定义处, 如果再次按下它, 那么就会跳回最开始的地方了. 有关标签跳转列表交互更多的信息, 请参考 `:h tag-stack`

#### 关键词多次匹配时指定跳转
> Specify Where to Jump to When a Keyword Has Multiple Matches

我们之前的示例很简单, 因为演示代码库只包含 Speaker 和 Anglophone 关键词的一个定义. 但是假设我们的光标定位在 speak 方法的调用上, 如下所示:
<pre>
Anglophone.new('Jack').<code class="cursor">s</code>peak
</pre>

Speaker, Francophone 和 Anglophone 类都定义了一个叫 speak 的方法. 所以, 如果我们调用 `<C-]>` 命令, 那么 Vim 会跳转到哪一个呢? 动手试试吧

如果当前缓冲区里的标记(tag)与关键词匹配, 那么它的优先级最高. 所以本示例中. 我们将跳转到 Anglophone 类定义的 speak 方法上. 如果你想了解更多 Vim 标签匹配排序的内容, 请查看: `:h tag-priority`

除了 `<C-]>` 之外, 我们还可以使用 `g<C-]>` 命令. 两个命令在当前关键词只有一个匹配时效果是完全一样的. 但是如果匹配了多个选项, 那么 `g<C-]>` 命令可以给我们展示一个可选择的匹配列表:

<pre>
# pri kind  tag                  file
1 F C f     speak                anglophone.rb
              class:Anglophone
              def speak 
2 F   f     speak                francophone.rb
              class:Francophone
              def speak
3 F   f     speak                speaker.rb
              class:Speaker
              def speak
Type number and &lt;Enter&gt; (empty cancels): <code class="cursor">&nbsp;</code>
</pre>

如提示所示, 我们可以输入:`数字` + `<CR>` 回车来选择要跳转的目的地

假如我们调用 `<C-]>` 命令, 然后发现我们跳转到了错误的地方. 我们可以使用 *:tselect* 命令拉出标签匹配里列表菜单来进行回顾查看. 或者我们使用 *:tnext* 命令来直接跳转到下一个匹配标签的位置. 如你所料, 补充的命令还有: *:tprev*, *:tfirst* 和 *:tlast*. 有关映射命令为快捷键的建议, 可以参考 [Tip 37 用缓冲区列表跟踪到文件](https://xu3352.github.io/linux/2018/10/23/practical-vim-skills-chapter-6#tip37)

#### 使用Ex命令
> Use Ex Commands

我们不必把光标移动到关键词的位置, 然后进行标签的跳转. 其实还可以调用 Ex 命令来完成. 

例如: 
- *:tag {keyword}* - 等同于 `<C-]>` 更多参考 `:h :tag`
- *:tjump {keyword}* - 等同于 `g<C-]>`  更多参考 `:h :tjump`

有时, 敲这些命令可能还比移动光标到关键词位置更快\-\-因为 Vim 对标签文件里的所有关键词都提供了 tab 补全功能. 例如: 我们输入 *:tag Fran*`<Tab>`, 然后 Vim 就会自动补全为完成的 *Francophone* 单词了

此外, 这些 Ex 命令还可以在以下形式使用正则表达式: *:tag /{pattern}* 或 *:tjump /{pattern}* (注意 *{pattern}* 之前的斜杠`/`). 例如, 想要导航到关键词以 *phone* 结尾的任何定义的地方, 那么可以输入:
<pre>
➾ :tjump /phone$ 
❮ # pri kind tag
  1 F C c    Anglophone        anglophone.rb
               class Anglophone < Speaker
  2 F   c    Francophone       francophone.rb
               class Francophone < Speaker
  Type number and &lt;Enter&gt; (empty cancels):
</pre>

以下是可以使用标记导航的命令列表:

Command            | Effect
----               | ----
`<C-]>`            | 光标处关键词跳转到第一个匹配的标签
`g<C-]>`           | 提示用户选择按光标处关键词匹配到的多个标签. <br>如果仅有一个匹配到, 那么会无提示的直接跳转
*:tag {keyword}*   | 跳转到第一个匹配 {keyword} 的标签
*:tjump {keyword}* | 提示选择按 {keyword} 匹配出的多个标签结果. <br>如果仅有一个匹配到, 那么会无提示的直接跳转
*:pop* 或 `<C-t>`  | 按标签历史记录回跳
*:tag*             | 通过标签历史推进
*:tnext*           | 跳转到 后一个 匹配的标签
*:tprev*           | 跳转到 前一个 匹配的标签
*:tfirst*          | 跳转到 第一个 匹配的标签
*:tlast*           | 跳转到 最后一个 匹配的标签
*:tselect*         | 提示用户选择标签匹配的列表
{: .table-multi-text}

---
随书源码: [Practical.Vim.2nd.Edition 源码包](http://127.0.0.1:4000/assets/archives/20181106092815_dnvim2-code.zip)

