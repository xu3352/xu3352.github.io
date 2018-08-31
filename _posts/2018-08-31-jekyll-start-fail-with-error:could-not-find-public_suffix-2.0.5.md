---
layout: post
title: "Jekyll启动失败:Could not find public_suffix-2.0.5"
tagline: ""
description: "刚重启完电脑, 发现`Jekyll`启动失败了, 然后错误提示:`Could not find public_suffix-2.0.5 in any of the sources`"
date: '2018-08-31 16:00:59 +0800'
category: blog
tags: jekyll ruby blog
---
> {{ page.description }}

# 启动报错
最近也没有对 `jekyll` 相关的做过什么操作, `python` 环境倒是有点变化, 不过跟 `ruby` 没关系呢...
```bash
# 启动 jekyll 服务
$ nohup bundle exec jekyll serve --drafts --incremental --trace &
bundler: failed to load command: jekyll (/usr/local/bin/jekyll)
Bundler::GemNotFound: Could not find public_suffix-2.0.5 in any of the sources
  /usr/local/Cellar/ruby/2.5.1/lib/ruby/2.5.0/bundler/spec_set.rb:88:in `block in materialize'
  /usr/local/Cellar/ruby/2.5.1/lib/ruby/2.5.0/bundler/spec_set.rb:82:in `map!'
  /usr/local/Cellar/ruby/2.5.1/lib/ruby/2.5.0/bundler/spec_set.rb:82:in `materialize'
  /usr/local/Cellar/ruby/2.5.1/lib/ruby/2.5.0/bundler/definition.rb:170:in `specs'
  /usr/local/Cellar/ruby/2.5.1/lib/ruby/2.5.0/bundler/definition.rb:237:in `specs_for'
  /usr/local/Cellar/ruby/2.5.1/lib/ruby/2.5.0/bundler/definition.rb:226:in `requested_specs'
  /usr/local/Cellar/ruby/2.5.1/lib/ruby/2.5.0/bundler/runtime.rb:108:in `block in definition_method'
  /usr/local/Cellar/ruby/2.5.1/lib/ruby/2.5.0/bundler/runtime.rb:20:in `setup'
  /usr/local/Cellar/ruby/2.5.1/lib/ruby/2.5.0/bundler.rb:107:in `setup'
  /usr/local/Cellar/ruby/2.5.1/lib/ruby/2.5.0/bundler/setup.rb:20:in `<top (required)>'
  /usr/local/Cellar/ruby/2.5.1/lib/ruby/2.5.0/rubygems/core_ext/kernel_require.rb:59:in `require'
  /usr/local/Cellar/ruby/2.5.1/lib/ruby/2.5.0/rubygems/core_ext/kernel_require.rb:59:in `require'
```

环境信息:
```bash
# ruby gem gcc 版本信息
$ ruby -v
ruby 2.5.1p57 (2018-03-29 revision 63029) [x86_64-darwin15]
$ gem -v
2.7.6
$ gcc -v
Configured with: --prefix=/Applications/Xcode.app/Contents/Developer/usr --with-gxx-include-dir=/usr/include/c++/4.2.1
Apple LLVM version 8.0.0 (clang-800.0.38)
Target: x86_64-apple-darwin15.6.0
Thread model: posix
InstalledDir: /Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin
```

# 解决
直接 `Google` 错误的内容, 然后前几篇文章都看看, 没解决的话就换换关键词重新搜索试试... 

> Well, I usually need to update the gem path in my $PATH environment variable when changing ruby minor versions (2.2 -> 2.3 -> 2.4 -> 2.5), otherwise it could not find the gems.
> 
> After changing the $PATH, a "`bundle update`" would fix it.

我这里的执行了2步:
```bash
# 想重新安装一遍 jekyll 的, 不过没有好使
$ gem install bundler jekyll

# 更新所有的 gems
$ bundle update

# 测试:启动成功
jekyll serve
```

---
参考：
- [`[solved]`jekyll: "Could not find public_suffix-2.0.5 ..."](https://bbs.archlinux.org/viewtopic.php?id=233386)

