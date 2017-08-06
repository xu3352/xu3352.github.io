---
layout: post
title: "Jekyll写作效率提升篇"
tagline: ""
description: "懒人必备，重复性的工作就做成脚本了，剩下的只需要关注文章内容即可！"
date: '2017-08-06 22:35:31 +0800'
category: blog
tags: jekyll shell blog github
---
> {{ page.description }}

# 技能清单
- 脚本启动 Jekyll
- 脚本按模板创建新文章
- 脚本提交到 github
- 脚本上传附件（截图、压缩包等）

几个脚本都是位于博客的根目录

有了这几个脚本，剩下的好像就只有文章内容了，专注于内容！

如果平时写作内容框架差不多的话，倒是可以做成一个模板！

# 启动脚本
启动Jekyll脚本：`startup.sh`
```bash
#!/bin/bash
#author:xu3352
#desc: start up jekyll

cd ~/blog
nohup bundle exec jekyll serve --drafts &

```
不常用，懒得每次找命令了

nohup 方式启动，日志会输出到 `nohup.out`

# 新建文章脚本
脚本按模板创建新文章: `new_post.sh`
```bash
#!/bin/bash
#author:xu3352
#desc: create a new post articles with template

TITLE=$1
TITLE_ZH=$2
TEMPLATE=draft_template.md
DATE=`date "+%Y-%m-%d"`
TIME=`date "+%H:%M:%S"`
# echo $DATE $TIME

DIR=`pwd`

# file path generate
FILE_NAME="$DATE-`echo $TITLE|sed 's/[ ][ ]*/-/g'`.md"
echo "file name:" _posts/$FILE_NAME

# template content
CONTENT=`cat $TEMPLATE`

# fill title
POST_TITLE=$TITLE
if [ -n "$TITLE_ZH" ]; then
    POST_TITLE=$TITLE_ZH
fi
CONTENT=`echo "${CONTENT}" | sed "s/{title}/${POST_TITLE}/g"`

# fill time
CONTENT=`echo "${CONTENT}" | sed "s/{time}/${DATE} ${TIME}/g"`

# output file (check exists)
if [ ! -e "$DIR/_posts/$FILE_NAME" ]; then
    echo "${CONTENT}" > _posts/$FILE_NAME
else
    echo "file exists..."
fi

# edit file with vim
vim _posts/$FILE_NAME

```

模板文件下载：[draft_template.md](https://raw.githubusercontent.com/xu3352/xu3352.github.io/master/draft_template.md)

想了解更多，请参考本文的另一篇文章：[Jekyll使用shell脚本+模板发布新文章](https://xu3352.github.io/linux/2017/05/03/post-new-article-with-your-template)

# 提交到Github脚本
自动提交脚本：`commit_post.sh`
```bash
#!/bin/bash
#author:xu3352
#desc: commit post articles

MSG=$1

if [ "" == "$MSG" ]
then
    MSG="发布新文章"
fi

# add dir
git add _posts/

# commit to local
git commit -m "$MSG"

# push to github
git push origin master
```
这里默认只把  `_posts` 目录的变更提交并推送到Github，更懒一点的话就改成博客的根目录 `.`

# 上传附件脚本
这里用的第三方的七牛云，好像免费也足够用了

[七牛云对象存储SDK Python版](http://127.0.0.1:4000/python/2017/03/23/qiniu-cloud-objects-storeage-with-python-sdk)

上传之后返回链接就可以使用了

# 补充
```bash
# 查看哪些文件没提交
git commit -v 

# 查看改了什么东西
git diff

```

# 所有文件
文件清单都在这里，有需要请自行下载使用 

[xu3352.github.io](https://github.com/xu3352/xu3352.github.io)

---
参考：
- [Jekyll使用shell脚本+模板发布新文章](https://xu3352.github.io/linux/2017/05/03/post-new-article-with-your-template)
- [七牛云对象存储SDK Python版](http://127.0.0.1:4000/python/2017/03/23/qiniu-cloud-objects-storeage-with-python-sdk)

