---
layout: post
title: "使用 DTS 实现跨阿里云账号的 RDS 实例迁移"
keywords: ""
description: "2个阿里云账号的mysql数据库迁移过程"
tagline: ""
date: '2019-02-18 16:07:39 +0800'
category: mysql
tags: mysql aliyun
---
> {{ page.description }}

# 迁移流程
参考 [使用 DTS 实现跨阿里云账号的 RDS 实例迁移](https://help.aliyun.com/document_detail/26652.html)


**场景**:
- 源库RDS示例:   RDS-A
- 目标库RDS示例: RDS-B

目标就是: 把 RDS-A 的所有的库/表/数据等 全部都迁移到 RDS-B 里

# 注意事项
- 准备工作: 2个RDS的登陆账号/密码, 某些操作需要短信验证码; 两个浏览器窗口
- 仔细阅读文档, 按步骤一步一步来, 迁移任务是在 RDS-B 上面操作的
- `角色名称` 这里有点复杂, 因为是需要在 RDS-A 里创建 `用户角色`, 然后 `受信云账号ID` 则是填写的 RDS-B 的账号ID
- 角色创建之后还需要 管理-编辑基本信息 和 授权, 编辑则需要修改json的结构; 授权则需要RDS的操作权限(自定义授权的也没问题)
- 源库信息 的数据库账号/密码 填写完成后, 记得点 `测试链接` 来验证, 如果报错提示 [EntityNotExist.Role : The role not exists: acs:ram::1695523917514117:role/AliyunDTSDefaultRole](http://bbs.yunxiaoer.com/yun-28-1-1.html), 则 RDS-A 上点击 `产品与服务` - `数据传输服务 DTS` - `前往RAM角色授权` - `同意授权`
- 目标库信息 当然就是 RDS-B 自己对应的内容了, 创建一个高权限的数据库账号即可
- 迁移类型有: `结构迁移` `全量数据迁移` `增量数据迁移` 三个复选框, 前两个默认是选择的, 后一个是要花钱的
- 迁移对象全部加到后边, 最后点击 `与检查并启动`, 全部都成功呢, 就可以下一步了
- `购买配置确认` 倒是吓我一跳, 看起来是即按时间收费, 又按流量收费; 不慌, 如果前面没有选择 `增量数据迁移`, 这里的费用则是 0 元, 可以选择最大的 `链路规格`, 点击 `立即购买并启动` 
- 最后就是等进度条到 100% 了


**汇总一下**: 

先在 RDS-B 上使用 DTS 进行数据迁移, 填写源库信息需要填写 RDS-A 的登陆账号ID 和对应的 RAM 角色名称等信息, 所以要在 RDS-A 上创建角色和授权, 最后再回到 RDS-B 上进行配置

---
参考：
- [原文档:使用 DTS 实现跨阿里云账号的 RDS 实例迁移](https://help.aliyun.com/document_detail/26652.html)
- [跨账号使用DTS迁移RDS报错EntityNotExist.Role : The role not exists: acs:ram](http://bbs.yunxiaoer.com/yun-28-1-1.html)

