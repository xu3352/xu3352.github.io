---
layout: post
title: "Linux 101 Hacks 第十章:LAMP开发栈(一)"
tagline: ""
description: "`Linux` + `Apache` + `MySQL` + `PHP` 开发环境搭建"
date: '2017-10-29 14:34:48 +0800'
category: linux
tags: linux linux-command linux-101-hacks ebook
---
> {{ page.description }}

# 75.安装 Apache2 (支持SSL)
推荐使用源码方式安装，因为可以很灵活的选择启用或者禁用模块

**示例1: 安装 Apache**
```bash
$ cd ~
$ wget http://www.eng.lsu.edu/mirrors/apache//httpd/httpd-2.2.17.tar.gz
$ tar xvfz httpd-2.2.17.tar.gz
```
最新的源码包请在这里下载：[httpd.apache.org](http://httpd.apache.org/)

**示例2: 安装 Apache 支持SSL/TLS模块**
```bash
$ cd httpd-2.2.17
$ ./configure --help

# 启用SSL
$ ./configure --enable-ssl --enable-so
$ make
$ make install
```
启用/禁用模块:
- 启用模块 `--enable-{module-name}` 比如：`--enable-ssl` 或 `--enable-ldap`
- 禁用模块 `--disable-{module-name}` 比如：`--disable-auth-basic`

Apache 默认安装路径是 `/usr/local/apache2`, 如果想修改其他的地方，可以设置编译参数：
`./configure --prefix=/your/path`

**示例3: 在 httpd.conf 启用 SSL**
```bash
# 默认的配置文件在 /usr/local/apache2/conf/httpd.conf
# 去掉前面的注释即可
$ vim /usr/local/apache2/conf/httpd.conf
Include conf/extra/httpd-ssl.conf

# 使用默认配置就可以了，不用进行修改
$ vim /usr/local/apache2/conf/extra/httpd-ssl.conf

# SSL证书和密钥，这个是需要我们手动创建的
$ egrep 'server.crt|server.key' httpd-ssl.conf
SSLCertificateFile "/usr/local/apache2/conf/server.crt"
SSLCertificateKeyFile "/usr/local/apache2/conf/server.key"
```

**示例4: 创建 server.crt 和 server.key 文件**
```bash
$ cd ~
# 生成 server.key
$ openssl genrsa -des3 -out server.key 1024

# 上面的操作会要求输入密码，这个需要记住；否则下面如果不能提供密码时会报错
2415:error:28069065:lib(40):UI_set_result:result too
small:ui_lib.c:849:You must type in 4 to 8191 characters

# 下一步生成 server.csr
openssl req -new -key server.key -out server.csr

# 最后生成 server.crt
openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt
```

**示例5: 把 server.key 和 server.crt 拷贝到指定目录**
```bash
$ cd ~
$ cp server.key /usr/local/apache2/conf/
$ cp server.crt /usr/local/apache2/conf/
```

**示例6: 启动Apache**
```bash
$ /usr/local/apache2/bin/apachectl start

# 由于启用了 SSL，所以这里需要输入之前设置的密码
Apache/2.2.17 mod_ssl/2.2.17 (Pass Phrase Dialog)
Server www.example.com:443 (RSA)
Enter pass phrase:
OK: Pass Phrase Dialog successful.
```
默认Apache SSL启用443端口，所以现在就支持 https 访问了，比如在浏览器上面输入: `https://{your-ip-address}`

**更多**:
- [How To Install Apache 2 with SSL on Linux (with mod_ssl, openssl)](http://www.thegeekstuff.com/2011/03/install-apache2-ssl/)
- [How To Generate SSL Key, CSR and Self Signed Certificate For Apache](http://www.thegeekstuff.com/2009/07/linux-apache-mod-ssl-generate-key-csr-crt-file/)
- [Install Apache 2 from Source on Linux](http://www.thegeekstuff.com/2008/07/install-apache-2-from-source-on-linux/)


# 76.源码安装 PHP
建议下载源码进行编译安装。这样有新的补丁或者升级时更加方便一点。下面是对 PHP5 进行的演示  最新版请到[官网下载](http://php.net/downloads.php)

**先决条件**:
- `Apache` - Web服务器, 上一小节我们已经搞定了
- `MySQL` - 如果要使用到Mysql的话，需要把Mysql先安装好了（可以先看后面一节的安装教程）

**示例1: 下载 PHP**
```bash
# 官网下载后，把源码放到 /usr/local/src 目录下
$ bzip2 -d php-5.2.6.tar.bz2
$ tar xvf php-5.2.6.tar
```

**示例2: 安装 PHP**
```bash
$ cd php-5.2.6
$ ./configure --help

# 编译安装
$ ./configure --with-apxs2=/usr/local/apache2/bin/apxs --with-mysql
$ make
$ make install

# 默认配置文件
$ cp php.ini-dist /usr/local/lib/php.ini
```
默认 PHP 是安装到 `/usr/local/lib` 目录，可以使用 `--prefix={install-dir-name}` 选项进行修改

**示例3: 在 httpd.conf 里支持 PHP**
```bash
# 增加一段
$ vim /usr/local/apache2/conf/httpd.conf
<FilesMatch "\.ph(p[2-6]?|tml)$">
SetHandler application/x-httpd-php
</FilesMatch>

# 要确保配置文件里有这一行(这个是在php安装的时候自动插入的)
LoadModule php5_module modules/libphp5.so
```

重启 Apache:
```bash
$ /usr/local/bin/apache2/apachectl restart
```

**示例4: 验证PHP安装是否安装成功**
```bash
$ vi test.php
<?php phpinfo(); ?>
```
然后访问：`http://local-host/test.php` 如果能看到PHP配置的选项和已安装的模块就表示安装成功了

**示例5: 安装过程中故障点**

**配置错误：configure: error: xml2-config not found:**
```bash
$ ./configure --with-apxs2=/usr/local/apache2/bin/apxs --with-mysql
Configuring extensions
checking whether to enable LIBXML support... yes
checking libxml2 install dir... no
checking for xml2-config path...
configure: error: xml2-config not found. Please check your libxml2 installation.

# 安装thelibxml2-devel 和 zlib-devel
rpm -ivh /home/downloads/linux-iso/libxml2-devel-2.6.26-2.1.2.0.1.i386.rpm /home/downloads/linux-iso/zlib-devel-1.2.3-3.i386.rpm
Preparing...##################################### [100%]
1:zlib-devel##################################### [ 50%]
2:libxml2-devel################################## [100%]
```

**configure: error: Cannot find MySQL header files.**
```bash
$ ./configure --with-apxs2=/usr/local/apache2/bin/apxs --with-mysql
checking for MySQL UNIX socket location...
/var/lib/mysql/mysql.sock
configure: error: Cannot find MySQL header files under
yes. Note that the MySQL client library is not bundled anymore!

# 安装 MySQL-devel-community
$ rpm -ivh /home/downloads/MySQL-devel-community-5.1.25-0.rhel5.i386.rpm
Preparing...###################################### [100%]
1:MySQL-devel-community########################### [100%]
```
更多：[Instruction Guide to Install PHP5 from Source on Linux](http://www.thegeekstuff.com/2008/07/instruction-guide-to-install-php5-from-source-on-linux/)

# 77.安装 MySQL
大多数Linux发行版都附带MySQL。还是建议下载最新的源码包进行安装。

**下载最新的MySQL版本**  官网下载地址：[mysql.com](https://dev.mysql.com/downloads/)

这里下载 Red Hat Enterprise Linux 5 RPM (x86) 的两个包：
- MySQL-client-community-5.1.25-0.rhel5.i386.rpm
- MySQL-server-community-5.1.25-0.rhel5.i386.rpm
- MySQL-devel-community-5.1.25-0.rhel5.i386.rpm

如果你想卸载已有的 MySQL，可以参考以下步骤（<font color="red">如果某些应用正在使用MySQL，请慎重!!!</font>）
```bash
[local-host]# rpm -qa | grep -i mysql
mysql-5.0.22-2.1.0.1
mysqlclient10-3.23.58-4.RHEL4.1

[local-host]# rpm -e mysql --nodeps
warning: /etc/my.cnf saved as /etc/my.cnf.rpmsave

[local-host]# rpm -e mysqlclient10
```

**示例1: 安装已下载的MySQL安装包**
```bash
[local-host]# rpm -ivh MySQL-server-community-5.1.25-0.rhel5.i386.rpm MySQL-client-community-5.1.25-0.rhel5.i386.rpm
Preparing...####################################### [100%]
1:MySQL-client-community########################### [ 50%]
2:MySQL-server-community########################### [100%]


PLEASE REMEMBER TO SET A PASSWORD FOR THE MySQL root USER!
To do so, start the server, then issue the following
commands:
/usr/bin/mysqladmin -u root password 'new-password'
/usr/bin/mysqladmin -u root -h medica2 password 'new-password'
Alternatively you can run:
/usr/bin/mysql_secure_installation


Starting MySQL.[  OK  ]
Giving mysqld 2 seconds to start
```

**安装 MySQL-devel**
```bash
[local-host]# rpm -ivh MySQL-devel-community-5.1.25-0.rhel5.i386.rpm
Preparing...####################################### [100%]
1:MySQL-devel-community  ########################## [100%]
```
这个是解决了编译PHP时报错的一个问题：
```bash
configure: error: Cannot find MySQL header files under yes.
```
请注意，MySQL客户端库不再捆绑了！

**示例2: MySQL安装后的安全设置**
```bash
[local-user]# /usr/bin/mysqladmin -u root password 'My2Secure$Password'
```

最好的选择是运行 `mysql_secure_installation` 脚本，该脚本将负责处理 MySQL 上所有典型的安全相关选项，如下所示，高级别的选项有以下几个：
- 修改root密码
- 删除 anonymous (匿名)用户
- 禁用root登陆远程服务器
- 删除默认的测试的数据库

```bash
[local-host]# /usr/bin/mysql_secure_installation
NOTE: RUNNING ALL PARTS OF THIS SCRIPT IS RECOMMENDED FOR
ALL MySQL SERVERS IN PRODUCTION USE!  PLEASE READ EACH
STEP CAREFULLY!
Enter current password for root (enter for none):
OK, successfully used password, moving on...

Change the root password? [Y/n] Y
New password:
Re-enter new password:
Password updated successfully!
Reloading privilege tables.. ... Success!

Remove anonymous users? [Y/n] Y

Disallow root login remotely? [Y/n] Y

Remove test database and access to it? [Y/n] Y

Reload privilege tables now? [Y/n] Y

installation should now be secure.
Thanks for using MySQL!
```

**示例3: 验证 MySQL安装成功**
```bash
# 查看mysql版本号
[local-host]# mysql -V
mysql  Ver 14.14 Distrib 5.1.25-rc, for redhat-linux-gnu(i686) 
using readline 5.1

# 终端登陆mysql
[local-host]# mysql -u root -p
Enter password:
mysql>
```

**MySQL：启动、停止、状态查询**
```bash
[local-host]# service mysql start
Starting MySQL.                       [ OK ]

[local-host]# service mysql stop
Shutting down MySQL.                  [ OK ]

[local-host]# service mysql status
MySQL running (12588)                 [ OK ]
```
**更多**:
- [Howto Install MySQL on Linux](http://www.thegeekstuff.com/2008/07/howto-install-mysql-on-linux/)
- [How to Install MySQL Database Using Yum groupinstall](http://www.thegeekstuff.com/2010/04/yum-groupinstall-mysql-database/)

# 78.安装LAMP开发栈
使用 `yum` 安装 `LAMP` 开发栈是非常简单的，而且只需要几分钟就能搞定了。对于初学者来说是个不错的选择，免除了从源码安装的各种麻烦。

**示例1: 使用 Yum 安装 Apache**
```bash
# 检查是否已经安装了apache服务
$ rpm -qa | grep httpd

# 如果没有安装过，则直接进行安装
$ yum install httpd

# 检查是否安装成功
$ rpm -qa | grep -i http
httpd-tools-2.2.9-1.fc9.i386
httpd-2.2.9-1.fc9.i386
```

开机启动设置：
```bash
$ chkconfig httpd on
$ service httpd start
Starting httpd:                   [  OK  ]
```

**示例2: 使用 yum 安装 MySQL**

使用 yum 安装 MySQL 最大的好处就是自动解决所有的依赖包，比如：mysql-libs, perl-DBI, mysql, perl-DBD-MySQL 等依赖包
```bash
$ yum install mysql-server

Dependencies Resolved

Transaction Summary
========================================================
Install     5 Package(s)
Update      0 Package(s)
Remove      0 Package(s)

Total download size: 15 M
Is this ok [y/N]: y

Running Transaction
Installing      : mysql-libs        [1/5]
Installing      : perl-DBI          [2/5]
Installing      : mysql             [3/5]
Installing      : perl-DBD-MySQL    [4/5]
Installing      : mysql-server      [5/5]
Complete!

# 验证是否安装成功
$ rpm -qa | grep -i mysql
php-mysql-5.2.6-2.fc9.i386
mysql-libs-5.0.51a-1.fc9.i386
mysql-server-5.0.51a-1.fc9.i386
perl-DBD-MySQL-4.005-8.fc9.i386
mysql-5.0.51a-1.fc9.i386

# 查看Mysql的版本
$ mysql -V
mysql  Ver 14.12 Distrib 5.0.51a, for redhat-linux-gnu
(i386) using readline 5.0

# 设置开机启动
$ chkconfig mysqld on

# 启动Mysql服务
$ service mysqld start

Initializing MySQL database:
Installing MySQL system tables... OK
Filling help tables... OK

To start mysqld at boot time you have to copy
support-files/mysql.server to the right place for your system

PLEASE REMEMBER TO SET A PASSWORD FOR MySQL root USER !
Start the server, then issue the following commands:
/usr/bin/mysqladmin -u root password 'new-password'
/usr/bin/mysqladmin -u root -h dev-db password 'new-password'

Alternatively you can run:
/usr/bin/mysql_secure_installation

Starting MySQL:
[  OK  ]
```

**后续安全设置**
```bash
# 安装之后默认不用输入密码即可链接
$ mysql -u root
mysql>
```
和之前我们单独安装 MySQL 一样，最好是做一些安全设置，直接执行脚本：
```bash
$ /usr/bin/mysql_secure_installation
Enter current password for root (enter for none):
OK, successfully used password, moving on...

Set root password? [Y/n] Y
New password: [Note: Enter the mysql root password here]
Re-enter new password:
Password updated successfully!

Remove anonymous users? [Y/n] Y
Disallow root login remotely? [Y/n] Y
Remove test database and access to it? [Y/n] Y
Reload privilege tables now? [Y/n] Y
... Success!
```
现在就必须使用密码才能链接上数据库了：
```bash
$ mysql -u root
ERROR 1045 (28000):Access denied for user
'root'@'localhost'(using password:NO)

# 输入密码链接
$ mysql -u root -p
Enter password:
mysql> show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
+--------------------+
2 rows in set (0.00 sec)
```

**示例3: 使用 yum 安装 PHP**
```bash
$ yum install php

Dependencies Resolved

Transaction Summary
========================================================
Install     3 Package(s)
Update      0 Package(s)
Remove      0 Package(s)

Total download size: 3.8 M
Is this ok [y/N]: y

Running Transaction
Installing      : php-common    [1/3]
Installing      : php-cli       [2/3]
Installing      : php           [3/3]
Complete!

# 检查是否安装成功
$ rpm -qa | grep -i php
php-cli-5.2.6-2.fc9.i386
php-5.2.6-2.fc9.i386
php-common-5.2.6-2.fc9.i386

# 给 PHP 安装MySQL模块
$ yum install php-mysql

# 其他模块
$ yum install php-common php-mbstring php-mcrypt php-devel php-xml php-gd
```

**更多**:
- [How To Install Or Upgrade LAMP Using Yum](http://www.thegeekstuff.com/2008/09/how-to-install-or-upgrade-lamp-apache-mysql-and-php-stack-on-linux-using-yum/)

