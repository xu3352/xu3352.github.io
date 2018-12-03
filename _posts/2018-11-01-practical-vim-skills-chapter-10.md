---
layout: post
title: "Vim实用技巧进阶(第10章:复制和粘贴) - Practical.Vim.2nd.Edition"
keywords: "vim,practical-vim,copy,paste,register,clipboard,实用技巧"
description: "Practical.Vim.2nd.Edition 实用技巧进阶 第10章:复制和粘贴"
tagline: "Tip 60~64"
date: '2018-11-01 09:44:57 +0800'
category: linux
tags: vim practical-vim linux
---
> {{ page.description }}

# 第10章 复制和粘贴
> Copy and Paste


## Tip 60 匿名寄存器的使用
{: #tip60}
> Delete, Yank, and Put with Vim's Unnamed Register

*Vim* 的 删除, 拷贝, 放置(delete, yank, put) 命令在日常使用中被设计得简单易用. *匿名寄存器* 就是使用频率最高的寄存器

通常, 我们提到的 *剪切*, *拷贝* 和 *粘贴* 都是将文本放在剪贴板上. 

而在 *Vim* 术语中, 我们不说 *剪贴板*, 而是 `寄存器`

#### 互换字符

Keystrokes | Buffer Contents
----       | ----
{start}    | Practica lvi<code class="cursor">m</code>
`F␣`       | Practica<code class="cursor">&nbsp;</code>lvim
`x`        | Practica<code class="cursor">l</code>vim
`p`        | Practical<code class="cursor">&nbsp;</code>vim
{: .table-multi-text}

- `F␣` - 往前搜索 *空格* 字符, 并定位到匹配的位置
- `x` - 删除光标处的 *空格* 字符, 并把删除的字符存入到 *匿名寄存器*
- `p` - 粘贴刚刚删除掉的 *空格*

综合起来: `xp` 这2个命令就相当于把光标处的2个字符互换了位置

#### 互换行

Keystrokes | Buffer Contents
----       | ----
{start}    | <code class="cursor">2</code>) line two <br>1) line one <br>3) line three
`dd`       | <code class="cursor">1</code>) line one <br>3) line three
`p`        | 1) line one <br><code class="cursor">2</code>) line two <br>3) line three
{: .table-multi-text}

- `dd` - 删除光标处的行内容, 并把内容存入到 *匿名寄存器*
- `p` - *vim* 这次知道粘贴的内容是行(line-wise), 所以把 *匿名寄存器* 的内容粘贴到了当前行下面 (注意前面的 `xp` 是粘贴在字符后面)

所以 `ddp` 就相当于当前行和下一行的互换位置

#### 复制行

Keystrokes | Buffer Contents
----       | ----
{start}    | 1) line one <br><code class="cursor">2</code>) line two
`yyp`      | 1) line one <br>2) line two <br><code class="cursor">2</code>) line two
{: .table-multi-text}

`yyp` 和 `ddp` 类似, 都是面向行的; `yyp` 进行了行的复制, 并放到了 *匿名寄存器*, 然后按行的形式粘贴出来, 达到复制行的效果

#### 拷贝撞车

前面 *Vim* 的 *删除*, *拷贝* 和 *放置* 操作看起来都是非常直观的; 那么且看下面的示例

<pre>
collection = getCollection();
process(somethingInTheWay, target);
</pre>

现在我们想将 *somethingInTheWay* 替换为 *collection*, 看看我们如何操作:

Keystrokes | Buffer Contents
----       | ----
`yiw`      | <code class="cursor">c</code>ollection = getCollection();<br> process(somethingInTheWay, target);
`jww`      | collection = getCollection();<br> process(<code class="cursor">s</code>omethingInTheWay, target);
`diw`      | collection = getCollection();<br> process(<code class="cursor">,</code> target);
`P`        | collection = getCollection();<br> process(somethingInTheWa<code class="cursor">y</code>, target);
{: .table-multi-text}

一套操作下来, 跟预想的不一样啊??? 

`yiw` 把 *collection* 存到了 *匿名寄存器* 里, 但是后面的 `diw` 删除 *somethingInTheWay* 的同时, 把 *匿名寄存器* 给覆盖了, 所以粘贴出来却不是我们想要的

为了解决这一问题, 我们需要了解 *vim* 的 *寄存器* 是如何工作的

## Tip 61 寄存器一览
{: #tip61}
> Grok Vim's Registers

*Vim* 不是使用单个剪贴板进行所有剪切, 复制和粘贴(cut, copy, paste)操作, 而是提供多个寄存器. 当我们使用删除, 拉取和放置(delete, yank, put)命令时，我们可以指定我们想要与之交互的寄存器

**Vim 术语差别**: `cut,copy,paste` 和 `delete,yank,put`

<pre>
cut, copy, paste 术语是普片理解的, 并且这些操作可用于大多数桌面软件程序和操作系统.
Vim 也提供这些功能, 但它使用不同的术语: delete, yank, put.

Vim的 put 命令实际上与粘贴操作相同. 
幸运的是, 这两个单词都以字母 <code class="highlighter-rouge">p</code> 开头, 因此可以认为就是粘贴命令了.

Vim 的 yank 命令相当于复制操作.
从历史上看, <code class="highlighter-rouge">c</code>命令已经分配给了更改操作, 因此vi的作者被给出了另一个名称.
<code class="highlighter-rouge">y</code> 键可用, 因此复制操作变为 yank 命令.

Vim 的 delete 命令相当于标准剪切操作.
也就是说, 它将指定的文本复制到寄存器中, 然后将其从文档中删除.

如果想真正的删除文本而不存入寄存器呢? Vim 提供一个特殊的寄存器: 黑洞(black hole).
东西存进去就相当于丢弃了, 黑洞寄存器 寻址符号为:<code class="highlighter-rouge">_</code> 所以真正的删除为: <code class="highlighter-rouge">"_{motion}</code>
</pre>

所以, <span class="red">除非特殊说明, *Vim* 里说的 剪切, 复制, 粘贴操作, 通常上是指 delete, yank, put 操作</span>; 而 *Vim* 里的 剪切 和 复制 是不能在其他程序里进行粘贴的; 后面会介绍特殊的寄存器与剪贴板进行交互, 就可以在其他程序里进行粘贴操作了. 

#### 寄存器访问

语法 `"{register}`

- `"ayiw` - 复制当前的词, 并存到寄存器 *a* 里, 可使用 `"ap` 粘贴出来
- `"bdd` - 删除当前行, 并存到寄存器 *b* 里, 可使用 `"bp` 粘贴出来
- `:delete c` - Ex命令, 删除当前行并存到寄存器 c, 粘贴删除的行可以使用 `:put c`

#### 匿名寄存器(\"\")

匿名寄存器 寻址符号为: `"` 

例如要粘贴命令为:  `""p` 可简写为 `p`

`x`, `s`, `d{motion}`, `c{motion}`, `y{motion}` 等命令(大写亦可)都会把内容另存一份到 *匿名寄存器*; 如果想指定放到某个寄存器里, 可以指定前缀: `"{register}`, 不指定就是默认的 *匿名寄存器*

*匿名寄存器* 的内容很容易被覆盖掉, 所以某些时候要注意一下

#### yank寄存器(\"0)

但使用 `y{motion}` 命令时, 会把文本存到 *匿名寄存器*

同时也会存一份到 yank寄存器, 寻址符号为: `0`

顾名思义, yank寄存器 仅只对 `y{motion}` 拉取操作生效, 而其他的 `x`, `s`, `c{motion}`, `d{motion}` 等命令不行

我们回到上个小节的: [拷贝撞车](#拷贝撞车) 的示例

Keystrokes | Buffer Contents
----       | ----
`yiw`      | <code class="cursor">c</code>ollection = getCollection();<br> process(somethingInTheWay, target);
`jww`      | collection = getCollection();<br> process(<code class="cursor">s</code>omethingInTheWay, target);
`diw`      | collection = getCollection();<br> process(<code class="cursor">,</code> target);
`"0P`      | collection = getCollection();<br> process(collectio<code class="cursor">n</code>, target);
{: .table-multi-text}

- `diw` - 删除当前词, 并覆盖掉 *匿名寄存器* 里的内容; 但是 yank寄存器 的是没变的
- `"0P` - 把 yank寄存器 的内容粘贴出来, 正好就是我们想要的

查看 *匿名寄存器* 和 *yank寄存器* 的内容:
<pre>
➾ :reg "0
❮ --- Registers ---
   ""  somethingInTheWay
   "0  collection
</pre>

#### 字母寄存器(\"a-\"z)

*Vim* 提供了一组以26个小写字母(a-z)命名的寄存器
- `"ad{motion}` - 删除(剪切)并存入寄存器 *a*
- `"ay{motion}` - 拉取(拷贝)并存入寄存器 *a*
- `"ap` - 粘贴(放置)寄存器 *a* 的内容

Keystrokes | Buffer Contents
----       | ----
`"ayiw`    | <code class="cursor">c</code>ollection = getCollection();<br> process(somethingInTheWay, target);
`jww`      | collection = getCollection();<br> process(<code class="cursor">s</code>omethingInTheWay, target);
`diw`      | collection = getCollection();<br> process(<code class="cursor">,</code> target);
`"aP`      | collection = getCollection();<br> process(collectio<code class="cursor">n</code>, target);
{: .table-multi-text}

但我们有多个想要粘贴的文本时, 字母命名的寄存器就很有用了

#### 黑洞寄存器(\"_)

*黑洞寄存器* 就是一个丢弃内容的地方, 删除内容不会影响到 *匿名寄存器*

Keystrokes | Buffer Contents
----       | ----
`yiw`      | <code class="cursor">c</code>ollection = getCollection();<br> process(somethingInTheWay, target);
`jww`      | collection = getCollection();<br> process(<code class="cursor">s</code>omethingInTheWay, target);
`"_diw`    | collection = getCollection();<br> process(<code class="cursor">,</code> target);
`P`        | collection = getCollection();<br> process(collectio<code class="cursor">n</code>, target);
{: .table-multi-text}

删除的时候指定了 黑洞寄存器, 所以不会覆盖 匿名寄存器 的内容, 粘贴的文本就是之前拷贝的

#### 剪贴板寄存器(\"+ 和 \"*)

目前为止, 前面提到的寄存器都是Vim的内部寄存器. 如果我们想在Vim里进行拷贝, 然后在外部其他程序里粘贴呢? 这个时候就需要用到系统剪贴板了

系统剪贴板寄存器 寻址符号为: `+`

如果我们从外部程序剪切或者拷贝了文本, 那么在 Vim 里可以使用 `"+p` 来进行粘贴 (插入模式下可使用 `<C-r>+`); 相反, 如果我们在 Vim 里使用 `"+` 对文本进行拉取(yank)或删除, 那么文本就会存到 *系统剪贴板* 里, 外部程序就可以直接粘贴使用

*X11* 窗口系统有第二种称为主剪贴板. 是鼠标最近的选择的文本, 我们可以使用鼠标中键来粘贴

首要剪贴板的寻址符号: `*` 

Keystrokes | Buffer Contents
----       | ----
`"+`    | X11 剪贴板, 用于 剪切, 复制和粘贴
`"*`    | X11 主剪贴板, 选中的文本被拷贝, 用鼠标中键粘贴
{: .table-multi-text}

`Windows`{: .red} 和 `Mac OS X`{: .red} 系统没有 *主剪贴板*, 所以 `"+` 和 `"*` 都表示 *系统剪贴板*

是否支持 *X11剪贴板* 可以使用 `:version` 来查看版本信息
- *+xterm_clipboard* 表示支持
- *-xterm_clipboard* 表示不支持

#### 表达式寄存器(\"=)

Vim 寄存器可以简单的被认为是容纳一块文本的容器. 而 表达式寄存器 是个例外, 寻址符号为 `=`

但我们在插入模式或命令模式按下 `<C-r>=`, 然后命令行就会有 `=` 字符提示, 输入一个数字表达式(如:*1+2+3*)并按回车即可计算出结果, 并把结果回填到之前的位置 (见 Tip 16)

#### 更多的寄存器

我们可以使用 delete 和 yank 命令显式设置 字母, 匿名和yank 等寄存器来存放内容. 此外, Vim提供了一些寄存器, 其值是隐式设置的. 这里统称为 只读寄存器

Keystrokes | Buffer Contents
----       | ----
`"%`       | 当前文件名
`"#`       | 候选文件名(缓存列表的候选文件)
`".`       | 最后插入的文本
`":`       | 最后执行的Ex命令
`"/`       | 最后的搜索 pattern
{: .table-multi-text}

严格的说 `"/` 不是只读的, 因为可以通过 `:let` 进行设置, 不过这里也放到表格里了

**手册**:
- *:h quote_quote* 匿名寄存器
- *:h quote0* yank寄存器
- *:h quote_alpha* 字母(a-z)寄存器
- *:h quote_* 黑洞寄存器
- *:h quote+* 剪贴板寄存器
- *:h quotestar* 主剪贴板寄存器
- *:h quote=* 表达式寄存器
- *:h quote.* 最后插入文本寄存器
- *:h quote/* 最后搜索模式寄存器
- *:h registers* 查看所有寄存器列表

## Tip 62 寄存器替换选中的文本
{: #tip62}
> Replace a Visual Selection with a Register

在可视化模式下使用 `p` 命令替换文本的同时, Vim 会把被替换的文本存入匿名寄存器中 

Keystrokes | Buffer Contents
----       | ----
`yiw`      | <code class="cursor">c</code>ollection = getCollection();<br> process(somethingInTheWay, target);
`jww`      | collection = getCollection();<br> process(<code class="cursor">s</code>omethingInTheWay, target);
`ve`       | collection = getCollection();<br> process(<code class="visual">somethingInTheWa<code class="cursor">y</code></code>, target);
`p`        | collection = getCollection();<br> process(collectio<code class="cursor">n</code>, target);
{: .table-multi-text}

这应该是最直观和简洁的方式了, 省去了一个删除的步骤 (多一个选中的步骤, 不过更加直观一点)

上面示例, 再尝试一下按 `u` 撤销替换, 然后 `gv` 重新选中之前被替换的文本, 然后按 `p` 会怎样? 

答案是什么都没变! 因为按 `u` 之前, 匿名寄存器已经被覆盖为替换前选中的文本了 (Feature or Bug?)

#### 2个词互换

Keystrokes                                | Buffer Contents
----                                      | ----
{start}                                   | <code class="cursor">I</code> like chips and fish.
`fc`                                      | I like <code class="cursor">c</code>hips and fish.
`de`                                      | I like <code class="cursor">&nbsp;</code>and fish.
`mm`                                      | I like <code class="cursor">&nbsp;</code>and fish.
`ww`                                      | I like  and <code class="cursor">f</code>ish.
`ve`                                      | I like chips and <code class="visual">fis<code class="cursor">h</code></code>.
`p`                                       | I like  and chip<code class="cursor">s</code>.
<code class="highlighter-rouge">`m</code> | I like <code class="cursor">&nbsp;</code>and chips.
`P`                                       | I like fis<code class="cursor">h</code> and chips.
{: .table-multi-text}

- `de` - 删除 *chips* (并存入匿名寄存器中)
- `mm` - 在光标处做了一个 *m* 标记, 方便一会儿跳转回来的
- `ve` - 选中 *fish*
- `p` - 把选中的 *fish* 替换为匿名寄存器中的 *chips* 文本 (被替换的 *fish* 存入匿名寄存器中)
- <code class="highlighter-rouge">`m</code> - 跳转回之前标记 *m* 的位置 (Tip 54)
- `P` - 把匿名寄存器中的 *fish* 粘贴到光标位置之前 (大写的p)

**手册**:
- *:h v_p*

## Tip 63 寄存器粘贴
{: #tip63}
> Paste from a Register

常规模式下的 放置(put) 命令的行为不一样, 这个取决于插入的文本是 面向字符(character-wise) 或 面向行(line-wise) 的

粘贴行为差异:

2种模式  | `p`        | `P`        | 存入 匿名寄存器
----     | ----       | ----       | ----
面向字符 | 光标之后   | 光标之前   | `x` `diw` `das` `yw` 等
面向行   | 光标下一行 | 光标上一行 | `dd` `yy` `dap` 等
{: .table-multi-text}

寄存器列表中带有 <span class="red">^J</span> 字符的就是换行, 试了一下出现在末尾会被认定为: 面向行
<pre>
:reg
--- Registers ---
""   #### 字符模式粘贴<span class="red">^J</span>
"0   粘贴行为差异
"1   #### 字符模式粘贴<span class="red">^J</span>
"2    粘贴<span class="red">^J</span> 粘贴
</pre>

#### 面向字符区域粘贴

假如我们的 匿名寄存器 已经存在了 *collection* 文本, 那么对比一下什么时候用: `p` 和 `P` 呢?


对比一下:
<code class="highlighter-rouge">process<code class="cursor">(</code>, target);</code>
和
<code class="highlighter-rouge">process(<code class="cursor">,</code> target);</code>

第一种情况明显是 `p`, 后面是 `P`; 实时上错了之后经常按 `puP` 和 `Pup` 来形成肌肉记忆后就好了

上面小节介绍了直接替换选中的文本的粘贴[Tip 60](#tip60), 这里介绍插入模式下如何粘贴:

- `<C-r>"` - 插入 匿名寄存器 里的内容
- `<C-r>0` - 插入 yank寄存器 里的内容

Keystrokes       | Buffer Contents
----             | ----
`yiw`            | <code class="cursor">c</code>ollection = getCollection();<br> process(somethingInTheWay, target);
`jww`            | collection = getCollection();<br> process(<code class="cursor">s</code>omethingInTheWay, target);
`ciw<C-r>0<Esc>` | collection = getCollection();<br> process(collectio<code class="cursor">n</code>, target);
{: .table-multi-text}

使用 `ciw` 命令可以带来额外的好处: 可以使用 `.` 命令进行当前词的替换!

#### 面向行区域粘贴

前面我们说了, 面向行的 `p` 和 `P` 命令会将 匿名寄存器 的内容放置到 下一行/上一行

这里值得注意的是, Vim 还提供 `gp` 和 `gP` 命令. 不同的点在于:光标最后停留的位置是在粘贴内容之前和之后

演示文本:
```html
<table>

  <tr>
    <td>Symbol</td>
    <td>Name</td>
  </tr>

</table>
```

![gP命令粘贴效果](/assets/archives/20181103122707_vim-gP-command.png)

多行文本复制时, `gP` 命令非常好用; 虽然 `P` 和 `gP` 命令都能达到预期的复制文本效果, 不过最后光标停留的位置还是 `gP` 更实用一点(修改更方便点)

`p` 和 `P` 命令都能在多行文本进行粘贴时处理得很好.

不过在处理 面向字符区域文本时, `<C-r>{register}` 会更加直观一点

**手册**:
- *:h p*
- *:h linewise-register*

## Tip 64 系统剪贴板交互
{: #tip64}
> Interact with the System Clipboard

除了 Vim 的内置粘贴(put)命令, 我们有时可以使用系统粘贴命令. 但是, 在终端内运行 Vim 时, 使用此功能偶尔会产生意外结果. 我们可以在使用系统粘贴命令之前启用 'paste' 选项来避免这些问题. 

#### 准备

禁用插件启动 vim
<pre>
$ vim -u NONE -N
</pre>

启用自动缩进功能
<pre>
:set autoindent
</pre>

然后把下面这段 ruby 代码拷贝到系统剪贴板里:
<pre>
[1,2,3,4,5,6,7,8,9,10].each do |n|
  if n%5==0
    puts "fizz"
  else
    puts n
  end
end
</pre>

#### 系统粘贴快捷键

*Mac* 系统默认的粘贴快捷键为 <kbd>Cmd</kbd>+<kbd>v</kbd>

而 *Linux* 和 *Windows* 就没那么舒适了, 其系统默认的粘贴快捷键为 <kbd>Ctrl</kbd>+<kbd>v</kbd>

这个和 *Vim* 里的快捷键正好冲突:
- 常规模式下 - `<C-v>` 是启用可视化模式 (Tip 21)
- 插入模式下 - `<C-v>` 是插入特殊字符 (Tip 17)

一些 *Linux* 终端提供了另一套粘贴的快捷键: <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>v</kbd> 或 <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>v</kbd>

别忘了还有我们的剪贴板寄存器 `"+{regiester}` 和 `"*{register}`

#### 插入模式下粘贴
当我们切换到 *插入模式* 下, 然后使用系统快捷键进行粘贴时, 我们会得到如下结果:(缩进可能太一样)

<pre>
[1,2,3,4,5,6,7,8,9,10].each do |n|
  if n%5==0
      puts "fizz"
        else
        puts n
          end
          end
</pre>

这个缩进并没有达到我们的预期. 当我们在插入模式下使用系统粘贴快捷键时, *Vim* 会以手动输入的字符来对待. 当 *autoindent* 选项开启后, 每次创建新行时, *Vim* 会保留同级别的缩进. 而剪贴板中每行前面的空格都被添加到了自动缩进的前面, 导致每一行都向右越走越远

这个时候, 我们可以手动开启 `:set paste` 选项, 告知 *Vim* 我们要使用系统的粘贴命令. 插入模式下, 在进行系统粘贴, 就会得到我们想要的结果了. 而当我们使用完之后, 可以关闭 `:set paste!` 选项, 回到之前的状态. 

在插入模式下如何切换 *paste* 选项呢? 我们可以设置 *pastetoggle* 选项

`:set pastetoggle=<f5>`

这样就可以同时在 *插入模式* 和 *常规模式* 下快速切换了. 如果觉得实用, 可以加到 *~/.vimrc* 文件里

#### 用系统剪贴板寄存器粘贴

如果 *Vim* 支持 *+clipboard* 功能的话, 可以直接使用剪贴板寄存器, 而不用来回的切换 *paste* 选项了. [Tip 61 剪贴板寄存器](#%E5%89%AA%E8%B4%B4%E6%9D%BF%E5%AF%84%E5%AD%98%E5%99%A8-%E5%92%8C-)

使用 `"+p` 或 `"*p` 的系统剪贴板粘贴 (会忽略 *paste* 和 *autoindent* 选项) 

**手册**:
- *:h 'paste'*
- *:h 'pastetoggle'*

