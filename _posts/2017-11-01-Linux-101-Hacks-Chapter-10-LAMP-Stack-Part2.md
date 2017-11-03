---
layout: post
title: "Linux 101 Hacks 第十章:LAMP开发栈(二)"
tagline: ""
description: "`Linux` + `Apache` + `MySQL` + `PHP` 开发环境搭建"
date: '2017-11-01 15:05:24 +0800'
category: linux
tags: linux linux-command linux-101-hacks ebook
---
> {{ page.description }}

# 79.安装XAMPP
`XAMPP` 是包含`MySQL`，`PHP` 和 `Perl` 的 `Apache` 发行版。所以这是个整合的安装包，而且里面相互的关联都已经配置好了。而且支持：Linux，Windows，MacOS，Solaris平台。

XAMPP [下载地址](https://sourceforge.net/projects/xampp/)

**示例1: 安装 XAMPP**
```bash
$ cd /opt
$ tar xvzf xampp-linux-1.7.3a.tar.gz
```

**示例2: 启动或停止XAMPP**
```bash
# 停止所有的 xampp 服务
$ /opt/lampp/lampp start

# 停止所有的 xampp 服务
$ /opt/lampp/lampp stop
```

**示例3: 启动指定的 XAMPP 服务**
```bash
$ /opt/lampp/lampp startapache
XAMPP: Starting Apache with SSL (and PHP5)...
```
`startmysql` 就是单独启动 mysql 服务了

**示例4: 停止指定的服务**
```bash
$ /opt/lampp/lampp stopmysql
XAMPP: Stopping MySQL...
```

**示例5: XAMPP配置文件**

所有的配置文件都放在了：`/opt/lampp/etc/` 目录下，比如：`httpd.conf` `my.cnf` `php.ini`

**更多**:
- [XAMPP: Easy Apache, MySQL, PHP, Perl Install](http://www.thegeekstuff.com/2011/01/xampp-install/)

# 80.Apache Web服务器安全设置
如果你是系统管理员(sysadmin)，那么可以参考一下下面的几个建议

**建议1: 使用独立的用户组和用户来运行Apache**
```bash
$ groupadd apache
$ useradd -d /usr/local/apache2/htdocs -g apache -s /bin/false apache

# 修改 httpd.conf
$ vi httpd.conf
User apache
Group apache
```
重启apache服务之后，使用 `ps -ef` 查看进程时，你将会看到除了第一个是root用户之外，其他的都是 apache 用户
```bash
$ ps -ef | grep -i http | awk '{print $1}'
root
apache
apache
apache
apache
apache
```

**建议2: 限制对根目录的访问**
```bash
$ vim httpd.conf
<Directory />
    Options None
    Order deny,allow
    Deny from all
</Directory>
```
**详解**:
- `Options None` - 设置为 None，表示不启用任何可选项的附加功能
- `Order deny,allow` - 指令执行顺序，这里的 deny 比 allow 优先
- `Deny from all` - 这里是拒绝所有的根目录访问请求

**建议3: 为conf和bin目录设置适当的权限**
```bash
# 新增组
$ groupadd apacheadmin

# 设置组可访问 bin 目录
$ chown -R root:apacheadmin /usr/local/apache2/bin
$ chmod -R 770 /usr/local/apache2/bin

# 设置组可访问 conf 目录
$ chown -R root:apacheadmin /usr/local/apache2/conf
$ chmod -R 770 /usr/local/apache2/conf

# 给组设置指定的用户:ramesh 和 john
$ vi /etc/group
apacheadmin:x:1121:ramesh,john
```

**建议4: 禁止浏览目录**
```bash
$ vim httpd.conf
<Directory />
  Options None
  Order allow,deny
  Allow from all
</Directory>

# 或者
<Directory />
  Options -Indexes
  Order allow,deny
  Allow from all
</Directory>
```

**建议5: 禁用 .htaccess**
```bash
$ vim httpd.conf
<Directory />
  Options None
  AllowOverride None
  Order allow,deny
  Allow from all
</Directory>
```

**更多**:
- [10 Tips to Secure Your Apache Web Server on UNIX / Linux](http://www.thegeekstuff.com/2011/03/apache-hardening/)

# 81.Apachectl和Httpd建议
安装 `Apache2` 之后，如果要使用 `apachectl` 和 `httpd` 来发挥其最大潜力，则应该不仅限于使用简单的 `start`，`stop` 和 `restart` 命令

Apachectl充当SysV初始化脚本，采用诸如:`start`，`stop`，`restart` 和 `status` 的参数。 它也作为httpd命令的前端，只需将命令行参数传递给httpd即可。 所以，使用apachectl执行的所有命令也可以通过调用httpd直接执行

**示例1: 使用不同的 httpd.conf 配置文件**
```bash
$ apachectl -f conf/httpd.conf.debug
# 或者
$ httpd -k start -f conf/httpd.conf.debug

# 查看进程
$ ps -ef | grep http
root   25080     1  0 23:26 00:00:00 /usr/sbin/httpd -f conf/httpd.conf.debug
apache 25099 25080  0 23:28 00:00:00 /usr/sbin/httpd -f conf/httpd.conf.debug
```
通常我们一般要修改 `httpd.conf` 配置文件的时候，记得做个备份，新改的配置不好使，还可以回滚到修改之前的状态; 而上面的操作直接就是先使用其他配置文件来进行调试参数了

**示例2: 使用临时的 DocumentRoot(不修改httpd.conf)**
```bash
$ httpd -k start -c "DocumentRoot /var/www/html_debug/"

# 如果想使用默认的配置时，重启就行了
$ httpd -k stop
$ apachectl start
```

**示例3: 临时提升日志级别**
```bash
$ httpd -k start -e debug
[Sun Aug 17 13:53:06 2008] [debug] mod_so.c(246): loaded module auth_basic_module
[Sun Aug 17 13:53:06 2008] [debug] mod_so.c(246): loaded module auth_digest_module
```
日志级别(由低到高)：`debug, info, notice, warn, error, crit, alert, emerg`

**示例4: 展示已编译的模块(静态模块)**
```bash
$ httpd -l
Compiled in modules:
core.c
prefork.c
http_core.c
mod_so.c
```

**示例5: 显示由apache加载的静态和动态模块**
```bash
$ httpd -M
Loaded Modules:
core_module (static)
mpm_prefork_module (static)
http_module (static)
so_module (static)
auth_basic_module (shared)
auth_digest_module (shared)
authn_file_module (shared)
authn_alias_module (shared)
Syntax OK
```

**示例6: 显示 httpd.conf 已配置的指令**
```bash
$ httpd -L
HostnameLookups (core.c)
"on" to enable, "off" to disable reverse DNS lookups, or
"double" to enable double-reverse DNS lookups
Allowed in *.conf anywhere

ServerLimit (prefork.c)
Maximum value of MaxClients for this run of Apache
Allowed in *.conf only outside <Directory>, <Files> or
<Location>

KeepAlive (http_core.c)
Whether persistent connections should be On or Off
Allowed in *.conf only outside <Directory>, <Files> or <Location>

LoadModule (mod_so.c)
a module name and the name of a shared object file to load it from
Allowed in *.conf only outside <Directory>, <Files> or <Location>
```

**示例7: 校验 httpd.conf 配置是否正确**
```bash
$ httpd -t -f conf/httpd.conf.debug
httpd: Syntax error on line 148 of
/etc/httpd/conf/httpd.conf.debug:
Cannot load /etc/httpd/modules/mod_auth_basicso into
server:
/etc/httpd/modules/mod_auth_basicso: cannot open shared
object file: No such file or directory
Once you fix the issue, it will display Syntax OK.

# 修复过后
$ httpd -t -f conf/httpd.conf.debug
Syntax OK
```

**示例8: 显示 httpd 构建参数**
```bash
$ httpd -V
Server version: Apache/2.2.9 (Unix)
Server built:   Jul 14 2008 15:36:56
Server Module Magic Number: 20051115:15
Server loaded:  APR 1.2.12, APR-Util 1.2.12
Compiled using: APR 1.2.12, APR-Util 1.2.12
Architecture:   32-bit
Server MPM:     Prefork
threaded:     no
forked:     yes (variable process count)
Server compiled with....
-D APACHE_MPM_DIR="server/mpm/prefork"
-D APR_HAS_SENDFILE
-D HTTPD_ROOT="/etc/httpd"
-D SUEXEC_BIN="/usr/sbin/suexec"
-D DEFAULT_PIDLOG="logs/httpd.pid"
-D DEFAULT_SCOREBOARD="logs/apache_runtime_status"
-D DEFAULT_LOCKFILE="logs/accept.lock"
-D DEFAULT_ERRORLOG="logs/error_log"
-D AP_TYPES_CONFIG_FILE="conf/mime.types"
-D SERVER_CONFIG_FILE="conf/httpd.conf"
...

# 如果只想查看版本号
$ httpd -v
Server version: Apache/2.2.9 (Unix)
Server built:   Jul 14 2008 15:36:56
```

**示例9: 仅加载指定的模块**
```bash
$ vim httpd.conf
<IfDefine load-ldap>
LoadModule ldap_module modules/mod_ldap.so
LoadModule authnz_ldap_module modules/mod_authnz_ldap.so
</IfDefine>
```
使用 `IfDefine` 来加载指定的模块, 这里起名为:`load-ldap`, 如果想要测试 ldap 并想要加载相关模块时:
```bash
$ httpd -k start -e debug -Dload-ldap -f /etc/httpd/conf/httpd.conf.debug
[Sun Aug 17 14:14:58 2008] [debug] mod_so.c(246): loaded module ldap_module
[Sun Aug 17 14:14:58 2008] [debug] mod_so.c(246): loaded module authnz_ldap_module
[Note: Pass -Dload-ldap, to load the ldap modules into Apache]

# 如果直接启动，则不会加载 ldap 模块
$ apachectl start
```

**更多**:
- [9 Tips to Use Apachectl and Httpd like a Power User](http://www.thegeekstuff.com/2008/08/9-tips-to-use-apachectl-and-httpd-like-a-power-user/)

# 82.Apache虚拟主机配置
**示例1: 解注httpd-vhosts.conf**
```bash
$ vi /usr/local/apache2/conf/httpd.conf
Include conf/extra/httpd-vhosts.conf
```
如果是源码安装的，这一行应改时被注释掉的

**示例2: 设置虚拟主机**
```bash
$ vi /usr/local/apache2/conf/extra/httpd-vhosts.conf
NameVirtualHost *:80

<VirtualHost *:80>
    ServerAdmin ramesh@thegeekstuff.com
    DocumentRoot "/usr/local/apache2/docs/thegeekstuff"
    ServerName thegeekstuff.com
    ServerAlias www.thegeekstuff.com
    ErrorLog "logs/thegeekstuff/error_log"
    CustomLog "logs/thegeekstuff/access_log" common
</VirtualHost>

<VirtualHost *:80>
    ServerAdmin ramesh@top5freeware.com
    DocumentRoot "/usr/local/apache2/docs/top5freeware"
    ServerName top5freeware.com
    ServerAlias www.top5freeware.com
    ErrorLog "logs/top5freeware/error_log"
    CustomLog "logs/top5freeware/access_log" common
</VirtualHost>
```
详解：
- `NameVirtualHost *:80` - 表示所有基于名称的虚拟主机将在默认端口80上监听
- `<VirtualHost *:80>...</VirtualHost>` - 每个虚拟主机的参数单独配置
- 上面配置了2个域名虚拟主机，都是80端口，2个站点
- 当你访问 `thegeekstuff.com` 时，Apache 将读取 `/usr/local/apache2/docs/thegeekstuff` 的资源进行服务，而对应的访问日志将会写入:`/usr/local/apache2/logs/thegeekstuff` 文件里

**示例3: 检查虚拟主机配置语法错误**
```bash
$ /usr/local/apache2/bin/httpd -S
VirtualHost configuration:
Syntax OK

# 下面是有警告的
$ /usr/local/apache2/bin/httpd -S
Warning: DocumentRoot
[/usr/local/apache2/docs/top5freeware] does not exist
Warning: ErrorLog [/usr/local/apache2/logs/thegeekstuff] does not exist
Syntax OK
```

**示例4: 重启apache**
```bash
$ /usr/local/apache2/bin/apachectl restart
```

**更多**:
- [How To Setup Apache Virtual Host Configuration (With Examples)](http://www.thegeekstuff.com/2011/07/apache-virtual-host/)

# 83.滚动Apache日志文件
使用 `logrotate` 服务就可以很好的处理日志切分的问题了

```bash
$ vi /etc/logrotate.d/apache
/usr/local/apache2/logs/access_log /usr/local/apache2/logs/error_log {
    size 100M
    compress
    dateext
    maxage 30
    postrotate
      /usr/bin/killall -HUP httpd
      ls -ltr /usr/local/apache2/logs | mail -s "$HOSTNAME: Apache restarted and log files rotated" ramesh@thegeekstuff.com
    endscript 
}
```
**详解**:
- `/path/access_log 和 /path/error_log` - 两个需要处理的日志文件全路径 
- `size 100M` - 日志文件达到100M时将会进行切分 (支持Kb, GB单位)
- `compress` - 表示切分的日志会进行压缩，默认使用gzip压缩，所以后缀就是`.gz`
- `dateext` - 使用 `YYYYMMDD` 日期格式 如：`access_log- 20110616.gz`
- `maxage` - 代表切分的日志文件可以保存的最大的天数
- `postrotate 和 endscript` - 后续命令执行。在切分完成过后，这中间的任何命令都将会执行。这里是进行了重启操作，并且发送了一个通知邮件

**手动执行**:
```bash
$ /etc/cron.daily/logrotate

# 查看效果
$ ls /usr/local/apache2/logs
access_log
error_log
access_log-20110716.gz
error_log-20110716.gz 
```

`logrotate` 的使用可以参考之前的一篇文章:[如何切分 tomcat 的 catalina.out 日志](https://xu3352.github.io/linux/2017/04/24/how-to-ratate-tomcat-catalina.out)

**更多**:
- [How to Rotate Apache Log Files in Linux](http://www.thegeekstuff.com/2011/07/rotate-apache-logs/)
- [The Ultimate Logrotate Command Tutorial with 10 Examples](http://www.thegeekstuff.com/2010/07/logrotate-examples/)

