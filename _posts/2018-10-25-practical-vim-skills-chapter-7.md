---
layout: post
title: "Vim实用技巧进阶(第7章:文件打开和存储) - Practical.Vim.2nd.Edition"
keywords: "vim,practical-vim,netrw,文件打开和存储,实用技巧"
description: "Practical.Vim.2nd.Edition 实用技巧进阶: 第7章 - 文件打开和存储"
tagline: "Tip 42~46"
date: '2018-10-25 10:21:15 +0800'
category: linux
tags: vim practical-vim linux
---
> {{ page.description }}

# 第7章 文件打开和存储
> Open Files and Save Them to Disk

## Tip 42 用 :edit 打开文件
{: #tip42}
> Open a File by Its Filepath Using ‘:edit’

语法 `:edit {filepath}` 

*{filepath}* 文件路径可以是绝对路径和相对路径, 相对路径是相对于当前窗口的目录 

演示目录结构 *files/mvc*

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

先用 *vim* 打开 *index.html* 文件
<pre>
➾ $ cd code/files/mvc
➾ $ vim index.html
</pre>

**1.相对于工作目录**:
使用 `:pwd` 可以查看当前工作目录

<pre>
➾ :pwd
❮ /Users/drew/practical-vim/code/files/mvc

➾ :edit lib/framework.js
➾ :edit app/controllers/Navigation.js
</pre>

实际上我们可以使用 `<Tab>` 来补全路径, 比如最后一个文件的操作 `:edit a<Tab>c<Tab>N<Tab>` 

**2.相对于当前文件目录**:

比如我们正在编辑 *app/controllers/Navigation.js* , 然后我们想编辑当前文件目录下的 *Main.js* 文件

- `:edit %<Tab>` - 这里的 `%` 表示当前文件
- `:edit %:h<Tab>` - `:h` 标识符去掉了文件名, 获取到了当前文件的目录
- `:edit app/controllers/` - 上面按下 `<Tab>` 之后的结果, 然后我们输入 *Main.js* 即可

整套下来, 所有的按键结果为 `:edit %:h<Tab>M<Tab><Tab>`

把下面的代码加入到 `~/.vimrc` 
```
cnoremap <expr> %% getcmdtype() == ':' ? expand('%:h').'/' : '%%'
```
然后就可以在命令模式下使用 `%%` 来替代 `%:h<Tab>` , 对于 *:edit* *:write* *:saveas* *:read* 都好使

**手册**:
- *:h cmdline-special* - 命令行里的特殊的符号, 比如 `%` `#` 等
- *:h ::h* - 查看更多的文件标识符, 里面有详细的示例

## Tip 43 用 :find 打开文件
{: #tip43}
> Open a File by Its Filename Using ‘:find’

**准备**:

<pre>
➾ $ cd code/files/mvc
➾ $ vim index.html

➾ :find Main.js
❮ E345: Can't find file "Main.js" in path
</pre>

因为 *Main.js* 不在当前目录下, 所以是不能找到的

**配置 path**:

<pre>
➾ :set path+=app/**
</pre>

`**` 通配符表示匹配 `app/` 目录下的所有子目录

**按名称查找文件**:

比如想编辑文件 *app/controllers/Navigation.js* 
<pre>
:find Navigation.js
</pre>

可以按 `<Tab>` 自动补齐文件名, 上面命令可以改为 `:find nav<Tab>`

那么如果文件重名呢? 例如: `Main.js` 存在于 *app/controllers* 和 *app/views* 目录

```
:find Main.js<Tab>
```

按下 `<Tab>` 键之后就会自动补齐 *./app/controllers/Main.js* 再按 `<Tab>` 就会切换到 `./app/views/Main.js` 

所以重名的文件按 `<Tab>` 键就可以进行选择了

**手册**:
- *:h 'path'*
- *:h file-searching*

## Tip 44 用netrw探索文件系统 
{: #tip44}
> Explore the File System with netrw

`netrw` 是一个 *vim* 自带的浏览文件系统的插件

**准备**:

检查并设置一下 *~/.vimrc* 
<pre>
set nocompatible
filetype plugin on
</pre>

**遇见 netrw - vim自带的文件浏览器**:

<pre>
➾ $ cd code/file/mvc
➾ $ ls
❮ app app.js index.html lib
➾ $ vim .
</pre>

![netrw vim自带的文件浏览器](/assets/archives/20181025082424_vim-netrw-plugin.png){:width="100%"}

**操作**:
- `k` / `j` - 上下移动光标; 其他 `{motion}` 跟 *vim* 里的操作一样
- `<CR>` - 打开光标处的文件/目录; 如果打开的是目录, 打开后将是此录对应的 文件列表
- `-`  减号返回上级目录, 相当于光标在 `..` 然后按回车
- `/html<CR>` - 按 `html` 搜索, 回车后光标会定位到目录位置处

**打开文件管理器**:

语法 `:edit {path}`

打开文件用 *:edit {filename}* 这里把 `{filename}` 改成 `{path}` 文件目录即可

Ex Command | Shorthand | Effect
----       | ----      | ----
`:edit .`  | `:e.`     | 打开文件管理器:当前工作区
`:Explore` | `:E`      | 打开文件管理器:当前窗口的目录

同样的 `:Sexplore` `:Vexplore` 对应水平和竖直切分窗口的文件管理器

**使用切分的窗口**:

经典的 GUI 编辑器都是自带边栏的文件管理器的, 有的更是可以像抽屉一样展开和收起

而 *Vim* 文件管理器(`:E` 或 `:e.`打开) 看起来就会有点奇怪

原因很简单: 它可以很好的与 *切分窗口* 结合起来使用

![netrw 切分窗口文件管理器](/assets/archives/20181025085628_vim-netrw-split-window.png){:width="100%"}

如上图所示, 上面的过程为: 
- 图1 - C窗口 开启 文件管理器
- 图2 - 原来的 C窗口 被文件列表窗口覆盖, 我们这里选择了 *d.txt* 文件
- 图3 - 打开了 *d.txt* 文件, 文件管理器窗口变成了 D窗口 

*思考*: 如果按照经典的边栏文件管理器怎么操作呢? 当我们从 C窗口 切换到边栏文件管理器时, 图1 的 A,B,C 窗口就失去焦点了, 那么边栏的文件管理器究竟应该给哪个窗口打开文件呢?

`<C-^>` 快速重 D窗口 切换回 C窗口

从某种意义上说, *Vim* 的窗口有2中模式: 一个是文件编辑窗口, 一个是文件管理器窗口

这2个窗口都是可以随意的在 *Vim* 里进行切分的, 而这种情况并不太适合边栏文件管理的方式

**netrw 更多操作**:

文件管理器不仅仅可以浏览文件列表, 同样还可以 *创建文件, 创建目录, 文件重命名, 删除文件* 等等

我们甚至还没有接触到此 netrw 的杀手级功能: **通过网络管理文件**  支持多种协议: *scp* *ftp* *curl* 和 *wget* 更多信息请看最后的手册

**手册**:
- *:h :Explore*
- *:h netrw-%*
- *:h netrw-d*
- *:h netrw-rename*
- *:h netrw-del*
- *:h netrw-ref*

## Tip 45 将文件存到不存在的目录
{: #tip45}
> Save Files to Nonexistent Directories

<pre>
➾ :edit madeup/dir/doesnotexist.yet
➾ :write
❮ "madeup/dir/doesnotexist.yet" E212: Can't open file for writing

➾ :!mkdir -p %:h
➾ :write
</pre>

可以看到, 如果新建的文件的路径是不存在的目录时, `:write` 进行保存时会报错的, 所以需要先使用命令来创建目录

**手册**:
- *:h ctrl-G*

## Tip 46 用超级用户存文件 
{: #tip46}
> Save a File as the Super User

<pre>
➾ $ ls -al /etc/ | grep hosts
❮ -rw-r--r-- 1 root wheel 634 6 Apr 15:59 hosts
➾ $ whoami ❮ drew
➾ $ vim /etc/hosts
这里使用 drew 用户进行编辑, 注意这里的 hosts 文件只有只读权限

➾ :write
❮ E45: 'readonly' option is set (add ! to override)

➾ :write!
❮ "/etc/hosts" E212: Can't open file for writing
没有权限, 强制保存也是没有用的

➾ :w !sudo tee % > /dev/null
❮ Password:
   W12: Warning: File "hosts" has changed and the buffer was
   changed in Vim as well
   [O]k, (L)oad File, Load (A)ll, (I)gnore All:
</pre>

使用 *sudo* 提升权限会要求输入密码, 然后会有一个警告提示, 这里推荐选项 *load file*

`:write !{cmd}` 命令把缓冲区的内容作为标准输入传给了指定外部的命令 *{cmd}*; `tee` 命令可以把内容输出到多个文件里, 在使用 *sudo* 提升权限后, 就可以把缓冲区的内容重新写入到 *hosts* 文件

命令模式下的 `%` 表示当前文件, 也就是 */etc/hosts*


**手册**:
- *:h :write_c*
- *:h :_%*

---
- [netrw.vim : Network oriented reading, writing, and browsing (keywords: netrw ftp scp) ](https://www.vim.org/scripts/script.php?script_id=1075)

