---
layout: post
title: "Tomcat日志快速备份和清理"
tagline: ""
description: "Tomcat 的 catalina.out 控制台日志默认不会自动切分，不过一段时间不管，日志大小可能就几十个G了，没准就会收到磁盘报警：该清理日志了"
date: '2017-06-24 13:57:51 +0800'
category: linux
tags: log tomcat linux
---
> {{ page.description }}

# 磁盘空间报警
最近总能收到磁盘空间使用率超过：80%以上的报警，基本上都是 `catalina.out`（一般都在30G~60G之间）日志过大导致的       
由于总的磁盘空间本来也不大(数据盘100G)，所以总是容易收到报警

**查看空间使用量:**
```bash
$ df -h 
文件系统               容量   已用  可用 已用% 挂载点
/dev/vda1             100G   17G   83G  17%  /
tmpfs                 3.9G     0  3.9G   0%  /dev/shm
```

如果不确定是哪些文件过大导致的，可以参考：[du查询文件夹/文件占用空间 top10](https://xu3352.github.io/linux/2017/01/09/linux-find-largest-files)

# 备份&清理
`tomcat_log_clean.sh`脚本清单：(限制在了每天的23点执行)
```bash
#!/bin/bash
#author:xu3352
#desc:backup and clean catalina.out logs

DATE=`date "+%Y%m%d"`
HOUR=`date +%H`

# backup and clear
cd /mnt/apache-tomcat-6.0.36-XXX/logs

# backup at the end of the day
if [ $HOUR = '23' -a ! -f "catalina.out.$DATE" ]; then
    echo "backup catalina.out.$DATE ..."
    cp catalina.out catalina.out.$DATE

    # truncate
    echo "truncate catalina.out..."
    echo "" > catalina.out
fi

# delete 5 days expired files
echo "delete 5 days expired files..."
find . -name "catalina.out.*" -type f -mtime +5 | xargs rm -rf
```

记得给可执行权限：
```bash
chmod 755 tomcat_log_clean.sh
```

# 定时任务
指定到 23:58 分执行任务
```bash
# 编辑定时任务，一行代表一个定时任务
# "58 23 * * *" 代表每天的 23:58:00 执行任务
$ crontab -e
58 23 * * * sh /path/tomcat_log_clean.sh

# 查看有哪些定时任务
$ crontab -l
58 23 * * * sh /path/tomcat_log_clean.sh
```

# 其他
`echo "" > file` 这种清空方式比较暴力(当然也会遗漏部分数据)，绝大部分情况都是好使的，如果不好使的话，可以尝试另一种备份和清理方式(`logrotate`工具，参考本文最后的链接)，这种配置稍微麻烦一点，linux下默认日志切分的好像都是使用这个工具，非常强大

---
参考：
- [如何切分 tomcat 的 catalina.out 日志](https://xu3352.github.io/linux/2017/04/24/how-to-ratate-tomcat-catalina.out)


