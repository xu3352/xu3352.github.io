---
layout: post
title: "Jekyll更新后导致:check_for_activated_spec错误"
keywords: "jekyll check_for_activated_spec"
description: "jekyll `3.8.3` 升级到 `3.8.5` 后, 运行 `jekyll --version` 报错. <br/>'check_for_activated_spec!': You have already activated jekyll 3.8.5, but your Gemfile requires jekyll 3.8.3. Prepending `bundle exec` to your command may solve this. (Gem::LoadError)"
tagline: ""
date: '2018-12-03 22:05:32 +0800'
category: blog
tags: jekyll blog
---
> {{ page.description }}

# Github安全报警

昨天收到 Github 的一封邮件, 说是 Jekyll 3.8.3 有潜在的安全漏洞, 建议升级到 3.8.4 之后版本

> Known **moderate severity** security vulnerability detected in <br/>
> jekyll >= 3.8.0, < 3.8.4 defined in Gemfile.lock. <br/>
> Gemfile.lock update suggested: jekyll ~> 3.8.4.

# jekyll升级

```bash
# 本地版本
$ jekyll --version
jekyll 3.8.3

# 升级
$ gem update jekyll
Updating installed gems
Updating jekyll
Fetching: jekyll-3.8.5.gem (100%)
Successfully installed jekyll-3.8.5
Parsing documentation for jekyll-3.8.5
Installing ri documentation for jekyll-3.8.5
Installing darkfish documentation for jekyll-3.8.5
Done installing documentation for jekyll after 4 seconds
Parsing documentation for jekyll-3.8.5
Done installing documentation for jekyll after 1 seconds
Gems updated: jekyll
```

# 启动报错

```bash
$ jekyll --version
Traceback (most recent call last):
        10: from /usr/local/bin/jekyll:23:in `<main>'
         9: from /usr/local/bin/jekyll:23:in `load'
         8: from /usr/local/lib/ruby/gems/2.5.0/gems/jekyll-3.8.5/exe/jekyll:11:in `<top (required)>'
         7: from /usr/local/lib/ruby/gems/2.5.0/gems/jekyll-3.8.5/lib/jekyll/plugin_manager.rb:50:in `require_from_bundler'
         6: from /usr/local/lib/ruby/gems/2.5.0/gems/bundler-1.16.4/lib/bundler.rb:107:in `setup'
         5: from /usr/local/lib/ruby/gems/2.5.0/gems/bundler-1.16.4/lib/bundler/runtime.rb:26:in `setup'
         4: from /usr/local/lib/ruby/gems/2.5.0/gems/bundler-1.16.4/lib/bundler/runtime.rb:26:in `map'
         3: from /usr/local/Cellar/ruby/2.5.1/lib/ruby/2.5.0/forwardable.rb:229:in `each'
         2: from /usr/local/Cellar/ruby/2.5.1/lib/ruby/2.5.0/forwardable.rb:229:in `each'
         1: from /usr/local/lib/ruby/gems/2.5.0/gems/bundler-1.16.4/lib/bundler/runtime.rb:31:in `block in setup'
/usr/local/lib/ruby/gems/2.5.0/gems/bundler-1.16.4/lib/bundler/runtime.rb:313:in `check_for_activated_spec!': You have already activated jekyll 3.8.5, but your Gemfile requires jekyll 3.8.3. Prepending `bundle exec` to your command may solve this. (Gem::LoadError)
```

按照提示加 bundle exec 前缀后, 运行没啥问题, 应该是其他依赖的东西有问题了 (记得切换到博客根目录)
```bash
$ bundle exec jekyll --version
jekyll 3.8.3
```

# 解决

干脆来个全套的
```bash
# 重新安装一遍
$ gem install bundler jekyll

# 更新所有的 gems
$ bundle update

# 测试
$ jekyll --version
jekyll 3.8.5
```

然后你会发现博客根目录的 *Gemfile.lock* 文件里的依赖也相应的更新了, 提交并同步到 Github 搞定

---
参考：
- [Jekyll启动失败](https://xu3352.github.io/blog/2018/08/31/jekyll-start-fail-with-error-could-not-find-public_suffix-2.0.5)

