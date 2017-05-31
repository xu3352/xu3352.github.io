---
layout: post
title: "confluence 5.4.4 安装和配置介绍"
tagline: ""
date: '2017-05-29 22:31:25 +0800'
category: atlassian
tags: confluence atlassian agile
---
> confluence 5.4.4 安装和配置介绍

# Confluence
知识共享平台，减少成员间的沟通成本  
一个专业的企业知识管理与协同软件，可以用于构建企业wiki。通过它可以实现团队成员之间的协作和知识共享  

# 安装
[官方Linux压缩包版文档](https://confluence.atlassian.com/conf54/confluence-installation-and-upgrade-guide/confluence-installation-guide/installing-confluence/installing-confluence-on-linux/installing-confluence-on-linux-from-archive-file)      
环境要求：
- jdk 1.7+
- mysql 5.1, 5.5

为了其他产品方便，最好使用统一环境：jdk1.8、mysql5.5

服务器硬件要求：(官方推荐配置)    
5 并发用户：(用户量x10应该没啥问题)      
- 2GHz+ CPU
- 512MB 内存
- 5GB 数据库空间

25 并发用户：        
- Quad 2GHz+ CPU
- 2GB+ 内存
- 10GB 数据库空间


## 下载地址
[confluence 5.4.4](https://www.atlassian.com/software/confluence/downloads/binary/atlassian-confluence-5.4.4.zip)    
[所有版本列表](https://www.atlassian.com/software/confluence/download-archives)     
下载的时候有个提速技巧，就是把 `https` 改成 `http`

## 指定数据目录
跟 jira、fisheye 类似，同样指定一下数据目录，最好跟安装目录分开，方便以后更新升级之类的影响
```bash
# 解压并放到指定目录
$ unzip atlassian-confluence-5.4.4.zip
$ mv atlassian-confluence-5.4.4 /data/software/

# 修改数据目录, 最好不要放到安装目录下面
$ cd /data/software/atlassian-confluence-5.4.4

$ vim confluence/WEB-INF/classes/confluence-init.properties
confluence.home=/data/software/confluence-home
```

核心的配置文件路径：`/data/software/confluence-home/confluence.cfg.xml`     
以后修改 mysql 密码之类的改这个文件即可

## 端口指定
其实就是修改 tomcat 的端口，如果出现端口占用的情况，上这里来改
```bash
$ cd /data/software/atlassian-confluence-5.4.4

# 找到 `Connector` 位置，对应修改即可
$ vim conf/server.xml
<Connector className="org.apache.coyote.tomcat4.CoyoteConnector" port="8090" ...
```

## 启动/停止
```bash
$ cd /data/software/atlassian-confluence-5.4.4

# 启动
$ ./bin/start-confluence.sh

# 停止
$ ./bin/stop-confluence.sh
```

# Confluence 设置向导
[官方 Confluence 设置向导](https://confluence.atlassian.com/conf54/confluence-installation-and-upgrade-guide/confluence-setup-guide)     
启动后，浏览器访问：`http://192.168.7.250:8090/` 自动进入设置向导

## 许可
根据 Server ID：可以申请一个试用的许可，申请好之后进入下一步

## 选择安装类型
这里选择：
- `Evaluation Installation` 评估版，默认是内嵌的 HSQLDB 数据库
- `Production Installation` 也就是正式版，需要手动配置数据库

## Mysql 配置
选择 `Direct JDBC`，进入手动配置数据库页面，填入对应的信息后，点击【下一步】进行数据库表的初始化
```sql
-- 以管理账户登陆控制台, 创建数据库和用户密码
$ mysql -uroot -p
mysql> CREATE DATABASE confluence CHARACTER SET utf8 COLLATE utf8_bin;
mysql> GRANT ALL PRIVILEGES ON confluence.* TO confluence@'%' IDENTIFIED BY 'confluenceXXXX';
mysql> GRANT ALL PRIVILEGES ON confluence.* TO confluence@'localhost' IDENTIFIED BY 'confluenceXXXX';
mysql> FLUSH PRIVILEGES;
mysql> QUIT
```

## 站点设置
可以选择创建：  
- Example Site - 示例站点
- Empty Site - 空站点
- Restore  From Backup - 从备份导入站点

这里选择 `Empty Site` 空站点即可

## 用户管理设置
- Manage users and groups within confluence - 独立设置创建和管理自己的用户及用户组（这里选择此项）
- Connect To JIRA - 可以使用 JIRA 管理用户（超过500用户不建议使用，另外后面可以集成 crowd，集中用户管理的）

这里选择 `Manage users and groups within confluence` 进行独立设置

## 系统管理员设置
系统管理员可以对 confluence 进行最高权限的管理，请牢记账号和密码！
- Username — 用户名(登陆账号)
- Password — 密码
- Confirm — 密码确认
- Name — 姓名（昵称）
- Email — 邮箱

点击下一步之后，可以看到设置成功画面，现在可以进入 Confluence 进行体验了！

---
参考：
- [烂泥：wiki系统confluence5.6.6安装、中文、破解及迁移](http://www.ilanni.com/?p=11989)

