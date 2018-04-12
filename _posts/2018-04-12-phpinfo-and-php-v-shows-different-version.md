---
layout: post
title: "Php控制台和phpinfo版本号不一致"
tagline: ""
description: "小白表示云里雾里"
date: '2018-04-12 19:55:20 +0800'
category: php
tags: php nginx mac
---
> {{ page.description }}

本来是那 `Sublime Text 3` 跑几个例子, 结果安装一个格式化插件 `phpfmt` 之后保存时总提示当前的PHP版本过低, 要你升级, 想着升级就升级呗, 于是就被带进坑里去了...

# PHP升级
Mac好像是自带了PHP了, 版本号查询: `php -v`
```bash
# 查询php版本号
$ php -v
PHP 5.5.38 (cli) (built: Oct 29 2017 20:49:07)
Copyright (c) 1997-2015 The PHP Group
Zend Engine v2.5.0, Copyright (c) 1998-2015 Zend Technologies
``` 

`PHP5` 和 `PHP7` 是两个差别很大的版本, 其中不同自行网上查找

说是升级, 其实是重新安装一个, 源码安装就麻烦一点, 这里有个简单点的:
```bash
# 安装PHP7, 最后是大的版本号
curl -s http://php-osx.liip.ch/install.sh | bash -s 7.2
```

最后安装的目录是: `/usr/local/php5-7.2.2-20180201-132629`   
额~~, 好吧, 为什么是 `php5-7.2.2` 这个样子...

而且安装完之后, 应该是有个 `/usr/local/php5` 的链接指向了 `/usr/local/php5-7.2.2-20180201-132629` 猜测是PHP好多地方应该都是指向的 `/usr/local/php5` 目录
```bash
$ ll /usr/local/
drwxr-xr-x   15 root        wheel   510B  4 12 19:31 php5-7.2.2-20180201-132629
lrwxr-xr-x    1 xuyinglong  wheel    37B  4 12 18:48 php5 -> /usr/local/php5-7.2.2-20180201-132629
```

```bash
# 查看安装后的版本号
$ /usr/local/php5-7.2.2-20180201-132629/bin/php -v
PHP 7.2.2 (cli) (built: Feb  1 2018 13:23:34) ( NTS )
Copyright (c) 1997-2018 The PHP Group
Zend Engine v3.2.0, Copyright (c) 1998-2018 Zend Technologies
    with Zend OPcache v7.2.2, Copyright (c) 1999-2018, by Zend Technologies
    with Xdebug v2.6.0, Copyright (c) 2002-2018, by Derick Rethans
```

看起来没问题, 然后再来个偷梁换柱, 把 `/usr/bin/php` 替换成我们最新的
```bash
# 查找位置
$ whereis php
/usr/bin/php

# 先备份
$ sudo /usr/bin/php /usr/bin/php5.5

# 创建一个链接, 类似window下面的快捷方式
$ ln -s /usr/local/php5-7.2.2-20180201-132629/bin/php /usr/bin/php
```
然后 `php -v` 就可以看到是 7.2.2 版本了

# 跑个PHP例子
经典的当然是:`test.php` 
```php
<?php phpinfo(); ?>
```

额, 话说直接可是跑不起来的, 把这段配置到 `nginx` 里, 然后重启 `sudo nginx -s reload` 

```conf
location ~ \.php$ {
    root           html;
    fastcgi_pass   127.0.0.1:9000;
    fastcgi_index  index.php;
    fastcgi_param  SCRIPT_FILENAME  /$document_root$fastcgi_script_name;
    include        fastcgi_params;
}
```

上面的 `test.php` 放到 `nginx` 安装目录下的 `html` 文件夹下, 然后浏览器里访问:  
`http://localhost/test.php` 如果幸运的话, 你就能看到 PHP 相关的版本和配置等信息了

等等, 是不是忘记启动 `php-fpm` 了, 现在的 `PHP` 都是带 `php-fpm` 的 (PHP5.3.3之后自带改模块了), 额, 这是个什么, 你还是看文末的参考吧

直接执行 `php-fpm` 好像是提示没有配置文件吧, 而 `/etc` 和 `/private/etc` 目录下都有 `php-fpm.conf` 文件, 那么就指定一个吧
```bash
$ php-fpm --fpm-config /private/etc/php-fpm.conf
```
额, 继续报错, 提示 `/usr/var/log/php-fpm.log` 目录不存在, 好吧, 这里修改一下路径
```bash
$ vim /private/etc/php-fpm.conf

# 修改错误日志文件路径, 目录不存在可以手动创建一下 mkdir -p /usr/local/log
error_log = /usr/local/log/php-fpm.log
```
好, 再次运行就成功了

于是我们再次刷新浏览器的 `http://localhost/test.php` 链接, 可以看到PHP相关的额信息, 可是版本号和控制台的不对啊...

# 控制台和Web端版本号不一致
额, 这个问题网上查了好多资料... 最终还是老外靠谱
**大致内容**:
- `php -v` - 控制台命令, 表示php的版本号
- `phpinfo()` - 这个是通过Web服务器查看到的PHP信息
- `重点` - Web服务器是通过 `php-fpm` 关联到php的, 而 `php-fpm` 指向的 php 才是页面展示的信息; 而 `php` 和 `php-fpm` 总是一对一的, 自己版本找自己对应的搭档就好了

上面是看人家讨论 `Apache` 的 `php5_module` 模块按不同 `php` 版本来对应配置所想到的

# 解决方案
搞明白怎么回事就好解决问题了, 来看看:
```bash
$ php-fpm -v
PHP 5.5.38 (fpm-fcgi) (built: Oct 29 2017 20:49:27)
Copyright (c) 1997-2015 The PHP Group
Zend Engine v2.5.0, Copyright (c) 1998-2015 Zend Technologies
```

在把 `php-fpm` 给换成最新的
```bash
# 查找位置
$ whereis php-fpm
/usr/sbin/php-fpm

# 备份
$ sudo mv /usr/sbin/php-fpm /usr/sbin/php-fpm5.5

# 创建一个链接
$ sudo ln -s /usr/local/php5-7.2.2-20180201-132629/sbin/php-fpm /usr/sbin/php-fpm
```

再次执行 `php-fpm -v` 可以看到是最新的 7.2.2 版本的了, 浏览器刷新应该可以看到都是最新的 7.2.2 版本的了

(忘记是否需要重启nginx了)

# 后话

`nginx`: 记住 `php -v` 和 `php-fpm -v` 应该是一对的, 要换应该一起换

`apache`: 同样, 如果安装了多个版本的php, 那么 `php5_module` 模块也需要对应

最后 `Sublime Text 3` 里面自动就好使了

---
参考：
- [PHP官网](http://www.php.net/)
- [mac下更新自带的PHP版本到5.6或7.0](https://www.jianshu.com/p/0456dd3cc78b)
- [编译安装nginx1.9.7+php7.0.0服务器环境](https://segmentfault.com/a/1190000004123048)
- [phpinfo() and php -v shows different version of PHP](https://superuser.com/questions/969861/phpinfo-and-php-v-shows-different-version-of-php/971895#971895?newreg=d36d0b544416498d89550b98da68bf5c)
- [Mac OS X 系统自带的 php-fpm 启动报错](https://lzw.me/a/mac-osx-php-fpm-nginx-mysql.html)
- [php中fastcgi和php-fpm是什么东西](https://www.zybuluo.com/phper/note/50231)

