---
layout: post
title: "Vim实用技巧进阶(第13章:搜索) - Practical.Vim.2nd.Edition"
tagline: "Tip 80~87"
keywords: "vim,practical-vim,search,实用技巧"
description: "Practical.Vim.2nd.Edition 实用技巧进阶 第13章:搜索"
date: '2018-11-21 17:14:08 +0800'
category: linux
tags: vim practical-vim linux
---
> {{ page.description }}


# 第13章 搜索

上一章重点研究了 Vim 正则表达式的引擎, 后续将会应用到搜索命令当中. 我们将从基础开始: 如何执行搜索, 高亮显示匹配内容 以及 如何在匹配内容间跳转. 然后将学习一些利用 Vim 增量搜索的技巧, 这不仅可以提供实时的反馈, 还可以通过自动补全来提高输入效率. 然后还将学习如何统计匹配文本的数量

搜索偏移功能允许我们在匹配文本中定位光标的位置. 后续会介绍搜索偏移简化工作流程的场景. 然后我们将看到如何利用搜索偏移来操作完整的搜索和修改过程

编写一个正确的搜索正则表达式, 通常需要好几次尝试, 因此迭代的修改一个搜索模式非常重要. 这个有2中方式: 调用搜索记录 和 使用命令行窗口

你是否希望有一种简单的方式来搜索文档中当前选中的文本呢? 后续将介绍一种简单的自定义覆盖 `*` 命令的技巧来搜索当前选中的文本


## Tip 80 搜索命令
{: #tip80}
> Meet the Search Command

本小节主要介绍搜索的基本功能, 包括如何指定搜索的方向, 重复(或反向)上次搜索, 以及使用搜索历史记录

#### 执行搜索

在常规模式下, 按下 `/` 就会启用 Vim 搜索提示. 我们可以输入一个搜索模式, 或者普通文本, 然后按下 `<CR>` 进行搜索. 如果按下 `<Esc>` 则取消搜索, 返回到常规模式

当我们执行搜索时, Vim 从光标位置开始向后进行搜索, 直到找到第一个匹配的文本, 并把光标定位到匹配的位置. 如果到达文档末尾也没有找到下一个匹配位置时, Vim 将会提示 "search hit BOTTOM, continuing at TOP." 这意味着某些情况下, 向后搜索也可以往前. 这并不像听起来那么令人迷惑. 只需要记住: 搜索命令是整个文档进行搜索, 这是很明智的

如果你非得只想往后搜索直到文档末尾, 而不是整个文档搜索的话, 你可以禁用 *wrapscan* 选项来达到目的 (参考 *:h \'wrapscan\'*)

#### 指定搜索方向

常规模式下:
- `/` - 向后搜索(从光标处 到 文档末尾) 
- `?` - 向前搜索(从光标处 到 文档开始)

搜索提示框总是以 `/` 或 `?` 开头的, 这也指明了搜索的方向

#### 重复上次搜索

如果是 `/` 向后搜索, 那么 `n` 表示继续向后搜索, 而 `N` 则表示向前搜索

如果是 `?` 向前搜索, 那么就正好相反, `n` 则表示继续向前搜索, `N` 则向后搜索

有时候如果想重复一个相同的搜索, 但是想换一个搜索反向, 那么可以执行一个空的搜索(执行最后一次的搜索)达到效果

Command | Effect
----    | ----
`n`     | 跳转到下一个匹配位置(*next match*), 保持搜索方向和偏移
`N`     | 调整到上一个匹配位置, 保持搜索方向和偏移
`/<CR>` | 搜索模式不变, 向后跳转到下一个匹配位置
`?<CR>` | 搜索模式不变, 向前调整到上一个匹配位置
`gn`    | 启用可视化模式, 选中下一次的匹配文本
`gN`    | 启用可视化模式, 选中上一次的匹配文本
{: .table-multi-text}

假如我们正在使用 `?` 向前搜索跳转到上一个匹配的位置, 这时我们想向后进行搜索了, 那么我们可以使用 `N` 直接跳转到后一个匹配的位置, 如果想使用 `n` 来跳转到后一个位置, 那么就得使用 `/<CR>` 改变搜索的方向

`n` 和 `N` 命令可以在匹配文本之间跳转. 但是如果我们想使用可视化模式选中文本来做点修改呢? 这就是 `gn` 命令的用武之地. 当处于常规模式下时, `gn` 命令会移动光标到下一个匹配的文本位置, 然后启用可视化模式并把匹配文本选中. 如果光标正处于匹配文本字符之间时, `gn` 命令则会选中当前匹配的文本. (参考 [Tip 84](#tip84))

#### 搜索历史调用

Vim 会记录搜索模式到历史记录中, 以方便我们重新调用它们. 当我们启用搜索命令的的时候, 按 `<Up>` 向上键来滚动查看之前的搜索内容. 事实上, 浏览搜索历史的交互界面和浏览命令行历史记录是一样的. 前面已经介绍过 [Tip 34. 调用历史命令](https://xu3352.github.io/linux/2018/10/21/practical-vim-skills-chapter-5#tip34). 而后续的实践将放到 [Tip 85. 用搜索历史创建复杂搜索](#tip85) 来详细讲解


## Tip 81 高亮匹配内容
{: #tip81}
> Highlight Search Matches

Vim 可以高亮显示搜索匹配的内容, 不过此特性默认情况下是未启用的. 后续将学习如何启用和如何设置静默高亮显示

搜索命令可以让我们在匹配的内容之间快速的跳转, 但是默认情况下, Vim 并没有突出的显示他们. 我们可以通过启用 *\'hlsearch\'* 选项(参考 *:h \'hlsearch\'*)来开启高亮显示, 当前编辑的文档和其他切分的窗口都会高亮显示匹配的内容

#### 静默高亮搜索

搜索高亮是一个非常有用的特性, 但是有时候可能并不受欢迎. 例如搜索一个常见的字符串时, 有可能匹配几百个结果出来, 那么我们的工作区将会被这些高亮的黄色霸占了(具体颜色取决于用的什么主题)

这种时候我们可以使用 *:set nohlsearch* 来禁用高亮显示(*:se nohls* 和 *:se hls!* 也可以). 但是但我们执行其他搜索的时候, 我们也许就又想开启次特性

Vim 还有一个更优雅的解决方案. `:nohlsearch` 命令可以临时的静默当前的搜索高亮结果(参考 *:h :noh*), 直到执行下一次新的搜索或重复搜索命令为止

#### 静默高亮快捷键

每次敲 `:noh<CR>` 来静默搜索高亮是个体力活(哈哈). 我们可以创建一个快捷键来替代:

```vim
nnoremap <silent> <C-l> :<C-u>nohlsearch<CR><C-l>
```

通常情况下, `<C-l>` 按键可以清理和重绘屏幕(参考 *:h CTRL-L*). 此按键映射基于常规的行为来静默高亮显示


## Tip 82 预览匹配
{: #tip82}
> Preview the First Match Before Execution

Vim 在启用增量搜索功能是时, 搜索命令更有用. 后续会介绍几种方式来进行工作流程的优化

默认情况下, Vim 在准备搜索模式时处于空闲状态, 直到按下 `<CR>` 回车执行搜索为止. 推荐启用 *\'incsearch\'* 选项(参考 *:h \'incsearch\'*)来进行增强搜索功能. 此选项可以预览正在输入的搜索而匹配到的第一个内容. 每次输入字符后, 模式能匹配到的第一个文本都会高亮显示

Keystrokes  | Buffer Contents
----        | ----
{start}     | <code class="cursor">T</code>he car was the color of a carrot.
`/car`      | The <code class="visual">car</code> was the color of a carrot.
`/carr`     | The car was the color of a <code class="visual">carr</code>ot.
`/carr<CR>` | The car was the color of a <code class="visual"><code class="cursor">c</code>arr</code>ot.
{: .table-multi-text}

当搜索输入 *car* 字符时, Vim 会高亮显示第一个匹配的文本, 也就是单词 *car* 本身. 后面在输入一个 *r* 字符后, Vim 停止了先前的预览, 转而跳转到下一个匹配单词 *carrot* 的前半部分. 这时如果按下 `<Esc>` 键, 那么搜索将会取消, 光标也会恢复到之前的行首位置. 但是如果按下 `<CR>` 回车键来执行搜索命令, 光标将会跳转到 *carrot* 单词的起始位置

本示例展示了搜索何时命中了目标. 如果我们仅仅是想移动光标到 *carrot* 单词的位置, 那么就没有必要把整个单词都输入完成. 示例中键入 `/carr<CR>` 就足够了. 如果没有启用 *\'incsearch\'* 选项, 那么在敲回车执行搜索前, 我们将不会知道何时我们的输入才能匹配到目标

#### 检查匹配是否存在

上面示例当中, 在同一行匹配到了2个 *car* 字符串. 试想一下如果 *car* 和 *carrot* 2个单词中间间隔了几百个词呢? 当我们把搜索由 *car* 改为 *carr* 时, Vim 将直接会把文档滚动到 *carrot* 单词位置并展示出来, 这正是我们想要的

设想一下如果我们仅仅是想检查 *carrot* 单词是否存在于当前文档中. 那么当启用 *\'incsearch\'* 选项后, 只需要简单的在搜索时输入 *carrot* 既可预览第一个存在的位置. 如果该词存在, 那么按下 `<Esc>` 键就可以回到搜索之前的状态了!

#### 根据预览补全搜索字段

上面的示例中, 我们搜索输入 *carr* 就直接定位到 *carrot* 单词了. 假如我们需要匹配整个的 *carrot* 单词, 用来做替换之类的呢?

当然, 简单的方式就是手动全部敲完整个单词 *carrot*, 不过有快捷键可以完成此任务: `<C-r><C-w>`. 此快捷键可以把当前预览匹配的词自动补全到搜索字段, 比较长的单词就很好用了

需要注意的是 `<C-r><C-w>` 自动补全比较脆弱. 例如在使用 `\v` 正则模式下搜索时, `<C-r><C-w>` 将会补全光标处的整个单词 (那么 `/\vcarr<C-r><C-w>` 将会得到 `/\vcarrcarrot` 结果)

## Tip 83 光标定位到匹配末尾
{: #tip83}
> Offset the Cursor to the End of a Search Match

搜索偏移可以用来定位搜索后光标停留到匹配文本的起始或末尾位置. 后面我们将介绍一个例子, 把执行搜索后的光标定位到匹配文本末尾位置, 然后再使用 `.` 命令进行一些修改

默认情况下, 每次我们执行搜索命令后, 光标总是停留在匹配文本的起始位置. 但是有时候我们需要把光标定位匹配文本的末尾位置. Vim 通过其搜索偏移特性就可以做到 (参考 *:h search-offset*)

*search/langs.txt*
<pre>
Aim to learn a new programming lang each year.
Which lang did you pick up last year?
Which langs would you like to learn?
</pre>

上面的摘录中, 有 3处 *lang* 是 *language* 的缩写. 那么如何替换为全写的呢? 一种简单的方式就是直接执行 *:%s/lang/language/g* 替换命令即可完成替换了. 不过这里我们用另一种方式

**通常的操作步骤**:
- `:lang<CR>` - 搜索 *lang*, 光标定位到第第一个匹配文本的起始位置
- `ea`uage`<Esc>` - 光标移动到 *lang* 单词末尾字符, 然后进入追加插入模式, 补全 *uage* 字符然后退出到常规模式
- `ne.` - 定位到下一个匹配文本, 然后移动到单词末尾, 然后使用 `.` 命令重复最后的修改, 即补齐单词内容
- `ne.` - 同上, 不过这里有点问题了, 我们想要的是 *languages* 而不是 *langsuage*

下面我们将使用 */lang/e*`<CR>` 把光标定位搜索匹配内容的最后位置. 后面使用 `n` 命令后, 光标位置仍然保持在匹配内容的末尾. 所以使用 `.` 命令就非常的方便了

Keystrokes     | Buffer Contents
----           | ----
{start}        | <code class="cursor">A</code>im to learn a new programming lang each year.  <br>Which lang did you pick up last year?  <br>Which langs would you like to learn?
/lang/e`<CR>`  | Aim to learn a new programming <code class="visual">lan<code class="cursor">g</code></code> each year.  <br>Which <code class="visual">lang</code> did you pick up last year?  <br>Which <code class="visual">lang</code>s would you like to learn?
`a`uage`<Esc>` | Aim to learn a new programming <code class="visual">lang</code>uag<code class="cursor">e</code> each year.  <br>Which <code class="visual">lang</code> did you pick up last year?  <br>Which <code class="visual">lang</code>s would you like to learn?
`n`            | Aim to learn a new programming <code class="visual">lang</code>uage each year.  <br>Which <code class="visual">lan<code class="cursor">g</code></code> did you pick up last year?  <br>Which <code class="visual">lang</code>s would you like to learn?
`.`            | Aim to learn a new programming <code class="visual">lang</code>uage each year.  <br>Which <code class="visual">lang</code>uag<code class="cursor">e</code> did you pick up last year?  <br>Which <code class="visual">lang</code>s would you like to learn?
`n.`           | Aim to learn a new programming <code class="visual">lang</code>uage each year.  <br>Which <code class="visual">lang</code>uage did you pick up last year?  <br>Which <code class="visual">lang</code>uag<code class="cursor">e</code>s would you like to learn?
{: .table-multi-text}

现实生活中, 搜索偏移派上用场时并不总是很明显. 假设我们执行没有偏移的搜索命令, 然后, 在按下几次 `n` 之后, 我们意识到我们更喜欢将光标放到匹配的末尾. 那么只需要执行 `//e<CR>` 即可. 这种不填写搜索字段的, Vim 会重新使用上一次的搜索模式. 于是就把最后的搜索改成使用偏移的了

## Tip 84 匹配文本的修改
{: #tip84}
> Operate on a Complete Search Match

Vim 搜索命令允许我们高亮显示匹配文本, 并快速的在匹配文本之间跳转. 我们同样可以使用 `gn` 命令操作匹配区域的文本 

Vim 搜索命令虽然在多个匹配文本之间跳转非常方便, 不过要对匹配的文本进行修改就有点难搞了, 但是 `gn` 命令 (<span class="warning">Vim 7.4.110 之后支持</span>) 提供了高效的工作流来对匹配文本进行修改

下面的示例中, 有几个类需要修改: *XmlDocument* *XhtmlDocument* *XmlTag* *XhtmlTag*

*search/tag-heirarchy.rb*
```rb
class XhtmlDocument < XmlDocument; end 
class XhtmlTag < XmlTag; end
```

预期的替换效果:
```rb
class XHTMLDocument < XMLDocument; end 
class XHTMLTag < XMLTag; end
```

要达到此效果, 我们可以使用 `gU{motion}` 操作把指定文本转为大写. *motion* 移动可以使用 `gn` 命令, 此命令可以选中下一次匹配的文本. 如果光标正处于当前匹配文本区域内, 那么 `gn` 则会选中当前匹配的所有内容, 否则 `gn` 选中下一次匹配的文本. (参考 *:h gU* 和 *:h gn*)

首先, 我们写一个正则 `/\vX(ht)?ml\C<CR>` 来匹配 *Xml* 和 *Xhtml*, `\C` 表示强制区分大小写, 所以执行搜索后, 4处需要替换的文本就被高亮展示出来了, 而光标此时正好就在第一个匹配文本位置

`gUgn` 命令可以把当前匹配的文本全部转为大写. 所以, 重复执行命令就变得简单了. 按下 `n` 到下一个匹配位置, 然后 `.` 命令来重复上次一的转大写修改. 这是2次按键完成变更的典型 `.` 命令使用场景. 

#### 改进的点命令

`gUgn` 命令可以理解为: 把下一次匹配内容转为大写. 如果光标正处于当前匹配内容处, 那么按下 `.` 后, 当前匹配文本受到影响. 但是如果光标不在匹配文本处, 那么 `.` 命令就会跳转到下一次的匹配内容处, 然后进行转大写操作. 也就是说, 我们不用按 `n` 键, 直接按 `.` 就可以完成跳转和转大写操作了

典型的点命令(`.`命令)分为2次按键: 一次来移动, 一次来修改. 而 `gn` 命令则把2步合为了一步. 因为 `gn` 操作的是下一次的匹配的区域, 而不是当前光标的位置. 所以按下 `.` 命令时, 既可以移动到下一个匹配, 又可以重复最后的转大写操作. 这就是: **改进的点命令**

Keystrokes          | Buffer Contents
----                | ----
{start}             | <code class="cursor">c</code>lass XhtmlDocument < XmlDocument; end <br>class XhtmlTag < XmlTag; end
/\vX(ht)?ml\C`<CR>` | class <code class="visual"><code class="cursor">X</code>html</code>Document < <code class="visual">Xml</code>Document; end <br>class <code class="visual">Xhtml</code>Tag < <code class="visual">Xml</code>Tag; end
`gUgn`              | class <code class="cursor">X</code>HTMLDocument < <code class="visual">Xml</code>Document; end <br>class <code class="visual">Xhtml</code>Tag < <code class="visual">Xml</code>Tag; end
`n`                 | class XHTMLDocument < <code class="visual"><code class="cursor">X</code>ml</code>Document; end <br>class <code class="visual">Xhtml</code>Tag < <code class="visual">Xml</code>Tag; end
`.`                 | class XHTMLDocument < <code class="cursor">X</code>MLDocument; end <br>class <code class="visual">Xhtml</code>Tag < <code class="visual">Xml</code>Tag; end
`n.`                | class XHTMLDocument < XMLDocument; end <br>class <code class="cursor">X</code>HTMLTag < <code class="visual">Xml</code>Tag; end
`.`                 | class XHTMLDocument < XMLDocument; end <br>class XHTMLTag < <code class="cursor">X</code>MLTag; end
{: .table-multi-text}

本示例中使用 `\C` 来区分了大小写, 如果不区分大小写(`\c`), 你会发现 `n.` 依然是好使的, 不过只按 `.` 命令就不好使了. 因为是先不区分大小写匹配, 然后在进行 `gUgn` 命令修改的. 例如模式会同时匹配 *Xml* 和 *XML*. 这时 `.` 命令每次都会匹配到当前光标所在的匹配文本, 而不是下一个匹配到的文本. 所以看起来就像什么也没发生, 因为 *XML* 转大写还是 *XML*

对于改进的点命令来说, 搜索需要在变更操作之前完成, 而不是变更之后. 上面的示例中, `gU` 命令会把目标文本转为大写, 所以搜索必须得是大小写敏感的才行, 但并不总是需要大小写敏感才能使改进的点命令正常工作

在大文件中使用改进的点命令时需要小心, 因为匹配文本的间隔可能很远, 如果使用 `n.` 那么在重复修改操作之前我们将先看到匹配的文本, 如果直接使用 `.` 命令, 那么就看不到匹配文本就直接被修改了

Vim 自从 <span class="warning">7.4.110</span> 版本之后就引入了 `gn` 命令. 如果你使用的是之前的版本, 那么此命令就是升级的好理由了!


## Tip 85 用搜索历史创建复杂搜索
{: #tip85}
> Create Complex Patterns by Iterating upon Search History

写一个正则表达式并不简单. 通常都不是一次就能写对的, 所以如果能在上一次的基础上进行改进就显得很必要. 那么重新调用和编辑搜索历史就是必备的技巧

*search/quoted-strings.txt*
<pre>
This string contains a 'quoted' word.
This string contains 'two' quoted 'words.'
This 'string doesn't make things easy.'
</pre>

目标是把单引号的重点内容改为双引号 (注意第三行多了一个单引号)
<pre>
This string contains a "quoted" word.
This string contains "two" quoted "words."
This "string doesn't make things easy."
</pre>

#### 草稿1:宽泛的匹配

先从粗略的搜索开始:
<pre>
➾ /\v'.+'
</pre>

先匹配一个单引号, 然后任意字符(一个以上字符), 然后以单引号结尾
<pre>
This string contains a <code class="visual">'quoted'</code> word.
This string contains <code class="visual">'two' quoted 'words.'</code>
This <code class="visual">'string doesn't make things easy.'</code>
</pre>

第一行看起来不错, 不过第二行就有点问题了, 因为 *.+* 是贪婪匹配, 它会匹配尽量多的字符. 而我们期望的是第二行是2个匹配块, 所以需要区分开

#### 草稿2:精准的匹配

正则的 `.` 可以匹配任意一个字符, 而本示例中, 我们其实想匹配除了单引号之外的其他任意字符, 于是我们可以使用 `[^']+` 改造:
<pre>
➾ /\v'[^']+'
</pre> 

在使用新的搜索时, 我们没有必要重新敲一遍. 我们可以使用 `/<UP>` 从搜索历史中选择刚刚使用的搜索字段. 我们只需要按 `<Left>` 和 删除键来删除 `.` 字符, 然后替换为 `[^']` 即可. 执行搜索后, 将得到如下匹配结果

<pre>
This string contains a <code class="visual">'quoted'</code> word.
This string contains <code class="visual">'two'</code> quoted <code class="visual">'words.'</code>
This <code class="visual">'string doesn'</code>t make things easy.'
</pre>

第二行匹配的结果达到我们的预期, 不过第三行还是有问题. 这里的 *doesn't* 单引号只是作为单词的一撇存在, 匹配不应该在这里终结的, 所以后面要接着改

#### 草稿3:另一次迭代

这里就要区分一撇和配对单引号的区别. 常见的例子有: *won\'t* , *don\'t* 和 *we\'re* 等. 每个示例都有一个特点, 那就是在一撇之后都紧接着有其他字母, 而不是空格或者标点符号. 所以我们的搜索模式需要允许一撇后紧跟字母的情况
<pre>
➾ /\v'([^']|'\w)+'
</pre>

本次涉及的修改比较大. 我们不仅仅需要输入额外的 `'\w` 项, 而且还必须在括号中包含2个备选项, 并用管道分隔它们. 是时候鸟枪换炮了

上次我们使用 `/<UP>` 把最近的搜索模式重新填充进来, 这次我们使用 `q/` 调出命令窗口. 这个就像是一个普通的 Vim 缓冲区, 但是它可以预先填充我们的搜索历史, 一行一个历史记录(参考 [Tip 34 调用历史命令](https://xu3352.github.io/linux/2018/10/21/practical-vim-skills-chapter-5#tip34)). 所以我们可以使用 Vim 的全部功能来修改最后一个搜索模式

下面的示例演示了如何进行这种特殊的修改. 如果你觉得很难理解 `c%(<C-r>")<Esc>` 的话, 可以看看之前的 [Tip 55. 配对括号之间的跳转](https://xu3352.github.io/linux/2018/10/27/practical-vim-skills-chapter-8#tip55) 和 [Tip 15. 插入模式下从寄存器粘贴](https://xu3352.github.io/linux/2018/10/16/practical-vim-skills#tip15)

Keystrokes             | Buffer Contents
----                   | ----
{start}                | <code class="cursor">\</code>v\'[^\']+\'
`f[`                   | \v\'<code class="cursor">[</code>^\']+\'
`c%`(`<C-r>`\")`<Esc>` | \v\'([^\']<code class="cursor">)</code>+\'
`i`\|\'\\w`<Esc>`      | \v\'([^\']\|\'\\<code class="cursor">w</code>)+\'
{: .table-multi-text}

但我们编辑完成之后, 只需要按 `<CR>` 回车键既可以执行本次搜索. 所以我们的文档看起来如下
<pre>
This string contains a <code class="visual">'quoted'</code> word.
This string contains <code class="visual">'two'</code> quoted <code class="visual">'words.'</code>
This <code class="visual">'string doesn't make things easy.'</code>
</pre>

都匹配上了

#### 草稿4:最后的修改

所有的匹配都达到了预期效果, 还剩下最后一步的修改:执行替换命令. 我们想捕获到单引号以内的所有内容, 所以最终的搜索模式改为:
<pre>
➾ /\v'(([^']|'\w)+)'
</pre>

我们可以使用 `/<UP>` 或 `q/` 命令窗口来完成最后的编辑. 喜欢那种方式就用哪个. 本次高亮显示的结果和上一次不会有任何差别, 不过每一次匹配, 配对单引号内的文本都会存到 `\1` 捕获寄存器里. 也就意味着我们可以执行下面的替换操作:
<pre>
➾ :%s//"\1"/g
</pre>

不填写搜索字段时, Vim 会自动重用最后一次的搜索命令(更多请参见: Tip 91), 最终替换后的效果为:
<pre>
This string contains a "quoted" word.
This string contains "two" quoted "words."
This "string doesn't make things easy."
</pre>

#### 讨论

下面命令做的事情实际和上面最后的替换完全一样:
<pre>
➾ :%s/\v'(([^']|'\w)+)'/"\1"/g
</pre>

但你是否相信自己可以一次性正确输入呢? 

因此, 别担心第一次输入的搜索能否正确. Vim 提供了快速获取到最近的搜索命令历史, 因此我们可以轻松的对搜索模式进行改进. 先从宽松的匹配开始, 然后再一步一步的到达你的目标

能够直接编辑命令行非常适合简单的编辑. 如果我们启用了 *\'incsearch\'* 选项, 那么在编辑搜索命令时将获得额外的实时反馈. 一旦我们使用命令行窗口时, 我们将失去这种特权, 但是凭借着拥有完全 Vim 的编辑功能, 这也显得很公平 


## Tip 86 匹配计数
{: #tip86}
> Count the Matches for the Current Pattern

本小节将展示几种方式来统计匹配文本出现的次数

例如我们先统计 *buttons* 出现了多少次: *search/buttons.js*
```js
var buttons = viewport.buttons;
viewport.buttons.previous.show();
viewport.buttons.next.show();
viewport.buttons.index.hide();
```

开始搜索:
<pre>
➾ /\<buttons\>
</pre>

现在我们可以使用 `n` 和 `N` 键在匹配文本之间进行跳转. 但是 Vim 的搜索命令并没有任何迹象告诉我们文档中匹配文本总共出现了多少次. 不过我们可以通过 *:substitute* 或 *:vimgrep* 命令来进行统计

#### 使用 :substitute 匹配计数

直接运行命令:
<pre>
➾ /\<buttons\>
➾ :%s///gn
❮ 5 matches on 4 lines
</pre>

我们调用了 *:substitute* 替换命令, 但是 `n` 标志禁止了正常的替换行为. Vim 不再进行匹配文本的替换, 而是简单的对匹配文本的数量进行了统计, 并把结果打印在了命令行. 把搜索字段置空, Vim 会使用最后一次的搜索模式. 而因为使用了 *n* 标志, 导致了替换字段会被忽略, 所以我们也就不用填写了

需要注意的是, 此命令包含了3个斜杠(`/`). 第一个到第二个斜杠为:**搜索字段**, 第二个到第三个斜杠为:**替换字段**. 
<span class="warning">要小心别漏掉了任何一个斜杠(`/`), 运行 `:%s//gn` 会导致所有匹配文本被替换为 *gn* 字符串!!!</span>

#### 使用 :vimgrep 匹配计数

利用 *:substitute* 替换命令的 *n* 标志可以得知匹配的文本数量. 但有时候能知道当前匹配文本是第几个可能很有用. 这里就要用到 *:vimgrep* 命令了:
<pre>
➾ /\<buttons\>
➾ :vimgrep //g %
❮ (1 of 5) var buttons = viewport.buttons;
</pre>

此命令使用当前缓冲区中找到的匹配文本来填充 quickfix 列表. *:vimgrep* 命令可以在多个文件中进行查找, 但是本示例我们只要求在当前文件中进行查找. *%* 就表示当前缓冲区对应的文件路径(参考 *:h cmdline-special*). 搜索字段留空就是让 *:vimgrep* 命令重用最后一次的搜索模式

同样的, 我们可以使用 `n` 和 `N` 在匹配项之间进行跳转. 而现在我们还可以通过 *:cnext* 和 *:cprev* 命令向前和向后跳转:
<pre>
➾ :cnext
❮ (2 of 5) var buttons = viewport.buttons;
➾ :cnext
❮ (3 of 5) viewport.buttons.previous.show();
➾ :cprev
❮ (2 of 5) var buttons = viewport.buttons;
</pre>

本书作者更推荐使用本技术来得知每一个匹配项的具体情况, 而不是使用替换命令. 如果有时做出了点修改, 那么 *1/5* 到 2/5 这种形式就非常有用了. 这个可以得知还有多少工作要做

quickfix 列表是许多 Vim 工作流程的核心功能. 在 第17章 中我们会做详细的介绍


## Tip 87 用选中文本搜索
{: #tip87}
> Search for the Current Visual Selection

常规模式下 `*` 命令可以按光标处的词进行搜索. 加上一点 Vim 脚本的小改动, 我们就可以重新定义可视化模式下 `*` 命令, 让其对选中的文本进行搜索

#### 可视化模式下搜索当前词

在可视化模式下, 使用 `*` 命令搜索光标处的词:

Keystrokes | Buffer Contents
----       | ----
{start}    | <code class="visual">She sells se<code class="cursor">a</code></code> shells by the sea shore.
`*`        | <code class="visual">She sells sea shells by the se<code class="cursor">a</code></code> shore.
{: .table-multi-text}

我们启用可视化模式, 然后选中前3个单词, 最后光标处于 *sea* 单词处, 然后我们调用 `*` 命令, Vim 会向后搜索下一个 *sea* 单词, 由于启用了可视化模式, 所以选中的区域会扩展到下个匹配的位置. 虽然这种行为与 常规模式 的 `*` 命令一致, 但是很少发现它很有用

#### 搜索选中文本(现有技术)

如果你查看手册 *:h visual-search*, 你将发现如下的建议:

```
Here is an idea for a mapping that makes it possible to do a search for the
selected text:
    :vmap X y/<C-R>"<CR>
Note that special characters (like '.' and '*') will cause problems.
```

`y` 命令(yank)是复制当前选中的文本, 然后 `/<C-r>"<CR>` 则是开启搜索, 然后把刚刚复制的文本从默认寄存器里粘贴出来, 然后执行搜索. 这个解决方案很简单, 但是如同后面的警告提到的, 特定的字符(`.` 和 `*`)会有问题

在 [Tip 79. 转译问题字符](https://xu3352.github.io/linux/2018/11/08/practical-vim-skills-chapter-12#tip79) 小节中, 我们知道了如何克服这些限制. 后面我们将把理论付诸实践, 并创建一个映射来搜索选中的文本而不会被特殊字符干扰

#### 搜索选中文本(终极版)

*patterns/visual-star.vim*  本段的 Vim 脚本就能实现此功能
```vim
xnoremap * :<C-u>call <SID>VSetSearch('/')<CR>/<C-R>=@/<CR><CR> 
xnoremap # :<C-u>call <SID>VSetSearch('?')<CR>?<C-R>=@/<CR><CR>

function! s:VSetSearch(cmdtype)
  let temp = @s
  norm! gv"sy
  let @/ = '\V' . substitute(escape(@s, a:cmdtype.'\'), '\n', '\\n', 'g') 
  let @s = temp
endfunction
```

把上面代码片段直接粘贴到 *~/.vimrc* 文件 或 安装 [visual-star](https://github.com/nelstrom/vim-visual-star-search) 插件就可以使用了

我们除了重写 `*` 命令以外, 我们把 `#` 命令也重写了, 一个向后搜索, 一个向前搜索选中的文本. *xnoremap* 关键字特别指定了映射应用于 可视化模式, 而不是 选中模式(参考 *:h mapmode-x*)


