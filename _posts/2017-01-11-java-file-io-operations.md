---
layout: post
title: "Java IO文本文件读写操作，批量操作"
date: '2017-01-11 18:30:09'
category: java
tags: java io file
---

> Java标准的IO文本文件读写操作

# 缘由
近2天解析了400M（压缩后的txt文件）文本文件，数据行有：1.9亿条；分两次导入，每次大约在45分钟左右。需要去重后再存库。

批量导入操作：如果文件过大（几兆的行数就挺大了），则需要一边读取一边操作。比如：达到3000条后，检查哪些已经存在了，然后剔除已存在的数据，剩下的批量插入数据库即可。

# 批量导入
```java
public long importByFiles() {
    int cnt = 0;
    String infoLog = "/path/infoLog.txt";
    String root = "/path/目标文件夹";
    List listFils = FileUtil.getAllTargetFiles(root, ".txt");
    System.out.println(FormatDate.getCurrentTime() + " - 导入文件数量 - 文件个数:" + listFils.size());

    List firstColumnList = new ArrayList();
    try {
        for (String targetFilePath : listFils) {
            String txt = FormatDate.getCurrentTime() + " - 开始处理文件:" + targetFilePath;
            FileUtil.writeAppend(infoLog, txt + "\n");
            System.out.println(txt);

            BufferedReader in = new BufferedReader(new FileReader(targetFilePath));

            int index = 0;
            int step = 3000;
            String line;
            while ((line = in.readLine()) != null) {
                if (StringUtils.isBlank(line)) continue;
                index++;
                cnt++;

                String[] columns = line.split(",");
                String firstColum = columns[0];
                firstColumnList.add(firstColum);

                // step个一批 处理存库
                if (index &gt;= step) {
                    checkDuplicateAndImport(firstColumnList, cnt);
                    index = 0;
                }
            }
            in.close();

            // 最后不够 step 个数的需要再次存库
            checkDuplicateAndImport(firstColumnList, cnt);
        }

        String txt = FormatDate.getCurrentTime() + " - 导入完成 - 使用总数据:" + cnt + "\n";
        FileUtil.writeAppend(infoLog, txt);
    } catch (IOException e) {
        e.printStackTrace();
    }
    return cnt;
}
```

# 去重复处理
记得一定要把：firstColumnList清空，不然后果自负😆
```java
/** 去重复处理后存库 */
public void checkDuplicateAndImport(List firstColumnList, int cnt) {
    if (firstColumnList == null || firstColumnList.isEmpty()) return;

    int before = firstColumnList.size();
    // 去重复处理
    List existsColumnList = xxxDao.queryExistsColumn(firstColumnList);
    if (existsColumnList != null &amp;&amp; !existsColumnList.isEmpty()) {
        firstColumnList.removeAll(existsColumnList);
    }
    int after = firstColumnList.size();

    // 不重复的存库
    xxxDao.batchSaveColumnList(firstColumnList);

    String txt = FormatDate.getCurrentTime() + " - 去重复处理后存库 - firstColumnList before:" + before + " - after(入库):" + after + " - cnt:" + cnt;
    FileUtil.writeAppend(getLogFilePath(), txt + "\n");
    if (existsColumnList != null) existsColumnList.clear();
    firstColumnList.clear();
}
```

清单：```FileUtil.java```
```java
import org.apache.commons.lang3.StringUtils;

import java.io.*;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/** 文件IO操作工具 */
public class FileUtil {
    /** 读取文本文件：行数小合适 */
    public static List readTxt(String filePath) {
        List list = new ArrayList();
        try {
            BufferedReader in = new BufferedReader(new FileReader(filePath));
            String str;
            while ((str = in.readLine()) != null) {
                list.add(str);
            }
            in.close();
        } catch (IOException e) {
            System.out.println("读取文件内容出错");
            e.printStackTrace();
        }
        return list;
    }

    /** 指定后缀过滤文件 */
    public static void visitAllFiles(File dir, String sufix, List files) {
        // 叶子节点(文件)
        if (!dir.isDirectory()) {
            String path = dir.getAbsolutePath();
            if (StringUtils.isNotBlank(sufix) &amp;&amp; path.endsWith(sufix)) files.add(path);
            return;
        }

        // 目录
        String[] children = dir.list();
        for (int i = 0; i &lt; children.length; i++) {
            visitAllFiles(new File(dir, children[i]), sufix, files);
        }
    }

    /** 获取目录下所有指定后缀文件列表(包含所有子目录) */
    public static List getAllTargetFiles(String root, String sufix) {
        List files = new ArrayList();
        visitAllFiles(new File(root), sufix, files);
        return files;
    }

    /** 文件追加 */
    public static void writeAppend(String filepath, String txt) {
        try {
            BufferedWriter out = new BufferedWriter(new FileWriter(filepath, true));
            out.write(txt);
            out.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static void main(String[] args) {
        String root = "/path/指定目录";
        String sufix = ".txt";
        List files = getAllTargetFiles(root, sufix);
        System.out.println("文件数量:" + files.size());
        for (String file : files) {
            System.out.println( file );
        }
    }
}
```

