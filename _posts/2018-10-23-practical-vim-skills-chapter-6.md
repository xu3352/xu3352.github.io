---
layout: post
title: "Vim实用技巧进阶(第6章:管理多个文件) - Practical.Vim.2nd.Edition"
keywords: "vim,practical-vim,files,管理多个文件,实用技巧"
description: "Practical.Vim.2nd.Edition 实用技巧进阶: 第6章-管理多个文件"
tagline: 'Tip 37~41'
date: '2018-10-23 11:21:46 +0800'
category: linux
tags: vim practical-vim linux
---
> {{ page.description }}

# 第6章 管理多个文件
> Manage Multiple Files

实际上是对 *缓冲区* 列表的管理

## Tip 37 用缓冲区列表跟踪到文件
{: #tip37}
> Track Open Files with the Buffer List

**理解文件和缓冲区的区别**:

当我们用其他编辑器打开文件/修改/保存时; 我们通常说我们正在编辑 *文件*, 而实际并不是这样的

我们操作的实际上是文件在内存里的展示, 用 *vim* 的术语叫做 `缓冲区`

区别:
- `文件` file 存储在磁盘上
- `缓冲区` buffer 加载在内存里

用 *vim* 打开一个文件时, 文件的内容会加载到内存的 *缓冲区*, 我们的编辑等操作实际上是对 *缓冲区* 进行的修改, 当我们执行保存操作时, 实际上是把 *缓冲区* 的内容回写入到了 *文件* 里

*vim* 大部分都是在 *缓冲区* 上面操作的, 也有少部分是直接操作文件, 比如: *:write* *:update* *:saveas* 

**缓冲区列表**: *code/files* 目录下有两个文件: *a.txt* *b.txt*

```
➾ $ cd code/files
➾ $ vim *.txt
❮ 2 files to edit

➾ :ls
❮ 1 %a "a.txt" line 1
  2    "b.txt" line 0

➾ :bnext
➾ :ls
❮ 1 #  "a.txt" line 1
  2 %a "b.txt" line 1
```

- `:ls` - 查看当前 *缓冲区* 列表
- `%` - 表示当前正在编辑的 *缓冲区* 
- `#` - 表示备用的 *缓冲区*, 即上次编辑过的 *缓冲区*, 可使用 `<C-r>` 快速切换

**使用缓冲区列表**:

- *:bprev* *:bnext* 缓冲区上一个/下一个
- *:bfirst* *:blast* 缓冲区第一个/最后一个

可以映射为快捷键: 
```vim
nnoremap <silent> [b :bprevious<CR>
nnoremap <silent> ]b :bnext<CR>
nnoremap <silent> [B :bfirst<CR>
nnoremap <silent> ]B :blast<CR>
```

需要注意的是, *vim* 有好多命令已经使用 `[` 和 `]` 为前缀了, 可以在小节后面查下手册

由于 `:ls` 已经给每个缓冲区加了一个编号, 所以可以使用 
- `:buffer N` - 切换到第 *N* 个缓冲区
- `:buffer {bufname}` - 按关键词匹配进行切换, 如果匹配到多个, 可以使用 `<Tab>` 补全 ([Tip 32](https://xu3352.github.io/linux/2018/10/21/practical-vim-skills-chapter-5#tip32))
- `:bufdo {cmd}` - 可对所有的缓冲区执行 *Ex* 命令; 实际中 `:argdo` 可能更实用些 ([Tip 38](#tip38))

**删除缓冲区**: 
- `:bdelete N1 N2 N3` - 按编号删除 如: `:bd 5 6 7 9 10` 删除 5~10, 除了8 的缓冲区
- `:N,M bdelete` - 按区间删除 如: `:5,10bd` 删除 5~10 的缓冲区

 *缓冲区* 的删除并不会影响到文件本身; 不过编号需要通过 `:ls` 来查看

**手册**:
- *:h :ls*
- *:h [*
- *:h :b*
- *:h :bufdo*
- *:h :bdelete*

## Tip 38 用参数列表将缓冲区分组
{: #tip38}
> Group Buffers into a Collection with the Argument List

```
➾ $ cd code/files/letters
➾ $ vim *.txt
❮ 5 files to edit

➾ :args
❮ [a.txt] b.txt c.txt. d.txt e.txt
```

*code/files/mvc* 目录结构
<pre>
app.js
index.html
app/
  controllers/
    Mailer.js
    Main.js
    Navigation.js
  models/
    User.js
  views/
    Home.js
    Main.js
    Settings.js
lib/
  framework.js
  theme.css
</pre>

**填充参数列表**:
语法 `:args {arglist}`

*1.按文件名列表* 
<pre>
➾ $ cd code/files/mvc
➾ $ vim
➾ :args index.html app.js
➾ :args
❮ [index.html] app.js
</pre>

*2.用通配符匹配* 

Glob            | Files Matching the Expansion
----            | ----
`:args *.*`     | index.html <br>app.js
`:args **/*.js` | app.js <br>lib/framework.js <br>app/controllers/Mailer.js <br>...etc
`:args **/*.* ` | app.js <br>index.js <br>lib/framework.js <br>lib/theme.css <br>app/controllers/Mailer.js <br>...etc
{: .table-multi-text}

多组通配匹配也是支持的 `:args **/*.js **/*.css`

**3.用反引号**:

`files/.chapters`
<pre>
the_vim_way.pml
normal_mode.pml
insert_mode.pml
visual_mode.pml
</pre>

<code class="highlighter-rouge">:args `cat .chapters`</code> 通过 *.chapters* 文件内容当做参数传给 *:args* 命令

**手册**:
- *:h :args_f*
- *:h wildcard*
- *:h starstar-wildcard*
- *:h backtick-expansion*

## Tip 39 管理隐藏文件
{: #tip39}
> Manage Hidden Files

```
➾ $ cd code/files
➾ $ ls
❮ a.txt b.txt
➾ $ vim *.txt
❮ 2 files to edit
我们在 a.txt 里随便改下, 先不要保存, 然后查看 缓冲区 列表

➾ :ls
❮ 1 %a + "a.txt" line 1
  2      "b.txt" line 0
可以看到 a.txt 前面多了一个 + 标识, 这个表示有未保存的变更
如果我们这个时候保存文件, 那么 + 标识就会消失; 不过我们一会儿在保存, 继续下面的测试

➾ :bnext
❮ E37: No write since last change (add ! to override)
在没有保存的情况下会有错误提示, 命令后加 ! 忽略提示

➾ :bnext!
➾ :ls
❮ 1 #h + "a.txt" line 1
  2 %a   "b.txt" line 1
```

加上 `!` 标识可以强制切换缓冲区, 使用 `:ls` 查看缓冲区, 可以看到 *b.txt* 已经被标记为激活状态, 而 *a.txt* 则被标记为带 *h* 的隐藏状态

**退出时处理隐藏的缓冲区**:

<pre>
➾ :quit
❮ E37: No write since last change (add ! to override)
  E162: No write since last change for buffer "a.txt"
</pre>

因为有未保存的缓冲区, 所以会有错误警告提醒, 要么把未保存的缓冲区保存(*:write*), 要么撤销变更(*:edit!*)

Command    | Effect
----       | ----
`:w[rite]` | 缓冲区写入磁盘, 即存文件
`:e[dit]!` | 重写从磁盘加载内容到缓冲区, 即撤销全部更改
`:qa[ll]!` | 关闭所有窗口, 忽略所有变更 并湖绿警告提醒
`:wa[ll] ` | 所有更新写入磁盘

**执行 `:*do` 命令前启用隐藏选项**:

默认情况下, 如果 *缓冲区* 有未保存的修改, 如果使用: *:next!* *:bnext!* *:cnext!* 等不加 `!` 标识命令时, *vim* 都会有 *No write since last change* 字样的错误提示, 多数情况这个提示很有用, 但部分情况除外

考虑到命令: `:argdo` `:bufdo` `:cfdo` 等命令的执行过程如下:

<pre>
➾ :first
➾ :{cmd}
➾ :next
➾ :{cmd}
❮ etc.
</pre>

如果 *缓冲区* 列表有为保存的修改, 那么 `:*do` 命令也会有错误提示

`:set hidden` 开启隐藏设置后, 我们可以使用不带 `!` 标识的命令而不会有警告了, 这个时候用 `:*do` 等命令就很好用了

`:set nohidden` 可以改回默认值

**手册**:
- *:h 'hidden'*

## Tip 40 窗口切分
{: #tip40}
> Divide Your Workspace into Split Windows

在Vim的术语中, 窗口(window)指是 *缓冲区* 的可视化窗口(viewport)

Vim 允许我们切分工作区来展示多个 *缓冲区*

**创建切分窗口**:

- `<C-w>s` - 水平(上下)切分
- `<C-w>v` - 垂直(左右)切分

![窗口切分](http://p9fggfk3y.bkt.clouddn.com/20181024022816_vim-split-windows.png){:width="80%"}

Command            | Effect
----               | ----
`<C-w>s`           | 水平(上下)切分; 可使用 `:edit {filename}` 加载其他文件
`<C-w>v`           | 垂直(左右)切分
`:sp[lit] {file}`  | 水平(上下)切分, 加载 *{file}* 到新建的窗口
`:vsp[lit] {file}` | 垂直(左右)切分, 加载 *{file}* 到新建的窗口

**窗口之前的切换**:

Command  | Effect
----     | ----
`<C-w>w` | 循环切换
`<C-w>h` | 切换到 左 侧窗口
`<C-w>j` | 切换到 下 侧窗口
`<C-w>k` | 切换到 上 侧窗口
`<C-w>l` | 切换到 右 侧窗口

实际上, `<C-w><C-w>` 跟 `<C-w>w` 效果是一样的

同样的, 上面表格里的也是一样的, 比如按住 <kbd>Ctrl</kbd> 然后按 <kbd>wj</kbd>

如果终端支持鼠标或你使用 *GVim*, 那么可以用鼠标激活窗口, 如果不好使, 请查看  *:h 'mouse'*

- `:set mouse=` - 禁用鼠标
- `:set mouse=a` - (GUI默认选项)鼠标支持, 可以用鼠标点击激活窗口, 滚动操作等

**关闭窗口**:

Ex Command | Normal Command | Effect
----       | ----           | ----
`:clo[se]` | `<C-w>c`       | 关闭当前活动的窗口
`on[ly]`   | `<C-w>o`       | 只保留活动的窗口, 关闭其他的

**窗口重新排列/大小调整**:

Keystrokes  | Buffer Contents
----        | ----
`<C-w>=`    | 宽高平局分配
`<C-w>_`    | 当前窗口 高度 调到最大
`<C-w>|`    | 当前窗口 宽度 调到最大
`[N]<C-w>_` | 当前窗口 高度 设置为 10行
`[N]<C-w>|` | 当前窗口 宽度 设置为 10列
`<C-w>[n]-` | 当前窗口 高度 -n 个单位
`<C-w>[n]+` | 当前窗口 高度 +n
`<C-w>[n]>` | 当前窗口 宽度 +n
`<C-w>[n]<` | 当前窗口 宽度 -n

*GUI* 的可以直接使用鼠标拖动窗口中间的线调整窗口大小

窗口移动的可以参考 *:h window-moving*

**手册**:
- *:h window*
- *:h window-move-cursor*
- *:h 'mouse'*
- *:h window-resize*
- *:h window-moving*

## Tip 41 标签页安排窗口布局
{: #tip41}
> Organize Your Window Layouts with Tab Pages

通常的 *IDE* 的标签页一般都是左侧有个边栏, 然后点击左侧边栏对应的文件, 标签页就会新打开一个该文件对应的窗口; 标签页就代表了当前哪些文件是打开的

但 *vim* 不是这样, 一个标签页是可以开启多个 *缓冲区* 列表的, 如下图所示:

![Vim Tab页窗口](http://p9fggfk3y.bkt.clouddn.com/20181024044839_vim-tab-pages.png){:width="100%"}

**如何使用标签页**

*vim* 的标签页通常被用于工作区来使用; `:lcd {path}` 可以为当前窗口设置工作目录

如果我们新建了一个标签页, 然后用 `:lcd` 命令切换到另一个目录, 那么我们可以将每个标签页配置为不同的项目

注意: `:lcd` 命令只对当前 *缓冲区* 窗口生效

如果想对 标签页内的其他切分的缓冲区窗口生效, 可以用: `:windo lcd {path}` 设置

**打开/关闭标签页**

Command                 | Effect
----                    | ----
`:tabe[dit] {filename}` | 新建一个标签页
`<C-w>T`                | 把当前窗口移动到新建的标签页
`:tabc[lose]`           | 关闭标签页 (所有窗口都关掉)
`:tabo[nly]`            | 只保留当前标签页, 其他标签页关不关掉

**标签页切换**

标签页编号是从 1 开始的

Ex Command       | Normal Command | Effect
----             | ----           | ----
`:tabn[ext] {N}` | `{N}gt`        | 切换到第 {N} 个标签页
`:tabn[ext]`     | `gt`           | 切到下一个标签页
`:tabp[revious]` | `gT`           | 切到上一个标签页

**标签页重新排列**

语法 `:tabmove [N]` 

如果 *[N]* 值为0, 表示把当前标签页移动到第一个位置; 如果参数省略, 那么默认移动到最后

如果使用 *GVim* 的话, 可以使用鼠标进行拖拽来重新编排顺序

**手册**:
- *:h tabpage*
- *:h CTRL-W_T*

