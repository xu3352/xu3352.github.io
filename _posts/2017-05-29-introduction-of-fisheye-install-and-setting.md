---
layout: post
title: "fisheye+crucible 4.0.4 安装和配置介绍"
tagline: ""
date: '2017-05-29 11:31:50 +0800'
category: atlassian
tags: fisheye crucible atlassian agile
---
> fisheye+crucible 4.0.4 安装和配置介绍

# fisheye和crucible

一个是代码深度查看的，一个是做代码审查的，一般都是配套使用了，默认的安装包也是两个产品都包括的，不过许可还是分开的，需要单独的设置

fisheye 通常是配合 jira 一起玩的，比如新分配一个任务或者Bug、 代码提交后，直接就可以关联（提交备注里的 KEY 匹配）起来，方便代码的查看和审查

# 安装步骤
[官方安装文档](https://confluence.atlassian.com/display/FISHEYE040/Installing+FishEye+on+Linux+and+Mac)

环境要求：
- jdk1.8+
- mysql5.1（考虑到安装其他产品，建议mysql5.5+）
- subversion 1.1-1.7
- git1.7.1+
- jira 5.0+
- crowd 2.4.x+

# 下载地址
[下载地址](http://downloads.atlassian.com/software/fisheye/downloads/fisheye-4.0.4.zip) 解压后是整合安装包：`fecru-4.0.4`，里面包含 `fisheye + crucible`
```bash
# 解压并发到指定位置
# fisheye-4.0.4.zip 解压后的目录为：fecru-4.0.4 (fisheye+crucible)
$ unzip fisheye-4.0.4.zip
$ mv fecru-4.0.4 /data/software/
```

## 配置数据目录
```bash
$ cd /data/software/
$ mkdir -p /data/software/fisheye-home

$ vim ~/.bash_profile
# 加到最后即可
# jira.home 目录也是可以这么配置的 `export JIRA_HOME=/data/software/jira-home`
export FISHEYE_INST=/data/software/fisheye-home

# 立即生效
$ source ~/.bash_profile
```

## 修改端口和 context
跟系统配置相关的大多是在安装目录下的：`config.xml` 文件里，绑定的ip、端口、许可、mysql数据设置等
```xml
   <web-server context="/fisheye">
       <http bind="192.168.7.250:8060"/>
   </web-server>
```

## 启动/停止 fisheye
```bash
$ cd /data/software/fecru-4.0.4

# 启动fisheye
$ ./bin/start.sh

# 停止fisheye
$ ./bin/stop.sh
```

# 启动配置

浏览器访问：`http://192.168.7.250:8060/fisheye/`， 进入初始配置页面

## 许可设置
申请 `fisheye` 和 `crucible` 的许可，如果有了，直接填写即可

## 链接到 JIRA
如果 `jira` 已经安装配置好了，这里直接可以配置。也可以后面在单独配置。

## 设置 fisheye 管理密码
这个密码没有对应的账户，而是访问管理页面的时候需要输入的口令。

## mysql 设置
Fisheye Admin管理页面：`http://192.168.7.250:8060/fisheye/admin`     
找到左侧最下方的：`System Settings -> Database` 项目，修改成 mysql 即可     
自带的 Driver 也可以直接使用，也可以用第三方的 `./lib/mysql-connector-java-5.1.42-bin.jar`，放到 lib 目录下即可
```sql
-- 用管理账户登陆 mysql
$ mysql -uroot -p
mysql> CREATE DATABASE fisheye CHARACTER SET utf8 COLLATE utf8_bin;
mysql> GRANT ALL PRIVILEGES ON fisheye.* TO fisheye@'%' IDENTIFIED BY 'fisheyeXXXX';
mysql> GRANT ALL PRIVILEGES ON fisheye.* TO fisheye@'localhost' IDENTIFIED BY 'fisheyeXXXX';
mysql> FLUSH PRIVILEGES;
mysql> QUIT
```

# 添加 svn 仓库

进入管理页面后，左侧：`Repository Settings -> Repositories`

- 点击 【Add repository】
- 选择【Subversion】起个别名

输入对应的信息：
- SVN URL: svn的根目录
- Path: 子路径
- Username: 用户名
- Password: 密码

剩下的设置默认即可, 保存之前先测试链接一下，确认能连上 svn 即可

# 匿名用户权限
默认匿名用户是可以看到仓库的，可以把这个权限去掉，仅登陆用户可见    
进入管理页面后，左侧：`Repository Settings -> Defaults -> Permissions`，把 `Anonymous` 勾选去掉，把 `All logged-in users` 勾选重新勾上就可以了

# 添加用户和组

这里可以创建组和用户，最好的方案是集成 crowd，jira 用户直接就可以登陆 fisheye 了，使用起来更加方便，后面会写文章来单独介绍 crowd 的安装和集成

# 关于破解
请使用正版！！！

---
参考：
- [jira+Confluence+FishEye安装破解集成](http://blog.csdn.net/u010414666/article/details/51689247)
- [代码深度查看工具Fisheye安装破解](http://pangge.blog.51cto.com/6013757/1560234)
- [Fisheye Migrating to MySQL](https://confluence.atlassian.com/fisheye/migrating-to-mysql-298976838.html)

- [破解包](http://on6gnkbff.bkt.clouddn.com/20170529090001_crack_fecru3.zip)

