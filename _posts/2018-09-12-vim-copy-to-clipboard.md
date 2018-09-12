---
layout: post
title: "Vim拷贝字符到剪贴板"
tagline: ""
description: "vim里某些情况下想拷贝文字到剪贴板, 用鼠标和剪贴板都感觉不方便... 不能 `yw` 直接拷贝一个单词到剪贴板么?"
date: '2018-09-12 09:30:45 +0800'
category: linux
tags: vim clipboard linux
---
> {{ page.description }}

Google 一下 `vim yank buffer clipboard`:
> 1. Put `set clipboard=unnamed` in your `vimrc`.
> 1. Select what you want to `copy` in Visual mode (Press `v` to enter).
> 1. Back to Normal mode (Press `escape[esc]`), press `y` to copy.
> 1. If you want to paste something from OS's clipboard, press `p/P` in Vim Normal mode.

# 是否支持剪贴板
```bash
# 剪贴板是否支持 (带 + 号的是支持的)
$ vim --version | grep clipboard
+clipboard
```
如果不支持的话, 可以先卸载, 然后重新安装一下`vim`, 不过 `brew install vim` 安装的好像默认就是支持的吧

对源码安装感兴趣的可以参考一下:[Mac源码安装vim 支持python2/3,lua,ruby,perl解释器](https://xu3352.github.io/mac/2018/07/22/vim-install-from-so    urce-on-mac-support-python2-python3-lua-ruby-perl)

# 开启/禁用剪贴板
1. 手动开启(推荐, 按需开启/禁用)
    - 打开文件: `vim filename`
    - 切换到命令模式: `ESC` + `:`
    - 输入 `set clipboard` 可以查看当前状态 (`set cli` + `TAB`可以自动补齐的)
    - 输入 `set clipboard=unnamed` 开启剪贴板功能
    - 输入 `set clipboard=` 停用剪贴板功能

2. 编辑文件时默认开启
    - 在 `~/.vimrc` 文件里设置 `set clipboard=unnamed` 
    - 临时禁用/开启方式同上; 每次默认是开启的 (有时也不一定方便的)

---
参考：
- [How to copy to clipboard in Vim?](https://stackoverflow.com/questions/3961859/how-to-copy-to-clipboard-in-vim)
- [Mac源码安装vim 支持python2/3,lua,ruby,perl解释器](https://xu3352.github.io/mac/2018/07/22/vim-install-from-source-on-mac-support-python2-python3-lua-ruby-perl)

