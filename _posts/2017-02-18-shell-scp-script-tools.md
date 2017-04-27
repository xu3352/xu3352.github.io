---
layout: post
title: "shell脚本上传小工具"
date: '2017-02-18 15:25:35'
category: linux
tags: linux scp linux-command shell tools
---

> FTP上传文件时不稳定，总是掉线😒（目标目录下其他文件较多，几万个。。。）

# 脚本
直接上脚本，仅支持当前目录下的 `target.zip`，当然可以自己改造，比如文件名用参数传入脚本，如果是文件夹，则自动压缩，然后再上传等等...

```bash
#!/bin/bash
#author:xu3352

HOST=YouIP
ZIP=target.zip
TIME=`date "+%Y%m%d_%H%M%S"`

if [ ! -f "$ZIP" ]; then
    echo "待上传的 zip 文件不存在：filepath=$ZIP"
    exit 1
fi

# scp target.zip to you server
scp $ZIP root@$HOST:/tmp/

# backup and replace
ssh -tt root@$HOST <<EOF
    cd /you/path/
    mv target.zip target_backup_$TIME.zip
    mv /tmp/target.zip .
    exit
EOF
```

