---
layout: post
title: "crowd 2.12.0 安装和配置介绍"
tagline: ""
date: '2017-05-30 14:15:00 +0800'
category: atlassian 
tags: crowd atlassian agile
---
> crowd 2.12.0 安装和配置介绍

# Crowd
Atlassian单点登录的产品，集中用户、用户组管理，方便权限控制。

最方便的当然是一个地方创建用户，其他产品都能登录使用了。而不是每个产品再去创建一遍用户，然后每次都需要登录一遍。

# 安装
[crowd官方安装文档](https://confluence.atlassian.com/crowd/installing-crowd-and-crowdid-191862.html)    

环境要求：
- jdk 1.8+
- mysql 5.5+

最新版要求都比较高，所有产品最好都统一：`jdk1.8+`、`mysql5.5+`

## 下载地址
[atlassian-crowd-2.12.0.zip](http://www.atlassian.com/software/crowd/downloads/binary/atlassian-crowd-2.12.0.zip)      
其他版本改一下版本号应该就可以下载了   [官方crowd下载中心](https://www.atlassian.com/software/crowd/download)

## 配置数据目录
```bash
# 解压到指定目录
$ unzip atlassian-crowd-2.12.0.zip
$ mv atlassian-crowd-2.12.0 /data/software/

# 设置数据存储目录，同其他产品一样，最好不要放在安装目录下面
$ cd /data/software/atlassian-crowd-2.12.0

# 假设数据目录为：/data/software/crowd-home
$ vim ./crowd-webapp/WEB-INF/classes/crowd-init.properties
crowd.home=/data/software/crowd-home
```

核心的配置文件（初始向导完成后生成）：    
- `/data/software/crowd-home/crowd.cfg.xml` - 数据库设置
- `/data/software/crowd-home/crowd.properties` - crowd app相关设置

## 端口修改
```xml
$ cd /data/software/atlassian-crowd-2.12.0
$ vim ./apache-tomcat/conf/server.xml

<?xml version="1.0" encoding="UTF-8"?>
<Server port="8020" shutdown="SHUTDOWN">

    <Service name="Catalina">

        <Connector acceptCount="100"
                   connectionTimeout="20000"
                   disableUploadTimeout="true"
                   enableLookups="false"
                   maxHttpHeaderSize="8192"
                   maxThreads="150"
                   minSpareThreads="25"
                   port="8095"
        ...
```

## 启动/停止
```bash
$ cd /data/software/atlassian-crowd-2.12.0

# 启动
$ ./start_crowd.sh

# 停止
$ ./stop_crowd.sh
```

# 初始设置向导
[crowd官方设置向导](https://confluence.atlassian.com/crowd/running-the-setup-wizard-192479.html)    
启动后，浏览器访问：`http://192.168.7.250:8095/crowd/console/` 自动进入初始化设置页面   

## 许可
根据 Server ID 可以申请评估版，试用30天。如果已有许可，直接填入后进行下一步

## 安装类型
- New Installation - 新安装
- Import data from an XML backup - 导入已有的备份

这里选择 `New Installation` 重新安装，如果需要从已有的备份导入，选第二项即可

## 数据库设置
- Embedded - 内嵌的 HSQLDB 数据库，评估版适用，正式版不建议
- JDBC Connection - 标准的java数据库连接，适用于各种外部自己安装的数据库
- JNDI Datasource - JNDI数据源形式

这里选择 `JDBC Connection` ，然后选择：`Mysql`，填入对应的信息进行下一步
![crowd数据库设置](https://confluence.atlassian.com/crowd/files/192479/131531043/3/1203375301342/SetupDatabaseConfigJDBC.png){:width="100%"}

初始化 `Mysql crowd` 数据库和账号密码
```sql
# 以管理员方式登录mysql控制台，初始化数据库和账号密码
$ mysql -uroot -p
mysql> CREATE DATABASE crowd CHARACTER SET utf8 COLLATE utf8_bin;
mysql> GRANT ALL PRIVILEGES ON crowd.* TO crowd@'%' IDENTIFIED BY 'crowdXXXX';
mysql> GRANT ALL PRIVILEGES ON crowd.* TO crowd@'localhost' IDENTIFIED BY 'crowdXXXX';
mysql> FLUSH PRIVILEGES;
mysql> QUIT
```

提供一个 `mysql-connector` 下载链接吧：
[mysql-connector-java-5.1.42-bin.jar](http://on6gnkbff.bkt.clouddn.com/20170530080308_mysql-connector-java-5.1.42-bin.jar.zip)

## 导入备份（可选）
如果有备份，导入即可，没有的话直接跳过

## 站点选项
需要设置 crowd 名称，填写：`Crowd` 即可

`Base URL` 可以吧 localhost 换成 ip

## 邮件服务
可以配置邮件通知，嫌麻烦的跳过即可

## 默认Directory 
设置Directory名词：`Crowd`
这里的 `Directory` 有：名单 和 目录的意思，理解成名单更贴切一点。以后集成时好多权限设置都跟这个有关

## 设置系统管理员（重要）
每个产品都需要设置一个自己的管理员，方便以后的系统管理和权限设置等，用户名和密码记住了！    
Crowd 系统管理员账号和密码尤其重要，因为和其他产品集成后，可以给在这里集中管理所有的用户和组和名单（Directory）
![设置 crowd 系统管理员](https://confluence.atlassian.com/crowd/files/192479/132251658/2/1203375301094/setup-defaultadmin.png){:width="100%"}
## 集成应用
默认已选中选择的两个服务：
- OpenID Server - 看介绍，应该是可以和后端用户打通，比如和第三方的管理后台用户关联起来，感觉不错，有空可以研究研究！
- Demo Application - 示例

默认即可，直接【下一步】

恭喜，到这里就初始配置完成，赶紧去体验一下吧！！！

# 后话
Crowd 的作用就是来集成其他 Atlassian 产品的，比如：`JIRA、Fisheye、Confluence` 等产品

此篇文章仅介绍安装部分，后续会单独介绍与其他产品的集成，后面的才是重点

花了不少功夫在 Crowd 集成上面，其中一个坑是 JIRA 7 和 7以下版本的差异，导致无法JIRA登陆的问题。。。


