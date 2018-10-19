---
layout: post
title: "Emmet-vim - Vim HTML增强插件"
tagline: ""
description: "`Emmet` (前身为 `Zen Coding`) 是一个能大幅度提高前端开发效率的一个工具<br>`emmet-vim` 插件 `Vim` 前端开发必备"
date: '2018-10-19 15:58:14 +0800'
category: linux
tags: emmet vim-plugin vim linux
---
> {{ page.description }}

几个HTML相关 `IDE`: 

IDE              | 特点                                | 语言
`Sublime Text 3` | 小巧+灵活; 最常用的文本编辑器       | 各种脚本语言
`Vim`            | 快+高效+高逼格                      | `markdown` `shell` `python`
`IntelliJ IDEA`  | Java开发, 大项目, 比 Eclipse 更智能 | `Java` `Jsp` `HTML` `Javascript` ...
`WebStorm`       | Web开发                             | `HTML` `Javascript` `Css` ...
`Atom`           | 炫酷                                | 各种脚本语言

前3个日常和开发使用; 后2个体验过

这里重点给大家介绍一下 `emmet-vim` 插件

# 安装
`Vundle` 安装:
```vim
" 找到 call vundle#begin() 和 call vundle#end() 之间插入 
plugin 'junegunn/vim-easy-align'


" 然后直接在 vim 里用命令方式安装
:source %
:plugininstall


" 文件末尾增加配置
" Enable just for html/css/md/markdown
let g:user_emmet_install_global = 0
autocmd FileType html,css,md,markdown EmmetInstall
```

触发快捷键修改可参考文档 [emmet-vim - Vim插件](https://vimawesome.com/plugin/emmet-vim)

# 使用
默认的快捷键: `<C-y>` + `,`  (常规模式 or 可视模式)

感受一下效果图: 可视化模式选中3行文本, `<C-y>`+`,` 触发插件, Tag栏输入: `ul>li*>span>a` 回车
![效果图](https://raw.githubusercontent.com/mattn/emmet-vim/master/doc/screenshot.gif){:width="100%"}

快速上手:

按键:`ul#id>li*3>a`, `<Esc>`, `<C-y>,`
```html
<ul id="id">
    <li><a href=""></a></li>
    <li><a href=""></a></li>
    <li><a href=""></a></li>
</ul>
```

按键:`table.datagrid>tr*3>td*4`, `<Esc>`, `<C-y>,`
```html
<table class="datagrid">
    <tr>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
</table>
```

# 快捷键
**快捷键一览**:

| 选项                         | 快捷键     | 说明
| 1. Expand abbreviation       | `<C-y>,`   | 展开缩写
| 2. Expand word               | `<C-y>;`   | 展开一个词
| 3. Update tag                | `<C-y>u`   | 更新标签
| 4. Wrap with abbreviation    | `v_<C-y>,` | 用缩写包装(可视模式)
| 5. Balance tag inward        | `<C-y>d`   | 选中标签
| 7. Go to next edit point     | `<C-y>n`   | 下一个编辑点
| 8. Go to previous edit point | `<C-y>N`   | 上一个编辑点
| 10. Merge lines              | `<C-y>m`   | 合并多行到一行
| 11. Remove tag               | `<C-y>k`   | 删除标签
| 12. Split/join tag           | `<C-y>j`   | 闭合标签/展开标签
| 13. Toggle comment           | `<C-y>/`   | 注释/解注标签
| 14. Make anchor from URL     | `<C-y>a`   | 根据URL创建一个锚点


手册: `:h emmet`

---
参考：
- [emmet-vim - Vim插件](https://vimawesome.com/plugin/emmet-vim)
- [mattn/emmet-vim - GitHub](https://github.com/mattn/emmet-vim)
- [Emmet.vim 教程 - 陈三](https://blog.zfanw.com/zencoding-vim-tutorial-chinese/)
- [更多缩写示例 - 前端开发必备！Emmet使用手册](https://www.w3cplus.com/tools/emmet-cheat-sheet.html)

