---
layout: post
title: "curl: (7) Failed to connect to raw.githubusercontent.com port 443: Connection refused"
keywords: "curl,brew,tmux"
description: "`brew install tmux` 重新安装 `tmux` 报错...<br/>curl: (7) Failed to connect to raw.githubusercontent.com port 443: Connection refused"
tagline: ""
date: '2022-11-19 13:25:07 +0800'
category: mac
tags: mac brew tmux
---
> {{ page.description }}

# brew install tmux

```shell
  brew install tmux
Warning: You are using macOS 10.13.
We (and Apple) do not provide support for this old version.
You will encounter build failures with some formulae.
Please create pull requests instead of asking for help on Homebrew's GitHub,
Twitter or any other official channels. You are responsible for resolving
any issues you experience while you are running this
old version.

==> Downloading https://mirrors.aliyun.com/homebrew/homebrew-bottles/ca-certificates-2022-07-19_1.all.bottle.tar.gz
Already downloaded: /Users/xuyinglong/Library/Caches/Homebrew/downloads/ea6e0173c119bdb2b64b2421364a39b02ed107471f6d6f10bf75dafc183db553--ca-certificates-2022-####    public.host
07-19_1.all.bottle.tar.gz
==> Downloading https://github.com/JuliaStrings/utf8proc/archive/v2.7.0.tar.gz
Already downloaded: /Users/xuyinglong/Library/Caches/Homebrew/downloads/1b8888ee93fe8b17e66e444119eb953ece9f1a07abee08a21d50a7111ea929a8--v2.7.0.tar.gz
==> Downloading https://raw.githubusercontent.com/imomaliev/tmux-bash-completion/f5d53239f7658f8e8fbaf02535cc369009c436d6/completions/tmux

curl: (7) Failed to connect to raw.githubusercontent.com port 443: Connection refused
Error: tmux: Failed to download resource "tmux--completion"
Download failed: https://raw.githubusercontent.com/imomaliev/tmux-bash-completion/f5d53239f7658f8e8fbaf02535cc369009c436d6/completions/tmux

```

直接改hosts文件即可: `vim /etc/hosts` (没有权限可以用root改)
```
199.232.68.133 raw.githubusercontent.com
199.232.68.133 user-images.githubusercontent.com
199.232.68.133 avatars2.githubusercontent.com
199.232.68.133 avatars1.githubusercontent.com
```

然后再安装一次就OK了

---
参考：
- [彻底解决【“curl: (7) Failed to connect to raw.githubusercontent.com port 443: Connection refused”】错误](https://blog.51cto.com/u_3826358/3832035){:target='blank'}

