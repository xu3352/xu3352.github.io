---
layout: post
title: "post new article with your template"
date: '2017-05-03 17:22:57 +0800'
category: linux
tags: blog shell tools linux
---
> shell脚本使用模板创建一篇新文章

# 重复性工作
**几个阶段：**
1. **刚入门，好依葫芦画瓢：**  
copy 自带的示例，修改YAML头信息：title，date，category，tags 等，删除模板内容，然后写是 markdown 的正文内容
2. **自定义模板：**  
多些写文章后发现模式是固定的，于是干脆自己做个模板，顺带把 markdown 常用的语法加进去，然后每次 copy 模板，少量改几个地方即可
3. **自动加载模板，并创建文章文件：**语言不限，各种工具，自己挑顺手的吧  
模板的基础上每次还是会修改title，date，文件名等，想到文件名其实就是标题，date可以使用当前日期，这些步骤可以再简化，于是做个 shell 脚本工具，方便每次使用了

# 模板
首先是模板：`draft_template.md` 注意bash前面应该是三个连在一起的\`
```html
---
layout: post
title: "{title}"
date: '{time} +0800'
category: linux
tags: linux
---
> 引用

# 标题
内容

# 代码清单
行内代码应用 `code`
``\`bash
$ ls -alh
``\`

# 图片
![](){:width="100%"}

参考：
- []()
- []()
```

# shell 脚本
然后是 shell 脚本：`new_post.sh` 
```bash
#!/bin/bash
#author:xu3352
#desc: create a new post articles with template

TITLE=$1
TEMPLATE=draft_template.md
DATE=`date "+%Y-%m-%d"`
TIME=`date "+%H:%M:%S"`
# echo $DATE $TIME

# file path generate
FILE_NAME="$DATE-`echo $TITLE|sed 's/[ ][ ]*/-/g'`.md"
echo "file name:" _posts/$FILE_NAME

# template content
CONTENT=`cat $TEMPLATE`

# fill title
CONTENT=`echo "${CONTENT}" | sed "s/{title}/${TITLE}/g"`

# fill time
CONTENT=`echo "${CONTENT}" | sed "s/{time}/${DATE} ${TIME}/g"`

# output file
echo "${CONTENT}" > _posts/$FILE_NAME

# edit file with vim
vim _posts/$FILE_NAME

```

# 使用
```bash
# 直接调用命令，把标题写进去就可以了，硬是要中文就再改一遍吧😆  
# 创建好新文件后会自动使用 vim 编辑文件，立马就可以开始写作了
./new_post.sh "post new article with your template"
```

参考：
- [在 Shell 中用 echo 输出变量丢失换行符的问题](http://blog.csdn.net/kodeyang/article/details/12883579)
- [shell - 将多个空格替换为一个空格](http://linux.ximizi.com/linux/linux5564.htm)
