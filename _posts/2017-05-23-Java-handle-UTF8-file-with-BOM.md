---
layout: post
title: "java处理 BOM 特殊字符"
tagline: ""
date: '2017-05-23 16:09:43 +0800'
category: linux
tags: bom java encoding linux
---
> windows下的部分文本文件包含 BOM 头信息，经常导致乱码问题

# BOM来源
用 windows 创建一个文本文件, 保存时指定字符集为 UTF-8 就自动包含 BOM 头信息了

# 查看文件字符集
使用 vim 可以查看文件字符集(安装了`powerline`插件)，这里直接可以看到是 dos 的 utf-16e 文本文件  
![vim查看字符集](http://on6gnkbff.bkt.clouddn.com/20170523082723_vim_show_file_charset.png){:width="100%"}
或者进入 vim 命令模式：`:set encoding` 也是可以查看或者设置字符集的

linux 使用 file 命令查看文件字符集:
```bash
# linux  (mac系统为: file -I 100_bom.txt)
$ file -i 100_bom.txt
100_bom.txt: text/plain; charset=utf-16le
```

# java处理掉开头的BOM
```java
import java.io.*;

public class UTF8ToAnsiUtils {
    // FEFF because this is the Unicode char represented by the UTF-8 byte order mark (EF BB BF).
    public static final String UTF8_BOM = "\uFEFF";

    public static void main(String args[]) {
        String path = "/path/100_bom.txt";

        try {
            int index = 0;
            FileInputStream fis = new FileInputStream(path);
            // 100_bom.txt 这里的编码为: utf-16le
            BufferedReader r = new BufferedReader(new InputStreamReader(fis, "utf-16le"));
            for (String s = ""; (s = r.readLine()) != null; ) {
                if (index++ == 0) s = UTF8ToAnsiUtils.removeUTF8BOM(s);
                System.out.println("line:" + index + " - " + s);
            }

            r.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static String removeUTF8BOM(String s) {
        if (s.startsWith(UTF8_BOM)) {
            s = s.substring(1);
        }
        return s;
    }
}
```

参考：
- [Handle UTF8 file with BOM](http://www.rgagnon.com/javadetails/java-handle-utf8-file-with-bom.html)
- [Reading UTF-8 - BOM marker](https://stackoverflow.com/questions/4897876/reading-utf-8-bom-markero)
- [HowTo: Check and Change File Encoding In Linux](https://www.shellhacks.com/linux-check-change-file-encoding/)

