---
layout: post
title:  "IntelliJ IDEA SVN检出地址重新定位/切换"
date:   2017-04-07 01:55:00 +0800
category: ide
tags: intellij-idea svn ide tools
---
> 当 SVN 服务器 IP 地址变更时, 老的 IP 无法使用, 客户端需要重新定位到新的 IP 地址

# 预期
场景: 同一个服务器的SVN资源库, 内网地址正常使用, 需要是用外网地址 或者 SVN 服务器 IP 变更了   

期望: 本地代码不重新检出的情况下(尤其是代码有变更，还没提交情况), 可以重新切换到最新的 IP 上   

由于 IDEA 可以配置分支, 所以相关的地方也需要一起修改

# 操作步骤
2步操作到位: (SVN服务器没变, IP/域名变更)
1. `Relocate`(重新定位) 到新URL
2. `Update/Switch`(更新/切换) 到新URL, 更新最新代码即可

如果直接更新时使用新URL的话, 会收到如下报错:
```bash
    Error:svn: E155025: 'svn://192.168.7.250/xxx'
    is not the same repository as
    'svn://外网IP/xxx'
```

各个 IDE 都支持界面上操作, 这里通过图文详细仅介绍 IDEA 里的操作

# 查看 SVN 仓库
`[菜单] -> VCS -> Browser VCS Repository -> Browse Subversion Repository...`      
然后可以看到`SVN Repositories`, 这里把新的仓库地址配置进去就可以知道是否好使了
![](http://on6gnkbff.bkt.clouddn.com/20170814151138_idea-svn-07-browse-repository.png){:width="100%"}

# IDEA 重新定位
`重新定位` : 用于IP/域名等变更     
`[项目] --右键--> Subversion -> Relocate...`
![](http://on6gnkbff.bkt.clouddn.com/20170814151136_idea-svn-01-relocate.png){:width="100%"}
`To URL:` 这里填入新的 IP 地址
![](http://on6gnkbff.bkt.clouddn.com/20170814151138_idea-svn-02-relocate.png){:width="100%"}

# IDEA 选择/配置分支
`[项目] --右键--> Subversion -> Update Directory...`
![](http://on6gnkbff.bkt.clouddn.com/20170814151138_idea-svn-03-update-project.png){:width="100%"}
勾选 `Update/Switch to special url`, Use branches 栏点击最右侧的 `...` 按钮选择/配置分支;  
点击 `Configure Branches...` 进行分支配置;
![](http://on6gnkbff.bkt.clouddn.com/20170814151138_idea-svn-04-select-branches.png){:width="100%"}
`Trunk location` : 可以直接IP或路径, 也可以点击右侧 `...`按钮进行选择;    
`Branch location` : 可以删除老的分支路径, 添加新的分支路径;     
配置好之后, 点击 `OK` 按钮来保存分支配置的内容; 
![](http://on6gnkbff.bkt.clouddn.com/20170814151138_idea-svn-05-configure-branches.png){:width="100%"}

配置分支也可以先跳过, 后面用到的时候在进行配置

# IDEA 更新/切换
`Update(更新)` : 用于更新当前仓库更新为最新内容     
`Switch(切换)` : 用于分支之间的切换(主干<->分支; 分支A<->分支B)     

`Update Directory` 弹框中, 分支按上面步骤已经保存好了;      
现在修改当前更新的URL: 这里需要修改为新地址(IP/域名), 如果点击右侧的 `...` 好像是一直转圈圈;     
点击 `OK` 按钮就开始更新最新的 SVN 内容了; 
![](http://on6gnkbff.bkt.clouddn.com/20170814151138_idea-svn-06-use-new-ip.png){:width="100%"}

本次已经配置好分支, 好像只能下次更新时生效;     
下次切换分支的时候, 从上面直接选择分支就可以了, IDEA 会自动把配置好的分支(短目录)全部按时间倒叙加载出来, 选择起来很方便

# IDEA 批量更新/切换
上面的操作是对单个项目操作的, 如果想批量操作, 可以按 `CMD+T` 调出批量操作弹框, 所有项目的 `Update/Switch` 操作都可以在一个弹框内完成

# 本地域名
由于最近内网网络很不稳定, 改过2~3次网段了, 每次配置一遍 IP 么, 内网还有其他好多服务也是要配置的, 这就麻烦了...

还记得 `/etc/hosts` 么, 干嘛不自定义一个域名呢, 把域名指向内网 IP 就可以了; 如果 SVN 服务器 IP 变了, 直接改 `hosts` 就可以了, 如果可以外网访问, 那么直接指向外网就可以了

比如自己定义svn域名为: `svn.xu3352.com`, 然后在内网直接使用内网的IP, 在外网就指向外网IP(前提是能访问到, 比如做了端口映射); 而 IDE 里不用再去 `Relocate` 一遍, 修改各种配置     
`/etc/hosts`: 
```bash
192.168.7.250  svn.xu3352.com
# 125.88.166.xx  svn.xu3352.com
```

内网的服务之间也可以使用修改: `/etc/hosts` 的方式, 这样就可以减少 IP 变动带来的麻烦

图文详解版于 2017.08.17 更新

参考：
- [svn switch error - is not the same repository](http://stackoverflow.com/questions/925698/svn-switch-error-is-not-the-same-repository)

