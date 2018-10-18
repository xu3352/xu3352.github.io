---
layout: post
title: "vim-easy-align 表格格式化/对齐插件"
tagline: ""
description: "非常强大的对齐格式化插件; 对于编辑 `Markdown` 的 `table` 来说简直就是量身定制神器 <br>支持的分隔符: `<Space>` `=` `:` `.` `|` `&` `#` `,`"
date: '2018-10-18 11:34:59 +0800'
category: linux
tags: vim-plugin vim linux
---
> {{ page.description }}

# 安装
`vundle` 方式安装: `vim ~/.vimrc`

```vim
" 找到 call vundle#begin() 和 call vundle#end() 之间插入 
plugin 'junegunn/vim-easy-align'


" 然后直接在 vim 里用命令方式安装
:source %
:plugininstall


" 文件末尾增加配置
" start interactive easyalign in visual mode (e.g. vipga)
xmap ga <plug>(easyalign)

" start interactive easyalign for a motion/text object (e.g. gaip)
nmap ga <plug>(easyalign)
```

# 常规用法
示例: 这里的 `{separator}` 分隔符为 `=`

<pre>
apple   =red
grass+=green
sky-=   blue
</pre>

对齐效果: `vipga=` 或 `gaip=`
<pre>
apple  = red
grass += green
sky   -= blue
</pre>

键入: `vipga=`

| `vip` | `v`isual-select `i`nner `p`aragraph | 可视化模式选中一段文本
| `ga`  | Start EasyAlign command (`ga`)      | 激活对齐插件
| `=`   | Align around `=`                    | 按 `=` 号对齐

键入: `gaip=`

| `ga` | Start EasyAlign command (`ga`) | 激活对齐插件
| `ip` | for `i`nner `p`ar:graph        | 行内段落
| `=`  | Align around `=`               | 按 `=` 号对齐

# Markdown表格对齐

先来感受一下强大的气息:
![Table对齐](https://raw.githubusercontent.com/junegunn/i/master/easy-align/tables.gif){:width="100%"}

动手试验:
<pre>
| Option| Type | Default | Description |
|--|--|--|--|
| threads | Fixnum | 1 | number of threads in the thread pool |
|queues |Fixnum | 1 | number of concurrent queues |
|queue_size | Fixnum | 1000 | size of each queue |
|   interval | Numeric | 0 | dispatcher interval for batch processing |
|batch | Boolean | false | enables batch processing mode |
 |batch_size | Fixnum | nil | number of maximum items to be assigned at once |
 |logger | Logger | nil | logger instance for debug logs |
</pre>

左对齐: `vipga*|`
<pre>
| Option     | Type    | Default | Description                                    |
| --         | --      | --      | --                                             |
| threads    | Fixnum  | 1       | number of threads in the thread pool           |
| queues     | Fixnum  | 1       | number of concurrent queues                    |
| queue_size | Fixnum  | 1000    | size of each queue                             |
| interval   | Numeric | 0       | dispatcher interval for batch processing       |
| batch      | Boolean | false   | enables batch processing mode                  |
| batch_size | Fixnum  | nil     | number of maximum items to be assigned at once |
| logger     | Logger  | nil     | logger instance for debug logs                 |
</pre>

右对齐: `vipga<Enter>*|`
<pre>
|     Option |    Type | Default |                                    Description |
|         -- |      -- |      -- |                                             -- |
|    threads |  Fixnum |       1 |           number of threads in the thread pool |
|     queues |  Fixnum |       1 |                    number of concurrent queues |
| queue_size |  Fixnum |    1000 |                             size of each queue |
|   interval | Numeric |       0 |       dispatcher interval for batch processing |
|      batch | Boolean |   false |                  enables batch processing mode |
| batch_size |  Fixnum |     nil | number of maximum items to be assigned at once |
|     logger |  Logger |     nil |                 logger instance for debug logs |
</pre>

居中对齐: `vipga<Enter><Enter>*|`
<pre>
|   Option   |  Type   | Default |                  Description                   |
|     --     |   --    |   --    |                       --                       |
|  threads   | Fixnum  |    1    |      number of threads in the thread pool      |
|   queues   | Fixnum  |    1    |          number of concurrent queues           |
| queue_size | Fixnum  |  1000   |               size of each queue               |
|  interval  | Numeric |    0    |    dispatcher interval for batch processing    |
|   batch    | Boolean |  false  |         enables batch processing mode          |
| batch_size | Fixnum  |   nil   | number of maximum items to be assigned at once |
|   logger   | Logger  |   nil   |         logger instance for debug logs         |
</pre>

就是这么强大!!!

# 高级用法
激活插件后的交互示例:

| Keystrokes   | Description                        | 等价的命令            | 描述                            |
| `<Space>`    | Around 1st whitespaces             | `:'<,'>EasyAlign\`    | 第一个空格分隔                  |
| `2<Space>`   | Around 2nd whitespaces             | `:'<,'>EasyAlign2\`   | 第二个空格分隔                  |
| `-<Space>`   | Around the last whitespaces        | `:'<,'>EasyAlign-\`   | 最后一个空格分隔                |
| `-2<Space>`  | Around the 2nd to last whitespaces | `:'<,'>EasyAlign-2\`  | 倒数第二个空格分隔              |
| `:`          | Around 1st colon (key: value)      | `:'<,'>EasyAlign:`    | 第一个 `:` 分隔                 |
| `<Right>:`   | Around 1st colon (key : value)     | `:'<,'>EasyAlign:>l1` | 同上, 分隔符会对齐              |
| `=`          | Around 1st operators with =        | `:'<,'>EasyAlign=`    | 第一个 `=` 分隔                 |
| `3=`         | Around 3rd operators with =        | `:'<,'>EasyAlign3=`   | 第三个 `=` 分隔                 |
| `*=`         | Around all operators with =        | `:'<,'>EasyAlign*=`   | 所有的 `=` 分隔                 |
| `**=`        | Left-right alternating around =    | `:'<,'>EasyAlign**=`  | `=` 先左->右对齐,然后交错对齐   |
| `<Enter>=`   | Right alignment around 1st =       | `:'<,'>EasyAlign!=`   | 第一个 `=` 前的右对齐, 其他不变 |
| `<Enter>**=` | Right-left alternating around =    | `:'<,'>EasyAlign!**=` | `=` 先右->左对齐,然后交错对齐   |

话说后面3个尝试了多遍, 前面有点懵圈... 后来搞懂了... (可以用上面的表格示例动手操作)

**详解**:
- `{separator}` - 分隔符  常用的有: `<Space>` `=` `:` `.` `|` `&` `#` `,` 
- `n{separator}` - 应用到第 `n` 个分隔符, 负数表示倒着数
- `<Enter>` - 回车控制对齐方向, 默认为左对齐; 1个回车右对齐; 2个回车居中对齐; 3个回车回到左对齐; 依次类推...
- `*{separator}` - 一个星号 + 分隔符表示 应用到所有的分隔符
- `**{separator}` - 2个星号表示交替对齐: 第一列右对齐, 第二列左对齐, 第三列右对齐, 以此类推...
- `<Enter>**{separator}` - 回车 + 2个星号 也是交替对齐: 第一列左对齐, 第二列右对齐, 第三列左对齐, 以此类推...
- `Markdown` 表格的分隔符为竖线: `|` 

# 表格格式化宏
表格对齐目前是我需求量最大的, 所以录制了一个宏, 以后就非常方便了: 

<span class="red">录制宏写法</span>: `q[name]{actions}q`   调用宏: `@[name]`

<span class="red">表格格式化对齐宏-录制</span>: `qtvipga*|q`

<span class="red">表格格式化对齐宏-使用</span>: `@t`

另外 分隔符 是支持正则的, 激活插件后也有好些快捷键支持, 更多的还是看后面的文档吧, 里面有很多图文示例 :) 

如果觉得好用, 可以去GitHub上给作者点赞

---
参考：
- [vim-easy-align - Vim Awesome](https://vimawesome.com/plugin/vim-easy-align)
- [vim easy-align插件使用- juandx - 博客园](https://www.cnblogs.com/juandx/p/5630837.html)
- [GitHub - junegunn/vim-easy-align: A Vim alignment plugin](https://github.com/junegunn/vim-easy-align)

