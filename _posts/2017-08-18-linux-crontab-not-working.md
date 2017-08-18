---
layout: post
title: "Linux Crontab 定时任务不好使了?"
tagline: ""
description: "定时器不好使了么? 前几天对某台服务器做了清理日志的定时任务, 几天后发现磁盘满了, 什么情况?"
date: '2017-08-18 13:43:27 +0800'
category: linux
tags: crontab linux
---
> {{ page.description }}

# 定时任务
linux 自带了定时任务服务: `crond`, 以方便我们定期做一些事情

比如:`备份/同步/日志清理/文件清理/服务检查` 等等 

总之, 这是个小巧, 灵活, 强大的服务

来个例子:
```
# 编辑定时任务，一行代表一个定时任务
# "30 05 * * *" 代表每天的 05:30:00 分钟执行任务
$ crontab -e
30 05 * * * sh /path/clean_expired_logs.sh

# 展示定时任务列表
$ crontab -l
```

定时任务设置语法:
```bash
# Example of job definition:  定时任务示例
# .---------------- minute (0 - 59)  分钟
# |  .------------- hour (0 - 23)  小时
# |  |  .---------- day of month (1 - 31)  几号
# |  |  |  .------- month (1 - 12) OR jan,feb,mar,apr ...  月份
# |  |  |  |  .---- day of week (0 - 6) (Sunday=0 or 7)  星期几
# |  |  |  |  |
# *  *  *  *  *   command to be executed
```
更多例子:[linux crontab格式和详细例子](http://dolphin-ygj.iteye.com/blog/455640)

# 定时器没执行?
我之前加过很多定时任务没问题的, 但是这台服务器第一次加, 然后脚本也是可以直接运行的, 所以我就怀疑定时任务没有执行, 因为也找不到定时任务的执行日志

检查清单:
1. Cron 服务是否运行
    - 进程检查 `ps ax | grep cron`
    - 服务启动/重启 `service cron start` 或 `service cron restart`
2. 定时语法检查
    - `* * * * * /bin/echo "cron works" >> /tmp/cron.log`
    - 语法是否正确? 每分钟打印一次日志, 看有没有日志
3. 命令是否可以独立运行？
    - 检查你的脚本是否有错误, 可以 debug 调试一下试试
    - 检查定时器所属用户, 应当使用当前用户执行当前用户的定时任务
4. cron 日志
    - 检查 `/var/log/cron.log` 或 `/var/log/messages` 错误日志
    - Ubuntu: `grep CRON /var/log/syslog`
    - Redhat: `/var/log/cron`
5. 检查权限
    - 脚本是否有可执行权限 `chmod +x /path/file`
    - 如果有输出日志, 检查是否有权限写入文件
6. 路径检查
    - 检查脚本文件开头的行: 比如 `#!/bin/bash`
    - 不要依赖环境变量, 比如:`PATH`, 因为他们的值在 `cron` 运行是可能不是你想要的
    - 文件使用绝对路径!
7. 调试时多打印点日志
    - 不要把日志丢弃掉了, 比如:`30 1 * * * command > /dev/null 2>&1` 此类写法调试时不推荐, 不方便排查问题
    - 重新启用标准输出或者标准错误消息输出

当我排查到第2步的时候, 发现是有日志的, 说明定时器是没有问题的!!!

那么为什么脚本执行了, 而没有达到我预期的结果呢

# 找到原因
后来发现脚本里使用的是 `相对路径`; 所以当我单独执行脚本的时候是好使的, 但是放到定时任务里, 实际上文件路径是不对的, 当然就没法执行成功了!!!

真是自己挖坑把自己埋了!!!

---
参考：
- [CronJob not running](https://stackoverflow.com/questions/22743548/cronjob-not-running)
- [Why is my crontab not working, and how can I troubleshoot it?](https://serverfault.com/questions/449651/why-is-my-crontab-not-working-and-how-can-i-troubleshoot-it)
- [linux crontab格式和详细例子](http://dolphin-ygj.iteye.com/blog/455640)

