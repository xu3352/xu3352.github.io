---
layout: post
title: "IntelliJ IDEA svn分支代码合并到主干"
date: '2017-03-10 17:34:22'
category: java
tags: intellij-idea svn java
---

> `IntelliJ IDEA`的`svn`代码合并用着挺顺手，解决冲突比较人性化

1. 首先需要切换到主干代码
2. `cmd+9`切换到版本控制面板（`View->Tool Windows->Version Control`）
3. 选择 `Subversion Working Copies Information Tab` 页，下面是你的所有的项目列表
4. 点击`【Merge From…】`按钮，选择`【branches】`选项，选中你需要合并代码的分支（如果你没有配置分支，则先配置分支根目录，`idea` 会自动加载所有分支）
5. 弹框提示：选择【快速手动选择】按钮

    - `【Merge All】全部合并`：自动检测全部没有合并的版本
    - `【Quick Manual Select】快速手动选择`：展示分支所有提交的版本数据，包括已合并和未合并的。非常快【推荐】
    - `【Select With Pre-Filter】按预设的选择`：大致意思是 仅加载尚未合并的修订版本以供选择。很慢

6. 手动选择你需要合并的版本号，一般是找到：创建分支的版本~最新的版本，复选框勾上，然后点击`【Merge Selected】`按钮
7. 如果有冲突，那么会有弹框提示，一个一个解决冲突就可以了
8. 分支代码已经合并到本地了，可以选择马上提交，也可以稍后再提交


