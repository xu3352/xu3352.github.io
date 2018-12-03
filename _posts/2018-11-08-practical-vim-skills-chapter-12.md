---
layout: post
title: "Vim实用技巧进阶(第12章:匹配模式和文本) - Practical.Vim.2nd.Edition"
tagline: "Tip 73~79"
keywords: "vim,practical-vim,matching,patterns,实用技巧"
description: "Practical.Vim.2nd.Edition 实用技巧进阶 第12章:模式和文本匹配"
date: '2018-11-08 09:58:00 +0800'
category: linux
tags: vim practical-vim linux
---
> {{ page.description }}

# 第12章 匹配模式和文本
> Matching Patterns and Literals

本章节我们将讨论 搜索, 替换和全局(search,substitute,global)命令. 不过首先得专注于其驱动的核心: *Vim搜索引擎*. 是否有思考过 Vim 正则表达式是如何工作, 如何关闭正则来进行匹配呢?

Vim 的正则表达式引擎可能与我们习惯使用的引擎有些不同. 最大的差异是可以通过 神奇开关 来切换模式进行搜索. 默认情况下, 某些字符在搜索时有特殊含义, 搜索时需要进行转义. 后续我们将学习如何使用 \V开关 一次性禁用所有的特殊含义

Vim 搜索模式中有几个特殊的选项: 零宽度分隔符, 用来标记单词或搜索匹配的边界. 后面我们将学习如何使用 *\V文字开关* 来处理特殊字符

## Tip 73 调整搜索大小写敏感度
{: #tip73}
> Tune the Case Sensitivity of Search Patterns

我们可以控制全局或每一次搜索是否开启忽略大小写

#### 全局区分大小写

通过设置 *ignorecase* 选项即可开启忽略大小写:
<pre>
➾ :set ignorecase
</pre>

需要注意的是, 此设置会对 Vim 关键词补全有一定的影响 参考:[Tip 112 关键词补齐]

#### 每次搜索区分大小写

我们可以使用以下选项来覆盖默认的是否忽略大小写:
- `\c` - 忽略大小写
- `\C` - 区分大小写

每次搜索的时候都可以强制指定是否区分大小写

所以, 如果想强制区分大小写, 只需要在每次敲完 *pattern* 之后加上 `\C` 即可

#### 启用智能大小写

Vim 提供了预测我们大小写敏感意图的 *smartcase* 选项

启用此选项后进行搜索时, 如果输入的全部是小写字母, 那么就不区分大小写; 但只要包含大写字母, 那么就是大小写敏感的

2个选项开启和关闭的搜索表现:

Pattern | \'ignorecase\' | \'smartcase\' | Matches
----    | ----         | ----        | ----
foo     | off          | -           | foo
foo     | on           | -           | foo Foo FOO
foo     | on           | on          | foo Foo FOO
Foo     | on           | on          | Foo
Foo     | on           | off         | foo Foo FOO
\cfoo   | -            | -           | foo Foo FOO
foo\C   | -            | -           | foo
{: .table-multi-text}

**手册**:
- *:h /ignorecase*
- *:h smartcase*


## Tip 74 使用\v启用正则搜索
{: #tip74}
> Use the \v Pattern Switch for Regex Searches

Vim 正则表达式语法风格比起 *Perl* 来说更接近 *POSIX*, 对于已经熟悉 *Perl* 的程序员来说有点失望了; 对于两种语言都不懂的表示更忧伤 :(

不过可以通过一个神奇的开关使得 Vim 的语法更接近于 *正则表达式*

颜色编码匹配 *patterns/color.css*
```css
body   { color: #3c3c3c;  }
a      { color: #0000EE;  }
strong { color: #000;  }
```

需要匹配 `#` 号后面的3位或6位 16进制 的字符, 包含数字和 A-F 的大小写字母

#### 匹配16进制的颜色编码

Vim 默认的模式:神奇模式 (magic search)

<pre>
➾ /#\([0-9a-fA-F]\{6}\|[0-9a-fA-F]\{3}\)
</pre>

这里使用了3中类型的括号:
- `[]` 中括号(Square brackets), 具有特殊的含义, 所以这里不需要转义
- `()` 小括号(parentheses), 字面上匹配 `()` 2字符, 所以我们必须转义它们以使它们具有特殊含义
- `{}` 大括号(curly braces), 和小括号一样, 但只用转义开头的一半即可

3种不同的括号决定了不同的规则, 这个一定需要记住!!!

#### 两个正则表达式引擎

Vim 7.4 引入了一个新的正则表达式引擎. 就的引擎使用回朔算法, 而新引擎使用状态机(state machine), 对复杂模式和长文本执行得更好. 相应的, 这种增强提高了使用正则表达式的所有特性(如语法高亮, 命令搜索 和 *vimgrep*)的性能

Vim 7.4 默认是启用的新的引擎的, 但旧的引擎仍然可以使用. 一些 Vim 正则表达式的特性不支持新的引擎. Vim 会自动切换到老的引擎来进行支持

**手册**:
- *:h new-regexp-engine*
- *:h two-engines*

#### 使用\v切换匹配模式

我们可以使用 `\v` 模式(very magic search)开关规范所有的特殊符号, 启用之后, 除了下划线 `_`, 大小写字母, 和数字外, 所有的字符都具有特殊含义

开启 `\v` 模式后, Vim 正则表达式引擎的行为表现得更像 *Perl*, *Python* 或 *Ruby*. 但是仍然有不同的地方, 后续的小节将会介绍哪些规则需要转义, 哪些不需要转义

<pre>
➾ /\v#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})
</pre>

少了很多的转义的反斜杠, 看起来是不是更加简洁了

**手册** *:h \v*

#### 使用字符类简化匹配

针对本示例, 我们有更加优雅的字符类 *\x* 来进行匹配, 而不用再去拼写复杂的 *[0-9a-fA-F]* 字符串

<pre>
➾ /\v#(\x{6}|\x{3})
</pre>

**手册** *:h /character-classes*

#### 讨论

匹配模式                                | 说明
----                                    | ----
`#\([0-9a-fA-F]\{6}\|[0-9a-fA-F]\{3}\)` | 默认(`\m`)模式, `()|{` 需要转义
`\v#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})`    | `\v` 模式, `()|{` 已有特殊含义, 不用转义
`\v#(\x{6}|\x{3})`                      | 用 `\x` 字符类表示了 [0-9A-Fa-f] 字符集
{: .table-multi-text}

Vim 认为所有还没有特殊意义的字符都是为 *将来扩展保留* 的. 换句话说, 例如 *#* 号现在没有特殊的含义不代表以后的版本中不会有特殊的含义. 如果 *#* 号已经有特殊含义了, 那么就需要转义来匹配 *#* 字符

**手册** <code>:h /\\</code>


## Tip 75 使用\V启用文本搜索
{: #tip75}
> Use the \V Literal Switch for Verbatim Searches

Vim 正则表达式的特殊字符在匹配时很方便, 但如果我们想搜索这些字符时, 它们可能会受到影响. 使用 *verynomagic* 文字开关可以取消诸如 `.` `*` 和 `?` 等字符的特殊含义

*patterns/excerpt-also-known-as.txt*
<pre>
The N key searches backward...
...the \v pattern switch (a.k.a. very magic search)...
</pre>

例如我们先搜索 `a.k.a` 那么最直观的搜索则为:
<pre>
➾ /a.k.a.
</pre>

不过但我们按下回车, 我们匹配到的比我们期望的多, 因为 `.` 字符有特殊的含义, 可以表示任意一个字符, 我们可以加个反斜杠(`\`)来进行转义来使用其字面含义

Keystrokes        | Buffer Contents
----              | ----
{start}           | <code class="cursor">T</code>he N key searches backward...  <br>...the \v pattern switch (a.k.a. very magic search)...
/a.k.a.`<CR>`     | The N key searches b<code class="visual"><code class="cursor">a</code>ckwar</code>d...  <br>...the \v pattern switch (<code class="visual">a.k.a.</code> very magic search)...
/a\\.k\\.a.`<CR>` | The N key searches backward...  <br>...the \v pattern switch (<code class="visual"><code class="cursor">a</code>.k.a.</code> very magic search)...
/\Va.k.a.`<CR>`   | The N key searches backward...  <br>...the \v pattern switch (<code class="visual"><code class="cursor">a</code>.k.a.</code> very magic search)...
{: .table-multi-text}

本示例中, 我们使用 `/a.k.a.` 进行搜索哦时, 出现了2处匹配的位置, 第二个才是我们期望的匹配, 我们也可以按 `n` 快速移动 

不过在某些情况下, 一个不精准的匹配可能导致奇怪的问题, 例如在执行 `:%s//also known as/g` 替换时, 会发现替换多了(替换时如果不指定搜索内容, 那么默认指上一次的搜索模式, 参考: Tip 91)

由于 `.` 字符有特殊含义(匹配任意字符), 所以如果想匹配 `.` 字符, 那么就需要加反斜杠(`\`)进行转义:
<pre>
➾ /a\.k\.a\.
</pre>

或者使用 `\V` 的纯字符模式:
<pre>
➾ /\Va.k.a.
</pre>

Vim 文档里提到 "使用 `\V` 模式意味着后面的搜索匹配只有反斜线(`\`)和终止符(`/`或`?`)具有特殊含义"  在 [Tip 79](#tip79) 的转义问题字符将介绍更多信息

<span>
按照经验: 使用 `\v` 开关来启用正则搜索, 而使用 `\V` 开关启用纯文本搜索
</span>
{: .warning}

**手册** *:h /\V*

#### 历史课:Vim模式语法遗产

除了 `\v` 和 `\V` 模式外, Vim 还有两种比较旧的匹配模式 (此4种模式仅Vim特有)
- `\m` - *magic search* Vim默认的神奇搜索, 自动为少数额外符号赋予特殊含义, 例如:`.*[]`, 但是没有给 `+?(){}` 赋予特殊含义, 这些字符必须转义才能赋予它们特殊含义 (对应正则表达式特殊的支持只走了一半, 看起来规则比较随意, 难以记忆)
- `\v` - *very magic search* 非常神奇搜索, 启用后语法更贴近 *正则表达式*, 除了 `_a-zA-Z` 之外的每个符号都有特殊含义, 语法和 *Perl* 正则一致
- `\V` - *verynomagic* 纯文本搜索, 所有字符都没有特殊含义 (除了反斜杠和终止符)
- `\M` - *nomagic* 普通搜索(没有魔法), 和纯文本类似, 模拟 vi 的搜索, 除了2个字符: `^` 和 `$`


## Tip 76 使用括号捕获子匹配
{: #tip76}
> Use Parentheses to Capture Submatches

当我们进行搜索匹配时, 我们可以使用括号`()`捕获子匹配, 然后在其他地方引用他们. 此功能与替换(substitute)命令配合是非常有用!!!

*patterns/springtime.txt*
<pre>
I love Paris in the
the springtime.
</pre>
上面片段中有词汇语法错误, *the* 出现了2次, 中间还有换行, 我们来使用搜索匹配来进行替换

<pre>
➾ /\v<(\w+)\_s+\1>
</pre>

嗯, 已经把2个重复的次 *the the* 匹配到了. 这个时候如果把2行合并成一行(`vipJ`进行合并)同样是可以匹配的. 最棒的是, 此模式可以匹配所有重复的2个单词. 

我们下面介绍此正则是如何起作用的:

2次匹配相同单词的技巧在于 `()` 和 `\1` 的组合使用. 括号内的任何内容都会自动存入到一个临时仓库中, 然后使用 `\1` 引用捕获到的文本内容. 如果模式中包含多组括号, 那么我们可以依次使用 `\1`, `\2` ... `\9` 来引用捕获的内容(最多到`\9`). `\0` 表示引用整个匹配内容, 不管模式中是否有括号

正则表达式在匹配词汇的时候有很多的小技巧. 我们在 [Tip 74](#tip74) 介绍了使用 `\v` 开关启用正则搜索. 
而 `<` 和 `>` 字符可以匹配单词的边界, 这个后续再 [Tip 77](#tip77) 中在做介绍. 
最后, `\_s` 匹配空白字符或换行符

子匹配在搜索模式中很有用. 不过有一个很好的示例就是: XML 和 HTML 标签的开始和结束匹配. 在 Tip 94 会介绍子匹配的替换

**手册**:
- *:h /\\_*
- *:h 27.8*

#### 使用括号而不捕获内容
<pre>
搜索测试: Andrew 或 Drew
➾ /\v(And|D)rew Neil

在括号前面使用 % 符号, 禁当前组的捕获
➾ /\v%(And|D)rew Neil

FIRSTNAME LASTNAME 位置互换
➾ /\v(%(And|D)rew) (Neil)
➾ :%s//\2, \1/g
</pre>

使用 `%()` 匹配的组将不计入捕获结果, 最后一次搜索一共有3组括号, 所以第1组括号 `\1` 对应的捕获内容为 And 或 D, 第2组括号因为前面有 `%` 符号, 所以不捕获, 第3组括号由于前面只有一个捕获的, 所以依次算作 `\2`, 对应的捕获内容为 Neil; 最后替换的效果就是2个词互换位置


## Tip 77 标注词的边界
{: #tip77}
> Stake the Boundaries of a Ward

定义一个搜索模型时, 指定单词的开始和结束位置可能很有用, Vim 给我们提供了单词分隔的选项

例如执行搜索 `/the<CR>`  的时候, 是会把 *these* *they* *their* 等单词一起搜索出来的
<pre>
<code class="visual">the</code> problem with <code class="visual">the</code>se new recruits is that 
<code class="visual">the</code>y don't keep <code class="visual">the</code>ir boots clean.
</pre>

如果我们想只搜索 *the* 完整的单词, 而不需要包含 *the* 片段的词, 那么我们需要指定 *词的边界*

在 `\v` 模式下, `<` 和 `>` 即代表词边界的符号. 所以我们可以使用 `/\v<the><CR>` 来达到我们的预期

`<` 和 `>` 是 0长度 的选项, 意味着他们本身不匹配任何字符. 他们只是表示一个 单词 与 空格或标点 之间的边界

我们可以大致认为 `<`, `>` 的含义和 `\w`,`\W` 字符类与 `\zs`,`\ze` 匹配分隔符的组合相似(参考 [Tip 78](#tip78)). 
- `\w` - 匹配一个单词的字符. 包括字母, 数字和下划线`_`字符
- `\W` - 匹配非了单词外的其他任意字符
- `<` 接近于 `\W\zs\w`
- `>` 接近于 `\w\ze\W`

在 `\v` 模式(very magic)下, 符号 `<`,`>` 代表一个词的边界, 但是在 `\m`, `\M` `\V` 模式(magic, nomagic, very nomagic)下, 就需要转义. 

因此, 我们使用 Vim 文档进行查看时也是需要加转义的反斜杠的 `:h /\<` 

需要注意的是, 如果我们在 `\v` 模式下需要匹配 `<>` 字符, 那么就得加反斜杠来进行转义了

即使我们没有养成使用词边界的习惯, 当平时在使用 `*` 或 `#` 命令对 光标处的词 进行向前或向后搜索后, 我们可以按下 `/<UP>` 查看搜索的历史命令, 我们就能看到上一次搜索就会带上 `<`,`>` 边界符号. 顺便提一下, `g*` 和 `g#` 变体执行的是没有边界符情况下的搜索

**手册**:
- `:h /\<`
- `:h *`


## Tip 78 标注匹配的边界
{: #tip78}
> Stake the Boundaries of a Match

有时候我们可能想要指定一个宽泛的匹配模式, 然后专注于匹配的子集, 那么 Vim 的 `\zs` 和 `\ze` 可以帮我们实现定义一个匹配的边界

到目前为止, 我们提到的搜索和匹配的感念是重叠的. 现在我们要把两个概念进行区分了. 
- `pattern` - 搜索模式, 指的是命令行里的正则表达式(或者其他文本)的搜索选项
- `match` - 匹配结果, 指的是按照搜索模式, 匹配出来的高亮结果(假设已经设置了 'hlsearch' 高亮选项)

匹配结果的边界通常对应于搜索模式的开始和结束. 我们可以使用 `\zs` 和 `\ze` 项来定制整个匹配模式的子集. 
- `\zs` - 标记匹配的开始
- `\ze` - 标记匹配的结尾

它们合在一起可以指定搜索模式来匹配一些列的字符串, 进而放大匹配的子集. 就如同单词的分隔符一样, `\zs` 和 `\ze` 也是 0长度的

Keystrokes              | Buffer Contents
----                    | ----
{start}                 | Practical Vim, <code class="cursor">S</code>econd Edition <br>Vim is a fast and efficient text editor
`/Practical Vim<CR>`    | <code class="visual"><code class="cursor">P</code>ractical Vim</code>, Second Edition <br>Vim is a fast and efficient text editor
`/Practical \zsVim<CR>` | Practical <code class="visual"><code class="cursor">V</code>im</code>, Second Edition <br>Vim is a fast and efficient text editor
`/Vim<CR>`              | Practical <code class="visual">Vim</code>, Second Edition <br><code class="visual"><code class="cursor">V</code>im</code> is a fast and efficient text editor
{: .table-multi-text}

现在可以看出 `\zs` 的作用了吧, 可以只匹配搜索模式中的子集, 而不仅仅是匹配子集; 首选需要满足整个搜索模式, 但只有子集会被高亮匹配

Keystrokes             | Buffer Contents
----                   | ----
{start}                | <code class="cursor">M</code>atch \"quoted words\"---not quote marks.
`/\v"[^"]+"<CR>`       | Match <code class="visual"><code class="cursor">"</code>quoted words"</code>---not quote marks.
`/\v"\zs[^"]+\ze"<CR>` | Match \"<code class="visual"><code class="cursor">q</code>uoted words</code>\"---not quote marks.
{: .table-multi-text}

搜索模式 `"[^"]+"` 可以匹配双引号及包含的内容. 后面在双引号内侧分别加了 `/zs` 和 `/ze` 之后就只匹配双引号里的内容了

**手册**:
- `:h /\zs`


## Tip 79 转义问题字符
{: #tip79}
> Escape Problem Characters

在 `/V` 纯文本模式下可以很容易的来进行纯文本的搜索匹配, 因为绝大部分的字符(如:`.` `+` `*`等)的特殊含义都被禁用了, 但是仍然有极少字符仍然有特殊的含义

#### 正向搜索转义斜杠'/'

*markdown* 文档片段 *patterns/search-url.markdown*
```md
Search items: [http://vimdoc.net/search?q=/\\][s]
...
[s]: http://vimdoc.net/search?q=/\\
```

假如我们想搜索全部的 `http://vimdoc.net/search?q=/\\` URL内容, 我们可以先把内容存到寄存器中, 然后搜索的时候从寄存器粘贴就不用挨个字母敲了, 当然我们想使用存文本模式来进行搜索

首先我们把光标定位到URL的中括号以内, 然后 `"uyi[` 把URL的内容复制到 *u* 寄存器里, 然后按下 `/\V<C-r>u<CR>` , 命令行的提示看起来如下:
<pre>
➾ /\Vhttp://vimdoc.net/search?q=/\\
</pre>

这个时候我们匹配到的结果是:
<pre>
Search items: [<code class="visual">http:</code>//vimdoc.net/search?q=/\\][s]
...
[s]: <code class="visual">http:</code>//vimdoc.net/search?q=/\\
</pre>

因为正向搜索时, 斜杠 `/` 字符被解释为`终止符`{: .danger}, 所有在此字符之后的内容都会被忽略

所以, 在 `\v` 和 `\V` 模式下, 如果要匹配 `/` 字符, 那么需要进行转义:
<pre>
➾ /\Vhttp:\/\/vimdoc.net\/search?q=\/\\
</pre>

<pre>
Search items: [<code class="visual">http://vimdoc.net/search?q=/\</code>\][s]
...
[s]: <code class="visual">http://vimdoc.net/search?q=/\</code>\
</pre>

嗯, 最后还漏掉了一个反斜杠(`\`)没匹配上, 后续将会介绍

#### 反向搜索转义问号'?'

当使用反向搜索的时候, 问号 `?` 就是搜索的`终止符`{: .danger}. 意味着我们不需要转义斜杠 `/`, 但是需要转义 `?`

*不转义时的效果*:
<pre>
➾ ?http://vimdoc.net/search?q=/\\
</pre>

<pre>
Search items: [<code class="visual">http://vimdoc.net/search</code>?q=/\\][s]
...
[s]: <code class="visual">http://vimdoc.net/search</code>?q=/\\
</pre>

*转义问号之后的效果*:
<pre>
➾ ?http://vimdoc.net/search\?q=/\\
</pre>

<pre>
Search items: [<code class="visual">http://vimdoc.net/search?q=/\</code>\][s]
...
[s]: <code class="visual">http://vimdoc.net/search?q=/\</code>\
</pre>

#### 每次都转义反斜杠'\\'

还有一个特殊字符 `\` 是需要进行转义的. 通常情况下, 反斜杠 `\` 之后的那个字符表示被转义的特殊含义. 所以要匹配反斜杠字符的话就需要加转义, 也就是: `\\`

*最终完美的匹配*:
<pre>
➾ /\Vhttp:\/\/vimdoc.net\/search?q=\/\\\\
</pre>

<pre>
Search items: [<code class="visual">http://vimdoc.net/search?q=/\\</code>][s]
...
[s]: <code class="visual">http://vimdoc.net/search?q=/\\</code>
</pre>

`不管正向还是反向搜索, 反斜杠字符都是需要转义的!!!`{: .danger}

#### 编程来转义字符

鉴于每次手动转义字符费时费力还容易出错. Vim 脚本提供了特定的函数来进行转换

语法 `escape({string}, {chars})`

*{chars}* 参数是需要转义的字符列表, 例如之前的URL搜索: 
- `escape(@u, '/\')` - 正向搜索时, 需要转义的字符 `/\`
- `escape(@u, '?\')` - 反向搜索时, 需要转义的字符 `?\`

首先, 确保寄存器 u 里还是我们之前拷贝的URL字符串, 然后按下 `/` 或 `?` 开启搜索, 然后 `\V` 启用纯字符搜索, 然后按下 `<C-r>=` 切换到表达式寄存器, 按照提示键入:(按Tab可补齐)
<pre>
➾ =escape(@u, getcmdtype().'\')
</pre>

最后按下 `<CR>` 回车, *escape* 函数将会把 u 寄存器的 URL 内容转义之后返回到搜索列表, 正好就是我们转义过后的效果!
- `@u` - 寄存器URL的内容
- `getcmdtype()` - 正向搜索返回 `/`, 反向搜索返回 `?`
- `.` - Vim 脚本里的字符串拼接符
- `getcmdtype().'\'` - 正向搜索返回 `/\` 而反向搜索则返回 `?\`

切换到表达式寄存器, 然后调用 *escape()* 函数来手动调用仍然需要敲很多次按键. 只需要多一点脚本, 我们就可以自动轻松的完成此过程. 更多参考: Tip 87

**手册**:
- *:h escape()*
- *:h getcmdtype()*

#### 搜索字段终止符

你可能会好奇搜索为什么会有终止符(`/`或`?`), 因为 Vim 允许在搜索字段终止符后面追加某些标志来调整搜索命令的行为

例如 `/vim/e<CR>` 将把光标放到高亮匹配位置的最后而不是前面. 更多参考: Tip 83

---
- [Practical.Vim.2nd.Edition 源码包](/assets/archives/20181106092815_dnvim2-code.zip)

