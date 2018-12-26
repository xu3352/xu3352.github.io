---
layout: post
title: "Vim实用技巧进阶(第17章:Quickfix编译代码和导航错误) - Practical.Vim.2nd.Edition"
keywords: "vim,practical-vim,quickfix,实用技巧"
description: "Practical.Vim.2nd.Edition 实用技巧进阶 第17章:Quickfix编译代码和导航错误"
tagline: "Tip 105~108"
date: '2018-12-21 10:06:14 +0800'
category: linux
tags: vim practical-vim linux
---

> {{ page.description }}

# 第17章 Quickfix编译代码和导航错误
> Compile Code and Navigate Errors with the Quickfix List

Vim 的 Quickfix 列表是一项核心功能, 它允许我们把外部的工具集成到我们的工作流程中. 最简单的, 它维护一些列带注释的地址, 包括文件名, 行号和消息. 传统上讲, 这些地址是编译器生成的错误消息列表, 但是它们也可以是来自语法检查器, linter, 或其他工具输出的警告

我们将从查看示例工作流程开始: 在外部 shell 中运行 *make* 并手动导航到错误信息. 然后我们将介绍 `:make` 命令, 了解如何通过解析编译器中的错误信息, 并用 quickfix 列表来进行导航来简化我们的工作流程

[Tip 106 查看Quickfix列表](#tip106), 示例提供了最有用的导命令来导航 `:make` 产生的结果. 然后在 [Tip 107 调用上次的Quickfix列表](#tip107), 我们将了解到 quickfix 自己的 undo(撤销) 命令

在 [Tip 108 自定义外部的编译器](#tip108) 中, 我们将介绍配置 Vim 所需的步骤, 以便调用 `:make` 通过 JSLint 放置 JavaScript 文件的内容, 从而生成 quickfix 可导航的列表

## Tip 105 在Vim内编译代码
{: #tip105}
> Compile Code Without Leaving Vim

从 Vim 外部调用编译器使我们不必离开编译器\-\-如果编译器产生了任何错误, Vim 提供了快速跳转的方法

#### 准备
> Preparation

下面将使用一个小的 C 语言程序作为示例. [源码下载地址](http://127.0.0.1:4000/assets/archives/20181106092815_dnvim2-code.zip). 在 Shell 终端中, 切换到 *code/quickfix/wakeup* 目录:
<pre>
➾ $ cd code/quickfix/wakeup
</pre>

你需要 gcc 来构建这个程序, 但不要认为你需要安装一个编译器来遵循这个技巧. 此处的工作流程展示了最初构思 quickfix 列表的任务(及其名称的由来). 我们很快就会看到, 此功能还有许多其他用途

#### Shell编译项目
> Compile the Project in the Shell

这个 wakeup 程序包含了: Makefile, wakeup.c 和 wakeup.h 3个文件. 在终端下, 我们可以使用 make 命令进行编译:
```bash
➾ $ make
 ❮ gcc -c -o wakeup.o wakeup.c
   wakeup.c:68: error: conflicting types for ‘generatePacket’
   wakeup.h:3: error: previous declaration of ‘generatePacket’ was here
   make: *** [wakeup.o] Error 1
```

编译器有助于报告一些错误. 在终端打印此信息非常号, 但是我们现在需要导航到每个错误, 以便我们可以在 Vim 中修复它

#### Vim内编译项目
> Compile the Project from Inside Vim

我们还可以直接在 Vim 内部来构建项目. 首先需要确保在 *code/quickfix/wakeup* 目录下, 并且需要包含 *Makefile* 文件, 然后按以下方式启动 Vim:
```bash
❮ $ pwd; ls 
   ~/code/quickfix/wakeup 
   Makefile wakeup.c wakeup.h

➾ $ vim -u NONE -N wakeup.c
```

在 Vim 内部, 就可以直接运行 `:make` 命令了:
```vim
➾ :make
 ❮ gcc -c -o wakeup.o wakeup.c
   wakeup.c:68: error: conflicting types for ‘generatePacket’
   wakeup.h:3: error: previous declaration of ‘generatePacket’ was here
   make: *** [wakeup.o] Error 1
   Press ENTER or type command to continue
```

得到的结果和终端运行 make 命令是一样的\-\-除了 Vim 对输出做了一些聪明的事情. Vim 不仅仅是回显 make 的输出结果, 而会解析每一行, 提取文件名, 行号和错误信息. 对于每个警告, Vim 会在 quickfix 列表创建一条记录. 所以, 我们可以在这些记录中前后导航, 并且 Vim 可以跳转到错误信息的具体行. 正如 Vim 的 quickfix 的文档(参考 *:h quickfix*)所说: 可以加快 修改-编译-修改 的流程 (\"speed up the edit-compile-edit cycle.\")

但我们运行 `:make` 命令后, Vim 会跳转到 quickfix 列表的第一条记录上. 本示例中, 我们可以看到光标跳转到了 wakeup.c 文件的如下位置:
```c
void generatePacket(uint8_t *mac, uint8_t *packet)
{
  int i, j, k;
  k = 6;

  for (i = 0; i <= 15; i++)
  {
    for (j = 0; j <= 5; j++, k++)
    {
      packet[k] = mac[j];
    }
  }
}
```

错误信息提示为: \"conflicting types for \'generatePacket\'.\". 我们可以运行 *:cnext* 命令跳转到下一个错误位置:
```c
void generatePacket(char *, char *);
```

这就解释了为什么编译器报错了: 文件中此函数的签名与实现中的签名不匹配. 我们把头文件的此函数参数改为 *uint8_t* 类型:
```c
void generatePacket(uint8_t *, uint8_t *);
```

然后保存文件, 再次调用 `:make` 命令:
```vim
➾ :write
➾ :make
 ❮ gcc -c -o wakeup.o wakeup.c
   gcc -o wakeup wakeup.o
```

这次程序编译成功了. 而 quickfix 列表也更新到了最后一次 make 调用的输出结果. 没有错误信息, 所以光标保持不变

#### 别忘记这个
> Don't Lose the Place

当我们运行 `:make` 命令时, Vim 会自动跳转到第一个错误的地方(除非没有错误). 如果我们希望光标保留在原地, 我们可以运行:
```vim
➾ :make!
```

末尾的 `!` 字符告诉 Vim 仅更新 quickfix 列表, 而不进行跳转. 假设现在我们运行了 `:make`, 然后发现我们应该使用 `:make!`, 那么该如何回到运行 `:make` 之前的位置呢? 很简单: `<C-o>` 命令就可以跳回跳转列表(jump list)的前一个位置. 更多信息请参考 [Tip 56 遍历跳转列表](https://xu3352.github.io/linux/2018/10/30/practical-vim-skills-chapter-9#tip56) 

## Tip 106 查看Quickfix列表
{: #tip106}
> Browse the Quickfix List

*quickfix* 列表包含一个或多个文件的位置集合. 每个记录可能是编译器在运行 `:make` 时报告的错误内容, 也可能是来自运行 `:grep` 的搜索匹配. 无论列表怎么生成, 我们都必须能够浏览这些记录. 本篇技巧中, 我们将回顾一下浏览 quickfix 列表的方法

完整的导航 quickfix 列表的命令可以参考文档 *:h quickfix*, 以下的表格将展示一些最有用的命令

Command     | effect
----        | ----
:cnext      | 跳转到 下个项目
:cprev      | 跳转到 上个项目
:cfirst     | 跳转到 第一个项目
:clast      | 跳转到 最后一个项目
:cnfile     | 跳转到 下个文件的第一个项目
:cpfile     | 跳转到 上个文件的最后一个项目
:cc N       | 跳转到 第N个 项目
:copen      | 打开 quickfix 窗口
:cclose     | 关闭 quickfix 窗口
:cdo {cmd}  | quickfix 列表里的 每一行 都执行 {cmd} 命令
:cfdo {cmd} | quickfix 列表里的 每个文件 都执行一次 {cmd} 命令
{: .table-multi-text}

他们都是以 `:c` 开头. 而位置列表有整套相似的命令, 都是以 `:l` 开头, 例如: `:lnext`, `:lprev` 等等. `:ll N` 命令是跳转位置列表的 第N个 位置

#### 位置列表
> Meet the Location List

对于填充 quickfix 列表的每个命令, 都有一个变体将结果放入位置列表中. 在 `:make`, `:grep` 和 `:vimgrep` 使用 quickfix 列表的同时, `:lmake`, `:lgrep` 和 `:lvimgrep` 使用位置列表. 那么它们有什么区别呢? 不管任何时候, 都只有一个 quickfix 列表存在, 但位置列表却可以被创建多个

假设我们按照 [Tip 108 自定义外部的编译器](#tip108) 的步骤, 以便在 JavaScript 文件中运行 `:make` 通过 JSLint 传递文件的内容. 现在假设我们在拆分的窗口分别打开了两个不同的 JavaScript 文件. 我们运行 `:lmake` 来编译当前活动窗口的内容, 那么它将会把全部错误信息都存到位置列表中. 然后我们切换到另一个切分的窗口再次执行 `:lmake`, Vim 会新建一个位置列表, 而不是替换已有的. 这样我们就有两个位置列表, 每个都保存着各自 JavaScript 文件错误的信息

与位置列表交互的任何命令(`:lnext`, `:lprev`等)都将作用于绑定到当前活动窗口的列表. 将其与 Vim 全局都可用的 quickfix 列表相比: 无论哪个 Tab 页或窗口是活动的, 当执行 `:copen` 时, quickfix 窗口都将展示相同的列表内容

#### Quickfix基础移动
> Basic Quickfix Motions

我们可以执行 `:cnext` 和 `:previous` 命令来向前和向后遍历整个的 quickfix 列表项. 如果我们想跳转到列表的起始和结束位置, 那么可以执行 `:cfirst` 和 `:clast` 命令. 这4个命令将被频繁使用. 所以给它们都映射为快捷键来方便使用就是个好想法. 那么可以参考 [Tip 37 用缓冲区列表跟踪到文件](https://xu3352.github.io/linux/2018/10/23/practical-vim-skills-chapter-6#tip37) 里的快捷键映射设置

#### Quickfix快进/快退
> Quickfix Fast Forward/Rewind

`:cnext` 和 `:cprev` 都可以加一个数字的前缀. 一个一个的进行查看 quickfix 列表就太慢了, 例如一次性跳5个项目:
<pre>
➾ :5cnext
</pre>

假设正在浏览 quickfix 列表, 而此文件有10多个匹配的地方, 但是都不是我们感兴趣的, 这种情况下, 我们可以一次性跳转到下个文件的第一个条记录, 这个命令就是 `:cnfile`. 其相反的命令为 `:cpfile`, 它可以直接跳转到上个文件的最后一条记录

#### 使用Quickfix窗口
> Use the Quickfix Window

我们可以使用 `:copen` 来打开 quickfix 窗口来查看其列表内容. 这个窗口看起来和普通的 Vim 缓冲区一样. 我们可以使用 `k` 和 `j` 进行上下移动, 甚至还可以使用 Vim 的搜索功能

但 quickfix 窗口有自己特殊的行为. 如果我们把光标停留在某一行, 然后按下 `<CR>` 回车键, 那么此行对应的文件将会被打开, 而光标会定位到对应的匹配的位置. 该文件通常在 quickfix 窗口正上方的窗口打开, 但是如果该文件已经在当前标签页的窗口中打开, 则该缓冲区将被重用

请注意, quickfix 窗口中的每一行对应 quickfix 列表中的记录. 如果我们运行 `:cnext`, 那么光标位置将在 quickfix 窗口向下移动一行, 即使该窗口未激活. 相反, 如果我们使用 quickfix 窗口跳转到 quickfix 列表中的项目, 那么下次运行 `:cnext` 时, quickfix 窗口将会选中之前选中的后一条项目. 从 quickfix 窗口选择项目类似于运行 `:cc [nr]` 命令, 但它是可视化的

当 quickfix 窗口激活时, 我们可以运行 `:q` 命令来关闭它. 但如果是其他窗口激活时, 也可以使用 `:cclose` 来关闭 quickfix 窗口


## Tip 107 调用上次Quickfix列表
{: #tip107}
> Recall Results from a Previous Quickfix List

当我们更新 quickfix 列表时, Vim 不会覆盖以前的内容. 它保存了旧的 quickfix 列表的结果, 允许我们返回它们

我们可以运行 `:colder` 命令来恢复到老版本的 quickfix 列表(Vim 保留了最后的10个列表). 相反, 运行 `:cnewer` 则可以从较老的版本切换到较新的版本. 注意, `:colder` 和 `:cnewer` 都可以带一个数字参数, 代表命令将会被执行多少次

如果我们运行 `:colder` 或 `:cnewer` 之后打开 quickfix 窗口, 它的状态栏将展示生成该列表的命令

你可以认为 `:colder` 和 `:cnewer` 就好比 quickfix 列表的 撤销和重做(undo and redo). 此外, 我们可以不用重复调用 `:make` 或 `:grep` 命令, 因为可以直接拉取上次执行的结果(除非文件发生了变化). 这个可以节省时间, 尤其是在命令需要较长时间运行时


## Tip 108 自定义外部的编译器
{: #tip108}
> Customize the External Compiler

Vim 的 `:make` 命令不仅限于调用外部 make 程序; 他可以执行你机器上的任何编译器(请注意, Vim 对 "编译器" 的定义可能比你习惯的更宽松; 参考 [compiler和make不仅适用于编译语言](#compiler和make不仅适用于编译语言)). 本小节中, 我们将设置 `:make` 命令, 以便它通过 JSLint 传递 JavaScript 文件, 然后使用输出结果来填充 quickfix 列表

首先需要配置 Vim, 以便运行 `:make` 调用 [nodelint](https://github.com/tav/nodelint), 一个 [JSLint](http://jslint.com/) 命令行的界面. 它依赖于 Node.js, 只需要运行以下命令就可以使用 NPM 进行安装:

```bash
➾ $ npm install nodelint -g
```

作为测试用例, 我们将使用 FizzBuzz 的 JavaScript 实现:

*quickfix/fizzbuzz.js*
```js
var i;
for (i=1; i <= 100; i++) {
    if(i % 15 == 0) {
        console.log('Fizzbuzz');
    } else if(i % 5 == 0) {
        console.log('Buzz');
    } else if(i % 3 == 0) {
        console.log('Fizz');
    } else {
        console.log(i);
    }
};
```

#### 配置make调用Nodelint
> Configure ‘:make’ to Invoke Nodelint

`'makeprg'` 设置允许我们指定在运行 `:make` 时调用的程序(参考 *:h \'makeprg\'*). 指定 Vim 运行 nodelint 如下:
```vim
➾ :setlocal makeprg=NODE_DISABLE_COLORS=1\ nodelint\ %
```

`%` 符号表示当前文件的路径. 所以我们正在编辑 *~/quickfix/fizzbuzz.js* 文件, 那么在 Vim 里运行 `:make` 则相当于在终端执行的命令:
```bash
➾ $ export NODE_DISABLE_COLORS=1
➾ $ nodelint ~/quickfix/fizzbuzz.js
❮ ~/quickfix/fizzbuzz.js, line 2, character 22: Unexpected '++'. for (i=1; i <= 100; i++) {
~/quickfix/fizzbuzz.js, line 3, character 15: Expected '===' ... if(i % 15 == 0) {
   ~/quickfix/fizzbuzz.js, line 5, character 21: Expected '===' ...
   } else if(i % 5 == 0) {
   ~/quickfix/fizzbuzz.js, line 7, character 21: Expected '===' ...
   } else if(i % 3 == 0) {
   ~/quickfix/fizzbuzz.js, line 12, character 2: Unexpected ';'.
   };
   5 errors
```

默认情况下, nodelint 使用ANSI颜色编码显示红色错误. 设置 *NODE_DISABLE_COLORS=1* 会屏蔽颜色, 这样可以更轻松地解析错误信息

接下来, 我们需要让 Vim 解析来自 nodelint 的输出, 以便它可以从输出结果中构建一个 quickfix 列表. 有2种方式可以解决这个问题: 一种是可以配置 nodelint, 使其输出类似于 make 生成的错误消息; 另一种是教 Vim 如何解析 nodelint 的默认输出. 我们将使用后一种技术

#### Nodelint输出来填充Quickfix
> Populate the Quickfix List Using Nodelint’s Output

`'errorformat'` 选项可以让 Vim 知道如何解析 `:make` 生成的结果(参考 *:h \'errorformat\'*). 可以运行以下命令检查默认值:
```vim
➾ :setglobal errorformat?
❮ errorformat=%*[^"]"%f"%*\D%l: %m,"%f"%*\D%l: %m, ...[abridged]...
```

如果你熟悉C语言的 scanf 函数, 那么这种格式就能看懂了. 每个带 `%` 前缀的字母都有特殊的含义: `%f` 表示文件名, `%l` 表示行号, `%m` 表示错误信息. 完整的列表请参考 *:h errorformat*

要解析 nodelint 的输出结果, 我们可以按下面的设置:
```vim
➾ :setlocal efm=%A%f\,\ line\ %l\,\ character\ %c:%m,%Z%.%#,%-G%.%#
```

现在, 当运行 `:make` 时, Vim 将会使用上面的格式对 nodelint 的输出结果进行解析. 每个警告都会提取出文件名, 行号和列号来生成一条 quickfix 列表的一个地址. 这样, 我们就可以使用命令(参考 [Tip 106 查看Quickfix列表](#tip106))在这些警告之间进行跳转了

#### 一个命令设置makeprg和errorformat
> Set Up ‘makeprg’ and ‘errorformat’ with a Single Command

`'errorformat'` 字符串不是我们想要提交给内存的东西. 相反, 可以将它保存到文件中, 然后使用 `:compiler` 命令来激活, 设置 `'makeprg'` 和 `'errorformat'` 选项的便捷快捷方式如下(参考 *:h :compiler*):
```vim
➾ :compiler nodelint
```

`:compiler` 命令可以激活编译插件, 它已设置 `'makeprg'` 和 `'errorformat'` 选项来运行和解析 nodelint. 它大致相当于下面的配置:

*quickfix/ftplugin.javascript.vim*
```vim
setlocal makeprg=NODE_DISABLE_COLORS=1\ nodelint\ %

let &l:efm='%A'
let &l:efm.='%f\, '
let &l:efm.='line %l\, '
let &l:efm.='character %c:'
let &l:efm.='%m' . ','
let &l:efm.='%Z%.%#' . ','
let &l:efm.='%-G%.%#'
```

编译器插件的内部结构更精细, 但这是已经很相近了. 通过运行以下命令, 你可以熟悉 Vim 分发的编译器插件:

```vim
➾ :args $VIMRUNTIME/compiler/*.vim
```

注意, Vim 没有附带 nodelint 编译器插件, 但是我们可以轻松[安装一个](https://github.com/bigfish/vim-nodelint).  如果我们想始终使用 nodelint 作为 JavaScript 文件的编译器. 那么可以使用自动命令或文件类型插件来实现:
```vim
autocmd FileType javascript compiler nodelint
```

#### compiler和make不仅适用于编译语言
> ‘:compiler’ and ‘:make’ Are Not Just for Compiled Languages

`make` 和 `compile` 两个词在编译的编程语言的上下文中具有特定的含义. 但在 Vim 中, 相应的 `:make` 和 `:compile` 命令具有更灵活的定义, 使它们适用于解释语言和标记格式. 

例如, 在处理 LaTeX 文档时, 我们可以配置 Vim, 以便 `:make` 命令可以将 `.tex` 文件编译为PDF. 或者如果我们使用 JavaScript 等解释语言, 我们可以通过 JSLint 或其他语法检查器运行 `:make` 来编译我们的源代码. 或者, 我们可以设置 `:make` 以便它运行测试套件(test suite)

在 Vim 术语中, 编译器可以是任何的外部程序, 它可以解析我们的文档并生成错误和警告列表信息. `:make` 命令只是简单的调用外部的编译器, 然后解析输出结果并构造一个可导航的 quickfix 列表


