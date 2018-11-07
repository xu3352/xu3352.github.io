---
layout: post
title: "Vim实用技巧进阶(第11章:宏指令) - Practical.Vim.2nd.Edition"
keywords: "vim,practical-vim,macros,实用技巧"
description: "Practical.Vim.2nd.Edition 实用技巧进阶 第11章:宏指令"
tagline: "Tip 65~72"
date: '2018-11-04 15:03:48 +0800'
category: linux
tags: vim practical-vim linux
---
> {{ page.description }}

# 第11章 宏指令
> Macros

Vim 提供了多种方式来 重复一个变更操作. 例如最常用的 `.` 命令, 重复一次小的变更非常有用. 

如果想要重复一些列的变更动作, 那么就要用到 Vim 的: `宏`

宏用来对一组相似的行, 段落甚至文件做重复的变更是一个理想的选择. 宏的执行有2种方式:
- 串行的在每个目标上执行
- 并行的在多个目标上执行

宏的录制过程中, 有时难免会操作失误, 不要紧, 因为可以轻松的给宏追加命令, 甚至是可以把宏的命令拿出来编辑, 最后在存回去

有时我们需要插入一系列的数字到文本中, 后面我将学习到如何在 *表达式寄存器* 中使用原始的 Vim 脚本来完成这个操作

> Vim’s macros take a minute to learn and a lifetime to master.

`宏` 上手容易, 精通则需要不断的实践; 新手和专家都能从此功能中获取有用的东西, 从而轻松实现任务的自动化

## Tip 65 宏录制和执行
{: #tip65}
> Record and Execute a Macro

`宏` 允许我们记录一些列的变更, 然后可以按照录制的步骤来重复执行(执行通常又叫播放)

#### 宏录制

录制语法 `q{register}{commands}q`
- `q` - 开始录制
- `{register}` - 表示寄存器名称 (a-z)
- `{commands}` - 一组操作命令(一系列的键盘按键)
- `q` - 是停止录制, 最后把 *{commands}* 以文本形式存到前面的寄存器里中

Keystrokes     | Buffer Contents
----           | ----
`qa`           | <code class="cursor">f</code>oo = 1 <br>bar = \'a\' <br>foobar = foo + bar
`A`;`<Esc>`    | foo = 1<code class="cursor">;</code><br>bar = \'a\' <br>foobar = foo + bar
`I`var␣`<Esc>` | var<code class="cursor">&nbsp;</code>foo = 1;<br>bar = \'a\' <br>foobar = foo + bar
`q`            | var<code class="cursor">&nbsp;</code>foo = 1;<br>bar = \'a\' <br>foobar = foo + bar
{: .table-multi-text}


查看寄存器 `a` 里的内容:
<pre>
:reg a
--- Registers ---
"a   A;<span class="red">^[</span>Ivar <span class="red">^[</span>
</pre>

`a` 寄存器里存的就是我们所有的变更操作了, 而 `^[`{: .red} 这里表示 `<Esc>` 按键

#### 宏执行

语法 `@{register}` 

而 `@@` 可以重复最近一次的 `@{0-9a-z":*}` 命令

Keystrokes | Buffer Contents
----       | ----
{start}    | var<code class="cursor">&nbsp;</code>foo = 1;<br>bar = \'a\' <br>foobar = foo + bar
`j`        | var foo = 1;<br>bar<code class="cursor">&nbsp;</code>= \'a\' <br>foobar = foo + bar
`@a`       | var foo = 1;<br>var<code class="cursor">&nbsp;</code>bar = \'a\';<br>foobar = foo + bar
`j@@`      | var foo = 1;<br>var bar = \'a\';<br>var<code class="cursor">&nbsp;</code>foobar = foo + bar;
{: .table-multi-text}

第二行的代码只需要 `@a` 就能达到第一行的效果, 而第三行 `@@` 就能重复第二行的操作, 也能达到第一行的效果; 这里的 `@@` 和 `.` 命令是不是有点相似呢?

我们有2种技术可以用来 批量执行 `宏`, 用 圣诞树的灯泡 打个比方:
<pre>
如果你购买一套便宜的派对灯, 很可能它们会串联起来. 如果一个灯泡爆炸, 它们都会熄灭
如果您购买高级套装, 他们更有可能并行连接. 这意味着任何灯泡都可以熄灭, 其余灯泡不受影响
</pre>

这里借用了电路的 串联 和 并联 来区分2中宏的批量执行的过程. 显然 并联 比 串联 的容错能力更强

#### 宏串行执行

好比串联的灯泡一样, 批量执行过程中, 遇到一个异常的情况, 后续的就停止了

#### 宏并行执行

好比并联的灯泡一样, 批量执行过程中, 即使有异常的情况, 别的单位不会受到影响

这里的并行术语旨在做一个类比, 实际上 Vim 的宏总是按循序执行的

后续 [Tip 68](#tip68) 和 [Tip 70](#tip70) 会介绍串行和并行的示例

**手册**:
- *:h q*
- *:h @*


## Tip 66 标准化,出击,中断
{: #tip66}
> Normalize, Strike, Abort

执行宏有时会产生意想不到的结果, 但如果我们遵循一些最佳实践, 我们可以得到更好的一致性

由于宏的执行过程是按录制的命令进行回放, 如果不小心, 重播时的结果很可能会偏离我的预期. 但是可以编写更灵活的宏, 来适应每个上下文做正确的事情

`黄金法则: 当录制宏时, 确保每个命令都是可重复的`{: .success}

#### 光标位置标准化

一旦开始录制宏, 先问下自己: 我在哪里, 我从哪里来, 我要到哪去?

在执行任何操作之前, 请确保光标已经就位, 以便下一个命令执行我们期望的操作, 或到达指定的位置

光标快速移动到 目标位置:
- `n`/`N` - 移动到 下一个/下一个 搜索的位置
- `0`/`$` - 移动到行首/尾
- `gg`/`G` - 移动到文件开始/结束位置

#### 用可重复的动作处理目标

Vim 里移动的命令有很多, 要用最合适的(精准的一步到位)

移动光标时, 避免使用 `h` 和 `l` (Character-wise)命令, 尽量使用 面向词(Word-wise) 的 `w` `b` `e` `ge` 等移动命令

例如使用 `0e` 之后, 每次都可以得到一致的结果: 把光标定位到行首第一个单词的最后一个字母

使用搜索导航, 使用文本对象, 配合 Vim 强大的运动(motions)命令, 使 `宏` 尽可能的灵活和可重复

`切记: 录制宏时, 禁止使用鼠标!!!`{: .danger}

#### 移动失败时中断

Vim 移动操作是可能失败的; 例如光标位置已经在文首时, 然后按 `k` 或 `h` 是没有反应的; 同样的, 如果光标处于文件最后位置, 那么按 `j` 或 `l` 也是没反应的. 

默认情况下, 当移动失败时, Vim会发出哔哔声, 这个可通过 *visualbell* 选项来进行设置

那么, 当执行 `宏` 的时候移动失败, 那么 Vim 会终止执行宏 

考虑如下案例: 我们使用 `/pattern` 搜索文本, 假如总共有 10 个匹配的位置. 这个时候开始录制宏, 然后按 `n` 找下一个匹配的位置, 然后我们对匹配的文本做些小修改, 然后停止宏的录制. 由于我们已经对一个匹配的位置已经做出来修改, 所以还剩下 9 个位置可以匹配.

但执行宏的时候, Vim 会把光标定位到下一个匹配的位置, 然后做出修改, 那么此文档就只剩下 8 个匹配位置了. 依次再执行 8 次宏, 那么就没有匹配的位置了. 如果我们再次执行宏呢? 由于 `n` 命令失败, 所以宏就终止了, 什么都不会发生. 

假如我们把宏录制到了 *a* 寄存器中了, 然后我们需要执行宏 `@a` 10次, 那么我们可以直接加个次数的前缀: `10@a`. 不要去数有多少个要执行, 直接设置一个超大的数, 例如 `100@a` 或 `1000@a`, 结果反正是一样的

**手册**:
- *:h 'visualbell'*


## Tip 67 回放计数
{: #tip67}
> Play Back with a Count

`.` 命令是少量重复最有效的编辑策略, 但不能用计数执行. 一个简单的 `宏` 就能解决计数的问题

在 [Tip 3](https://xu3352.github.io/linux/2018/10/16/practical-vim-skills#tip3) 的示例中, 我们使用了 `.` 命令把:

<pre>
var foo = "method("+argument1+","+argument2+")";
</pre>
改为:
<pre>
var foo = "method(" + argument1 + "," + argument2 + ")";
</pre>

Tip 3 示例中, 我们使用几次了 `;.` 完成了重复的修改动作. 如果需要大量重复的呢?

<pre>
x = "("+a+","+b+","+c+","+d+","+e+")";
</pre>

我们用同样的方式进行修改, 但是一次变更时需要按下 `;.` 2个命令, 额, 这个有点多了...

那么能否加个计数, 类似 `11;.` 之类的呢? 嗯, 命令这么写是支持的, 不过并不是我们想要的结果

`11;.` 实际是执行了 11 次`;` 然后执行了一次 `.` 命令, 而并不是我们想要的执行 11 次 `;.` 组合命令

幸运的是我们简单的录制一个宏就解决问题了: `qq;.q` (把名 `;.` 命令存到 q 寄存器中)

Keystrokes  | Buffer Contents
----        | ----
{start}     | <code class="cursor">x</code> = \"(\"+a+\",\"+b+\",\"+c+\",\"+d+\",\"+e+\")\";
`f+`        | x = \"(\"<code class="cursor">+</code>a+\",\"+b+\",\"+c+\",\"+d+\",\"+e+\")\";
`s + <Esc>` | x = \"(\" +<code class="cursor">&nbsp;</code>a+\",\"+b+\",\"+c+\",\"+d+\",\"+e+\")\";
`qq;.q`     | x = \"(\" + a +<code class="cursor">&nbsp;</code>\",\"+b+\",\"+c+\",\"+d+\",\"+e+\")\";
`22@q`      | x = \"(\" + a + \",\" + b + \",\" + c + \",\" + d + \",\" + e +<code class="cursor">&nbsp;</code>\")\";
{: .table-multi-text}

`;` 命令是重复 `f+` 的搜索. 当光标定位到最后一个 *+* 号之后时, `;` 移动失败, 宏终止执行

这里的 22 是随便设置(2和@都在一个按键上)的, 只要感觉能完成任务就好, 大点没关系, 因为是安全的

## Tip 68 邻近行执行宏
{: #tip68}
> Repeat a Change on Contiguous Lines

我们可以通过录制宏, 然后在每一行上播放来轻松的在一个区间内的所有行上重复相同的更改. 有2中方法可以执行此操作: `串行` 或 `并行` 执行

示例文本:
<pre>
1. one
2. two
3. three
4. four
</pre>

目标: 
<pre>
1) One
2) Two
3) Three
4) Four
</pre>

#### 录制宏

给第一行录制 `宏`

Keystrokes | Buffer Contents
----       | ----
`qa`       | 1. <code class="cursor">o</code>ne<br> 2. two
`0f.`      | 1<code class="cursor">.</code> one<br> 2. two
`r)`       | 1<code class="cursor">)</code> one<br> 2. two
`w~`       | 1) O<code class="cursor">n</code>e<br> 2. two
`j`        | 1) One<br> 2. t<code class="cursor">w</code>o
`q`        | 1) One<br> 2. t<code class="cursor">w</code>o
{: .table-multi-text}

- `0` - 把光标移动到了行首位置, 使得后续的操作都可以标准化
- `f.` - 查找 `.` 字符并把光标定位到匹配的位置

这里为什么不用 `l` 呢, 如果超过10行的时候就不适用了, 尽量避免单个字符移动的命令

另外, `f.` 是一个安全的操作, 如果没有找到 `.` 字符, 那么宏就会终止, 不会引起其他问题

#### 串行执行宏

Keystrokes | Buffer Contents
----       | ----
{start}    | 1) One <br>2. t<code class="cursor">w</code>o <br>3. three <br>4. four
`3@a`      | 1) One <br>2) Two <br>3) Three <br>4) F<code class="cursor">o</code>ur
{: .table-multi-text}

使用 `@a` 即可执行宏, 后面3行需要执行, 那么就是 `3@a` 即可

那么下面的情况呢?

Keystrokes | Buffer Contents
----       | ----
{start}    | <code class="cursor">1</code>. one <br>2. two <br>// break up the monotony <br>3. three <br>4. four
`5@a`      | 1) One <br>2) Two <br><code class="cursor">/</code>/ break up the monotony <br>3. three <br>4. four
{: .table-multi-text}

宏执行到第3行就熄火了, 因为第3行是注释文本, 没有 `.` 字符, 所以 `f.` 命令失败, 宏执行终止

#### 并行执行宏

[Tip 30 区间执行常规模式命令](https://xu3352.github.io/linux/2018/10/21/practical-vim-skills-chapter-5#tip30)
示例展示了在多行之间执行 `.` 命令, 那么我们把此技术应用到宏上面

Keystrokes      | Buffer Contents
----            | ----
`qa`            | 1. one
`0f.r)w~`       | 1) O<code class="cursor">n</code>e
`q`             | 1) O<code class="cursor">n</code>e
`jVG`           | 1) One <br><code class="visual">2. two <br>// break up the monotony <br>3. three <br>4. f<code class="cursor">o</code>ur</code>
`:'<,'>normal @a` | 1) One <br>2) Two <br>// break up the monotony <br>3) Three <br>4) F<code class="cursor">o</code>ur
{: .table-multi-text}

我们重新录制了宏, 去掉最后的 `j`, 不用往下移动一行了

`:normal @a` 命令可以使宏在选中的每一行都执行, 不过第3行并没有抛锚了, 这是为什么呢?

之前是 `5@a` 来串行执行5次重复执行, 当执行到第3行的时候终止, 后续的循环队列也一起终止

而这次, 我们并行执行5次迭代, 每次调用宏都独立于其他调用, 因此第3行失败的时候, 并不会影响到其他宏的运行

#### 用串行还是并行

串行 和 并行哪个更好呢? `答案是: 看情况!`{: .warning}

并行执行宏兼容性更好. 在本示例中用并行正好就是我们期望的结果.

不过有时执行宏遇到异常情况时, 也许正好需要了解异常原因, 这个时候串行执行就能快速定位到异常的位置

理解了两种技巧原理, 才能找到不同场景使用不同技术的诀窍


## Tip 69 宏追加命令
{: #tip69}
> Append Commands to a Macro

有时在录制宏的时候漏掉了某个必不可少的步骤, 我们可以不用重新录制一遍, 而是可以将额外的命令追加到已有的宏的后面

假如录制一个宏 (借用 [Tip 68 的示例](#tip68))

Keystrokes | Buffer Contents
----       | ----
`qa`       | 1. <code class="cursor">o</code>ne <br>2. two
`0f.r)w~`  | 1) O<code class="cursor">n</code>e <br>2. two
`q`        | 1) O<code class="cursor">n</code>e <br>2. two
{: .table-multi-text}

由于最后按下了 `q` 停止了宏的录制, 后来认识到最后还需要加 `h` 来移动到下一行

<pre>
:reg a
"a   0f.r)w~
</pre>

如果按下 `qa` 那么 Vim 则会记录我们的按键操作并存入到 *a* 寄存器中; 如果按下 `qA` 那么 Vim 则会把 按键操作 追加到 *a* 寄存器里

Keystrokes | Buffer Contents
----       | ----
`qA`       | 1) O<code class="cursor">n</code>e <br>2. two
`j`        | 1) One <br>2. t<code class="cursor">w</code>o
`q`        | 1) One <br>2. t<code class="cursor">w</code>o
{: .table-multi-text}

再看 *a* 寄存器的内容
<pre>
:reg a
"a   0f.r)w~j
</pre>

这个小技巧可以让我们不用重新录制整个宏, 不过缺点就是只能在末尾追加命令. 后面 [Tip 72](#tip72) 将介绍如何对宏指令进行修改


## Tip 70 文件批量处理
{: #tip70}
> Act Upon a Collection of Files

到目前为止, 我们对宏的运用都仅限于单个文档里, 不过一个宏是可以在多个文件里执行的

同样的, 我们需要考虑到2中方式来执行: 串行还是并行

我们有几个文件看起来如下 `macros/ruby_module/animal.rb` (源码包下载见文末)
```ruby
# ...[end of copyright notice]
class Animal
  # implementation
end
```

需要包装到模块里: 
```ruby
# ...[end of copyright notice]
module Rank
  class Animal
    # implementation
  end
end
```

#### 准备

确保如下代码加入到: `~/.vimrc`
```vim
set nocompatible
filetype plugin indent on
set hidden
if has("autocmd")
  autocmd FileType ruby setlocal ts=2 sts=2 sw=2 expandtab
endif
```

*'hidden'* 选项我们之前讨论过了, 参考: [Tip 39 管理隐藏文件](https://xu3352.github.io/linux/2018/10/23/practical-vim-skills-chapter-6#tip39)

#### 打开目标文件列表

批量打开示例的所有 ruby 文件

```vim
➾ $ vim
➾ :cd code/macros/ruby_module
➾ :args *.rb
```

查看缓冲区列表:
```vim
➾ :args
❮ [animal.rb] banker.rb frog.rb person.rb
```

可以使用 `:first` `:last` `:prev` `:next` 来切换文件

#### 录制宏

切换到第一个文件: *animal.rb*
```vim
➾ :first
```

![Tip 70 宏录制](http://p9fggfk3y.bkt.clouddn.com/20181106135936_vim-macro-files-act.png)

**步骤**:
- `qa` - 开始录制宏, 寄存器为 *a*
- `gg/class<Cr>` - 由于每个文件开始都有版权信息(copyright), 所以先用 `gg` 将光标定位到文件起始位置(标准化), 再搜索 *class* 并定位到匹配的位置
- `Omodule Rank<Esc>` - 先用 `O` 在光标上一行位置插入新行, 然后输入 *module Rank* 文本, 按 `<Esc>` 切换到常规模式
- `j>G` - 光标切换到第3行, 然后 `>G` 把 第3行~最后一行 向右缩进一次(2个空格)
- `Goend<Esc>` - `G` 定位到文件最后一行, `o` 往后插入一行, 然后输入 *end* 文本(输入完自动缩进到行首), 在按 `<Esc>` 切回到常规模式
- `q` - 停止录制宏, 操作步骤命令存入a寄存器里

#### 并行执行宏

*:argdo* 命令可以依次对每个缓冲区执行 Ex 命令, 如果现在执行 *:argdo normal @a* 会有副作用

因为第一个文件录制宏的时候已经处理过了, 这个时候如果跑的话, 会再处理一次, 所以要先把当前文件的更改撤销掉

<pre>
撤销更新:重新载入文件; 如果之前保存到了文件, 可以使用 u 来撤销
➾ :edit!

批量执行:应用到所有 args 列表文件
➾ :argdo normal @a
</pre>

#### 串行执行宏

目前我们的宏可以在单个缓冲区很好的执行, 想要在多个缓冲区执行, 那么还需要在宏里追加命令 *:next*, 然后我们就可以使用 `3@a` 来应用到其他3个文件, 当然我们也可以使用 `22@a`, 因为 *:next* 执行失败时, 宏就会终止了

![追加命令后串行执行其他文件](http://p9fggfk3y.bkt.clouddn.com/20181107014334_vim-macro-files-acts-series.png)

#### 保存所有文件变更

我们一共修改了4个文件, 但是一个都还没有保存, 我们也可以使用 *:argdo write* 来保存

这里有更简单的方式:
<pre>
➾ :wall
</pre>

另外有一个命令为 *:wnext*, 相当于 *:write* + *:next* 2个命令的合体, 如果使用宏来处理参数列表(*:args*)的话, 这个命令就用得上了

#### 讨论

上面的示例中, 假如第3个缓冲区因为某种原因会导致宏执行失败, 那么并行执行的 *:argdo normal @a* 命令执行后, 就只有第3个文件会失败. 如果我们使用串行的方式执行, 那么第3个文件失败时, 宏终止执行, 光标正好定位到第3个文件, 正好就可以看看究竟什么原因导致宏执行失败的

因为是多个文件, 所以我们不能一眼就看到所有的东西, 这个时候使用并行的方式执行, 处理失败的就容易遗漏掉

所以在本示例中, 并行方式执行固然更快, 但也容易遗漏一些有用的信息

**手册**:
- *:h :argdo*
- *:h :wa*
- *:h :wn*


## Tip 71 生成一个数字列表
{: #tip71}
> Evaluate an Iterator to Number Items in a List

能够在宏每次执行时插入一个可变更的变量可能是很有用的. 例如给文件的每一行最前面加个行号. 

示例文件: *macros/incremental.txt*
<pre>
partridge in a pear tree
turtle doves
French hens
calling birds
golden rings
</pre>

目标效果:
<pre>
1) partridge in a pear tree
2) turtle doves
3) French hens
4) calling birds
5) golden rings
</pre>

(话说遇到这种情况, 一般都是写个小程序, 不过 Vim 直接就能很快的搞定, 强大...)

我们之前介绍过使用简单的 数值计算 和 表达式寄存器 (参考 [Tip 10 简单计算](https://xu3352.github.io/linux/2018/10/16/practical-vim-skills#tip10) 和 [Tip 16 数学计算](https://xu3352.github.io/linux/2018/10/16/practical-vim-skills#tip16))
- `<C-x>` - 数字相减
- `<C-a>` - 数字相加 (容易和 tmux 快捷键冲突)
- `<C-r>={expression}` - 计算 {表达式} 的值 (加减乘除表达式)

#### 基本的Vim脚本

<pre>
➾ :let i=0
➾ :echo i
 ❮ 0

➾ :leti+=1 
➾ :echo i
 ❮ 1
</pre>

*:let* 给变量赋值, *:echo* 打印变量的值, 我们可以使用 *表达式寄存器* 把变量的值插入到文档中

切换到插入模式, 然后 `<C-r>=i<CR>` 就可以把变量 i 的值插入到文档中了

#### 录制宏

Keystrokes                | Buffer Contents
----                      | ----
:let i=1                  | <code class="cursor">p</code>artridge in a pear tree
`qa`                      | <code class="cursor">p</code>artridge in a pear tree
`I<C-r>=`i`<CR>`)␣`<Esc>` | 1)<code class="cursor">&nbsp;</code>partridge in a pear tree
:let i += 1               | 1)<code class="cursor">&nbsp;</code>partridge in a pear tree
`q`                       | 1)<code class="cursor">&nbsp;</code>partridge in a pear tree
{: .table-multi-text}

录制宏之前, 我们先设置变量 i 的值为 1, 在宏内部, 我们将表达式设置为了变量的值, 然后将变量的值+1, 也就是说, 变量的值现在已经是 2

#### 执行宏

Keystrokes        | Buffer Contents
----              | ----
{start}           | 1)<code class="cursor">&nbsp;</code>partridge in a pear tree <br>turtle doves <br>French hens <br>calling birds <br>golden rings
`jVG`             | 1) partridge in a pear tree <br><code class="visual">turtle doves <br>French hens <br>calling birds <br><code class="cursor">g</code>olden rings</code>
:\'<,\'>normal @a | 1) partridge in a pear tree <br>2) turtle doves <br>3) French hens <br>4) calling birds <br>5)<code class="cursor">&nbsp;</code>golden rings
{: .table-multi-text}

*:normal @a* 命令可以把选中的行都执行一遍宏(参考[并行执行宏](#并行执行宏)). 变量 i 的值从 2 开始, 每行都把值写入行首, 之后值自增+1, 留给下一行使用

使用 拷贝(yank), 粘贴(put) 和 `<C-a>` 命令同样可以达到相同的效果, 可以拿来练练手

## Tip 72 宏指令修改
{: #tip72}
> Edit the Contents of a Macro

在 [Tip 69 宏追加命令](:tip69) 小节我们介绍了如何在宏的最后追加命令, 如果我们先删除最后的一些命令, 或者修改最前面的命令呢? 本节内容将介绍如何把宏当做一个文本内容来进行修改

#### 问题:不标准的格式

假如我们按照 [Tip 68 录制宏](http://127.0.0.1:4000/linux/2018/11/04/practical-vim-skills-chapter-11#%E5%BD%95%E5%88%B6%E5%AE%8F) 的示例录制完宏, 并存入到a寄存器里, 那么看下面的文件:

*macros/mixed-lines.txt*
<pre>
1. One
2. Two
3. three
4. four
</pre>

由于第二行的第一个单词首字母已经是大写的了, 那么 `~` 命令会字母进行大小写转换, 所以这里需要把 `~` 命令换成 `vU` 命令(把光标处字母转大写)

#### 宏指令粘贴到文档里

首先按 `G` 把光标定位到文档最后一行, 然后把寄存器的内容粘贴到光标的下一行
<pre>
➾ :put a
</pre>

`"ap` 命令同样可以粘贴寄存器的内容, 不过位置是光标后面, 而不是新的一行

**宏指令对应的键盘编码**: 这里以 [Tip 70](http://127.0.0.1:4000/linux/2018/11/04/practical-vim-skills-chapter-11#%E5%BD%95%E5%88%B6%E5%AE%8F-1) 的宏做说明

<pre>
➾ :rega
❮ --- Registers ---
 "a Omoul<80>kb<80>kbdule Rank^[j>GGoend^[
</pre>

- `^[` - 表示 `Escape` 键, 即按键 `<Esc>` 或 `<C-[>`
- `<80>kb` - 表示 `backspace` 键, 即删除键

寄存器里存的键盘按键会比较特殊, 不容易看懂, 想要知道全部的按键编码, 自己录制一个宏, 把按键都敲一遍, 然后查看寄存器里的内容就知道了

#### 文本编辑宏

前面已经把宏的内容以文本形式粘贴出来了, 准备把 `~` 替换为 `vU` 吧

Keystrokes   | Buffer Contents
----         | ----
{start}      | <code class="cursor">0</code>f.r)w~j
`f~`         | 0f.r)w<code class="cursor">~</code>j
`s`vU`<Esc>` | 0f.r)wv<code class="cursor">U</code>j
{: .table-multi-text}

#### 修改后的宏重置回去

删除, 剪切, 拷贝等动作是可以指定寄存器的, 不指定则是默认的 匿名寄存器. 所以这里最简单的就是 `"add` (或`:d a`), 不过有点问题, 因为 `dd` 是面向行(line-wise)的, 寄存器里会包含 `^J` 字符

<pre>
➾ :reg a
 ❮ 0f.r)wvUj^J
</pre>

`^J` 表示新起一行, 大多数情况是没有问题的, 不过某些情况会导致宏的行为异常, 所以这里最好的方式是进行 面向字符(character-wise) 的复制

Keystrokes | Buffer Contents
----       | ----
{start}    | // last line of the file proper<br>0f.r)wvUj
`0`        | // last line of the file proper<br>0f.r)wv<code class="cursor">U</code>j
`"ay$`     | // last line of the file proper<br><code class="cursor">0</code>f.r)wvUj
`dd`       | <code class="cursor">/</code>/ last line of the file proper
{: .table-multi-text}

我们把该行所有内容(除了回车)都复制到a寄存器里了, 然后把最后一行的文本删除掉

改造完的宏就可以很好的应付本小节的示例文本了

#### 讨论

能够将把宏指令粘贴到文档里进行编辑, 修改后再把内容回置到寄存器里是比较方便的. 不过由于寄存器里的内容可读性比较差, 所以如果只是追加命令的话, 当然是 [Tip 69 宏追加命令](#tip69) 来的方便

由于寄存器里存的也是文本的字符串, 所以我们也可以使用 Vim 脚本进行修改. 例如可以使用 *substitute()* 函数(不同于 *:substitute* 命令)来就行内容替换

<pre>
➾ :let @a=substitute(@a, '\~', 'vU', 'g')
</pre>

**手册**:
- *:h ~*
- *:h v_U*
- *:h substitute()*
- *:h function-list* - Vim脚本函数列表

---
- [Practical.Vim.2nd.Edition 源码包](http://p9fggfk3y.bkt.clouddn.com/20181106092815_dnvim2-code.zip)

