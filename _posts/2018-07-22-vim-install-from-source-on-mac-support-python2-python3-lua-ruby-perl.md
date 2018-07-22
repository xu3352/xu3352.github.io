---
layout: post
title: "Mac源码安装vim 支持python2/3,lua,ruby,perl解释器"
tagline: ""
description: "本来是想研究研究 `Vim` 的 `YCM(YouCompleteMe)` 插件的, 不过这玩意儿是真的挺难搞的... 折腾了好久没好使, 先放弃; 然后找替代品 `neocomplete` 试试, 结果又要 `lua ` 支持... 干脆来个源码重新安装吧"
date: '2018-07-22 15:42:46 +0800'
category: mac
tags: vim python mac
---
> {{ page.description }}

# YCM
`YCM` = `YouCompleteMe` VIM 下超级NB的补全插件, 反正大家都这么说, 我也就这么信了... 

尤其是针对 `C` 系列语言的补全做的很好, 虽然我不用... 其他好多语言也是支持的, 比如: `python` `java` 等

所以就想试试 `python` 的补全怎么样, 研究了一段时间, 发现确实难搞:
- 安装包大, 下载慢... 后来在本地把安装源码压缩备份了一个zip包, 这个zip包就有 165M
- 编译难通过, `C` 语言系列的还没试过; 光 `python` 倒是试过几次了 
- 安装之后问题多, 难排查; 反正就是不好使, 各种问题, 各种Google...

额, 跑题跑远了... 

# vim 安装
## 当前环境
本地Mac环境自带的 `vim` 是 `brew install vim` 安装的, 默认是支持 `python` (python2) 的, 而 `python3` 是不支持的 

把 `brew` 安装的 `vim` 卸载掉: `brew uninstall vim`

我们本地python有3个版本: `2.6 / 2.7 / 3.5`  (3.5为默认的)

2.6的应该是系统自带的; 2.7 和 3.5 应该是我很早之前安装的, 没什么印象了; 而且还是不是使用 `brew` 安装的

## 源码包下载
[vim 8.1.0197 下载地址](https://codeload.github.com/vim/vim/tar.gz/v8.1.0197)   其他版本:[VIM-广发下载页面](https://www.vim.org/download.php)

## 编译安装
```bash
# 解压
$ tar -xzvf ~/Downloads/vim-8.1.0197.tar.gz

$ cd vim-8.1.0197

# 查看编译支持的选项
$ ./configure -h

# 编译选项配置: python2/3 perl ruby lua
$ ./configure \
--enable-multibyte \
--enable-perlinterp=dynamic \
--enable-rubyinterp=dynamic \
--with-ruby-command=/usr/local/bin/ruby \
--enable-pythoninterp=dynamic \
--with-python-config-dir=/usr/lib/python2.7/config \
--enable-python3interp \
--with-python3-config-dir=/Library/Frameworks/Python.framework/Versions/3.5/lib/python3.5/config-3.5m \
--enable-luainterp \
--with-lua-prefix=/usr/local/Cellar/lua/5.3.5 \
--enable-cscope \
--enable-gui=auto \
--with-features=huge \
--enable-fontset \
--enable-largefile \
--disable-netbeans \
--enable-fail-if-missing \
--prefix=/usr/local/vim8

# 编译安装
$ make && make install

# 确认是否安装成功: 并可以检查是否支持了 python2/3 lua等解释器
# 由于设置了 --prefix=/usr/local/vim8 所以全路径是这样
$ /usr/local/vim8/bin/vim --version

# 查看 老的vim路径, 并删除掉
$ ll `which vim`
$ rm /usr/local/bin/vim

# 创建软链
$ ln -s /usr/local/vim8/bin/vim /usr/local/bin/vim

# 再次查看版本号, 确定是否已经支持
$ vim --version
```

**注意事项**:
- `python2` 和 `python3` 的 config 目录路径需要对应上
- `lua` - 这个是 `vim` 另一个补齐插件所依赖的 `neocomplete`

# 其他
## configure: error: could not configure lua
```bash
# 报错的话, 可以先检查一下 lua 安装路径; 找不到的话 可以用 brew 安装 注意安装之后的路径
$ brew install lua
```

`configure` 和 `make` 时需要多观察一下结果, 看看有没有错误; 解决完报错, 离成功就不远了... 

非常神奇的是, 支持 `python3` 之后, 我的 `YCM` 重新安装一遍之后, 直接就好使了... :)

---
参考：
- [VIM NB自动补齐插件 YCM - YouCompleteMe](https://vimawesome.com/plugin/youcompleteme)
- [Install Vim 8 with Python, Python 3, Ruby and Lua support on Ubuntu 16.04](https://gist.github.com/odiumediae/3b22d09b62e9acb7788baf6fdbb77cf8)

