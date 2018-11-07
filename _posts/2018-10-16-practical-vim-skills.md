---
layout: post
title: "Vim实用技巧进阶(第1~3章:介绍,常规模式,插入模式) - Practical.Vim.2nd.Edition"
tagline: "Tip 1~19"
keywords: "vim,practical-vim,vim介绍,常规模式,插入模式"
description: "Practical.Vim.2nd.Edition 实用技巧进阶:第1~3章 - 介绍,常规模式,插入模式"
date: '2018-10-16 15:47:05 +0800'
category: linux
tags: vim practical-vim linux
---
> {{ page.description }}

# 约定
## 一般按键说明

按键         | 说明
`x`          | 按下 `x` 字母
`dw`         | 依次按下 `d` 和 `w` 字母
`dap`        | 依次按下 `d` `a` `p` 字母
`<C-n>`      | 同时按下 `<Ctrl>` + `n` 字母
`g<C-]>`     | 先按下 `g`, 然后同时按下 `<Ctrl>` + `]`
`<C-r>0`     | 同时按下 `<Ctrl>` + `r`, 然后按下 `0`
`<C-w><C-=>` | 先同时按下 `<Ctrl>` + `w`, 然后再同时按下 `<Ctrl>` + `=`

## 替代字符

按键                                          | 说明
`f{char}`                                     | 按下 `f` + 其他任何字符
<code class="highlighter-rouge">`{a-z}</code> | 按下 <code class="highlighter-rouge">`</code> + 任意小写字母
`m{a-zA-Z}`                                   | 按下 `m` + 任意大小写字母
`d{motion}`                                   | 按下 `d` + `motion` 命令 (比如:`2h`, `2j`, `5w` 参考:[Vim编辑器导航基础](https://xu3352.github.io/linux/2017/09/02/Linux-101-Hacks-Chapter-2-Essential-Linux-Commands-part-2#23-vim%E7%BC%96%E8%BE%91%E5%99%A8%E5%AF%BC%E8%88%AA%E5%9F%BA%E7%A1%80) )
`<C-r>{register}`                             | 同时按下 `<Ctrl>` + `r`, 然后接 `{register}` 寄存器


## 特殊的按键

按键      | 说明
`<Esc>`   | `Escape` 键
`<CR>`    | 回车键 (同 `<Enter>`)
`<Ctrl>`  | `Control` 键
`<Tab>`   | `Tab` 键
`<Shift>` | `Shift` 键
`<S-Tab>` | 同时按下 `<Shift>` + `<Tab>` 键
`<Up>`    | 向上健
`<Down>`  | 向下健
`␣`       | 空格键 <code class="highlighter-rouge" style="font-size:20px;"> ␣ </code>


# 第1章 VIM之路
> The Vim Way

## Tip 1 点命令
{: #tip1}
> Meet the Dot Command

`.` 命令 重复上一次更改操作, vim里最强大和常用的命令

## Tip 2 不要重复
{: #tip2}
> Don’t Repeat Yourself

尽量减少移动步骤

复合命令 | 等同写法 | 作用
`C`      | `c$`     | 删除光标到行末, 进入插入模式
`s`      | `cl`     | 删除光标处字符, 进入插入模式
`S`      | `^C`     | 删除当前行, 进入插入模式
`I`      | `^i`     | 光标定位到行首, 进入插入模式
`A`      | `$a`     | 光标定位到行尾, 进入插入模式
`o`      | `A<CR>`  | 向下插入一行, 进入插入模式
`O`      | `ko`     | 向上插入一行, 进入插入模式

## Tip 3 退一步,跳三步
{: #tip3}
> Take One Step Back, Then Three Forward

尽量使动作可重复
```javascript
// 修改前
var foo = "method("+argument1+","+argument2+")";

// 修改目标:就是格式化一下嘛; 4个"+"号左右都加空格
var foo = "method(" + argument1 + "," + argument2 + ")";
```

Keystrokes    | Buffer Contents
{start}     | <code class="cursor">v</code>ar foo = \"method(\"+argument1+\",\"+argument2+\")\";
`f+`          | var foo = \"method(\"<code class="cursor">+</code>argument1+\",\"+argument2+\")\";
`s`␣+␣`<Esc>` | var foo = \"method(\" +<code class="cursor">&nbsp;</code>argument1+\",\"+argument2+\")\";
`;`           | var foo = \"method(\" + argument1<code class="cursor">+</code>\",\"+argument2+\")\";
`.`           | var foo = \"method(\" + argument1 +<code class="cursor">&nbsp;</code>\",\"+argument2+\")\";
`;.`          | var foo = \"method(\" + argument1 + \",\" +<code class="cursor">&nbsp;</code>argument2+\")\";
`;.`          | var foo = \"method(\" + argument1 + \",\" + argument2 +<code class="cursor">&nbsp;</code>\")\";


1. 这里使用 `f+` (`f{char}`模式) 快速定位到单个字符 `+`;
1. 然后 `s␣+␣<Esc>` 删掉当前字符后切换为插入模式, 并输入 `␣+␣` , 再切换为常规模式;
1. 然后 `;` 重复上次的查找动作, 定位到下一个 `+` 号上面;
1. 然后 `.` 重复上次替换变更的动作;
1. 再按两次 `;.` 组合即可完成后面的2个 `+` 的替换 

## Tip 4 动作,重复动作,相反动作
{: #tip4}
> Act, Repeat, Reverse

意图              | 动作                    | 重复动作 | 反转(撤销)
修改              | {edit}                  | `.`      | `u`
行内搜索字符:往后 | `f{char}`/`t{char}`     | `;`      | `,`
行内搜索字符:往前 | `F{char}`/`T{char}`     | `;`      | `,`
文件匹配:往后     | `/patterm<CR>`          | `n`      | `N`
文件匹配:往前     | `?patterm<CR>`          | `n`      | `N`
替换操作          | `:s/target/replacement` | `&`      | `u`
一些列动作(宏)    | `qx{changes}q`          | `@x`     | `u`

宏在某些时候非常好使!

## Tip 5 手动查找和替换
{: #tip5}
> Find and Replace by Hand

示例文案: "content" 出现在了每一行
<pre>
...We're waiting for content before the site can go live...
...If you are content with this, let's go ahead with it...
...We'll launch as soon as we have the content...
</pre>

这里我们想把部分的 "content" 替换为 "copy", 当然可以使用:
`:%s/content/copy/gc` 达到效果, 这里我们选择手动的方式  

Keystrokes      | Buffer Contents
{start}       | ...We're waiting for content before the site can go live...<br>...If you are <code class="cursor">c</code>ontent with this, let's go ahead with it...<br>...We'll launch as soon as we have the content...
`*`             | ...We're waiting for `content` before the site can go live...<br>...If you are `content` with this, let's go ahead with it...<br>...We'll launch as soon as we have the <code class="highlighter-rouge"><code class="cursor">c</code>ontent</code>...
`cw`copy`<Esc>` | ...We're waiting for `content` before the site can go live...<br>...If you are `content` with this, let's go ahead with it...<br>...We'll launch as soon as we have the cop<code class="cursor">y</code>...
`n`             | ...We're waiting for <code class="highlighter-rouge"><code class="cursor">c</code>ontent</code> before the site can go live...<br>...If you are `content` with this, let's go ahead with it...<br>...We'll launch as soon as we have the copy...
`.`             | ...We're waiting for cop<code class="cursor">y</code> before the site can go live...<br>...If you are `content` with this, let's go ahead with it...<br>...We'll launch as soon as we have the copy...
{:table-multi-text}


**步骤**:
- 先将光标定位到第二行的 content 位置
- `*` - 往后搜索光标所在的 content, 并将光标定位到下一个找到的位置
- `cwcopy<Esc>` - `cw` 删除光标位置的词并切换到插入模式, 替换为 `copy` 单词后切换为常规模式
- `n` - 继续上次搜索内容, 由于最后一行的已经替换掉了, 所以从首行往后匹配, 定位到第一行的内容
- `.` - 重复上一次的替换动作, 把第一行的内容也替换掉

## Tip 6 一键完成
{: #tip6}
> Meet the Dot Formula

> One Keystroke to Move, One Keystroke to Execute <br/>
> 一键[查找]移动, 一键[替换]执行

动作尽量精简, 后续相同的动作尽量做到 `一键完成` 的效果

# 第2章 常规模式
> Normal Mode

常规模式是 `Vim` 默认的状态

## Tip 7 三思而后行
{: #tip7}
> Pause with Your Brush Off the Page

动手之前可以先思考一下

## Tip 8 大步撤销
{: #tip8}
> Chunk Your Undos

在我们进行修改之后, 可以按 `u` 进行撤销上一次的更改

上一次更改: 基本上就是2个常规模式之间的内容变更 

所以我们在修改东西的时候可以尽量一直保持在插入模式下, 如果我们先全部重来, 只需要按 `<Esc>u` 即可

- `A` - 光标定位到当前行末尾, 状态切换为插入模式
- `<Esc>o` - 换行并切换为插入模式
- `u` - 撤销上一次变更
- `<C-r>` - `u` 的后悔药
- `U` - 撤销最后一行的更改; 按2次就是回到原始状态

更多可查看手册: `:h u`

## Tip 9 撰写可重复的更改
{: #tip9}
> Compose Repeatable Changes

重复性的动作尽量可以用: `.` 替代

## Tip 10 简单计算
{: #tip10}
> Use Counts to Do Simple Arithmetic 

示例文案:
<pre>
.blog, .news { background-image: url(/sprite.png); }
.blog { background-position: 0px 0px }
</pre>

最后增加一行:
<pre>
.news { background-position: -180px 0px }
</pre>

Keystrokes | Buffer Contents
{start} | .blog, .news { background-image: url(/sprite.png);  }<br><code class="cursor">.</code>blog { background-position: 0px 0px  }
`yyp` | .blog, .news { background-image: url(/sprite.png);  }<br>.blog { background-position: 0px 0px  }<br><code class="cursor">.</code>blog { background-position: 0px 0px  }
`cw`.news`<Esc>` | .blog, .news { background-image: url(/sprite.png);  }<br>.blog { background-position: 0px 0px  }<br>.new<code class="cursor">s</code> { background-position: 0px 0px  }
`180<C-x>` | .blog, .news { background-image: url(/sprite.png);  }<br>.blog { background-position: 0px 0px  }<br>.news { background-position: -18<code class="cursor">0</code>px 0px  }

- `<C-x>` - 数字相减
- `<C-a>` - 数字相加 (容易和 tmux 快捷键冲突)
- `<C-r>={expression}` - 计算 {表达式} 的值 (加减乘除表达式)

手册: `:h ctrl-x` `:h ctrl-a`

## Tip 11 能重复的就别数数
{: #tip11}
> Don't Count If You Can Repeat

数完估计都操作完了

## Tip 12 动作组合
{: #tip12}
> Combine and Conquer

`Operator + Motion = Action`

- `d{motion}` - 比如:`dl` 删一个符 `daw` 删一个词 `dap` 删一段

手册: `:h operator` `:h motion`

`Operator` 触发操作:

触发 | 效果
`c`  | 修改
`d`  | 删除
`y`  | 复制到寄存器
`g~` | 大小写反转
`gu` | 转小写
`gU` | 转大写
`>`  | 往右缩进
`<`  | 往左缩进
`=`  | 自动缩进
`!`  | 通过外部程序过滤{motion}行

# 第3章 插入模式
> Insert Mode

## Tip 13 插入模式立即更正
{: #tip13}
> Make Corrections Instantly from Insert Mode

插入模式下进行更正:

Keystrokes | Effect
`<C-h>` | 往前删除一个字符
`<C-w>` | 删除一个词
`<C-u>` | 删除一行

**同样适用于 `Bash/Zsh` 等终端操作**

## Tip 14 返回常规模式
{: #tip14}
> Get Back to Normal Mode

Keystrokes | Effect
`<Esc>`    | 切换到常规模式
`<C-[>`    | 切换到常规模式
`<C-o>`    | 切换到插入模式  (`:h i_CTRL-O`)

`zz` 把当前行放到屏幕中间位置; 通常和 `<C-o>zz` 组合使用

## Tip 15 插入模式下寄存器粘贴
{: #tip15}
> Paste from a Register Without Leaving Insert Mode

示例文案: 粘贴一段文字到第二行行末
<pre>
Practical Vim, by Drew Neil
Read Drew Neil's
</pre>

Keystrokes | Buffer Contents
`yt,`      | <code class="cursor">P</code>ractical Vim, by Drew Neil <br/>Read Drew Neil's
`jA␣`      | Practical Vim, by Drew Neil <br/>Read Drew Neil's <code class="cursor">&nbsp;</code>
`<C-r>0`   | Practical Vim, by Drew Neil <br/>Read Drew Neil's Practical Vim<code class="cursor">&nbsp;</code>
`.<Esc>`   | Practical Vim, by Drew Neil <br/>Read Drew Neil's Practical Vim<code class="cursor">.</code>

- `yt,` - 光标到第一个 "," 之间的文本放入寄存器
- `jA␣` - 光标移动到下一行, 然后定位到行末并切换为插入模式, 再输入一个空格
- `<C-r>0` - 插入寄存器 0 里的内容, 即刚刚放到寄存器的内容 (`:h i_CTRL-R`)
- `.<Esc>` - 句号结尾后退出插入模式

## Tip 16 数学计算
{: #tip16}
> Do Back-of-the-Envelope Calculations in Place

文案: 这里我们计算椅子的总价
<pre>
6 chairs, each costing $35, totals $
</pre>

Keystrokes       | Buffer Contents
`A`              | 6 chairs, each costing $35, totals $<code class="cursor">&nbsp;</code>
`<C-r>=6*35<CR>` | 6 chairs, each costing $35, totals $210<code class="cursor">.</code>

## Tip 17 非常用字符插入
{: #tip17}
> Insert Unusual Characters by Character Code

Keystrokes            | Effect
`<C-v>{123}`          | 按十进制代码插入字符 (`<C-v>065` 为 `A`)
`<C-v>u{123}`         | 按十六进制代码插入字符 (`<C-v>u1234` 为 `ሴ`)
`<C-v>{nondigit}`     | 插入非数字字符?
`<C-k>{char1}{char2}` | 插入由 `{char1}{char2}` 组成的复合字符 (`<C-k>13` 为 ⅓)

手册: 
- `:h ga` - 查看光标所在字符的 `Ascii` 值
- `:h i_CTRL-V_digit`

## Tip 18 组合字符插入
{: #tip18}
> Insert Unusual Characters by Digraph

`<C-k>{char1}{char2}` 组合字符

- `<C-k>?I` - `¿`
- `<C-k><<` - `«`
- `<C-k>>>` - `»`
- `<C-k>12` - ½
- `<C-k>14` - ¼
- `<C-k>34` - ¾
- `<C-k>A:` - `Ä`

更多:
- `:h digraphs-default`
- `:h digraph-table`

## Tip 19 覆盖模式
{: #tip19}
> Overwrite Existing Text with Replace Mode

常规模式下按 `R` 即可开启覆盖模式; `r` 仅覆盖一个字符

Keystrokes    | Buffer Contents
{start}       | <code class="cursor">T</code>yping in Insert mode extends the line. But in Replace mode<br>the line length doesn't change.
`f.`          | Typing in Insert mode extends the line<code class="cursor">.</code> But in Replace mode<br>the line length doesn't change.
`R`,␣b`<Esc>` | Typing in Insert mode extends the line, <code class="cursor">b</code>ut in Replace mode<br>the line length doesn't change.


---
参考:
- [Vim编辑器导航基础](https://xu3352.github.io/linux/2017/09/02/Linux-101-Hacks-Chapter-2-Essential-Linux-Commands-part-2#23-vim%E7%BC%96%E8%BE%91%E5%99%A8%E5%AF%BC%E8%88%AA%E5%9F%BA%E7%A1%80)
- [vim中做简单运算](https://blog.csdn.net/a627088424/article/details/39001487)

