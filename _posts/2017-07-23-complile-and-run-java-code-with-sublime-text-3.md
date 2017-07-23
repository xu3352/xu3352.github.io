---
layout: post
title: "Sublime Text 3 编译和运行Java"
tagline: ""
description: "随手几行 Java 测试代码，快速执行看结果"
date: '2017-07-23 14:55:51 +0800'
category: ide
tags: sublime-text-3 java
---
> {{ page.description }}

前提是你系统已经安装 JDK 了

# 测试代码
有时候可能写个几行代码，启动 idea 感觉又浪费了点，就用：`Sublime Text 3` 代替吧，凑合用了，不过发现只带了个默认的编译环境：JavaC，运行的没有。终端敲命令行跑当然是没有问题的，不过既然有编辑器了，那就可以定制一个编译+运行的环境
```java
public class Test {
    public static void main(String[] args) {
        System.out.println("hello world!");
    }
}
```

# 定制构建环境
新建一个构建环境：`菜单 -> Tools -> Build System -> New Build System...`      
名称就保存为：JavaRun 可以自己定义
```java
{
   "shell_cmd": "javac \"$file\" && java \"$file_base_name\"",
   "file_regex": "^(...*?):([0-9]*):?([0-9]*)",
   "selector": "source.java",
}
```
其实就是把两个命令放到一起执行了：`javac Test.java && java Test`

# 编译运行
构建的时候可以选择指定的构建工具：`菜单 -> Tools -> Build System -> JavaRun`

然后：`CMD+B` 就可以看效果了
```
hello world!
[Finished in 0.6s]
```

---
参考：
- [How to set up Sublime text 3 to run and compile java on linux?](https://stackoverflow.com/questions/28416885/how-to-set-up-sublime-text-3-to-run-and-compile-java-on-linux)


