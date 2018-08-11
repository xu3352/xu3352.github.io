---
layout: post
title: "Jenkins Maven编译失败 提示:sun.misc.BASE64Encoder 是 Sun 的专用 API，可能会在未来版本中删除"
tagline: ""
description: "当前项目 `Jenkins` 一直用得好好的, 突然之间就构建失败了... 而且构建环境什么的没有变动过"
date: '2018-08-11 15:07:06 +0800'
category: java
tags: maven jenkins java
---
> {{ page.description }}

# 构建失败
```html
[ERROR] COMPILATION ERROR : 
[INFO] -------------------------------------------------------------
[ERROR] ..... 警告：sun.misc.BASE64Encoder 是 Sun 的专用 API，可能会在未来版本中删除
[ERROR] ..... 警告：sun.misc.BASE64Decoder 是 Sun 的专用 API，可能会在未来版本中删除
[ERROR] ..... 常量字符串过长
```

`pom.xml` 报错前的配置:
```xml
    <plugins>
      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-compiler-plugin</artifactId>
        <configuration>
          <source>1.6</source>
          <target>1.6</target>
        </configuration>
      </plugin>
    </plugins>
```

Google了好多结果, 而且大多都是几年前的, 基本都尝试了一遍, 无果... 

综合一下结果:
```xml
    <plugins>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <version>2.3.2</version>
            <dependencies>
                <dependency>
                    <groupId>org.codehaus.plexus</groupId>
                    <artifactId>plexus-compiler-javac</artifactId>
                    <version>1.8.1</version>
                </dependency>
            </dependencies>
            <configuration>
                <source>1.6</source>
                <target>1.6</target>
                <encoding>UTF-8</encoding>
                <compilerArguments>
                    <verbose/>
                    <bootclasspath>${java.home}/lib/rt.jar</bootclasspath>
                </compilerArguments>
            </configuration>
        </plugin>
    </plugins>
```
**几种尝试方法**:
1. 指定 `maven-compiler-plugin` 版本为 `2.3.2`, 说是错误就会变成警告; 试了, 不行
2. 指定 `rt.jar` 包位置(路径检查一下), 试了, 报错更离谱了: `... 致命错误：在类路径或引导类路径中找不到软件包 java.lang ...`, 嗯, 不能加这个
3. 加 `plexus-compiler-javac` 依赖, 也不好使

# 替换工具类
好吧, 既然不推荐使用了, 那就替换掉吧:

`org.apache.commons.codec.binary.Base64` 类, `encode` 和 `decode` 都有了, 而且使用还更加方便点

`maven` 依赖包:
```xml
<dependency>
	<groupId>commons-codec</groupId>
	<artifactId>commons-codec</artifactId>
	<version>1.6</version>
</dependency>
```
把相关的代码替换掉, 然后简单的测试了一下, 效果是一样的

最终配置:
```xml
    <plugins>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <version>2.3.2</version>
            <dependencies>
                <dependency>
                    <groupId>org.codehaus.plexus</groupId>
                    <artifactId>plexus-compiler-javac</artifactId>
                    <version>1.8.1</version>
                </dependency>
            </dependencies>
            <configuration>
                <source>1.6</source>
                <target>1.6</target>
                <encoding>UTF-8</encoding>
            </configuration>
        </plugin>
    </plugins>
```

2个对应的错误修改: (两个错误不是在一个类里, 独立的2个类)
1. 把 `常量字符串过长` 处理了 (这里是别人 main 测试的一行代码, 直接删除了)
2. Base64 相关的地方 

提交后, 再进行一次构建:
```
[WARNING] ... 警告：sun.misc.BASE64Encoder 是 Sun 的专用 API，可能会在未来版本中删除
```

实际上是 Base64的工具类漏改了一处, 然后这里只提示了警告 `WARNING`, 而不是 `ERROR`... 最后构建成功!!! 

额, 这说明 `maven-compiler-plugin` 版本为 `2.3.2` 好像又是可以的

最后把漏掉的一处一起改完, 然后提交, 再构建, 没有警告, 没有错误, 构建成功!


# 总结
对于上面的结果其实是有点疑问的, 怎么感觉一会儿好使, 一会儿不好使的...

后来我又做了个小测试:
1. 把一处 `sun.misc.BASE64Encoder` 还原, 提交代码, 然后构建: 这里只出现了警告, 构建成功
2. 把 `常量字符串过长` 的还原, 提交代码, 然后构建:
    - 之前的 `sun.misc.BASE64Encoder` 警告变成错误了
    - `常量字符串过长` 也是错误, 构建失败


后来回忆起来, 很早之前其实遇到过 <span style="color:red">"警告：sun.misc.BASE64Encoder 是 Sun 的专用 API，可能会在未来版本中删除"</span> 这种情况的, 不过怎么解决的没有印象了, 应该也是解决完其他错误, 这个问题自动就消失了, 所以也没在意吧

不过这种构建失败的时候, 映入眼帘的几乎全是:

<span style="color:red">"警告：sun.misc.BASE64Encoder 是 Sun 的专用 API，可能会在未来版本中删除"</span>

所以给很容易给迷惑了, 真正有问题的也许在后面, 不仔细估计还看不到...

最后, 反正 `sun.misc.BASE64Decoder` 不推荐用了, 换掉吧!!!

---
参考：
- [不要使用sun.misc.BASE64Encoder](https://blog.csdn.net/paul342/article/details/50266561)
- [sun.misc.BASE64Decoder 是 Sun 的专用 API，可能会在未来版本中删除 【解决方案】](https://www.oschina.net/question/158170_29048)
