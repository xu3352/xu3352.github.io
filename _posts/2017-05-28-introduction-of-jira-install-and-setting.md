---
layout: post
title: "jira7.3.6(linux) 安装配置介绍"
tagline: ""
date: '2017-05-28 13:48:08 +0800'
category: atlassian
tags: jira atlassian agile
---
> jira 安装配置介绍 （推荐[官方文档](https://confluence.atlassian.com/jirasoftwareserver073/getting-started-with-jira-software-861254171.html)）

# jira 是什么
集任务计划、Bug跟踪、任务分配管理于一体的服务平台，这里介绍的是：JIRA Software

系列产品： 
- **JIRA Software**: 整合了JIRA Core + 敏捷开发流程
- **JIRA Service Desk**: 搜集信息、服务、报告    
    你的团队有工作要做。你的客户希望高效并且你的业务也要做到高效。JIRA服务台通过有效的SLA支持，可定制队列，将用户体验直观化
- **JIRA Core**: 计划、跟踪、工作 – 更智能、更高效   
    JIRA是一个专业的项目跟踪管理工具，帮助团队创建计划任务、构建并发布优秀的产品；全球成千上万的团队选择JIRA，用JIRA来捕获,组织管理缺陷、分配任务，跟踪团队的活动
 
# jira 安装
官方文档基本都是最全面的，读文档是个好习惯：[jira(linux)官方安装文档](https://confluence.atlassian.com/adminjiraserver073/installing-jira-applications-on-linux-861253030.html)

JIRA7.3.6 安装要求：JDK1.8+（避免使用JDK 1.8._25、1.8._31）、MySQL5.5+

## 下载地址
可指定平台和版本下载：[下载地址](https://www.atlassian.com/software/jira/update), 这里下载最新的：jira 7.3.6 tar.gz版

## 安装详细步骤
```bash
# 1.解压
$ tar -xzvf atlassian-jira-software-7.3.6.tar.gz

# 2.放到指定目录, 比如：/data/software/
$ mv atlassian-jira-software-7.3.6-standalone /data/software/

# 3. 使用jdk 1.8 版本(这里使用的是不推荐的版本，估计哪块有点bug吧)
#   由于默认 jdk 是1.6的，所以需要手动指定 jdk 版本
$ cd /data/software/atlassian-jira-software-7.3.6-standalone

# 3.1 修改catalina.sh
$ vim vim ./bin/catalina.sh
# 放前面103行空白处即可, 假如 jdk 的目录为：/data/software/jdk1.8.0_131
export JAVA_HOME=/data/software/jdk1.8.0_131
export JAVA_HOME=$JAVA_HOME/jre
# export JIRA_HOME=/data/software/jira-home

# 3.2 修改 ./bin/setclasspath.sh
$ vim ./bin/setclasspath.sh
# 放前面23行左右空白处即可
export JAVA_HOME=/data/software/jdk1.8.0_131
export JAVA_HOME=$JAVA_HOME/jre
# export JIRA_HOME=/data/software/jira-home

# 4.配置数据目录, 尽量避免放在安装目录下, 或者配置 jdk 时最后加上 JIRA_HOME 系统变量也行
$ vim ./atlassian-jira/WEB-INF/classes/jira-build.properties
jira.home = /data/software/jira-home

# 5.修改端口，跟 tomcat 一样改端口
$ vim ./conf/server.xml
# 找到这里修改即可
<Connector port="9100" ... 

# 6.启动/停止 jira (停止：./bin/stop-jira.sh)
# 启动 jira 后即尝试可访问，如果有问题可以查看启动日志：$JIRA_INSTALL/logs/catalina.out
$ ./bin/start-jira.sh
```

# jira 配置
浏览器打开：`http://192.168.7.250:9100`，自动会进入到 JIRA 设置页面       
选择 ***I'll set it up myself***  (自己设置)   
## 配置 mysql 数据库
选择安装好的 Mysql，填写对应的信息后，可以点【测试链接】按钮，没问题再下一步。如果连不上，一般来说是登陆 ip 限制了，重新赋予权限
```sql
-- 直接用控制台管理员账号/密码登陆， 创建 jira 数据库，创建用户名和密码
$ mysql -uroot -p
mysql> create database jira default character set utf8 collate utf8_bin;
mysql> grant all on jira.* to 'jira'@'%' identified by 'jiraXXXX';
mysql> flush privileges;
```
如果后面需要修改 mysql 设置：`/data/software/jira-home/dbconfig.xml` （JIRA数据目录下的 dbconfig.xml）
应该是需要手动把连接 mysql 的 jar 包放到 `$JIRA_INSTALL/atlassian-jira/WEB-INF/lib/` 下的 [下载mysql-connector](http://imgffeeii.b0.upaiyun.com/soft/jira/jira7.3.zip)

## 应用设置
然后就是配置：
标题：设置一个标题
模式：（私有/公有）选私有
Base URL: `http://192.168.7.250:9100`

## 许可申请
记住你的：Server ID，申请许可需要用到   
可以申请一个免费 30天 试用的许可，按提示的来就行，申请到许可之后，填入许可的框里，然后【下一步】

## 设置管理员账号
昵称、邮箱、账号、密码

## 邮件通知
选择稍后配置

## 选择语言
默认其实已经中文了，比较方便    

到这里，安装和基本配置基本完成，后面的可以创建项目，走走流程；看看系统设置，权限之类的东西

# 创建项目
可以选择创建示例项目，看看大致的流程，多用用就熟悉了

# 关于破解
Atlassion的产品是收费的，一般都可以使用 30天，能用正版的还是用正版吧


参考：
- [烂泥：jira7.2安装、中文及破解](http://www.ilanni.com/?p=12119)
- [Jira 7.3.6 破解版详细安装步骤](http://www.ffeeii.com/post/550)
- [安装Tomcat指定JDK](http://www.cnblogs.com/lioillioil/archive/2011/10/08/2202169.html)

- [破解包 + Mysql connector](http://imgffeeii.b0.upaiyun.com/soft/jira/jira7.3.zip)

