---
layout: post
title: "Mac brew update 非常慢... 更换brew镜像源解决"
tagline: ""
description: "每次使用 `brew install xxx` 安装软件的时候默认会先执行一遍更新操作, 然后等几分钟... "
date: '2018-09-06 10:58:46 +0800'
category: mac
tags: brew mac
---
> {{ page.description }}

# brew update 慢
每次 `brew update` 或 `brew install xxx` 都需要等好久...

有时候安装个软件, 可以先按 `Ctrl + c` 先终止更新, 然后就可以继续安装了... 我也是醉了...

# 更换brew镜像源
```bash
# 进入brew主目录
$ cd `brew --repo`

# 更换镜像
$ git remote set-url origin https://git.coding.net/homebrew/homebrew.git

# 测试效果
$ brew update
```

**几个镜像**:
- `https://git.coding.net/homebrew/homebrew.git` - Coding
- `https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/brew.git` - 清华
- `https://mirrors.ustc.edu.cn/brew.git` - 中科大

---
参考：
- [解决 "brew update" 无响应](https://www.jianshu.com/p/631e63dab0a0)
- [Mac下更换Homebrew镜像源](https://blog.csdn.net/lwplwf/article/details/79097565)

