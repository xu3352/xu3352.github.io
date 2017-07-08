---
layout: post
title: "IntelliJ IDEA 快捷键(mac版)"
tagline: "工欲善其事"
description: "熟练使用快捷键，可以进一步的提高效率"
date: '2017-07-03 13:56:26 +0800'
category: ide
tags: intellij-idea ide mac
---
> {{ page.description }}

IDEA 支持很多套预定义的快捷键:(设置->Keymap)，默认的是 `Mac OS X 10.5+`
- Mac OS X 10.5+ 
- Mac OS X
- Emacs
- Eclipse
- NetBeans
- JBuilder

可以根据自己的习惯来选择，也可以按自己的喜好来重置某些快捷键，总之很贴心，方便

# Mac键盘符号说明
Mac键盘符号和修饰键说明
- `⌘` Command
- `⇧` Shift
- `⌥` Option
- `⌃` Control
- `↩︎` Return/Enter
- `⌫` Delete
- `⌦` 向前删除键（Fn+Delete）
- `↑` 上箭头
- `↓` 下箭头
- `←` 左箭头
- `→` 右箭头
- `⇞` Page Up（Fn+↑）
- `⇟` Page Down（Fn+↓）
- `Home` Fn + ←
- `End` Fn + →
- `⇥` 右制表符（Tab键）
- `⇤` 左制表符（Shift+Tab）
- `⎋` Escape (Esc)

# Shortcuts 捷径

| 快捷键   | 功能                                   | 说明         |
|---------|----------------------------------------|--------------|
| `⌃⇧Space` | Smart code completion                  | 代码自动补齐 |
| `Double⇧` | Search everywhere                      | 全局搜索     |
| `⌘↩︎     ` | Show intention actions and quick-fixes | 尝试快速修复 |
| `⌘N,^↩︎  ` | Generate code | 生成代码 |
| `⌘P     ` | Parameter info | 参数信息 |
| `⌥⌘↑    ` | Extend selection | 扩展选择 |
| `⌥⌘↓    ` | Shrink selection | 收缩选择 |
| `⌘E     ` | Recent files popup | 近期修改过的文件 |
| `⇧F6    ` | Rename | 重命名 |

# General 常用

| 快捷键   | 功能                                   | 说明         |
|---------|----------------------------------------|--------------|
| `⌘1...⌘9` | Open corresponding tool window   | 开启或关闭对应的工具窗口，使用最多的一般是：`⌘1` 和 `⌘9`   |
| `⌘S     ` | Save all   | 手动保存全部修改，其实不小心关闭了东西也不会丢的      |
| `⌘⌥Y    ` | Synchronize   | 同步      |
| `⌘⇧F12  ` | Toggle maximizing editor  | 编辑窗口最大化、最小化      |
| `⌥⇧I    ` | Inspect current file with current profile   |       |
| `⌃§,⌃`  ` | Quick switch current scheme  | 切换主题、代码样式之类的      |
| `⌘,     ` | Open Settings dialog  | 设置      |
| `⌘;     ` | Open Project Structure dialog | 项目结构窗口      |
| `⌘⇧A    ` | Find Action   | 按行为动作查找      |

# Debugging 调试

| 快捷键   | 功能                                   | 说明         |
|---------|----------------------------------------|--------------|
| `F8 / F7  ` | Step over / into  | 下一步 / 进入方法    |
| `⇧F7 / ⇧F8` | Smart step into / Step out  | 智能进入方法 / 跳出当前方法     |
| `⌥F9      ` | Run to cursor | 执行到光标出     |
| `⌥F8      ` | Evaluate expression    | 计算表达式的值     |
| `⌘⌥R      ` | Resume program    | 恢复执行     |
| `⌘F8      ` | Toggle breakpoint | 断点增加/删除     |
| `⌘⇧F8     ` | View breakpoints  | 查看所有断点     |


# Search / Replace 搜索/替换

内容搜索很强大，可与正则配合查找或者替换，很方便

| 快捷键   | 功能                                   | 说明         |
|---------|----------------------------------------|--------------|
| `Double⇧` | Search everywhere   | 全局搜索     |
| `⌘F     ` | Find   | 文件内查找     |
| `⌘G/⌘⇧G ` | Find next / previous  | 按选择字符查找下一个/上一个     |
| `⌘R     ` | Replace  | 替换字符     |
| `⌘⇧F    ` | Find in path   | 按工作区/项目/路径查找字符串     |
| `⌘⇧R    ` | Replace in path   | 按工作区/项目/路径替换字符串     |
| `^G     ` | Select next occurrence    | 选择下一个所选文本内容，可同时编辑     |
| `^⌘G    ` | Select all occurrences    | 选择全部相同字符的文本内容，可同时编辑     |
| `^G     ` | Unselect occurrence   | 取消批量选择，好像不好使，而且 ESC 就可以取消了     |


# Editing 文本编辑

| 快捷键   | 功能                                   | 说明         |
|---------|----------------------------------------|--------------|
| `^Space ` | Basic code completion | 基础代码完成      |
| `^⇧Space  ` | Smart code completion   | 智能代码完成      |
| `⌘⇧↩ ︎ ` | Complete statement  | 完成语句，会自动加分号等      |
| `⌘P   ` | Parameter info (within method call arguments)   | 参数信息      |
| `^J   ` | Quick documentation lookup  | 文档查看      |
| `⇧F1  ` | External Doc    | 外部文档      |
| `⌘+mouse  ` | Brief Info  | 概要信息      |
| `⌘F1  ` | Show descriptions of error at caret     | 光标处显示错误提醒      |
| `⌘N,^↩  ` | Generate code...    | 生成代码      |
| `^O   ` | Override methods    | 覆盖方法      |
| `^I   ` | Implement methods   | 实现接口方法      |
| `⌘⌥T  ` | Surround with...    | 嵌入代码块，比如：try...catch，for，if 之类的      |
| `⌘/   ` | Comment / uncomment with line comment   | 注释行代码      |
| `⌘⌥/  ` | Comment / uncomment with block comment      | 解开注释      |
| `⌥↑   ` | Extend selection    | 扩展选择      |
| `⌥↓   ` | Shrink selection    | 收缩选择      |
| `^⇧Q  ` | Context info    | 上下文信息      |
| `⌥↩   ` | Show intention actions and quick-fixes      | 快速修复提示      |
| `⌘⌥L  ` | Reformat code   | 重新格式化      |
| `^⌥O  ` | Optimize imports    | 选择性的导入包      |
| `^⌥I  ` | Auto-indent line(s)     | 自动缩进行      |
| `⇥/⇧⇥ ` | Indent / unindent selected lines    | 缩进行/取消缩进      |
| `⌘X   ` | Cut current line to clipboard   | 剪切行到剪贴板，光标所在行什么也没选择的话     |
| `⌘C   ` | Copy current line to clipboard  | 复制行      |
| `⌘V   ` | Paste from clipboard    | 粘贴      |
| `⌘⇧V  ` | Paste from recent buffers...    | 从最近的缓冲区粘贴      |
| `⌘D   ` | Duplicate current line  | 复制行      |
| `⌘⌫   ` | Delete line at caret    | 删除行      |
| `^⇧J  ` | Smart line join     | 多行合并成一行      |
| `⌘↩   ` | Smart line split    | 一行分割为多行      |
| `⇧↩   ` | Start new line  | 新起一行，而不用到行尾再敲回车      |
| `⌘⇧U  ` | Toggle case for word at caret or selected block     | 大小写切换      |
| `⌘⇧]/⌘⇧[ ` | Select till code block end / start  | 代码块选择      |
| `⌥⌦   ` | Delete to word end  | 删除至单词结束处      |
| `⌥⌫   ` | Delete to word start    | 删除至单词开始处      |
| `⌘+/⌘-  ` | Expand / collapse code block    | 折叠/展开代码      |
| `⌘⇧+  ` | Expand all  | 折叠的全部展开      |
| `⌘⇧-  ` | Collapse all    | 全部折叠      |
| `⌘w   ` | Close active editor tab     | 圈闭当前编辑窗口      |


# Refactoring 重构

| 快捷键   | 功能                                   | 说明         |
|---------|----------------------------------------|--------------|
| `F5 `| Copy  | 拷贝      |
| `F6 `| Move  | 移动      |
| `⌘Delete `| Safe Delete | 安全删除      |
| `⇧F6 `| Rename    | 重命名      |
| `^T ` | Refactor this     | 开始重构      |
| `⌘F6 `| Change Signature  |       |
| `⌘⌥N `| Inline    |       |
| `⌘⌥M `| Extract Method    | 重构成方法      |
| `⌘⌥V `| Extract Variable  | 重构成变量      |
| `⌘⌥F `| Extract Field     | 重构成字段      |
| `⌘⌥C `| Extract Constant  | 重构成静态变量      |
| `⌘⌥P `| Extract Parameter | 重构参数列表      |


# Navigation 导航

| 快捷键   | 功能                                   | 说明         |
|---------|----------------------------------------|--------------|
| `⌘O  `  | Go to class | 搜索类      |
| `⌘⇧O `  | Go to file  | 搜索文件      |
| `⌘⌥O `  | Go to symbol    | 搜索符号      |
| `^←/^→` | Go to next / previous editor tab    | 下一个/上一个编辑窗口      |
| `F12 `  | Go back to previous tool window     | 进入到上次的工具窗口      |
| `⎋   `  | Go to editor (from tool window)     |       |
| `⇧⎋  `  | Hide active or last active window   |       |
| `⌘L  `  | Go to line  | 跳转到某行      |
| `⌘E  `  | Recent files popup   | 最近编辑过的文件列表      |
| `⌘⌥←/⌘⌥→ `  | Navigate back / forward |       |
| `⌘⇧⌫ `  | Navigate to last edit location  | 跳转到最后的编辑位置，很有用      |
| `⌥F1 `  | Select current file or symbol in any view   |       |
| `⌘B,⌘Click `  | Go to declaration   | 跳转到定义行      |
| `⌘⌥B `  | Go to implementation(s) | 进入接口实现方法      |
| `⌥Space,⌘Y `  | Open quick definition lookup    |       |
| `^⇧B `  | Go to type declaration  | 跳转到定义的方法      |
| `⌘U `  | Go to super-method / super-class    | 跳转到父级方法/父类      |
| `^↑/^↓ `  | Go to previous / next method    | 方法上一个、下一个      |
| `⌘]/⌘[ `  | Move to code block end / start  | 跳转代码块结束/开始处      |
| `⌘F12  `  | File structure popup    | 文件结构弹框      |
| `^H  `  | Type hierarchy  | 类层次结构      |
| `⌘⇧H `  | Method hierarchy    | 方法调用层次结构      |
| `^⌥H `  | Call hierarchy  | 调用层次结构      |
| `F2/⇧F2 ` | Next / previous highlighted error   | 跳转到下一个错误的地方，可快速定位哪块有错误提示，jsp页面有时候会有误报      |
| `F4/⌘↓ `  | Edit source / View source   | 进入源码文件，比如 svn diff 的时候很方便      |
| `⌥Home `  | Show navigation bar | 展示导航栏      |
| `F3  `  | Toggle bookmark | 设置/取消书签      |
| `⌥F3 `  | Toggle bookmark with mnemonic   |       |
| `^0...^9 `| Go to numbered bookmark | 跳转到书签编号0~9      |
| `⌘F3 `    | Show bookmarks  | 展示书签      |


# Complile and Run 编译和运行

| 快捷键   | 功能                                   | 说明         |
|---------|----------------------------------------|--------------|
| `⌘F9 `  | Make project  |  编译工作区      |
| `⌘⇧F9 ` | Compile selected file, package or module   | 编译文件、包、项目      |
| `^⌥R/D `| Select configuration and run / debug   |  选择性执行      |
| `^R/D ` | Run/Debug | 运行或者 以Debug方式运行      |
| `^⇧R,^⇧D `| Run context configuration from editor | 按上下文配置执行      |


# Usage Search 变量搜索

| 快捷键   | 功能                                   | 说明         |
|---------|----------------------------------------|--------------|
| `⌘F7/⌥F7 `| Find usages / Find usages in file   | 查找哪些地方使用到了      |
| `⌘⇧F7 `   | Highlight usages in file    | 文件内使用到的地方高亮展示      |
| `⌘⌥F7 `   | Show usages | 展示哪里调用过      |


# VCS / Local History 版本控制 / 本地历史

| 快捷键   | 功能                                   | 说明         |
|---------|----------------------------------------|--------------|
| `⌘K `   | Commit project to VCS    | 提交代码      |
| `⌘T `   | Update project from VCS  | 更新代码      |
| `⌘⇧K`   | Push commits | 提交？貌似不好使      |
| `^V `   | VCS quick popup  | VCS操作项目弹框      |


# Live Template  代码块模板

| 快捷键   | 功能                                   | 说明         |
|---------|----------------------------------------|--------------|
| `⌘⇧J`   | Surround with Live Template     | 以模板嵌套，不好使，可以用 `⌘⌥T` 替代    |
| `⌘J`    | Insert Live Template    | 插入模板     |

# 其他

IEDA 非常厉害的一点是：模糊搜索，不管是在工具窗口，代码自动提示时都可以使用

调代码的时候自动提示，然后模糊匹配（前缀，后缀，驼峰式，部分内容匹配等），自动完成，非常爽

常用的快捷键：
- 跳转到最后的编辑位置
- 查看下一个错误位置
- 错误修复建议：这个比 Eclipse 智能许多, 比如创建类，方法，实现接口方法等
- 查看类（类方法）
- 查看方法结构 + 模糊搜索
- 跳转代码块结束/开始处
- 生成代码:构造方法，Getter/Setter，toString等

- 查看本地变更文件
- 更新代码
- 提交代码
- SVN文件对比
- 跳转到源码文件对应位置

`自己用着顺手的工具就是最棒的工具!!!`

---
参考：
- [IntelliJ IDEA For Mac 快捷键](http://wiki.jikexueyuan.com/project/intellij-idea-tutorial/keymap-mac-introduce.html)
- [官方快捷键PDF](https://www.jetbrains.com/idea/docs/IntelliJIDEA_ReferenceCard_Mac.pdf)

