---
layout: post
title: "IntelliJ IDEA SVN 分支代码合并（图文详解）"
tagline: ""
description: "之前写了一篇纯文本版的，过于简短了点，这里再补个图文的"
date: '2017-07-02 21:45:34 +0800'
category: java
tags: svn java intellij-idea mac
---
> {{ page.description }}

# 合并的理解
> 最后提交到哪个分支，最终代码就是合并到了哪个分支    

感觉最近对代码合并的理解更加深入了一点，以前基本上是多个分支最终会合并到主干，大部分情况就可以满足了      
那么分支与分支，主干与分支之间怎么相互合并了，为什么会有这种需求呢，说个例子就明白了：

比如，现在有1个主干，2个分支，假如名称如下：
- trunk
- branches-001
- branches-002

考虑：现在 trunk 有一个紧急的 bug 修复了，那么 branches-001 和 branches-002 怎么办？    
嗯，主干既然已经修复了，那么分支合并到主干时候不就都好使了么？      

然而我这里的情况是：branches-001 分支其实也是一个生产环境，所以 trunk 的 bug 修复代码其实需要合并到 branches-001 分支；如果对 trunk 的改动比较大的话，建议先新建一个 bugfix 的分支，测试通过之后再合并到 trunk 和 其他分支上

说了那么多，其实没那么复杂：      
`B 要合并到 A，那么本地就切换到 A 的代码，然后把 B 的部分代码拉取到本地，修改（合并、解决冲突）后提交即可`

回想一下我们怎么提交代码的：修改本地代码，然后提交就完事了

合并其实也就是修改本地代码，只是代码已经写好了(分支上)，拿过来粘贴(IDE处理)到了本地，然后再提交的 `最后提交到哪个分支，最终代码就是合并到了哪个分支` 记住了这句，妈妈再也不担心以后合并的时候傻傻分不清楚了

# IntelliJ IDEA
个人觉得 IDEA 就是专门为 java 开发者量身定制的 IDE。用过几年 Eclipse 和 MyEclipse，后来就一直用 IDEA 了，初学者可能会有很多不适应，熟练后绝对可以提高生产力的。代码提示，重构，源代码管理方面做得不错，以后再慢慢介绍吧

这里介绍一下 IEDA SVN 的使用：
- 浏览/添加 SVN Repository ：菜单 `VCS` -> `Browse VCS Repository` -> `Browse Subversion Repository...`
- 版本管理查看：菜单 `View` -> `Tool Windows` -> `Version Control` (或者 `CMD+9`)

SVN的版本管理器：
![ 版本管理管理器](http://on6gnkbff.bkt.clouddn.com/20170702150439_idea-version-control.png){:width="100%"}
- **Local Changes** : 本地代码变更后未提交的，会出现在这里，最常用的就是:提交、回滚、对比代码，可以配置多个 Change List，方便分组管理
- **Repository Changes** : 这里其实是仓库提交日志：谁在什么时候提交了什么问题，变更了多少代码，对应的版本号是多少
- **Incoming Changes** : 别人已提交的，本地还没有更新的
- **Subversion Working Copies Information** : 这里展示的是本地副本信息，这里可以配置分支路径，合并代码也在这里
- **Update Info** : 这里可以看到刚刚更新下来哪些代码

# 合并步骤（图文）
1.切换到主干:`CMD+T` 所有项目可以一起更新 (更新代码，切换分支都适用)
![](http://on6gnkbff.bkt.clouddn.com/20170702154831_svn-update-repository.png){:width="100%"}

2.切换到版本管理器界面：`CMD+9`
![](http://on6gnkbff.bkt.clouddn.com/20170702150439_idea-version-control.png){:width="100%"}

3.切换到：Subversion Working Copies Information Tab 页面，找到需要合并的主干
![](http://on6gnkbff.bkt.clouddn.com/20170702150220_idea-svn-merge-01.png){:width="100%"}

4.点击 `Merge From...` 按钮，选择分支
![](http://on6gnkbff.bkt.clouddn.com/20170702150221_idea-svn-merge-02.png){:width="100%"}

5.选择具体需要合并的分支
![](http://on6gnkbff.bkt.clouddn.com/20170702150221_idea-svn-merge-03.png){:width="100%"}

6.选择合并方式：`Quick Manual Select` 快速手动选择，这个最快，首选
![](http://on6gnkbff.bkt.clouddn.com/20170702150222_idea-svn-merge-04.png){:width="100%"}

7.选择对应的版本号列表：一般是从分支创建到最新，具体看需求，可以只选择部分变更，选中后右侧会展示对应变更的代码
![](http://on6gnkbff.bkt.clouddn.com/20170702150222_idea-svn-merge-05.png){:width="100%"}

8.开始合并后需要等待一会儿，人品好的话(没有冲突)，分支代码就直接合并到本地来，弹出的提示框可以直接提交本地代码，也可以暂时放弃，之后再提交；
人品不好的话，就需要处理冲突了，解决冲突的界面有3列，左侧的是本地的，中间是合并结果，右侧是拉取的远程代码，3个对比着看还是比较方便的，这块暂时没有图，以后再补上

---
参考：
- [IntelliJ IDEA svn分支代码合并到主干(纯文字版)](https://xu3352.github.io/java/2017/03/10/svn-merge-branches-to-trunk-in-intellij-idea)

