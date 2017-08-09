---
layout: post
title: "Jekyll 构建加速：增量构建"
tagline: ""
description: "平时全部构建一次需要花好几秒，增量构建：--incremental 不到一秒"
date: '2017-08-10 03:52:13 +0800'
category: blog
tags: jekyll nohup blog
---
> {{ page.description }}

# 启动 Jekyll
由于懒，所以已经做成了脚本：
```bash
#!/bin/bash
#author:xu3352
#desc: start up jekyll

cd ~/blog
nohup bundle exec jekyll serve --drafts &

```

启动的时候看日志：`nohup.out`，看到其中有一行提醒：
```bash
 Incremental build: disabled. Enable with --incremental
```

于是就加上了：
```bash
#!/bin/bash
#author:xu3352
#desc: start up jekyll

cd ~/blog
nohup bundle exec jekyll serve --drafts --incremental &

```
嗯，确实比以前快了很多，每次保存之后刷新基本就是最新的效果了

但是，有个很明显的问题，就是我即使没有编辑和保存的时候，也是一直在重新构建！什么情况。。。这不是死循环了么。。。但是没多想，直接就去掉了

刚刚突然想起这茬来：Jekyll 只有在文件有变更的时候才最自动构建，然后看到 `nohup` 方式启动，哈哈，明白了没？

由于 Jekyll 是用 nohup 方式启动的，并且启动脚本就在博客的根目录下，所以日志默认就产生在博客下面了，好，从 jekyll 启动开始，就会有启动日志写入 `nohup.out` 文件，然后就会触发 --incremental 增量构建事件，构建之后又往 `nohup.out` 写日志，然后又触发，死循环了，所以即使你什么都不干，也能看到自动构建的一直再出发打印日志

# jekyll exclude
只需要把 `nohup.out` 文件加入到 `_config.yml` 的 exclude 列表最后即可：
```yaml
exclude: ["xxx", "changelog.md", "nohup.out"]
```

重启 jekyll 之后就可以了，完美解决构建速度问题！

