---
layout: post
title: "Vim实用技巧进阶(第15章:全局命令) - Practical.Vim.2nd.Edition"
keywords: "vim,practical-vim,globle-commands,实用技巧"
description: "Practical.Vim.2nd.Edition 实用技巧进阶 第15章:全局命令"
tagline: "Tip 98~101"
date: '2018-12-08 20:18:25 +0800'
category: linux
tags: vim practical-vim linux
---
> {{ page.description }}

# 第15章 全局命令
> Globle Commands

全局(*:global*)命令将 Ex 命令的强大功能和 Vim 模式匹配功能结合起来: 它能在指定模式匹配的每一行上执行 Ex 命令. 除了 点命令 和 宏 之外, 全局命令是 Vim 处理重复性工作最高效的强大的工具之一

## Tip 98 全局命令
{: #tip98}
> Meet the Global Command

*:global* 全局命令可以在匹配到的多行上执行 Ex 命令, 其语法如下(参考 *:h :g*):
<pre>
:[range] global[!] /{pattern}/ [cmd]
</pre>

*:global* 全局命令默认的区间范围是整个文件(即`%`). 这和大多数的其他 Ex 命令区分开, 包括: *:delete*, *:substitute*, *:normal* 等命令的默认区间都只是当前行

*{pattern}* 字段与搜索历史集成. 所以可以留空来使用上次的搜索模式

*[cmd]* 可以是任何 Ex 命令(除了其他 *:global* 全局命令以外). 在实践中, 与文档中的文本交互的 Ex 命令证明是最有用的, 例如 [Tip 27 VIM命令行-命令列表](https://xu3352.github.io/linux/2018/10/21/practical-vim-skills-chapter-5#tip27). 如果不指定 *[cmd]*, 那么会使用默认的 *:print* 打印命令

我们可以使用 *global!* 或 *:vglobal* 命令对反向匹配的行进行操作. 匹配的排除掉, 也就是未匹配的行. 后面会有相应的示例.

*:global* 命令通过两遍遍历 *[range]* 执行行来工作. 第一遍标记按 *{pattern}* 匹配到的指定行, 第二遍对标记的行执行 *[cmd]* 命令. *[cmd]* 命令本身可以使用一个区间参数, 这使得我们可以在一片区域的多行上进行操作. 这强大的技术在 [Tip 101.CSS规则按属性排序](#tip101) 会有示例介绍

#### Grep的起源
考虑以下缩写的 *:global* 命令:
<pre>
➾ :g/re/p
</pre>

*re* 代表正则表达式, 而 *p* 则是 *:print* 的缩写(是 *[cmd]* 的默认命令), 如果我们忽略掉斜杠的话, 那么正好就是: `grep`

## Tip 99 按匹配删除行
{: #tip99}
> Delete Lines Containing a Pattern

组合 *:global* 和 *:delete* 命令可以快速删减文件内容. 我们可以保留或丢弃 *{pattern}* 匹配的所有行

*global/episodes.html*
```html
<ol>
  <li>
    <a href="/episodes/show-invisibles/">
      Show invisibles 
    </a>
  </li>
  <li>
    <a href="/episodes/tabs-and-spaces/">
      Tabs and Spaces 
    </a>
  </li>
  <li>
    <a href="/episodes/whitespace-preferences-and-filetypes/">
      Whitespace preferences and filetypes 
    </a>
  </li>
</ol>
```

每个 *li* 列表项包含2部分数据:标题和跳转链接. 我们使用 *:global* 命令分别来进行过滤

#### 删除匹配的行 :g/re/d

如果我们想丢弃 *\<a\>* 标签内容之外的所有东西, 该怎么办? 在示例文件中, 每个链接的内容显示在独立的行上, 而其他行则都包含了一个开启或一个结尾的HTML标签. 所以我们可以针对 HTML 标签来设计匹配模式, 然后使用 *:global* 命令来排除匹配到的所有行

命令如下:
```vim
➾ /\v\<\/?\w+>
➾ :g//d
```

执行后的效果如下:
<pre>
      Show invisibles 
      Tabs and Spaces 
      Whitespace preferences and filetypes 
</pre>

和 *:substitute* 替换命令一样, 我们可以把 *:global* 命令搜索字段留空, Vim 会重用上次的搜索模式(参考 [Tip 91 重用上次搜索模式](https://xu3352.github.io/linux/2018/12/03/practical-vim-skills-chapter-14#tip91)). 因此我们可以通过先宽泛匹配, 后精准目标的方式来构建我们的正则表达式, 完整的示例在 [Tip 85 用搜索历史创建复杂搜索](https://xu3352.github.io/linux/2018/11/21/practical-vim-skills-chapter-13#tip85) 

搜索字段使用 `\v`(正则表达式) 模式(参考 [Tip 74 使用\v启用正则搜索](https://xu3352.github.io/linux/2018/11/08/practical-vim-skills-chapter-12#tip74)). 它匹配一个开口的尖括号(`\<`), 后跟一个可选的斜杠(`\/?`), 然后是一个或多个单词字符(`\w+`), 最后跟一个单词结束分隔符(`>`). 这不是一个通用的标签匹配正则表达式, 但是本示例够用了

#### 保留匹配的行 :v/re/d

这次我们该另一种方式. *:vglobal*(或简写的 *:v*) 命令正好就是与 *:g* 命令相反. 它对针不匹配的行执行一个命令

包含 *URL* 的行很好区分出来: 它们都包含 *href* 属性. 所以下面的命名了就能筛选出来:
<pre>
➾ :v/href/d
</pre>

上面的命令可以这么理解: 删除不包含 *href* 的行. 效果如下:
```html
    <a href="/episodes/show-invisibles/">
    <a href="/episodes/tabs-and-spaces/">
    <a href="/episodes/whitespace-preferences-and-filetypes/">
```

只用一个简单的命令, 就能把文件缩减到我们感兴趣的行了


## Tip 100 收集TODO项存寄存器
{: #tip100}
> Collect TODO Items in a Register

组合使用 *:global* 和 *:yank* 命令, 可以把采集到按 *{pattern}* 匹配到的所有行存到一个寄存器里

*global/markdown.js*
```js
Markdown.dialects.Gruber = {
    lists: function() {
        // TODO: Cache this regexp for certain depths.
        function regex_for_depth(depth) { /* implementation */ }
    },
    "`": function inlineCode( text ) {
        var m = text.match( /(`+)(([\s\S]*?)\1)/ );
        if ( m && m[2] )
            return [ m[1].length + m[2].length ];
        else {
            // TODO: No matching end code found - warn!
            return [ 1, "`" ];
        }
    }
}
```

示例代码里有2行注释, 并且都是以 *TODO* 开头的. 假如我们想在一个地方收集所有的 *TODO* 项目. 可以运行如下命令一目了然的查看:
<pre>
➾ :g/TODO
❮  // TODO: Cache this regexp for certain depths.
      // TODO: No matching end code found - warn!
</pre>

记住, *:print* 是 *:global* 命令默认的 *[cmd]*. 这里只是简单的把包含 *TODO* 的行进行打印. 但它没有太大的用处, 因为一旦运行其他的命令, 消息就会消失. 所以一个替代的策略是: 把所有包含 *TODO* 的行都拷贝(yank)到寄存器里. 然后我们就可以把寄存器的内容粘贴到另一个文件并保存, 以供日后使用

<pre>
➾ :reg a
❮ --- Registers ---
"a
</pre>

现在我们把包含 *TODO* 的行存入寄存器中:
<pre>
➾ :g/TODO/yank A
➾ :reg a
❮ "a  // TODO: Cache this regexp for certain depths.
            // TODO: No matching end code found - warn!
</pre>

这里的诀窍是我们使用大写的A对寄存器进行了寻址. 这告诉 Vim 需要对指定的寄存器进行追加; 而小写的a则会覆盖寄存器的内容. 所以上面的全局命令可以理解为: 把所有匹配到包含 *TODO* 的行, 整个的追加到 a寄存器

再试运行 *:reg a*, 我们可以看到寄存器的内容就包含了两个有 *TODO* 的行. (为了易读起见, 这里格式化为两个单独的行展示了, 而实际上换行符应该显示为 `^J` 字符的.) 然后我们就可以在切分窗口中新开一个缓冲区, 并执行 `"ap` 粘贴 a寄存器 的内容到文档中了

#### 讨论

本示例中, 我们仅仅是收集了2个 *TODO* 项, 这可以非常快速的手动完成. 但这种技术很好扩展. 如果文档包含几十个 *TODO* 项, 同样的操作就能达到相同的效果

我们甚至可以将 *:global* 与 *:bufdo* 或 *:argdo* 组合起来, 以收集一组文件中所有的 *TODO* 项. 这个可以作拿来练手, 在 [Tip 36 批量执行多个Ex命令](https://xu3352.github.io/linux/2018/10/21/practical-vim-skills-chapter-5#tip36) 可以找找灵感

下面还有个可选方案:
<pre>
➾ :g/TODO/t$
</pre>

这里使用 *:t* 命令, 在 [Tip 29 区间复制或移动](https://xu3352.github.io/linux/2018/10/21/practical-vim-skills-chapter-5#tip29) 中介绍过. 比起把所有 *TODO* 项存到寄存器, 我们可以简单的复制并粘贴到文件末尾. 在运行此命令后, 光标将定位到文末的最后的一个 *TODO* 项的行上面. 这种技术更加单, 因为可以避免寄存器中的特殊字符. 但它不能像 *:argdo* 和 *:bufdo* 命令那样巧妙的工作


## Tip 101 CSS规则按属性排序
{: #tip101}
> Alphabetize the Properties of Each Rule in a CSS File

当使用 *Ex* 命令和 *:global* 命令组合时, 还可以给 *Ex* 指定一个区间范围. Vim 允许我们使用 *:g/{pattern}* 作为参考点动态设置区间范围. 下面我们将看到如何利用这个特点来对CSS文件中的每个块的属性进行按字母排序的

*global/unsorted.css*
```css
html { 
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
}
body { 
  line-height: 1.5;
  color: black;
  background: white;
}
```

假设我们想对每个规则属性按字母排序, 那么就要用到 Vim 内置的 *:sort* 命令(参考 *:h :sort*)

#### 对单个块的规则属性排序

先从尝试 *:sort* 命令开始(参考下面的表格), 我们可以使用 `vi{` 轻松的选择包含在 *{}* 内的文本对象. 执行 `:'<,'>sort` 命令, 把选中的行进行重新按字母排序. 这项技巧可以在一个规则块内很好的执行. 但是想象一下我们的样式表是包含好几百个的规则块, 能否有更好的办法自动的对他们进行处理呢?

Keystrokes | Buffer Contents
----       | ----
{start}    | html <code class="cursor">{</code> <br>&nbsp;&nbsp;margin: 0; <br>&nbsp;&nbsp;padding: 0; <br>&nbsp;&nbsp;border: 0; <br>&nbsp;&nbsp;font-size: 100%; <br>&nbsp;&nbsp;font: inherit; <br>&nbsp;&nbsp;vertical-align: baseline; <br>}
`vi{`    | html { <code class="visual"><br>&nbsp;&nbsp;margin: 0; <br>&nbsp;&nbsp;padding: 0; <br>&nbsp;&nbsp;border: 0; <br>&nbsp;&nbsp;font-size: 100%; <br>&nbsp;&nbsp;font: inherit; <br>&nbsp;&nbsp;vertical-align: baseline;<code class="cursor">&nbsp;</code></code><br>}
:\'<,\'>sort | html { <br>&nbsp;&nbsp;<code class="cursor">b</code>order: 0; <br>&nbsp;&nbsp;font-size: 100%; <br>&nbsp;&nbsp;font: inherit; <br>&nbsp;&nbsp;margin: 0; <br>&nbsp;&nbsp;padding: 0; <br>&nbsp;&nbsp;vertical-align: baseline; <br>}
{: .table-multi-text}

#### 对每个块的规则属性排序

我们可以使用一个 *:global* 命令对文件中的每个规则块的属性进行排序. 执行如下命令:
<pre>
➾ :g/{/ .+1,/}/-1 sort
</pre>

我们可以得到如下结果:
```css
html { 
  border: 0;
  font-size: 100%;
  font: inherit;
  margin: 0;
  padding: 0;
  vertical-align: baseline;
}
body { 
  background: white;
  color: black;
  line-height: 1.5;
}
```

*sort* 命令在每个规则的 *{}* 块内部得到执行. 示例文件仅仅是包含10几行的样式表代码, 但是即使是更大的CSS文件也是适用的

最后的命令是比较复杂的, 不过知道是如何运作的将帮助我们看到 *:global* 命令是多么的强大. 其格式如下:
<pre>
:g/{pattern}/[cmd]
</pre>

记住: Ex 命令通常可以自己接收一个区间范围(在 [Tip 28. 区间执行命令](https://xu3352.github.io/linux/2018/10/21/practical-vim-skills-chapter-5#tip28) 已经介绍过). 对于 *:global* 命令中的 *[cmd]* 来说也是一样的. 所以, 扩展一下格式模板:
<pre>
:g/{pattern}/[range][cmd]
</pre>

*[cmd]* 的 *[range]* 区间范围可以用 *:g/{pattern}* 的匹配作为参考点动态设置. 通常 `.` 表示光标所在的行, 但是在 *:global* 命令中, 它表示每次 *{pattern}* 所匹配到的行

我们把最后执行的命令拆分成两个独立的 Ex 命令. 先从后面的开始:
<pre>
➾ :.+1,/}/-1 sort
</pre>

去掉区间的偏移量, 那就是 `.,/}/`, 这表示: 从当前行到下一个 `/}/` 模式匹配的行. 而 *+1* 和 *-1* 偏移量则是简单的缩小的区间的范围到 `{}` 以内. 如果我们把光标定位到未排序CSS文件的第1行(包含html的行)或第9行(包含body的行), 然后执行上面的 Ex 命令, 那么它将把 `{}` 内的属性按字母进行排序

我们仅需要把光标定位到 `{}` 块的开始位置, 然后执行 `:.,/}/sort` 命令就可以对每个规则块属性排序. 抓到关键点了没? 现在尝试执行 *:global* 命令来进行 *{pattern}* 搜索
<pre>
➾ /{/
</pre>

这可以把光标放到 `{}` 块的顶部, 正好就是我们期望的地方. 最后在把 *:global* 和 *[cmd]* Ex命令合并到一起:
<pre>
➾ :g/{/ .+1,/}/-1 sort
</pre>

模式中的 `{` 可以匹配每个 `{}` 块的第一行位置. 对于匹配到的每一个行, *:sort* 命令按 *[range]* (终止于`{}`块)执行. 最终的结果就是所有的CSS属性都在每个规则块内按字母进行排序

#### 讨论

通用的 *:global* 全局命令格式如下:
<pre>
:g/{start}/ .,{finish} [cmd]
</pre>

我们可以理解为: 对于每个以 *{start}* 开始和以 *{finish}* 结束区间的所有行, 执行指定的 *[cmd]* 命令.

同样的, 我们可以使用 *:global* 命令和其他任何的 Ex 命令进行组合. 例如: 我们想对特定的区间进行缩进, 那么我们可以使用 `:>` Ex 命令(参考 *:h :>*)来达到效果:
<pre>
➾ :g/{/ .+1,/}/-1 > 
❮ 6 lines >ed 1 time 
  3 lines >ed 1 time
</pre>

注意 *:>* 命令每次调用时都会回显一条消息, 而 *:sort* 则不会. 我们可以通过在 *[cmd]* 前面添加 *:silent* (参考 :h :sil)选项来静默这些消息的显示:
<pre>
➾ :g/{/sil .+1,/}/-1 >
</pre>

在 *:g/{pattern}* 匹配到大量行时, 这个技巧非常有用

