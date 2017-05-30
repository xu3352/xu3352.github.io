---
layout: post
title: "JIRA 集成 Crowd 实现单点登录"
tagline: ""
date: '2017-05-30 16:44:04 +0800'
category: atlassian
tags: crowd jira atlassian agile
---
> JIRA 集成 Crowd 实现单点登录

# 说明
如果你愿意每次都登录一遍 Atlassian 的产品(JIRA、Confluence、Fisheye)，那么这篇文章就不适合你了，哈哈

首先贴上最详细的官方文档，不过是英文版的（现在知道懂英文的好处了吧），不是有翻译吗，嘿嘿
[JIRA 集成 Crowd 官方文档](https://confluence.atlassian.com/crowd/integrating-crowd-with-atlassian-jira-192625.html)    

# 注意事项
- 当前 Crowd 版本(2.12.x)支持 JIRA 3.7.4以后的版本
- 如果 JIRA 4.2 版本，请升级 Crowd 2.0.7及以上版本
- JIRA 4.3+ 需要 Crowd 2.1+ 
- 不要把每个产品部署到一个 tomcat 里 （先前文章的都是独立安装版本，不存在此问题）
- 其他应用程序（如 Fisheye、Confluence） 中使用 JIRA 作为用户目录（Directory），则JIRA 关闭时将无法访问

***总之：***
都使用比较新的版本应该是没问题的，先前安装的几个产品除了 Confluence 版本稍低一点，其他都是最新版本的，所以不用担心

# Crowd配置
先以系统管理员身份登录 Crowd：`http://192.168.7.250:8095/crowd/console`
## 1.新建 目录/组/用户
- 新建目录：`test-directory`
    - 顶部菜单：Directories
    - 左侧菜单：Add Directory
    - 选择 Internal 类型
    - 设置 Name：`test-directory`，其他可默认
    - 确认更新
![新建目录](http://on6gnkbff.bkt.clouddn.com/20170530102512_crowd-add-directory.png){:width="100%"}

- 新建组：`test-administrators` 和 `test-users`
    - 顶部菜单：Groups
    - 左侧菜单：Add group
    - 输入 Name：`test-administrators`
    - Directory 下拉框选择刚刚创建的目录：`test-directory`
    - 点击 【Create】按钮就可以了
    - 以同样的方式创建组：`test-users`
![新建组](http://on6gnkbff.bkt.clouddn.com/20170530103313_crowd-add-group.png){:width="100%"}

- 新建用户：`testAdmin` 和 `testUser`
    - 顶部菜单：Users
    - 左侧菜单：Add users
    - 填写对应的信息：`testAdmin`
    - Directory 选择：`test-directory` 目录
    - 以同样的方式创建 `testUser` 账号
![新建用户](http://on6gnkbff.bkt.clouddn.com/20170530103629_crowd-add-user.png){:width="100%"}

- 组分配成员：testAdmin 分配到 `test-administrators`组，而 testUser 分配到 `test-users`组
    - 顶部菜单：Groups
    - Directory 选择：`test-directory`，然后查询
    - 点击组：`test-administrators`
    - 点击 Tab 页：Direct members 分配成员
    - 点击 【Add usrs】按钮
    - 弹窗口中点击【Search】按钮加载成员
    - 勾选 `testAdmin` 用户
    - 以同样的方式把 testUser 加入 `test-users`组里

## 2.导入已有 JIRA 用户
不管 JIRA 是否已经创建过用户和组，这里都需要导入一遍，因为 JIRA系统管理员和默认的组需要导入过来使用     
不过得注意，导入时应当选择刚刚创建的Directory：`test-directory`     
 步骤如下： 
- 顶部菜单：Users
- 左侧菜单：Import users
- 选择默认的【Atlassian importer】，然后下一步
- 产品选择：JIRA
- Directory 选择先前创建的目录：`test-directory`
- 修改其他项目：dbname、username、password 等数据库信息，然后下一步完成导入   

***注意，重新分配组成员(其他产品导入时也是需要操作一遍)***：
```java
记得把新导入过来的成员分别添加到新的组里
管理员的放 test-administrators 组里
用户的放 test-users 里
```

这里会把 JIRA 所有的用户和组都导入过来      
JIRA7 导入的组应该是：`jira-administrators` 和 `jira-software-users` 2个组     
JIRA6 及以下版本 应该是：`jira-administrators` 和 `jira-developers` 和 `jira-users` 3个组      
在配置登陆权限的时候也有区别！

![导入JIRA用户](http://on6gnkbff.bkt.clouddn.com/20170530110755_crowd-import-users.png){:width="100%"}

## 3.新建 JIRA Application
步骤如下：
- 顶部菜单：Application
- 左侧菜单：Add application
- 选择 Application 类型：JIRA，Name：`jira`，Password：`jira` （需记住）【下一步】
- 输入 URL：`http://192.168.7.250:9100/`，点击【Resolve IP Address】自动提取IP地址【下一步】
- 选择先前创建的目录：`test-directory` 【下一步】
- 勾选 “Allow all users to authenticate” (省事) 【下一步】
- 确认无误后点击【Add application】 按钮即可完成添加操作
- 完成后可以对新建的账号进行模拟登陆测试

步骤图如下：（图中由于之前已经加过 jira，除第一张截图外其他取名为：jiratest）
![添加JIRA Application步骤01](http://on6gnkbff.bkt.clouddn.com/20170530113239_crowd-add-application-01.png){:width="100%"}
![添加JIRA Application步骤02](http://on6gnkbff.bkt.clouddn.com/20170530113239_crowd-add-application-02.png){:width="100%"}
![添加JIRA Application步骤03](http://on6gnkbff.bkt.clouddn.com/20170530113239_crowd-add-application-03.png){:width="100%"}
![添加JIRA Application步骤04](http://on6gnkbff.bkt.clouddn.com/20170530113240_crowd-add-application-04.png){:width="100%"}
![添加JIRA Application步骤05](http://on6gnkbff.bkt.clouddn.com/20170530113240_crowd-add-application-05.png){:width="100%"}
![添加JIRA Application步骤06](http://on6gnkbff.bkt.clouddn.com/20170530114412_crowd-add-application-06.png){:width="100%"}

# JIRA配置
以系统管理员身份登陆JIRA：`http://192.168.7.250:9100/`      

## 添加 Crowd Directory
右上角齿轮图标下拉框选择：【用户管理】-> 【用户目录】-> 【添加目录】-> 【Atlassian 人群】
Crowd Server设置页面：
- 输入名称 - 默认已经填好了
- 服务器URL - crowd 访问地址: `http://192.168.7.250:8095/crowd`
- 应用程序名称 - jira (crowd添加应用程序时设置的:名称)
- 应用程序密码 - jira (crowd添加应用程序时设置的:密码)
- 其他选项默认即可，点击【测试设置】，可以看到连接测试成功字样，然后点击【测试并保存】就添加好了
- 可以把新建的 “Crowd Server” 目录顺序调整到最前面去

![jira添加crowd目录01](http://on6gnkbff.bkt.clouddn.com/20170530115456_jira-add-crowd-directory.png){:width="100%"}
![jira添加crowd目录02](http://on6gnkbff.bkt.clouddn.com/20170530120331_jira-add-crowd-directory-02.png){:width="100%"}

## 配置Crowd的SSO认证
官网上目前写的是可选项，那么之前的配置应该是好使了，不过没有进行测试了，如果测试的话，最好把 crowd 和 jira 都重启一下

详细步骤：  
```bash
# 进入 jira 安装目录
$ cd /data/software/atlassian-jira-software-7.3.6-standalone

# 修改 seraph-config.xml，注释掉一行，解注一行
$ vim atlassian-jira/WEB-INF/classes/seraph-config.xml
# 找到这一行并注释掉
<!--<authenticator class="com.atlassian.jira.security.login.JiraSeraphAuthenticator"/>-->
# 找到这一行，并解开注释
<authenticator class="com.atlassian.jira.security.login.SSOSeraphAuthenticator"/>

# 配置 crowd.properties 文件, 首先从 crowd 安装目录下 copy 到 jira 的 classes 目录
$ cd /data/software/atlassian-jira-software-7.3.6-standalone
$ cp /data/software/atlassian-crowd-2.12.0/client/conf/crowd.properties ./atlassian-jira/WEB-INF/classes

# 编辑 crowd.properties 文件
# 输入crowd 里设置的 jira application 参数, 同一台服务器可用 localhost，其他默认
$ vim atlassian-jira/WEB-INF/classes/crowd.properties

application.name                        jira
application.password                    jira
application.login.url                   http://localhost:9100/

``` 

# 尝试登陆
重启 crowd 和 jira 服务，然后可以尝试使用 testAdmin 登陆 JIRA   
这个时候应该是不好使的！！！       

JIRA6 及以下版本 可以通过：     
【系统】 ->【全局权限】-> 【JIRA 用户】把指定的组加上【JIRA 用户】权限就可以登陆 JIRA 了     

JIRA7 全局权限里已经没有【JIRA 用户】权限了，需要在应用程序里配置：     
【应用程序】->【应用程序访问权限】-> 把Crowd同步过来的组加到 JIRA Software 里就可以登陆了    
![应用程序访问权限](http://on6gnkbff.bkt.clouddn.com/20170530125538_jira-application-asscess-setting.png){:width="100%"}

Crowd 里同步过来的的管理员组：`test-administrators` 可以赋予【JIRA 管理员】权限，方便别人一起来管理     
可以根据需求来决定是否赋予：【JIRA 系统管理员】最高权限

# 总结
1. 需要配置 crowd 的 Directory/Groups/Users
2. 导入 jira 用户时选新创建的目录
3. crowd 配置应用程序时记得设置的用户名和密码，之后要模拟登陆测试
4. jira 要添加 crowd 目录，同步新建的组合用户
5. 配置 crowd 的 sso 登陆认证
6. jira 全局权限设置，配置新建的管理组的管理权限 (jira6在全局权限里配置登陆权限)
7. jira 应用程序需要允许新建的组来登陆

---
参考：
- [Missing global permissions “JIRA Users” in JIRA7](https://community.atlassian.com/t5/JIRA-questions/Missing-global-permissions-JIRA-Users-in-JIRA7/qaq-p/326823)

