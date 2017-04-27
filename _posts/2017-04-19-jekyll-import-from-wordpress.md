---
layout: post
title:  "使用jekyll-import导入wordpress文章"
date:   2017-04-19 14:31:00 +0800
category: blog
tags: jekyll wordpress blog
---
> 把 WordPress 的文章导入到 Jekyll 里

# 查看 Jekyll 版本号
```bash
# 其他版本没有尝试过
$ jekyll --version
jekyll 3.4.3
```

# 安装 jekyll-import
```bash
# 依赖包
$ gem install unidecode sequel mysql2 htmlentities

# 安装 jekyll-import
$ gem install jekyll-import
```

# 执行导入脚本
```bash
# 可以在jekyll目录下新建一个_import目录，比如我的是：~/blog
$ mkdir ~/blog/_import
$ cd ~/blog/_import
# 自己修改字段内容: dbname|user|password|host
$ ruby -rubygems -e 'require "jekyll-import";
    JekyllImport::Importers::WordPress.run({
      "dbname"   => "",
      "user"     => "",
      "password" => "",
      "host"     => "localhost",
      "socket"   => "",
      "table_prefix"   => "wp_",
      "site_prefix"    => "",
      "clean_entities" => true,
      "comments"       => true,
      "categories"     => true,
      "tags"           => true,
      "more_excerpt"   => true,
      "more_anchor"    => true,
      "extension"      => "html",
      "status"         => ["publish"]
    })'
```

# 总结
生成结果就在当前目录，`_posts`目录下就是发布的文章了，同级的目录是对应的`page`页面。  
导入过程还是很方便的，不过有个很尴尬的问题，中文乱码。。。感觉又瞎折腾了。。。  
看文档提示只会导入文章，页面和评论`This only imports post & page data & content)`

![jekyll-import效果图](http://on6gnkbff.bkt.clouddn.com/20170419075028_jekyll-import.png){:width="100%"}

参考：  
- [Jekyll Importters:WordPress](http://import.jekyllrb.com/docs/wordpress/)   
- [从wordpress移植到Jekyll!](http://abloz.com/%E6%8A%80%E6%9C%AF/2017/02/06/welcome-to-jekyll/)

