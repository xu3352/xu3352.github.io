---
layout: post
title: "Vim实用技巧进阶(第5章:命令模式) - Practical.Vim.2nd.Edition"
tagline: "Tip 27~36"
keywords: "vim,practical-vim,ex-commands,command-history,命令模式,实用技巧"
description: "Practical.Vim.2nd.Edition 实用技巧进阶: 第5章-命令模式"
date: '2018-10-21 20:30:46 +0800'
category: linux
tags: vim practical-vim linux 
---
> {{ page.description }}

# 第5章 命令模式
> Command-Line Mode

`vim` 继承自 `vi`;  而 `vi` 继承于 `ex` 的行编辑器

## Tip 27 VIM命令行
{: #tip27}
> Meet Vim's Command Line

- 常规模式按 `:` 即可进入到命令行模式
- 命令模式下, 输入命令后按 `<CR>`(回车) 即可执行命令
- 如果想返回常规模式, 按 `<Esc>` 即可
- 常规模式按 `/` 即可激活搜索提示
- 插入模式按 `<C-r>=` 即可访问表达式寄存器, 可以进行一些数学计算

`Ex` 命令列表:

Command                                         | Effect
----                                            | ----
`:[range]delete [x]`                            | 行区间删除 [内容存入寄存器 `x`]
`:[range]yank [x]`                              | 行区间拷贝 [内容存入寄存器 `x`]
`:[line]put [x]`                                | 指定行追加寄存器 `x` 的内容
`:[range]copy {address}`                        | 行区间拷贝后并张贴到指定的位置
`:[range]move {address}`                        | 行区间移动到指定的位置
`:[range]join`                                  | 合并行
`:[range]normal {commands}`                     | 区间内执行常规模式的命令
`:[range]substitute/{pattern}/{string}/[flags]` | 区间内按匹配的替换
`:[range]global/{pattern}/[cmd]`                | 区间内匹配的行里执行 Ex 命令: `cmd`

`{address}` 可以是: `.` 当前行, `$` 文件末尾等

一些命令可以同时在 *插入模式* 和 *命令模式* 下使用:

命令              | 说明
----              | ----
`<C-w>`           | 往前删除一个词
`<C-u>`           | 往前删除所有字符
`<C-v>` / `<C-k>` | 插入非常用字符 参考: [Tip 17 非常用字符插入](https://xu3352.github.io/linux/2018/10/16/practical-vim-skills#tip17)
`<C-r>{register}` | 插入指定 `{register}` 的内容  参考:[Tip 15 插入模式下寄存器粘贴](https://xu3352.github.io/linux/2018/10/16/practical-vim-skills#tip15)

不过在命令模式下只能使用: `<left>` `<right>` 进行移动了

总之, `Ex` 命令可以批量的操作移动, 拷贝之类的, 而不用移动当前的光标 

**手册**:
- *:h {address}*
- *:h ex-cmd-index* 


## Tip 28 区间执行命令
{: #tip28}
> Execute a Command on One or More Consecutive Lines

示例文案: 
```html
<!DOCTYPE html><!-- -->
<html><!-- -->
    <head><title>Practical Vim</title></head><!-- -->
    <body><h1>Practical Vim</h1></body><!-- -->
</html><!-- -->
```

**执行命令示例**:
- `:1` `:print` - 定位到第一行, 然后打印当前行内容
- `:$` `:p` - 定位到最后一行, 然后打印最后一行的内容
- `:3p` - 打印第3行的内容
- `:3d` - 删除第3行内容 (等同于常规模式下`3G`+`dd`的操作)

区间范围操作: `:{start},{end}`
- `:2,5p` - 打印第2~5行的内容
- `:2` `:.,$p` - 光标定位到第2行, 然后把 当前行 到 文件最后一行 打印
- `:%p` - 打印整个文件, 等同于 `:1,$p`
- `:%s/Practical/Pragmatic/` - 全文替换

可视化模式下的区间操作:
- `2G` `VG` - 定位到第二行, `V` 切换为可视化行模式, `G` 定位到文件末尾
- `:` - 这个时候按下 `:` 激活命令模式, 会看到命令行有 `:'<,'>` 字样提示, 即表示可视化的区间
- `:'<,'>p` - 实际上只是输入 `p` 命令, 按回车会把可视化区间的内容打印出来

匹配模式下的区间操作:
- `:/<html>/,/<\/html>/p` - 同样是打印第2行之后的所以内容, 不过是按正则匹配的区间来的

地址偏移的区间操作:
- `:/<html>/+1,/<\/html>/-1p` - 打印3~4行的内容
- `:2` `:.,.+3p` - 打印 当前行~当前行后3行的内容, 即 2~5 行

地址看起来就像 `:{address}+n` 这里的 `{address}` 可以是 行号, 标记, 或者是一个 正则模式; 然后还可以加一个偏移量

区间的写法比较复杂, 这里总结一下:

Symbol | Address
----   | ----
`1`    | 第一行
`$`    | 最后一行
`0`    | 第0行, 第一行的上一行 (`:.copy 0` 试试)
`.`    | 光标所在行:当前行
`'m`   | 标记为 `m` 的行
`'<`   | 可视化模式的 起始位置
`'>`   | 可视化模式的 结束位置
`%`    | 整个文件, 等同于 `:1,$`

## Tip 29 区间复制或移动
{: #tip29}
> Duplicate or Move Lines Using ':t' and ':m' Commands

复制和移动的简写:
- `:t` 为 `:copy` 的简写 
- `:m` 为 `:move` 的简写 

<pre>
Shopping list
    Hardware Store
        Buy new hammer
    Beauty Parlor
        Buy nail polish remover
        Buy nails
</pre>

**复制行的语法** `:[range]copy {address}`

![复制第6行到第二行后面](/assets/archives/20181021124842_vim-duplicate-lines-with-t-command.png)

`:6copy.` 将第6行复制到当前行(第二行)下面

Command    | Effect
----       | ----
`:6t.`     | 将第6行复制到当前行下面
`:t6`      | 将当前行复制到第6行下面
`:t.`      | 当前行复制并粘贴 (等同于常规模式的 `yyp`)
`:t$`      | 复制当前行到最后一行的下面
`:'<,'>t0` | 复制可视化选中的行到第一行上面

`yyp` 和 `:t.` 的区别在于: `yyp` 使用了寄存器, 而 `:t.` 没有

**移动行的语法** `:[range]move {address}`

![可视化选中的行移动](/assets/archives/20181021132604_vim-moving-lines-with-m-command.png)

`Vjj` 使用可视化模式选中第2~4行之后, `:` 启动命令模式, 自动补齐可视化模式的区间 `:'<,'>` 然后输入 `m$` 回车, 即可把选中的行移动到文件最后

重复最后一次 Ex 命令只需要按 `@:` 即可, 后面 [Tip 31](https://xu3352.github.io/linux/2018/10/21/practical-vim-skills-chapter-5#tip31) 将会提到

**手册**:
- *:h :copy*
- *:h :move*


## Tip 30 区间执行常规模式命令
{: #tip30}
> Run Normal Mode Commands Across a Range

语法 `:[range]normal {commands}`

<pre>
var foo = 1
var bar = 'a'
var baz = 'z'
var foobar = foo + bar
var foobarbaz = foo + bar + baz
</pre>

Keystrokes       | Buffer Contents
----             | ----
{start}          | <code class="cursor">v</code>ar foo = 1 <br>var bar = \'a\' <br>var baz = \'z\' <br>var foobar = foo + bar <br>var foobarbaz = foo + bar + baz
`A;<Esc>`        | var foo = 1<code class="cursor">;</code><br>var bar = \'a\' <br>var baz = \'z\' <br>var foobar = foo + bar <br>var foobarbaz = foo + bar + baz
`jVG`            | var foo = 1;<br><code class="visual">var bar = 'a' <br>var baz = 'z' <br>var foobar = foo + bar <br><code class="cursor">v</code>ar foobarbaz = foo + bar + baz </code>
`:'<,'>normal .` | var foo = 1;<br>var bar = \'a\';<br>var baz = \'z\';<br>var foobar = foo + bar;<br>var foobarbaz = foo + bar + baz<code class="cursor">;</code>
{: .table-multi-text}

`:'<,'>normal .` 即表示 可视化区间都执行 常规模式的 `.` 命令, 而上一次的变更则是 在行尾加上 `;`

- `:%normal A;` - 此命令同样可以完成上面的任务; 给每一行末尾加上 `;`
- `:%normal i//` - 给 javscript 所有行都加上注释
- `:normal .` - 当前行执行上一次的变更 (这个就很厉害了)
- `:normal @q` - 当前行执行一次宏, 寄存器 `q` 里存着的一组动作 (<span class="red">这个无敌了</span> 参考:Tip 68)

## Tip 31 重复上次的Ex命令
{: #tip31}
> Repeat the Last Ex command

在第1章的时候我们介绍了 `.` 命令来重复最后的一次变更

而重复最后一次 `Ex` 命令则是 `@:` 

多文件的切换:
- `vim a.txt b.txt c.txt` - 使用vim同时打开3个已存在的文件
- `:bnext` - 切换到下一个文件, 即 *b.txt*
- `@:` - 重复上一次的 `:bnext` Ex 命令, 切换到下一个文件, 即 *c.txt*
- `@@` - 重复上一次的 `@{0-9a-z":*}` 命令(`@:`) , 切换到 *a.txt* (到末尾后切换到第一个)
- `:bprevious` - 切换到上一个文件, 即回到了 *c.txt*
- `@:` - 回到 *b.txt*
- `@@` - 回到 *a.txt*

注意这里的 `@:` 和宏的使用是相似的; `@@` 相当于执行上一次的宏 

不过本示例中, 更好的选项应该是: `<C-o>` 来进行反向跳转; 当我们执行了 `:bnext` 时, 再操作 `<C-o>` 即可返回上一次的文件, 效果相当于 `:bprevious`

`<C-o>` 命令同样适用于 *:next* *:cnext* *:tnext* 等命令 

而执行 Ex 命令后([Tip 27](https://xu3352.github.io/linux/2018/10/21/practical-vim-skills-chapter-5#tip27)), 如果想要撤销, 只需按 `u` 即可

**手册**:
- *:h @:*
- *:h @@*
- *:h CTRL-O*

## Tip 32 Tab补全Ex命令
{: #tip32}
> Tab-Complete Your Ex Commands 

就像在终端下输入命令一样, 输入部分之后, 按 `<Tab>` 就会有补全的提示了, 非常方便

`:col<C-d>` 
<pre>
colder colorscheme
</pre>

`<C-d>` 会提供一个可补全的列表, 这个时候在按下 `<Tab>` 键, 那么补全则依次提示为: *colder* -> *colorscheme* -> *col*  反向循环则为 `<S-Tab>`

`:colorscheme <C-d>`
<pre>
blackboard   desert        morning     shine
blue         elflord       murphy      slate
darkblue     evening       pablo       solarized
default      koehler       peachpuff   torte
delek        mac_classic   ron         zellner
</pre>

这次按下 `<C-d>` 后, 展示的补全列表则是基于 `colorscheme` 命令的候选项, 如果我们想选用 *solarized* 的话, 只需输入 `so` 然后按 `<Tab>` 补全即可

**部分补全示例**:
- *:edit* - 补全当前目录下的文件或目录
- *:write* - 同上
- *:tag* - 补全标签名称
- *:set* - 补全vim的配置选项
- *:help* - 补全手册查询命令

定制补全建议 *wildmode* 参数:

*bash* 设置:
<pre>
set wildmode=longest,list
</pre>

*zsh* 设置:
<pre>
set wildmenu
set wildmode=full
</pre>

启用 *wildmenu* 选项后, vim 会提供一个建议的列表, 然后可以通过:
- `<Tab>` / `<C-n>` or `Right` - 向后选择补全
- `<S-Tab>` / `<C-p>` or `Left` - 向前选择补全

**手册**:
- *:h c_CTRL-D*
- *:h :command-complete* 
- *:h 'wildmode'* 


## Tip 33 命令行插入当前词
{: #tip33}
> Insert the Current Word at the Command Prompt

`<C-r><C-w>` 可以把光标处的词拷贝到命令行里来, 字符比较多的话就比较省时间了

<pre>
var tally;
for (tally=1; tally <= 10; tally++) {
  // do something with tally
};
</pre>

Keystrokes         | Buffer Contents
----               | ----
{start}            | var <code class="cursor">t</code>ally;<br>for (tally=1; tally <= 10; tally++) {<br>&nbsp;&nbsp;// do something with tally<br>};
`*`                | var <code class="visual">tally</code>;<br>for (<code class="visual"><code class="cursor">t</code>ally</code>=1; <code class="visual">tally</code> <= 10; <code class="visual">tally</code>++) {<br>&nbsp;&nbsp;// do something with <code class="visual">tally</code><br>};
`cw`counter`<Esc>` | var <code class="visual">tally</code>;<br>for (counte<code class="cursor">r</code>=1; <code class="visual">tally</code> <= 10; <code class="visual">tally</code>++) {<br>&nbsp;&nbsp;// do something with <code class="visual">tally</code><br>};
{: .table-multi-text}

最后光标停留在 `counter` 最后位置, 然后 `:%s//<C-r><C-w>/g` 就能看到 `:%s//counter/g` 

**命令行扩展**:
- `<C-r><C-w>` - 把光标处的 word 放到命令行
- `<C-r><C-a>` - 把光标处的 WORD 放到命令行
- `<C-r><C-l>` - 把光标所在行内容都放到命令行

比如在查看 *.vimrc* 文件时, 使用 *:h `<C-r><C-w>`* 把光标处的 word 拿到此处, 查看文档是不是很方便

**手册**:
- *:h word*
- *:h WORD*
- *:h c_CTRL-R_CTRL-W*

## Tip 34 调用历史命令
{: #tip34}
> Recall Commands from History

- `:`   - 然后按 `<Up>` 或 `<Down>` 可选择全部历史命令
- `:h ` - 然后按 `<Up>` 或 `<Down>` 可选择以 `:h ` 开始的历史命令
- `/`   - 然后按 `<Up>` 或 `<Down>` 可选择搜索的历史命令

**命令行窗口**

假如们正在写一个 *Ruby* 脚本, 每当我们修改东西之后都想看下运行看效果, 那么:
- `:write` - 保存文件
- `:!ruby %` - 用 *ruby* 执行本文件的内容 (`%` 表示当前文件名)

当我们反复上面的过程几次后, 我们想通过管道把两个命令合并成一个来执行:
- `:write | !ruby %` 

两个命令都已经在历史清单里了, 我们不用再去敲一遍, 那么入合并呢? 

- `q:` - 调出命令行窗口 (*:h cmdwin*)
- `k` / `j` - 在命令窗口 *往上* / *往下* 移动(`{motion}`) 来查历史命令
- `<CR>` - 找到我们想要的命令后, 按 <kbd>Enter</kbd> 即可执行此 *Ex* 命令
- `:q` - 退出命令窗口

命令窗口里是可以编辑历史命令的: 先按 `q:` 调出命令窗口

Keystrokes        | Buffer Contents
----              | ----
{start}           | <code class="cursor">w</code>rite<br>!ruby %
`A␣|<Esc>`        | write <code class="cursor">|</code><br>!ruby %
`J`               | write \|<code class="cursor">&nbsp;</code>!ruby %
`:s/write/update` | update \|<code class="cursor">&nbsp;</code>!ruby %
{: .table-multi-text}

编辑完成后按下 `CR` 回车即可执行刚刚编辑好的 `:update | !ruby %` 组合命令

3种唤起命令窗口的方式:

Command | Action
----    | ----
`q:`    | 打开历史命令窗口
`q/`    | 打开搜索的历史命令窗口
`<C-f>` | 命令模式下可按 <kbd>Ctrl + f</kbd> 切换到命令窗口

## Tip 35 执行Shell命令 
{: #tip35}
> Run Commands in the Shell

在命令模式下, 我们可以在前面加一个 `!` 叹号来调用 `shell` 中的外部程序

**查看当前目录文件列表** `:!ls` 
<pre>
duplicate.todo         loop.js
emails.csv             practical-vim.html
foobar.js              shopping-list.todo
history-scrollers.vim  
</pre>

按下 <kbd>Enter</kbd> 或 命令继续

注意是 `:!ls` 而不是 `:ls`, 后者是 *vim* 内置命令, 查看当前打开了哪些文件列表的

命令行中的 `%` 表示当前文件名, 比如我们前面的示例命令 `:!ruby %`

执行一次 *shell* 命令的语法为 `:!{cmd}`

执行多次 *shell* 命令的语法为 `:shell`

**先执行命令进入到终端** `:shell` 
```bash
$ pwd
/Users/drew/books/PracticalVim/code/cmdline_mode
$ ls
duplicate.todo         loop.js
emails.csv             practical-vim.html
foobar.js              shopping-list.todo
history-scrollers.vim  
$ exit
```
`exit` 退出后重新回到当前 *vim* 编辑器

**Vim 后台执行**: 此方式比 `:shell` 方式要方便一点
- `<C-z>` 会把 *vim* 挂起, 然后切换到终端
- `jobs` 可查看后台的任务列表
- `fg %num` 可切换到挂起的任务

**使用缓冲区的内容进行标准输入或输出**:
- `:read !{cmd}` - 把 *cmd* 执行的结果(标准输出)写入当前文件(缓冲区) 如: `:read !ls`
- `:write !{cmd}` - 和上面相反, 把当前文件(缓冲区)内容当做标准输入传给了 *cmd* 命令 ([Tip 46](https://xu3352.github.io/linux/2018/10/25/practical-vim-skills-chapter-7#tip46))

`!` 符号的位置不同有不同的含义:
- `:[range]write !sh` - 把缓冲区当做标准输入传给了 *sh* 命令
- `:[range]write ! sh` - 同上
- `:[range]write! filename` - 表示把 *filename* 内容强制覆盖掉; 相当于内容另存为一个文件

**来个示例** *:[range]write !{cmd}*

假如文件的 *395* 行是如下内容:
<pre>
ls -lth index.md
</pre>

输入命令将看到如下结果 `:395write !sh`
<pre>
:395write !sh
-rw-r--r--  1 xuyinglong  staff   460B 10 22 10:34 index.md

Press ENTER or type command to continue
</pre>

这里还有个非常好的示例: *批量修改文件后缀*  [:h rename-files](http://vimhelp.appspot.com/tips.txt.html#rename-files)

**通过外部命令过滤缓冲区的内容**

语法 `:{range}![!]{filter} [!][arg]`

`:1,10!grep hello` 表示把第 *1~10* 行中, 包含有 *hello* 字符的保留下来

**重新排序示例**: 按第2列的 *last name* 进行排序
<pre>
first name,last name,email
john,smith,john@example.com
drew,neil,drew@vimcasts.org
jane,doe,jane@example.com
</pre>

`:2,$!sort -t',' -k2`
<pre>
first name,last name,email
jane,doe,jane@example.com
drew,neil,drew@vimcasts.org
john,smith,john@example.com
</pre>

*sort* 命令的 `-t','` 表示按 `,` 号进行切分; `-k2` 表示按第2列进行排序

当我们先过滤内容时, `!{motion}` 可以快速的帮我们设置号区间

假如光标处于第2行时, 按下 `!G` , 命令行将给我们设置区间 `:.,$!` 只需要敲剩下的 `{filter}` 命令即可

**汇总一下最有用的几种调用外部命令的用法**:

Command                | Effect
----                   | ----
`:shell`               | 开启一个 *shell* 终端 (输入 *exit* 命令后返回到 *vim*)
`:!{cmd}`              | 执行 *{cmd}* 命令
`:read !{cmd}`         | 执行 *{cmd}* 命令, 把返回内容插入到当前行下面
`:[range]write !{cmd}` | 区间行作为标准输入传给 *{cmd}* 命令执行
`:[range]!{filter}`    | 按 *{filter}* 命令过滤指定的区间内容

*本小节的信息量比较大, 不过功能却是相当的强悍!!!*

**手册**:
- *:h :!*
- *:h cmdline-special*
- *:h filename-modifiers* - 文件名修饰语, 比如: *文件名* *文件路径* *文件后缀* 等
- *:h :shell*
- *:h :read!* 
- *:h :write_c* 
- *:h rename-files*
- *:h :range!* - 缓冲区过滤
- *:h !*

## Tip 36 批量执行多个Ex命令
{: #tip36}
> Run Multiple Ex Commands as a Batch

当大批量的命令需要复用的时候, 这个时候可以做成一个脚本!

**把链接里的文本内容和链接提取出**:
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
</ol>
```

目标效果:
<pre>
Show invisibles: http://vimcasts.org/episodes/show-invisibles/
Tabs and Spaces: http://vimcasts.org/episodes/tabs-and-spaces/
</pre>

**方式1: Ex命令一个一个敲**

<pre>
➾ :g/href/j
➾ :v/href/d
❮ 8 fewer lines
➾ :%norm A: http://vimcasts.org
➾ :%norm yi"$p
➾ :%s/\v^[^\>]+\>\s//g
</pre>

**详解**:
- `:g/href/j` - 全局模式搜索 *href* 的行, 然后执行命令 *j* 合并(*join*)行
- `:v/href/d` - 全局模式搜索非 *href* 的行, 然后执行命令 *d* 删除行 (提示少了8行)
- `:%norm A: http://vimcasts.org` - 行执行常规模式命令 *A*, 然后追加域名前缀 
- `:%norm yi"$p` - 执行常规模式命令 *yi"$p*, 把超链接进行复制, 然后定位到行尾进行粘贴
- `:%s/\v^[^\>]+\>\s//g"` - 执行正则替换, 把标签(后面还有个空格)删除掉, 剩下目标文本

**方式2: 把Ex命令写到脚本里进行调用**:

脚本: `batch.vim`
```vim
global/href/join
vglobal/href/delete
%normal A: http://vimcasts.org
%normal yi"$p
%substitute/\v^[^\>]+\>\s//g
```

首先要去掉命令行 `:` 前缀, 然后尽量用全命令(非简写)书写脚本, 增加可读性

调用方式 `:source batch.vim`  如果想撤销更新, 按一次 `u` 即可

**方式3: 脚本批量处理多文件**: 同时编辑3个文件

```bash
$ pwd
~/dnvim2/code/cmdline_mode
$ ls vimcasts
episodes-1.html episodes-2.html episodes-3.html
$ vim vimcasts/*.html
```

*One by One* 执行:
<pre>
➾ :args
❮ [vimcasts/episodes-1.html] vimcasts/episodes-2.html vimcasts/episodes-3.html
➾ :first
➾ :source batch.vim
➾ :next
➾ :source batch.vim
</pre>

<span class="red">一条命令搞定</span> `:argdo source batch.vim`

**手册**:
- *:h :global*
- *:h :vglobal*
- *:h source*
- *:h :argdo*


---
参考:
- [Linux的bg和fg命令- huxuanhui的空间 - OSChina - 开源中国](https://my.oschina.net/huxuanhui/blog/13844)

