---
layout: post
title: "Jekyll 增量构建(--incremental)引发的问题"
tagline: ""
description: "自从使用增量构建之后, 构建确实很快, 很方便; 但是某些公共的模板文件并不能一起更新, 比如: `index.md archive.html categories.html tags.html`，所以搞个触发构建的机制"
date: '2017-08-12 14:15:32 +0800'
category: blog
tags: jekyll blog
---
> {{ page.description }}

# 问题
启动命令:      
`nohup bundle exec jekyll serve --drafts --incremental --trace &`

这里使用到了增量构建选项:`--incremental`, 这样文件变动后只需要重新构建变更的文件即可, 所以非常快!

但是出现一个很坑的问题, 其中一个就是每当新建一篇文章后, 首页刷新最新的文章并没有展示出来, 及时重新启动也不好使, 必须去掉 `--incremental` 重新启动后才好使, 瞬间就感觉很尴尬了, 这么大的 bug 没有人发现么? 😆

# 思路
增量更新其实是只针对有变更的文件, 比如当前编辑的文章, 每次保存之后, 刷新浏览器就是最新的内容. 

再比如当前文章修改了标题, 分类, 或者标签之类的, 当前文章刷新时是更新了, 而:      
`index.md archive.html categories.html tags.html` 这些也是不会更新的

这个时候怎么办呢, 我最开始的笨方法就是: `vim index.md` 最后加个空行, 再保存一下, 再刷新就好了

可是不能每次都这么干吧, 关键是还得改回去, 另外还有其他文件也有这个问题, 那么是不是只修改一下文件的更新时间之类的就好使了呢?

# 解决
BINGO! 比如:`touch index.md` 再刷新首页就好使了, 干的漂亮! 

这之前其实只知道 `touch` 是用来创建文件用的, 但是最基本的用法其实是来修改文件访问和修改时间! 

有兴趣查查手册可以: `man touch`, 不过 Mac 跟 Linux 下的命令行有些参数有些差别的哦

来个脚本:`flush_cache.sh`
```bash
#!/bin/bash
#author:xu3352@gmail.com
#desc: change file access and modification times to regenerate pages 
#       (if jekyll start with --incremental option)

# file list
list=(index.md archive.html categories.html tags.html)

# for loop
length=${#list[*]}
for (( i=0;i<$length;i++ ))
do
    # echo "file $i:" ${list[$i]}
    touch ${list[$i]}
done
```

加个可执行权限, 需要的时候, 手动执行一下就可以了. 

然后我把他加入到 `new_post.sh` 里了, 每次新建一篇文章完之后自动调用一次, 这样首页刷新也可以看到了
```diff
diff --git a/new_post.sh b/new_post.sh
index 98a6742..eeccc8b 100755
--- a/new_post.sh
+++ b/new_post.sh
@@ -35,6 +35,9 @@ else
     echo "file exists..."
 fi

+# change modification time to regenerate some pages
+source flush_cache.sh
+
 # edit file with vim
 vim _posts/$FILE_NAME
```

---
参考：
- [Jekyll 构建加速：增量构建(--incremental)](https://xu3352.github.io/blog/2017/08/09/jekyll-build-accelerate)
- [Linux touch 命令 - 为什么我们需要改变时间戳？](https://linux.cn/article-2740-1.html)
- [shell数组（array)常用技巧学习实践](http://bbs.linuxtone.org/thread-5317-1-1.html)

