---
layout: post
title: "IntelliJ IDEA插件开发"
tagline: ""
description: "我的第一个idea插件:`Jump2Mybatis`的制作过程, 最后附源码"
date: '2018-04-26 12:21:43 +0800'
category: ide
tags: intellij-idea-plugin intellij-idea ide
---
> {{ page.description }}

# 想法
`IDEA` 应该算是相当智能的一款 `IDE`, 用过几年 `Eclipse` 和 `MyEclipse` 系列, 然后又用过几年 `IDEA`, 我还是接着用 `IDEA`

`IDEA` 有挺多优点的; 比如在开发后端的时候, `IDEA` 可以直接从 `Controller` 跳转到 `JSP` 页面, 非常方便; 

而后端我们基本上都是使用 `Mybatis` 的, 而每次从 `Dao` 到 `Mybatis` 的SQL文件的时候, 操作起来就稍显麻烦, 举个例子:

```bash
    @Override
    public Student findById(String id) {
        if (StringUtils.isBlank(id)) return null;
        Map<String, Object> param = new HashMap<String, Object>();
        param.put("id", id);
        return (Student) template.selectOne("student.findById", param);
    }
``` 
**大体步骤**:
1. 根据 `student` 查找到 `Mybatis` 的 `SQL` 文件: `StudentDao.xml`
2. 在 `StudentDao.xml` 文件里搜索 `findById`, 然后跳转到对应的位置

看起来也挺简单的, 使用快捷键也要好几步才能到达指定位置!

**实际步骤**:
1. 选中并copy `findById`
2. 选中 `student`, 然后 `Cmd+Shift+N` , 方向键选择 `StudentDao.xml` 
3. 打开 `StudentDao.xml` 文件后, 按 `Cmd+F` 调出搜索框, 然后粘贴 `student` 后按回车开始搜索, 然后光标会到达指定位置

那么是否可以一步到位呢? 选中 `student.findById` 然后一个快捷键到达目的地?

# 插件环境准备
Google / 百度 上很多入门教程, 参考一下:[IntelliJ IDEA插件开发实战](https://www.jianshu.com/p/2427e4cfd3e9)

主要就是启用: `Plugin DevKit` 插件, 然后配置好插件SDK `IntelliJ IDEA IU` 即可

# 先定一个小目标
不要想着一口吃个胖子, 如果第一步就遇到问题, 那么很容易就会选择放弃了

## 1. 跑个例子 `Hello World` 级别的
网上有挺多例子, 随便找一个就行, 可以参考下这个:[IntelliJ IDEA插件开发实战](https://www.jianshu.com/p/2427e4cfd3e9)

**注意事项**:
1. 需要启用 `Plugin DevKit` 插件
2. 创建Project(idea的工作区)时, 可以不用创建Module(idea的项目)
3. 可以使用快捷导航创建一个`Action`
![创建Action导航01](http://on6gnkbff.bkt.clouddn.com/20180429064911_idea-plugin-dev-new-action-01.png){:width="100%"}
![创建Action导航02](http://on6gnkbff.bkt.clouddn.com/20180429064911_idea-plugin-dev-new-action-02.png){:width="100%"}
使用导航可以自动把`plugin.xml`配置好:
```xml
    <actions>
        <!-- Add your actions here -->
        <action id="Hello" class="Hello" text="Hello" description="Hello">
            <add-to-group group-id="EditorPopupMenu" anchor="first"/>
        </action>
    </actions>
```
    `Hello.java` 加一个弹框即可:
    ```java
        import com.intellij.openapi.actionSystem.AnAction;
        import com.intellij.openapi.actionSystem.AnActionEvent;
        import com.intellij.openapi.ui.Messages;
        
        public class Hello extends AnAction {
        
            @Override
            public void actionPerformed(AnActionEvent e) {
                Messages.showInfoMessage("Hello World", "My Title");
            }
        }
    ```
4. 运行插件
![运行插件03](http://on6gnkbff.bkt.clouddn.com/20180429064911_idea-plugin-dev-new-action-03.png){:width="100%"}
如果创建了`Module`, 并且代码是在`Module`里, 那么请运行代码所在的`Module`(这里我反正是被坑了); 同样的, 如果是导入了其他的`Module`, 运行时这里也注意一下

    运行时会新弹出个`IDEA`的`APP`, 在哪里可以进行测试, 同样也是可以`Debug`的 

    在 editor 里右键 -> 选择 `Hellow` 菜单
    ![运行插件04](http://on6gnkbff.bkt.clouddn.com/20180429064911_idea-plugin-dev-new-action-04.png){:width="100%"}
    ![运行插件05](http://on6gnkbff.bkt.clouddn.com/20180429064911_idea-plugin-dev-new-action-05.png){:width="100%"}


## 2. 获取到选中的文本
官网有例子:[editor_basics](https://github.com/JetBrains/intellij-sdk-docs/tree/master/code_samples/editor_basics)

把示例代码download到本地, 然后导入`Module` (快捷键 `CMD + ;`)
![](http://on6gnkbff.bkt.clouddn.com/20180429072138_idea-pluin-dev-modules-import-01.png){:width="100%"}
运行时, 最好也是独立跑, 选择Module, 然后起个名
![](http://on6gnkbff.bkt.clouddn.com/20180429072139_idea-pluin-dev-modules-import-02.png){:width="100%"}

`EditorIllustration.java` 是把选中的文本替换掉了, 改造一下就好了:
```java
// 当前选中的起止位置和文本
final SelectionModel selectionModel = editor.getSelectionModel();
final int start = selectionModel.getSelectionStart();
final int end = selectionModel.getSelectionEnd();
TextRange range = new TextRange(start, end);
String selectTxt = document.getText(range);

System.out.println("选择文本位置: " + start + "," + end + "   selectTxt:" + selectTxt);
```

## 3. 找到指定名称的文件
按我们最开始的想法, 我们选择的内容为: `student.findById`, 那么我们要找的文件就是: `StudentDao.xml`

[How to find file in project ?](https://intellij-support.jetbrains.com/hc/en-us/community/posts/206765155-How-to-find-file-in-project-)
> If You want find files, you could also use:
> com.intellij.psi.search.FilenameIndex#getFilesByName for searching for PsiFiles
> `FilenameIndex.getFilesByName(project, fileName, searchScope);`

就是这个了, 可以根据文件名找到我们想要的文件, `searchScope` 可以是 `project` 或者 `module` 的

一般来讲, 要找的文件都是属于当前 `module` 的, 在 `project` 下很可能存在多个重名的文件

## 4. Editor打开指定名称的文件
[OpenFile in IDEA and goto Line](https://intellij-support.jetbrains.com/hc/en-us/community/posts/206133429-OpenFile-in-IDEA-and-goto-Line-)
> Create com.intellij.openapi.fileEditor.OpenFileDescriptor. You will need VirtualFile to do that. 
> VirtualFile is easly retrieved when you have com.intellij.psi.PsiFile.
> Then use one of its `navigate` methods.

找到源码进去看看方法, 就是你了
```java
new OpenFileDescriptor(project, psiFile.getVirtualFile()).navigate(true);
```

## 5. 光标移动到指定位置
`OpenFileDescriptor` 打开文件的时候可以传行和列, 也可以指定偏移量(offset)

这里我们直接使用 offset 就可以了; 直接查询关键词在文件中的位置即可
```java
int offset = psiFile.getText().indexOf("findById");
new OpenFileDescriptor(project, psiFile.getVirtualFile(), offset).navigate(true);
```

# 重构优化
Mybatis 实际上是根据 `namespace` 来确定唯一值的(`<mapper namespace="student">`), 文件名其实不重要

1. 找到所有 `xml` 文件
2. 筛选出 `Mybatis` 的 `SQL` 文件 (包含 `<mapper namespace="xxx">` 字样的)
3. 按照`namespace`的值做精准匹配

# 锦上添花
上面实际上是在 `DaoImpl` 里跳转的

在 `Controller` 基本上是这个样子: `studentService.findById(id)`

在 `Service` 基本上是这个样子: `studentDao.findById(id)` 

那么, 选中: `studentService.findById` 或 `studentDao.findById` 也可以跳转呢? 

因为去掉 `Service` 或 `Dao` 就和上面的一样了, 可以做个兼容的!

# 重复造轮子?
`IntelliJ Idea` 已经有非常多的好用而强大的插件, 可以在自己动手之前, 先找找有没有功能类似的插件:[IntelliJ IDEA Plugins](https://plugins.jetbrains.com/idea)

好多插件也是开源的, 源代码基本上都是在 [github](https://github.com/) 上, 也是学习的好机会

# 发布
打包之后就在project下面就会生成一个`*.jar` 包, `IDEA` 从本地安装时选择它就可以了
![](http://on6gnkbff.bkt.clouddn.com/20180429080456_idea-plugin-dev-build.png){:width="100%"}

# 插件源码 
[Jump2Mybatis源码](http://on6gnkbff.bkt.clouddn.com/20180429081136_idea_plugin_dev.zip)

---
参考：
- [IntelliJ IDEA插件开发实战](https://www.jianshu.com/p/2427e4cfd3e9)
- [JetBrains/intellij-sdk-docs - 示例代码](https://github.com/JetBrains/intellij-sdk-docs/tree/master/code_samples)
- [IntelliJ Platform SDK - 看左侧菜单](http://www.jetbrains.org/intellij/sdk/docs/welcome.html)
- [PSI Cookbook](http://www.jetbrains.org/intellij/sdk/docs/basics/psi_cookbook.html)
- [How to open particular file in IntelliJ idea programatically](https://intellij-support.jetbrains.com/hc/en-us/community/posts/206102469-How-to-open-particular-file-in-IntelliJ-idea-programatically)
- [How to find file in project ?](https://intellij-support.jetbrains.com/hc/en-us/community/posts/206765155-How-to-find-file-in-project-)
- [OpenFile in IDEA and goto Line](https://intellij-support.jetbrains.com/hc/en-us/community/posts/206133429-OpenFile-in-IDEA-and-goto-Line-)
- [how to get module?](https://intellij-support.jetbrains.com/hc/en-us/community/posts/206767325-how-to-get-module-)
- [can I get the Module Name of current file in Editor ?](https://intellij-support.jetbrains.com/hc/en-us/community/posts/206798975-can-I-get-the-Module-Name-of-current-file-in-Editor-)
- [How to get a PsiFile from a Module?](https://intellij-support.jetbrains.com/hc/en-us/community/posts/208391445-How-to-get-a-PsiFile-from-a-Module-)

