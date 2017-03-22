---
layout: post
title:  "七牛云对象存储SDK Python版"
date:   2017-03-23 01:51:00 +0800
categories: python qiniu
---
> 七牛云对象存储服务。BLOG图片、附件等资源存储还是很方便的

直接QQ截图存桌面的`blog_uploads`目录下，然后调用命令：`qiniu_upload_blog.py`上传即可。
```shell
# 脚本记得加入到可执行的path目录下，或者做个软连接即可直接调用了，比如：
ln -s qiniu_upload_blog.py /usr/local/bin/qiniu_upload_blog.py
```

直接上代码:`qiniu_upload_blog.py`
加了简单的备份和日志功能，方便以后使用
```python
#!/usr/bin/env python
# -*- encoding: utf-8 -*-
# author: xu3352<xu3352@gmail.com>
# desc: qiniu object upload tools ("blog")

## import
from qiniu import Auth, put_file, etag, urlsafe_base64_encode
import qiniu.config
import os
from time import gmtime, strftime

## =============================================================fields
# Access Key and Secret Key
access_key = 'your_access_key'
secret_key = 'your_secret_key'

# qiniu access object
q = Auth(access_key, secret_key)

# bucket to upload
bucket_name = 'blog'
bucket_url_prefix = "http://on6gnkbff.bkt.clouddn.com"

# other params
blog_uploads="/Users/xuyinglong/Desktop/blog_uploads"
backup="/Users/xuyinglong/coding-python/blog/upload_backup"
logfile="/Users/xuyinglong/coding-python/blog/output.log"

## =============================================================functions
# backup file
def backup_files(f, t):
    # move file from blog_uploads to backup directory
    os.rename(blog_uploads + "/" + f, backup + "/" + t)

# write log
def log(f, info):
    output = open(logfile, "a")
    currtime = strftime("%Y-%m-%d %H:%M:%S", gmtime())
    output.write(currtime + " - file:" + f + " - info:" + info + "\n")
    output.close()

# main
def upload_main():
    # jpg|png files in blog_uploads directory.
    imgfiles = [name for name in os.listdir(blog_uploads)
        if name.endswith('.png') or name.endswith(".jpg")]

    print("file count:"+ str(len(imgfiles)) )   # output console

    for f in imgfiles:
        currtime = strftime("%Y%m%d%H%M%S", gmtime())
        # key = filename with postfix
        key = currtime + "_" + f
        
        #gen a token
        token = q.upload_token(bucket_name, key, 3600)

        #upload local file with token
        ret, info = put_file(token, key, blog_uploads + '/' + f)

        url = bucket_url_prefix + "/" + key
        print(url)  # output console

        # backup file 
        backup_files(f, key)

        # log url to file
        log(f, url)

## =============================================================main
# call main
upload_main()
```


参考:
[Qiniu Python SDK](https://developer.qiniu.com/kodo/sdk/python "七牛云PythonSDK")


