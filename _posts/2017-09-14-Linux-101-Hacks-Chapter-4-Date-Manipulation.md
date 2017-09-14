---
layout: post
title: "Linux 101 Hacks 第四章:Date相关操作"
tagline: ""
description: "Linux Date 常用操作(设置, 展示, 加减, 格式化等)示例"
date: '2017-09-14 19:14:11 +0800'
category: linux
tags: linux linux-command linux-101-hacks ebook
---
> {{ page.description }}

# 33.设置系统日期和时间

```bash
$ date {mmddhhmiyyyy.ss}
```
- `mm` - 月份
- `dd` - 日期
- `hh` - 小时(0~23h)
- `mi` - 分钟
- `yyyy` - 年份
- `ss` - 秒数

日入设置日期为: `2009-01-31 22:19:53`
```bash
$ date 013122192009.53
```

类似的, 也可以这么设置:
```bash
$ date 013122192009.53

$ date +%Y%m%d -s "20090131"

$ date -s "01/31/2009 22:19:53"

$ date -s "31 JAN 2009 22:19:53"

$ date set="31 JAN 2009 22:19:53"
```
也可以单独设置时间:
```bash
$ date +%T -s "22:19:53"

$ date +%T%p -s "10:19:53PM"
```

# 34.设置硬件日期和时间
在设置硬件日期和时间之前, 请确保系统的日期和时间是正确的. 

直接使用 `hwclock` 命令可以显示当前硬件的时钟

把硬件时钟设置为系统时钟:
```bash
# hwclock –systohc

# hwclock --systohc –utc
```

检查时钟文件是否设置UTC:
```bash
$ cat /etc/sysconfig/clock
ZONE="America/Los_Angeles"
UTC=false
ARC=false
```

# 35.格式化显示日期和时间

```bash
$ date
Thu Jan  1 08:19:23 PST 2009

$ date --date="now"
Thu Jan  1 08:20:05 PST 2009

$ date --date="today"
Thu Jan  1 08:20:12 PST 2009

$ date --date='1970-01-01 00:00:01 UTC +5 hours' +%s
18001

$ date '+Current Date: %m/%d/%y%nCurrent Time:%H:%M:%S'
Current Date: 01/01/09
Current Time:08:21:41

$ date +"%d-%m-%Y"
01-01-2009

$ date +"%d/%m/%Y"
01/01/2009

$ date +"%A,%B %d %Y"
Thursday,January 01 2009
```

格式选项:
- `%D` - 日期 (mm/dd/yy)
- `%d` - 一月中的一几天 (01...31)
- `%m` - 月份 (01...12)
- `%y` - 年份后两位(00...99)
- `%a` - 星期几缩写名称 (Sun...Sat)
- `%A` - 星期几全名 (Sunday...Saturday)
- `%b` - 月份缩写 (Jan...Dec)
- `%B` - 月份全名 (January...December)
- `%H` - 小时 (00...23)
- `%I` - 小时 (01...12)
- `%Y` - 年份, 4位数 (1970...2017)

# 36.显示过去的日期和时间
有好几种方式可以实现:
```bash
$ date --date='3 seconds ago'
Thu Jan  1 08:27:00 PST 2009

$ date --date="1 day ago"
Wed Dec 31 08:27:13 PST 2008

$ date --date="1 days ago"
Wed Dec 31 08:27:18 PST 2008

$ date --date="1 month ago"
Mon Dec  1 08:27:23 PST 2008

$ date --date="1 year ago"
Tue Jan  1 08:27:28 PST 2008

$ date --date="yesterday"
Wed Dec 31 08:27:34 PST 2008

$ date --date="10 months 2 day ago"
Thu Feb 28 08:27:41 PST 2008
```

# 37.显示将来的时间
同样也是有好几种方式
```bash
$ date
Thu Jan  1 08:30:07 PST 2009

$ date --date='3 seconds'
Thu Jan  1 08:30:12 PST 2009

$ date --date='4 hours'
Thu Jan  1 12:30:17 PST 2009

$ date --date='tomorrow'
Fri Jan  2 08:30:25 PST 2009

$ date --date="1 day"
Fri Jan  2 08:30:31 PST 2009

$ date --date="1 days"
Fri Jan  2 08:30:38 PST 2009

$ date --date="2 days"
Sat Jan  3 08:30:43 PST 2009

$ date --date='1 month'
Sun Feb  1 08:30:48 PST 2009

$ date --date='1 week'
Thu Jan  8 08:30:53 PST 2009

$ date --date="2 months"
Sun Mar  1 08:30:58 PST 2009

$ date --date="2 years"
Sat Jan  1 08:31:03 PST 2011

$ date --date="next day"
Fri Jan  2 08:31:10 PST 2009

$ date --date="-1 days ago"
Fri Jan  2 08:31:15 PST 2009

$ date --date="this Wednesday"
Wed Jan  7 00:00:00 PST 2009
```

---
参考：
- [hwclock命令](http://man.linuxde.net/hwclock)

