---
layout: post
title: "CURL上传下载"
date: '2017-02-24 20:50:58'
categories: linux curl
tags: curl
---

> 开发测试的时候非常方便😆

# 下载/上传文件
```bash
#下载后重命名
curl -o /path/test.zip http://server/path/test.zip

#表单上传
curl -F "param1=hello" -F "myfiles=@/path/test.zip" http://server/path/fils_uploads
```

参考：
- [Using curl to upload POST data with files](http://stackoverflow.com/questions/12667797/using-curl-to-upload-post-data-with-files)
- [CURL常用命令](http://www.cnblogs.com/gbyukg/p/3326825.html)

