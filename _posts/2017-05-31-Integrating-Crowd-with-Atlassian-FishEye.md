---
layout: post
title: "FishEye 集成 Crowd 实现单点登录"
tagline: ""
date: '2017-05-31 17:06:35 +0800'
category: atlassian
tags: fisheye crowd atlassian agile
---
> FishEye 4.0.4 (加Crucible) 集成 Crowd 2.12.0 实现单点登录

# 说明
Fisyeye 集成配置较 JIRA 的简单，大致的步骤跟 JIRA 集成 Crowd 一样的，所以这个就简单了

要求：fisheye 1.3.x+

先前安装的版本是最新版本的，所以不用管了

# Crowd 配置

## 1.新建 目录/组/用户
还记得 jira 集成 crowd 的步骤吧，第一步就是：新建 目录/组/用户      

jira 集成是已经创建过了，这里不用在单独创建了，直接使用就好 （不会的请看前一篇文章）

## 2.导入已有 Fisheye 用户
这一步可以把以后的账号导入 crowd 里，导入过程跟 JIRA 的导入一样，需要注意的是导入的时候选择的目录：`test-directory`

Fisheye 好像没有默认的组，也没有默认的系统管理员，但是有：Fisheye系统管理密码

同样需要重新分配组成员，按需求把新导入的用户重新分配到：`test-administrators` 和 `test-users`

## 3.新建 Fisheye Application
步骤如下：
- 顶部菜单：Application
- 左侧菜单：Add application
- 选择 Application 类型：FishEye，Name：`fisheye`，Password：`fisheye` 【下一步】
- 输入 URL：`http://192.168.7.250:8060/fisheye/`，点击【Resolve IP Address】自动提取IP地址【下一步】
- 选择先前创建的目录：`test-directory` 【下一步】
- 勾选 “Allow all users to authenticate” (省事) 【下一步】
- 确认无误后点击【Add application】 按钮即可完成添加操作
- 完成后可以对新建的账号进行模拟登陆测试
![Crowd 新建 Fisheye Application](http://on6gnkbff.bkt.clouddn.com/20170531094005_crowd-add-fisheye-application.png){:width="100%"}

# Fisheye 配置
直接进入 Fisheye 的管理控制台：`http://192.168.7.250:8060/fisheye/admin` 

## 添加 Crowd Directory
右上角齿轮图标下拉框选择：【Administration】-> 【User Settings】-> 【User Direcotrys】-> 【Add Directory】，点击【Atlassian Crowd】按钮：
- 输入名称 - 默认已经填好了
- 服务器URL - crowd 访问地址: `http://192.168.7.250:8095/crowd`
- 应用程序名称 - `fisheye` (crowd添加应用程序时设置的:名称)
- 应用程序密码 - `fisheye` (crowd添加应用程序时设置的:密码)
- 其他选项默认即可，点击【Test Settings】，可以看到连接测试成功字样，然后点击【Save and Test】就添加好了
- 可以把新建的 “Crowd Server” 目录顺序调整到最前面去，可以点【同步】按钮进行同步用户和组数据
![Fisheye 添加 Crowd Directory](http://on6gnkbff.bkt.clouddn.com/20170531101934_fisheye-add-user-directory.png){:width="100%"}

## 全局权限
左侧菜单：【Security Settings】->【Global Setting】：   
直接把所有同步过来的组够打钩吧，省事，默认 “Access to FishEye“ 全部已经选中且不能修改，可以单独设置 Crucible 的访问权限

## 配置Crowd的SSO认证
直接编辑安装目录下的 config.xml 文件：`vim /data/software/fecru-4.0.4/config.xml`   
核心的就一句：`<crowd sso-enabled="true"/>` 注意前后位置哦，加多了会导致启动失败！    
```xml
<config>
...
	<security allow-anon="false" allow-cru-anon="false">
        <built-in>
                <signup enabled="true"/>
        </built-in>
        
        <!-- crowd sso支持 -->
        <crowd sso-enabled="true"/>
        
        <admins>
                <system-admins>
                        <group>confluence-users</group>
                </system-admins>
        </admins>
        <avatar><disabled/></avatar>
        <emailVisibility/>
    </security>
...
</config>
```

## 用户关系映射
这个比较有意思，可以把 svn 的提交者和当前用户关联起来

这样在后面会很方便，这里改完后，JIRA里看到的提交者就对应到用户了

# 登陆尝试
记得重启 Fisheye，然后可以先登录 JIRA，然后在开个 Tab 页面，填入：`http://192.168.7.250:8060/fisheye/` 应该就自动登录了，就是这么神奇
```bash
# 进入安装目录
$ cd /data/software/fecru-4.0.4

# 停止
$ ./bin/stop.sh

# 启动
$ ./bin/start.sh
```

---
官方文档：
- [Integrating Crowd with Atlassian FishEye](https://confluence.atlassian.com/crowd/integrating-crowd-with-atlassian-fisheye-200895.html)
- [Configuring FishEye to talk to Crowd](https://confluence.atlassian.com/fisheye/connecting-to-crowd-813695565.html)

