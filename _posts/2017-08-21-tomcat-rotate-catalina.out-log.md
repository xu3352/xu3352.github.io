---
layout: post
title: "Tomcat 备份和清理 catalina.out 文件 (高级版)"
tagline: ""
description: "每隔一段时间, 总是要花一些时间来清理 `Tomcat` 的 `catalina.out` 日志, 为什么不做成脚本呢?"
date: '2017-08-21 17:42:39 +0800'
category: linux
tags: tomcat shell awk log linux
---
> {{ page.description }}

# 发现Tomcat
由于一台服务器一般会启动多个 `tomcat` 实例, 而为每个 tomcat 定制一个备份和清理的脚本也是挺麻烦的, 其中只是 `tomcat` 的安装目录不一样而已

使用 `ps` 就可以找到运行中的 `tomcat` 了:
```bash
ps aux | grep "tomcat"
```

这里面有 `tomcat` 安装目录的信息, 所以可以用 `grep` 和 `awk` 命令匹配并截取出来:
```bash
ps aux | grep -v grep | grep "tomcat" | awk '{for(i=1;i<=NF;i++){if ($i ~ /catalina.base/){printf("%s\n", $i)}}}' | awk -F '=' '{print $2}'
```

是不是感觉 `awk` 很强大, 以至于单这个命令都可以出本书了:     
[The AWK Programming Language (AWK 程序设计语言) 中文翻译, LaTeX 排版](https://github.com/wuzhouhui/awk)

# 备份
使用简单的 `cp` 和 `echo` 命令即可实现备份的目的, 不过这种办法比较粗糙, 可能造成部分日志丢失! 不过控制台日志一般没那么高要求的

清空文件:(不删除)
```bash
echo "" > /path/file
```

一天备份一次即可, 如果已经有了就不用备份了

# 清理
使用 `find` 和 `xargs` 和 `rm` 就可以实现: 超过 N天 的文件删除掉
```bash
find /path/logs/ -name "*.log.*" -type f -mtime +3 | xargs rm -rf
```

# 定时任务
加入定时任务
```bash
# 编辑定时任务，一行代表一个定时任务
# "58 23 * * *" 代表每天的 23:58:00 执行任务
$ crontab -e
58 23 * * * sh /usr/local/myscript/rotate_tomcat_log.sh
```

这样就不用管一台服务器有多少个 `tomcat` 了, 全部自动化备份和清理, 终于可以摆脱清理的烦恼了. 不过还有个缺点: 每台服务器得操作一遍, 暂时没想到更好的办法...

# 脚本完整版
`/usr/local/myscript/rotate_tomcat_log.sh`
```bash
#!/bin/bash
#author:xu3352@gmail.com
#desc: rotate tomcat catalina.out daily

do_job() {
    local DATE=`date "+%Y%m%d"`
    # tomcat base dir list
    local TOMCAT_BASES=(`ps aux | grep -v grep | grep "tomcat" | awk '{for(i=1;i<=NF;i++){if ($i ~ /catalina.base/){printf("%s\n", $i)}}}' | awk -F '=' '{print $2}'`)

    local LEN=${#TOMCAT_BASES[*]}
    # echo "LEN:" $LEN

    for (( i=0; i<$LEN; i++ ))
    do
        echo "Tomcat Base Dir : ${TOMCAT_BASES[i]}"
        backup "${TOMCAT_BASES[i]}"
        clean_expired "${TOMCAT_BASES[i]}"
        echo "backup and clean success ^_^ "
    done
}

backup() {
    cd $1/logs/
    if [ ! -f "catalina.out.$DATE" ]; then
        echo "backup to catalina.out.$DATE if not exists..."
        # copy
        cp catalina.out catalina.out.$DATE
        # truncate
        echo "" > catalina.out
    fi
}

clean_expired() {
    echo "clean expired 3 days catalina.out log..."
    find $1/logs/ -name "catalina.out.*" -type f -mtime +3 | xargs rm -rf
}

# start job
do_job

```

脚本使用函数式的写法, 注意参数的传递写法跟调用脚本的写法类似: `$1, $2, $3 ...`

---
参考：
- [Tomcat日志快速备份和清理](https://xu3352.github.io/linux/2017/06/24/tomcat-log-quickly-backup-and-clean)
- [awk存入shell数组](http://blog.csdn.net/jianren02/article/details/7320180)
- [Shell 定义数组](http://opus.konghy.cn/shell-tutorial/chapter2.html#array)
- [Shell Local variable](https://bash.cyberciti.biz/guide/Local_variable)

