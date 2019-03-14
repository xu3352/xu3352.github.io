---
layout: post
title: "IntelliJ IDEA 插件: Jump2Mybatis 快速定位到Mapper对应的Element元素"
keywords: "intellij idea,mybatis"
description: "例如在 IntelliJ IDEA 的 Editor 里选中 `studentServiceImpl.update`, 然后按 `Alt+B` 直接跳转到对应Mybatis的SQL文件里的 `update` 节点"
tagline: ""
date: '2019-03-14 17:21:01 +0800'
category: ide
tags: intellij-idea mybatis ide
---
> {{ page.description }}


# Jump2Mybatis

好久之前做的插件, 最近改良了一下, 然后就顺便放到 [github: xu3352/jump2mybatis](https://github.com/xu3352/jump2mybatis) 上了

如果使用 Mybatis 做开发, 那么就会经常在映射的 XML 文件里编写和查看 SQL; 那么如何快速的定位到对应的SQL语句了?

例如要查一个接口的SQL, 那么一般步骤为: 
1. 根据接口 URL 找到 `Controller`
1. 找到对应的 `Service`
1. 找到对应的 `Dao`
1. 找到对应的映射SQL: 假如是 `student.update`
1. 找到 namespace 为 `student` 的 Mybatis的XML配置文件(文件名通常已实体:`Student` 命名, 如:`StudentXXX.xml` 此类)
1. 打开 `StudentXXX.xml` 文件, 然后找到对应的 `update` 节点

那么, 此插件则致力于解决从第一步直达最后一步
{: style="color:red;"}


# 效果图

![操作跳转](/assets/archives/jump2mybatis-plugin-snapshot-01.png){:width="100%"}

![跳转到指定元素ID上](/assets/archives/jump2mybatis-plugin-snapshot-02.png){:width="100%"}

![插件信息](/assets/archives/jump2mybatis-plugin-snapshot-03.png){:width="100%"}


