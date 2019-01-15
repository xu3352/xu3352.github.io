---
layout: post
title: "Vim实用技巧进阶(第19章:自动补全) - Practical.Vim.2nd.Edition"
keywords: "vim,practical-vim,autocompletion,实用技巧"
description: "Practical.Vim.2nd.Edition 实用技巧进阶 第19章:自动补全"
tagline: "Tip 112~119"
date: '2019-01-03 17:15:48 +0800'
category: linux
tags: vim practical-vim linux

---
> {{ page.description }}

# 第19章 自动补全
> Dial X for Autocompletion

自动补全把我们从输入整个单词中拯救了出来. 只需要敲一个字母, Vim 就会构建了一个推荐列表供我们来选择. 这是否有用取决于我们对推荐列表交互的熟练程度. 在 [Tip 113 自动补全弹出菜单](#tip113) 将学习到几种自动补全的技巧

在 [Tip 112 Vim关键词补全](#tip112) 中介绍了基础的关键词补全. 通过扫描当前编辑会话的所有文件以及标签文件来创建补全推荐列表. 我们将在 [Tip 114 理解关键词的来源](#tip114) 中理解这意味着什么, 并了解如果缩小建议列表的范围

除了关键词外, Vim 还有其他方式来创建推荐列表. [Tip 112 Vim关键词补全](#tip112) 的表格列出了一些重点的快捷方式, 后面会陆续对他们做相应的介绍

为了重复利用 Vim 的自动补全功能, 我们需要了解两件事: 如何触发获取最相关的建议和如何从列表选择正确的单词. 在后面的小节中将一一讨论


## Tip 112 Vim关键词补全
{: #tip112}
> Meet Vim’s Keyword Autocompletion

使用关键词自动补全功能, Vim 会尝试猜测我们正在输入的单词, 这就不用手动挨个输入剩余的字符了

Vim 的自动补全功能是在插入模式下触发的. 调用时, Vim 会根据当前编辑会话中的每个缓冲区的内容创建一份单词列表, 然后筛选出匹配光标左侧字符的单词. 过滤出来的单词列表会显示在提示菜单中供我们选择

下图为触发 Vim 自动补全前后的截图:

![Vim触发自动补全](/assets/archives/vim-trigger-autocompletion.png){:width="70%"}

示例中, 字符 \"s\" 被用来过滤单词列表, 最后菜单给出了3个候选项: \"sells\", \"sea\", \"shells\". 想想为什么 \"She\" 没在列表中, 参考后面的 [自动补全和区分大小写](#自动补全和区分大小写)

#### 触发自动补全功能
> Trigger Autocompletion

插入模式下按 `<C-p>` 和 `<C-n>` 组合按键可以触发 Vim 的自动补全功能, 两个分别是选择单词列表的前一个选项和后一个选项

`<C-p>` 和 `<C-n>` 命令都是调用通用关键词自动补全. 还有几种自动补全的变体, 但都是以 `<C-x>` 为前缀的. 本章节中, 后续将一一介绍它们(完整的列表参考 `:h ins-completion`{:.vimhelp}):

Command      | Type of Completion
----         | ----
`<C-n>`      | 通用关键词
`<C-x><C-n>` | 当前缓冲区关键词
`<C-x><C-i>` | 包含文件的关键词
`<C-x><C-]>` | 标签文件的关键词
`<C-x><C-k>` | 字典里的关键词
`<C-x><C-l>` | 按行补全
`<C-x><C-f>` | 文件名补全
`<C-x><C-o>` | Omni补全
{: .table-multi-text}

如果在上面的示例中使用 `<C-x><C-n>`, 那么你补全菜单展示的内容将完全一样. 但是如果使用 `<C-n>` 却可能有更多的推荐选项, 因为单词列表是从当前缓冲区之外的来源填充的. 后续将在 [Tip 114 理解关键词的来源](#tip114) 中深入探讨

无论哪种类型的补全被触发, 但是跟推荐列表菜单的交互都是一样的, 后续将会介绍到

#### 自动补全和区分大小写
> Autocompletion and Case Sensitivity

当启用 `'ignorecase'` 选项时, Vim 的搜索命令将不区分大小写(在 [Tip 73 调整搜索大小写敏感度](https://xu3352.github.io/linux/2018/11/08/practical-vim-skills-chapter-12#tip73) 中已经介绍过), 但是有副作用: 自动补全也变成不区分大小写了

在 `She sells sea shells` 示例中, *\"She\"* 不在单词列表中, 因为它以大写的 *\"S\"* 开头. 但是如果启用了 *\'ignorecase\'* 选项, 那么 *\"She\"* 会出现在单词列表中, 如果我们输入了一个小写的 *\"s\"*, 那么 *\"S\"* 可能不是我们想要的

通过启用 `'infercase'` 选项可以修复此行为(参考 `:h 'infercase'`{:.vimhelp}). 这会以小写的开头的 *\"she\"* 添加到单词列表中


## Tip 113 自动补全弹出菜单
{: #tip113}
> Work with the Autocomplete Pop-Up Menu

要想精通自动补全, 那么就得先了解如何与弹出菜单进行交互. 要么优化选项然后找到想要的, 要么没有想要的将其关闭

当自动补全功能激活后, Vim 会绘制一个弹出菜单, 其中包含单词列表中的选项. 在后面的表格中将展示与此菜单进行交互的命令

更多详细内容可以再 Vim 文档中找到 `:h popupmenu-completion`{:.vimhelp}

无论哪种自动补全的变体被使用, 当补全的弹出菜单展示出来后, `<C-n>` 和 `<C-p>` 总是在菜单中向后/向前移动一个项目. 相反, 在插入模式中使用时, `<C-n>` 和 `<C-p>` 则会触发通用关键词自动补全

**弹出菜单中使用的命令**:

Keystrokes         | Effect
----               | ----
`<C-n>`            | 使用 后一个匹配项
`<C-p>`            | 使用 前一个匹配项
`<Down>`           | 选择 后一个匹配项
`<Up>`             | 选项 前一个匹配项
`<C-y>`            | 使用当前选项(yes)
`<C-e>`            | 退出自动补全
`<C-h>` (和`<BS>`) | 从当前匹配项 删除一个字符
`<C-l>`            | 从当前匹配项 增加一个字符
`{char}`           | 停止补全, 并插入 {char} 字符
{: .table-multi-text}

`<C-n>` 和 `<Down>` 键都是选择菜单中的下一项, 而 `<C-p>` 和 `<Up>` 键则都是选择下一项, 只是机制略有不同

#### 只浏览, 不修改
> Browse the Word List Without Changing the Document

当按下 `<Down>` 键时, 弹出菜单会选择列表中下一个项目, 但是文档并不进行修改. 所以我们可以按 `<Up>` 和 `<Down>` 键来选择列表中的单词, 直到找到想要的为止, 然后按 `<CR>` 回车键或 `<C-y>` 把该单词插入到文档中

#### 滚动选择并更新
> Update the Document As You Scroll Through the Word List

相反, `<C-n>` 不仅仅是选择列表中的下一个项目, 并且还会使用当前选中的单词并更新到文档中. 这样我们就不用按 `<CR>` 回车键进行确认了, 因为文档中的单词总是和弹出菜单中当前选中项目始终是同步的. 一旦选择好单词并继续输入, 弹出菜单机会消失

所以, `<C-p>` 和 `<C-n>` 比 `<Up>` 和 `<Down>` 更受欢迎, 理由有2个: 前者不用大幅度挪动手; 而且不用按 `<CR>` 或 `<C-y>` 来确认选择, 因为文本会自动插入到文档中. 另外, 如同 [Tip 47 Keep Your Fingers on the Home Row](https://xu3352.github.io/linux/2018/10/27/practical-vim-skills-chapter-8#tip47) 提到的: 尽量保持双手4指回归到默认位置

#### 取消所有选择
> Dismiss All Selections

一旦我们把自动补全菜单召唤出来后, 可能也会想让他消失. 例如, 如果列表选项过多, 那么手动敲也许更快一点. 所以我们可以按 `<C-e>` 来退出弹出菜单, 它会还原文本到召唤菜单之前的内容

#### 重新输入改进单词列表
> Refine the Word List as You Type

使用自动补全弹出菜单时, 这里有个非常实用的技巧: `<C-n><C-p>`. 就是2个分开的命令: `<C-n>` 之后紧接着 `<C-p>` (或者 `<C-p><C-n>` 也可以). 第一个命令是调用自动补全, 召唤弹出菜单, 然后选中列表中的第一项. 第二个命令则是选择前一项, 正好回到召唤弹出菜单之前的样子. <span>重点来了, 现在继续输入, 这时 Vim 会按输入内容实时过滤列表中的单词了!</span>{:.warning}

如果单词列表包含太多选项, 这就非常方便了. 假设我们只输入了2个字符, 但是单词列表却包含了20个个建议, 当输入第3个字符时, 单词列表将立即被提炼改进. 我们继续输入字符, 直到单词列表足够短并有用, 然后供我们进行选择

这个技巧同样适用于其他变体的自动补全. 例如, 按 `<C-x><C-o><C-p>` 可以对 omni 自动补全实时过滤; 而 `<C-x><C-f><C-p>` 则是实时过滤文件名


## Tip 114 理解关键词的来源
{: #tip114}
> Understand the Source of Keywords

通用关键词自动补全从少数几个来源编译其单词列表. 我们可以指定哪些想要的来源来使用

几种形式的自动补全使用特定的文件或一组文件来生成其单词列表. 通用关键词自动补全则使用这些单词列表的合并结果. 要了解通用关键词的来源, 首先得了解每种更有针对性的自动补全的形式

#### 缓冲区列表
> The Buffer List

填充自动补全单词列表最简单的机制是仅使用当前缓冲区的单词. 使用 `<C-x><C-n>` 即可触发当前文件的关键词补全(参考 `:h compl-current`{:.vimhelp}). 当通用关键词自动补全生成太多候选项, 并且你知道所需单词位于当前缓冲区时, 这可能很有用

但是, 当前缓冲区单词数量很少时, 推荐列表就几乎没有选项提供了. 为了扩充单词列表, 我们可以让 Vim 从每个缓冲区中提取关键词, 查看当前缓冲区列表命令:
```vim
➾ :ls!
```

通用关键词源自此列表中每个文件的内容, 也就是 Vim 会话中已打开的所有文件. 后续我们将会看到甚至不需要打开文件就可以将其内容拉入自动补全的单词列表

#### 包含的文件
> Included Files

大多数编程语言都提供了一些从额外的文件或库加载代码的方法. 在 C 语言中, 可以使用 *#include* 直接导入, 而 Python 则使用 *import*, Ruby 使用 *require*. 如果我们正在编辑一个包含另一个库代码的文件时, 那么在构建补全的单词列表时, 如果 Vim 能够读取引用文件的内容将非常有用. 这正是 `<C-x><C-i>` 触发补全时所做的事情(参考 `:h compl-keyword`{:.vimhelp})

Vim 支持C语言方式的包含文件, 但可以通过调整 \'include\' 设置来教它适配其他语言(参考 `:h 'include'`{:.vimhelp}). 这通常由文件类型插件来处理. 好消息是, Vim 已经支持多种语言, 因此除非不支持的语言, 否则不用修改此设置. 尝试打开一个 Ruby 或 Python 文件, 然后运行 `:set include?`, 你就会发现 Vim 已经知道如何查找这些语言的包含文件了

#### 标签文件 
> Tag Files

在 [第16章 索引和导航](https://xu3352.github.io/linux/2018/12/16/practical-vim-skills-chapter-16) 中, 我们介绍了 *Exuberant Ctags*, 它是一个外部程序, 用于扫描源代码中的关键字, 例如函数名, 类名, 以及给定语言中具有重要意义的任何其他构造. 但 ctags 在代码库上运行时, 他会生成关键字索引, 这些关键字按字母顺序进行寻址和排序. 按照惯例, 索引保存在名为 tags 的文件中 

使用 ctags 索引代码库的主要原因是为了使导航更容易, 但是标签文件创建了一个有用的副产品: 可用于自动补全的关键词列表. 我们可以使用 `<C-x><C-]>` 命令调起此列表 (参考 `:h compl-tag`{:.vimhelp})

如果要不全的单词是语言对象(例如函数名或类名), 那么标签自动补全将是一个不错的选择

#### 合并到一起
> Put It All Together

通用关键词自动补全则是通过合并缓冲区列表, 包含文件以及标签文件三者, 来生成推荐列表. 如果想要调整此行为, 可以参考后面的 [自定义通用的自动补全](#自定义通用的自动补全). 记住, 通用关键词自动补全仅适用 `<C-n>` 就能触发, 而其他变体则都是以 `<C-x>` 开头, 然后跟其他按键组合的

#### 自定义通用的自动补全
> Customizing the Generic Autocompletion

我们可以通过使用 `'complete'` 选项来自定义通用关键词补全扫描的地址列表. 此选项包含以逗号分隔的单个字母标记列表, 它们表示是否启用特定的扫描地址. 默认的设置为: `complete=.,w,b,u,t,i`. 我们可以通过下面的命令来禁用对 包含文件 的扫描:
```vim
➾ :set complete-=i
```

或者我们可以启用 拼写字典 的单词:
```vim
➾ :set complete+=k
```

完整的标记符列表可以在文档中找到 `:h 'complete'`{:.vimhelp}


## Tip 115 按词典补全单词
{: #tip115}
> Autocomplete Words from the Dictionary

Vim 的字典自动补全的推荐列表由单词列表构建而来. 我们可以配置 Vim, 以便字典自动补全使用和内置拼写检查器相同单词的列表

有时我们可能想使用自动补全功能, 但是这个单词却不存在于任何打开的缓冲区, 包含文件以及标签文件里, 这种情况下, 我们可以试试在字典中找到它. 触发按键: `<C-x><C-k>` (参考 `:h compl-dictionary`{:.vimhelp})

要启用此功能, 我们需要为 Vim 提供合适的单词列表. 最简单的方法是运行: `:set spell` 来启用 Vim 的拼写检查(更多参考 [第20章 用Vim拼写检查器查找和修复]). 拼写字典中的所有单词都可以通过 `<C-x><C-k>` 命令触发获得

如果不想启用 Vim 的拼写检查器, 你同样可以使用 `'dictionary'` 选项来指定一个或多个包含单词列表的文件 (参考 `:h 'dictionary'`{:.vimhelp})

字典自动补全当单词很长, 并且很难拼写时也许非常有用. 举个例子:

![Vim 按词典补全单词](/assets/archives/vim-dictionary-autocompletion.png){:width="80%"}

还有一种使用拼写字典的自动补全变体, 在 [Tip 123 修复插入模式下的拼写错误] 中将介绍如何使用它 


## Tip 116 按行补全
{: #tip116}
> Autocomplete Entire Lines

到目前为止的示例中, 我们都只是看到了单词的补全, 但是 Vim 还可以按整行补全

按行自动补全由 `<C-x><C-l>` 触发(参考 `:h compl-whole-line`{:.vimhelp}). 示例代码如下:

*auto_complete/bg-colors.css*
```css
.top {
  background-color: #ef66ef; }
.bottom {
```

假设我们想复制第二行到文件的最后一行, 这里使用 按行补全 来搞定:

Keystrokes            | Buffer Contents
----                  | ----
{start}               | .top { <br/>&nbsp;&nbsp;background-color: #ef66ef; } <br/>.bottom <code class="cursor">{</code>
`o`ba                 | .top { <br/>&nbsp;&nbsp;background-color: #ef66ef; } <br/>.bottom { <br/>&nbsp;&nbsp;ba<code class="cursor">&nbsp;</code>
`<C-x><C-l><Esc>` | .top { <br/>&nbsp;&nbsp;background-color: #ef66ef; } <br/>.bottom { <br/>&nbsp;&nbsp;background-color: #ef66ef; <code class="cursor">}</code> 
{: .table-multi-text}

同一个文件, 既给 通用关键词自动补全 生成推荐列表提供来源, 同样给 按行自动补全 生成推荐列表提供来源. 另外一个需要注意的点是, Vim 会忽略每行开头的缩进

按行自动补全 的精妙之处在于我们不必知道要复制行的位置. 只需要知道它存在, 然后键入前几个字符, 按下 `<C-x><C-l>`, 然后 Vim 就自动的把整行都补全了! 

之前我们已经介绍过两种复制行的方法: 一种是使用寄存器 (参考 [匿名寄存器-复制行](https://xu3352.github.io/linux/2018/11/01/practical-vim-skills-chapter-10#%E5%A4%8D%E5%88%B6%E8%A1%8C)), 另一种是 Ex 命令(参考 [区间复制或移动](https://xu3352.github.io/linux/2018/10/21/practical-vim-skills-chapter-5#tip29)). 每种都有自己的优势和劣势, 试着确定每种技术的应用场景, 并相应的使用它们


## Tip 117 按单词补全
{: #tip117}
> Autocomplete Sequences of Words

当我们使用自动补全来扩展单词时, Vim 会记住已选单词的上下文. 如果第二次调用自动补全, 那么 Vim 会把这个单词插入到补全列表的最后. 我们可以反复的重复此操作来填写整个单词. 这通常比复制和粘贴更快

示例代码 *auto_complete/help-refs.xml*
```html
Here's the "hyperlink" for the Vim tutor:
<vimref href="http://vimhelp.appspot.com/usr_01.txt.html#tutor">tutor</vimref>.

For more information on autocompletion see:
<vimr
```

*\<vimref\>* 标签是此书作者自定义的一个XML元素, 用于指向 Vim 的 `:help` 帮助页面的链接. 假如我们想在最后一行插入一个 *\<vimref\>* 标签, 用于指向 `:h ins-completion` 的链接. 标签看起来像已有的 *\<vimref\>*, 除了*usr_01* 要改成 *insert* 之外, 还有 *tutor* 也要换成 *ins-completion*

我们可以通过复制已有的 *\<vimref\>* 标签, 并修改需要的部分以便快速的得到想要的结果. 把光标移动到现有的的 *\<vimref\>* 标签位置, 拷贝(yank)它, 然后移动到需要插入的位置进行粘贴. 此处这样操作并不会太麻烦, 因为文档内容很短. 但是如果文档非常的长, 那么找到 *\<vimref\>* 位置可能需要光标移动到很远的地方

这里我们使用 Vim 自动补全功能将 *\<vimref\>* 标签的副本插入到我们想要的位置:

Keystrokes    | Buffer Contents
----          | ----
{start}       | \<vim<code class="cursor">r</code>
`a<C-x><C-p>` | \<vimref<code class="cursor">&nbsp;</code>
`<C-x><C-p>`  | \<vimref\>.<code class="cursor">&nbsp;</code>
`<C-p>`       | \<vimref href<code class="cursor">&nbsp;</code>
`<C-x><C-p>`  | \<vimref href=\"http<code class="cursor">&nbsp;</code>
`<C-x><C-p>`  | \<vimref href=\"http://vimhelp<code class="cursor">&nbsp;</code>
{: .table-multi-text}

开始时, 按 `a` 进入插入模式, 然后 `<C-x><C-p>` 把 *vimr* 自动补全 为 *vimref*. (这里也可以使用 `<C-x><C-n>`)

而当我们第二次按 `<C-x><C-p>` 时就比较有意思了. Vim 记住了 *vimref* 在文档中自动补全的上下文内容. 当我们再次调用自动补全时, Vim 要补全 *vimref* 之后的内容, 因为 *vimref* 在标签的开始和结束位置都出现过, 所以 Vim 弹出菜单给出了2个选项, 提示让我们选择需要的上下文内容. 再次按下 `<C-p>` 得到了我们想要的结果

现在我们继续重复一遍一遍的按 `<C-x><C-p>`. 每次我们调用此命令, Vim 都会在匹配的上下文中插入它找到的补全单词. 填写 XML 标记的其余部分不需要很长时间. 在完成此操作之后, 我们可以手动编辑标签, 将 *usr_01* 改为 *insert*, 而 *tutor* 改为 *ins-completion* 即可

Vim 的自动完成功能不仅仅可以补全单词, 而且还可以按行进行补全. 如果我们重复的使用 `<C-x><C-l>` 命令(参考 [Tip 116 按行补全](#tip116)), 那么它将可以快速的插入一些列的行内容

自动补全单词和行可以让我们比使用复制及粘贴更快的复制文本. 不仅效率超高, 也是炫技(装逼)神器 :)


## Tip 118 补全文件名
{: #tip118}
> Autocomplete Filenames

在命令行终端下, 我们可以按 `<Tab>` 键来补全目录或文件的路径. 同样的, Vim 有文件名自动补全功能

触发命令: `<C-x><C-f>` (参考 `:h compl-filename`{:.vimhelp})

Vim 始终维护着对当前工作目录的引用, 就像 shell 一样. 我们可以通过执行 `:pwd` 命令(print working directory)查询当前工作的目录, 也可以使用 `:cd {path}` 命令(change directory)来更改当前工作目录. 这对于理解 Vim 的 文件自动补全功能 来说非常重要: 始终是相对于当前工作目录来进行路径补全, 而非相对于当前编辑的文件.

假设有以下的文件结构: 一个小型的web程序
<pre>
webapp/
  public/
    index.html
    js/
      application.js
</pre>

现在我们正在编辑 *index.html* 文件:

*auto_complete/webapp/public/index.html*

```html
<html>
  <head>
    <title>Practical Vim - the app</title>
    <script src="" type="text/javascript"></script>
  </head>
  <body></body>
</html>
```

这时我们想把 *application.js* 文件填充到 *src=\"\"* 属性上, 但是如果我们想使用 文件名补全功能 就太麻烦了:
```vim
➾ :pwd 
 ❮ webapp
```

如果我们现在调用 文件自动补全, 它将把相对于 *webapp* 目录的路径进行补全, 最终得到 *src=\"public/js/application.js\"*. 但是我们实际想要的是 *src=\"js/application.js\"*, 这时想要使用 文件自动补全, 那么首先得切换到 *public* 目录下:
```vim
➾ :cd public
```

现在调用 文件自动补全, 那么它将会相对于 *webapp/public* 目录生效:

Keystrokes   | Buffer Contents
----         | ----
`i`          | \<script src=\"<code class="cursor">"</code>/\>
js/ap        | \<script src=\"js/ap<code class="cursor">"</code>/\>
`<C-x><C-p>` | \<script src=\"js/application.js<code class="cursor">"</code>/\>
{: .table-multi-text}

插入文件路径之后, 我们可以跳回先前的工作目录:
```vim
➾ :cd -
```

如同 shell 一样, `cd -` 可以在上一个工作目录之前进行切换 (参考 `:h :cd-`{:.vimhelp})

在文件名自动补全的 `:h compl-filename`{:.vimhelp} 文档中, 特别指出了 *the \'path\' option is not used (yet).*. 也许未来的 Vim 版本中, 没有必要更改目录以将此功能用于示例中Web应用的场景


## Tip 119 按上下文智能补全
{: #tip119}
> Autocomplete with Context Awareness

*Omni-completion* 是 Vim 智能提示的方案. 它提供了对光标位置上下文定制的推荐列表. 本篇技巧中, 我们将了解它如何在 CSS 文件的上下文起作用的

*Omni-completion* 由 `<C-x><C-o>` 命令触发(参考 `:h compl-omni`{:.vimhelp}). 此功能是作为 file-type(文件类型) 插件实现的, 因此要激活它, 必须有以下的配置:

*essential.vim*
```vim
set nocompatible 
filetype plugin on
```

我们还必须安装一个插件来实现我们正在使用的语言的 omni 自动补全. Vim 支持十几种语言, 包括 HTML, CSS, JavaScript, PHP 和 SQL. 完整的列表可以参考 `:h compl-omni-filetypes`{:.vimhelp}

下面是两种 omni 对 CSS 补全的场景:

![omni补全](/assets/archives/vim-omni-completion.png){:width="70%"}

输入一个CSS属性的 *ba* 前缀, 它会显示一个补全列表, 包括: *background*, *background-attachment* ... 等. 示例中选择的是 *background-color*, 第二次触发 omni 自动补全, 没有给任何输入, 但是 Vim 也可以识别 *color* 上下文, 所以它提供三种推荐: *#*, *rgb(* 和 *transparent*

CSS相对静态特性使其非常适合 omni 补全, 如果你对特定语言的支持不满意, 可以找找其他插件或编写自己的插件. 如何编写自己的 omni 补全插件, 可以参考 `:h complete-functions`{:.vimhelp}


