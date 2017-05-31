---
layout: post
title: "Confluence 集成 Crowd 实现单点登录"
tagline: ""
date: '2017-05-31 19:20:58 +0800'
category: atlassian
tags: confluence crowd atlassian agile
---
> Confluence 5.4.4 集成 Crowd 2.12.0 实现单点登录

# 说明
版本对应说明：
- Confluence 2.6.2以下 <==> Crowd 不支持
- Confluence 2.6.2~2.7.4  <==>  Crowd 1.2+
- Confluence 2.8~3.4.8  <==>  Crowd 1.3.2~2.2.7
- Confluence 3.5+  <==>  Crowd 2.1+

多个产品不要部署到同一个 tomcat 容器里（这里特指 war 版本安装的产品），前行的几个产品我们都是独立安装版本的，不存在此问题

# Crowd 配置
登陆 Crowd 管理后台：`http://192.168.7.250:8095/crowd/console`   
步骤可以参考先前的文章：[JIRA 集成 Crowd 实现单点登录](https://xu3352.github.io/atlassian/2017/05/30/Integrating-Crowd-with-Atlassian-JIRA) 一文，已经非常详细了

## 1.准备 Directories/Groups/Users
由于之前已经创建好了，这里不再赘述

## 2.导入已有 Confluence 用户
导入方法类似，只是产品选择：`Confluence`，目录选择：`test-directory`

导入后 Confluence 的用户和组(`confluence-administrators`和`confluence-users`)都会被同步过来，记得按需求把新导入的用户重新分配到：`test-administrators` 和 `test-users`，以后只管理我们自己创建的两个组就可以了

## 3.新建 Confluence Application
步骤如下：
- 顶部菜单：Application
- 左侧菜单：Add application
- 选择 Application 类型：`Confluence`，Name：`wiki`，Password：`wiki` 【下一步】
- 输入 URL：`http://192.168.7.250:8090/`，点击【Resolve IP Address】自动提取IP地址【下一步】
- 选择先前创建的目录：`test-directory` 【下一步】
- 勾选 “Allow all users to authenticate” (省事) 【下一步】
- 确认无误后点击【Add application】 按钮即可完成添加操作
- 完成后可以对新导入的账号进行模拟登陆测试 
![Crowd 新建 Confluence Application](http://on6gnkbff.bkt.clouddn.com/20170531115014_crowd-add-confluence-application.png){:width="100%"}

# Confluence 配置
登陆 Confluence 管理控制台：`http://192.168.7.250:8090/`

## 1.新增 Crowd Directory
右上角齿轮图标下拉框选择：【站点管理】-> 【用户&安全】-> 【用户目录】->【添加目录】-> 【Atlassian Crowd】进入配置页面： 
- 输入名称 - 默认已经填好了
- 服务器URL - crowd 访问地址: `http://192.168.7.250:8095/crowd`
- 应用程序名称 - `wiki` (crowd添加应用程序时设置的:名称)
- 应用程序密码 - `wiki` (crowd添加应用程序时设置的:密码)
- 其他选项默认即可，点击【测试设置】，可以看到连接测试成功字样，然后点击【测试并保存】就添加好了
- 可以把新建的 “Crowd Server” 目录顺序调整到最前面去
![Confluence 新增 Crowd Directory](http://on6gnkbff.bkt.clouddn.com/20170531120020_confluence-add-crowd-user-driectory.png){:width="100%"}

## 2.全局权限
菜单栏【用户目录】上面就是菜单：【全局权限】-> 点击右上角的【编辑权限】    
把同步过来的 `test-administrators`组 和 `test-users`组 都配置进来，授予那些权限参考：`confluence-administrators` 和 `confluence-users`

## 3.开启 Crowd 的 SSO 认证
这一步官网上面说是可选的，没测试过。    
配置过程：
```bash
# 进入 confluence 安装目录
$ cd /data/software/atlassian-confluence-5.4.4

# 编辑 `/confluence/WEB-INF/classes/seraph-config.xml` 注释一行，解注一行
$ vim ./confluence/WEB-INF/classes/seraph-config.xml
# 找到这一行并注释掉
<!-- <authenticator class="com.atlassian.confluence.user.ConfluenceAuthenticator"/> -->
# 找到这一行，并解开注释
<authenticator class="com.atlassian.confluence.user.ConfluenceCrowdSSOAuthenticator"/>

# 配置 crowd.properties 文件, 可以从 crowd 安装目录下 copy 到 confluence 的 classes 目录下
$ cd /data/software/atlassian-confluence-5.4.4
$ cp /data/software/atlassian-crowd-2.12.0/client/conf/crowd.properties ./confluence/WEB-INF/classes/

# 修改 crowd.properties 配置，改成先前在 crowd 里创建的 application 设置的参数, 同一台主机可使用 localhost
$ vim ./confluence/WEB-INF/classes/crowd.properties
application.name                        wiki
application.password                    wiki
application.login.url                   http://localhost:8090

```

# 尝试登陆
记得先重启 Confluence 服务：
```bash
# 进入 Confluence 安装目录
$ cd /data/software/atlassian-confluence-5.4.4

# 停止服务
$ ./bin/stop-confluence.sh

# 启动服务
$ ./bin/start-confluence.sh
```
然后浏览器先登录 JIRA，然后浏览器在开个 Tab 页面，输入：`http://192.168.7.250:8090/` 见证奇迹


# 总结
到此，`JIRA + Fisheye + Confluence` 集成 Crowd 的介绍就都完成了，只要一个会了，其他的套路都差不多，注意 JIRA7 和 JIRA6及以下 版本的区别       

最终我们实现了：JIRA、Fisheye、Confluence产品切换时不需要重新登录目的

如果 Atlassian 的几个产品用得好，对团队应该是可以起到很大的推动作用的。毕竟人家是商业版的，而且很贵，用起来感觉就像奢侈品一样了，哈哈！！！

---
参考：
- [Integrating Crowd with Atlassian Confluence](https://confluence.atlassian.com/crowd/integrating-crowd-with-atlassian-confluence-198573.html)
- [JIRA 集成 Crowd 实现单点登录](https://xu3352.github.io/atlassian/2017/05/30/Integrating-Crowd-with-Atlassian-JIRA)

