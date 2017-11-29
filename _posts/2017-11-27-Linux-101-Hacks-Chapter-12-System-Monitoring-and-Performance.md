---
layout: post
title: "Linux 101 Hacks 第十二章:系统和性能监控"
tagline: ""
description: "Linux系统和性能的监控和表现. 涉及有: `free top df du lsof vmstat netstat sysctl nice renice kill ps sar` 等命令"
date: '2017-11-27 21:41:25 +0800'
category: linux
tags: linux linux-command linux-101-hacks ebook
---
> {{ page.description }}

# 89.Free命令
`free` 命令显示有关系统物理（RAM）和交换内存的所有必要信息
语法:`free [options]`

**示例1: 查看系统内存(RAM)大小**
```bash
$ free
       total        used        free   shared  buffers  cached
Mem: 1034624        1006696     27928  0       174136   615892
-/+ buffers/cache:  216668      817956
Swap:2031608        0           2031608
```
默认单位:KB

**示例2: 展示系统内存使用情况**
```bash
$ free -mto
      total    used    free shared    buffers     cached
Mem:     1010   983      27      0        170        601
Swap:    1983     0    1983
Total:   2994   983    2011
```
**参数详解**:
- `m` - 以MB为单位
- `t` - 展示总和
- `o` - 隐藏 `buffers/cache` 行的展示 

# 90.Top命令
`top` 可以实时的展示系统各种性能指标, 如:CPU负载, 内存使用情况, 进程列表等

**示例1: 查看当前系统的状态, 包括CPU使用率**
```bash
$ top
top - 21:57:15 up  25 days,  20:21,  1 user,  load average: 0.08, 0.08, 0.08
Tasks: 174 total,   1 running, 173 sleeping,   0 stopped,   0 zombie
Cpu(s):  1.5%us,  0.2%sy,  0.0%ni, 95.0%id,  3.3%wa,  0.0%hi,  0.0%si,  0.0%st
Mem:   8051552k total,  7443448k used,   608104k free,   249872k buffers
Swap:  4095992k total,        0k used,  4095992k free,  2097308k cached

  PID USER      PR  NI  VIRT  RES  SHR S %CPU %MEM    TIME+  COMMAND
 3052 root      20   0 3549m 626m  12m S  2.0  8.0   0:45.16 java
    1 root      20   0 19336 1460 1196 S  0.0  0.0   0:01.26 init
    2 root      20   0     0    0    0 S  0.0  0.0   0:00.00 kthreadd
    3 root      RT   0     0    0    0 S  0.0  0.0   0:00.00 migration/0
    4 root      20   0     0    0    0 S  0.0  0.0   0:00.00 ksoftirqd/0
    5 root      RT   0     0    0    0 S  0.0  0.0   0:00.00 watchdog/0
    6 root      RT   0     0    0    0 S  0.0  0.0   0:00.00 migration/1
.....
   36 root      20   0     0    0    0 S  0.0  0.0   0:00.00 kacpi_hotplug
   37 root      20   0     0    0    0 S  0.0  0.0   0:00.00 ata/0
```
**top展示内容详解**:
- 第一行 top: 表示系统已经运行25天, 以及当前系统压力情况
- 第二行 Tasks: 显示了进程总数, 以及运行, 休眠, 停止和僵尸进程计数的详细信息
- 第三行 Cpu(s): 显示系统当前CPU利用率 本示例中CPU空闲率为 95.0%
- 第四行 Mem 和 第五行 Swap : 展示了内存使用情况, 和free类似
- 剩余的行 : 展示了系统中所有活动的进程, 默认按CPU使用情况排序 

**示例2: 按照内存排序**
```bash
$ top
.....

# 按下 F , 然后就会看到如下信息; 按对应的字母, 然后按回车就可以按指定的列进行排序了
Current Sort Field:  K  for window 1:Def
...

# 这里我们选择 n, 然后回车就可以按内存高的进行排序了, 其他列也是一样的操作
  n: %MEM       = Memory usage (RES)
```

**示例3: 显示/隐藏指定的列信息**
```bash
$ top
...

# 按下 f, 然后看到如下信息
Current Fields:  AEHIOQTWKNMBcDfgjplrsuvyzX  for window 1:Def
...

# 每列都是对应了一个字母, 按对应的字母进行勾选或者取消勾选, 然后回车即可
```

**示例4: 查看正在运行的进程的全路径好参数**
```bash
$ top
...

# 按下 c 就可以展示/隐藏进程的全路径和参数了
```

**示例5: 查看单个CPU的使用情况**
```bash
$ top
...

# 按下数字 1, 就可以展示/隐藏 单个CPU的使用情况了
```

**更多**:
- [15 Practical Linux Top Command Examples](http://www.thegeekstuff.com/2010/01/15-practical-unix-linux-top-command-examples/)
- [Top on Steroids – 15 Practical Linux HTOP Examples](http://www.thegeekstuff.com/2011/09/linux-htop-examples/)
- [How To Capture Unix Top Command Output to a File in Readable Format](http://www.thegeekstuff.com/2009/10/how-to-capture-unix-top-command-output-to-a-file-in-readable-format/)
- [IFTOP Guide: Display Network Interface Bandwidth Usage on Linux](http://www.thegeekstuff.com/2008/12/iftop-guide-display-network-interface-bandwidth-usage-on-linux/)

# 91.Df命令  
`df` 命令(disk free)用来展示已安装的磁盘空间总量和可用的磁盘空间量
语法:`df [options] [name]`

**示例1: 查看系统剩余了多大空间**
```bash
$ df –h
Filesystem            Size  Used Avail Use% Mounted on
/dev/sda1             64G   44G   17G  73%   /
/dev/sdb1            137G   67G   70G  49%   /home/user
```

**示例2: 展示文件系统的类型**
```bash
$ df -Tha
Filesystem    Type     Size  Used  Avail Use%  Mounted on
/dev/sda1    ext2    64G    44G   17G  73%    /
/dev/sdb1    ext2   137G    67G   70G  49%    /home/user
none         proc      0      0     0    -    /proc
none        sysfs      0      0     0    -    /sys
none       devpts      0      0     0    -    /dev/pts
none        tmpfs   2.0G      0  2.0G    0%   /dev/shm
```

# 92.Du命令
`du` 命令(disk usage)展示特定目录及其子目录的文件大小的情况

**示例: 查看home目录及其所有子目录占用了多大空间**
```bash
$ du -sh ~
320M    /home/jsmith
```
**详解**:
- `s` - 仅展示汇总信息
- `h` - 易于辨认的单位, 如:K 就是 KB, M 就是 MB, G 就是 GB的意思

# 93.Lsof命令
`lsof` 命令(list open files)表示展示打开的文件. 其中包括:网络链接, 设备和目录等. `lsof` 展示的列包括:
- `COMMAND` - 进程名称
- `PID` - 进程ID
- `USER` - 进程所属用户
- `FD` - 文件描述
- `TYPE` -文件节点类型
- `DEVICE` - 设备编号
- `SIZE` - 文件大小
- `NODE` - node编号
- `NAME` - 全路径

**示例1: 展示所有打开的文件**
```bash
$ lsof | more
COMMAND    PID      USER   FD    TYPE    DEVICE    SIZE/OFF       NODE NAME
init         1      root  cwd     DIR       8,5        4096          2 /
init         1      root  rtd     DIR       8,5        4096          2 /
init         1      root  txt     REG       8,5      137808     132203 /sbin/init
init         1      root  mem     REG       8,5      156872    2621468 /lib64/ld-2.12.so
init         1      root  mem     REG       8,5     1922112    2621505 /lib64/libc-2.12.so
init         1      root  mem     REG       8,5      145720    2621507 /lib64/libpthread-2.12.so
init         1      root  mem     REG       8,5       47064    2621509 /lib64/librt-2.12.so
init         1      root  mem     REG       8,5      268200    2621511 /lib64/libdbus-1.so.3.4.0
....
```
如果直接使用 `lsof` 命令, 则会输出大量的文件信息, 所以这里使用 `more` 可以进行翻页查看 
```bash 
# 统计打开文件的总数
$ lsof | wc -l
3093
```

**示例2: 查看指定用户打开的文件**
```bash
$ lsof –u ramesh
vi      7190 ramesh  txt    REG        8,1   474608 475196 /bin/vi
sshd    7163 ramesh    3u  IPv6   15088263   TCP dev-db:ssh->abc-12-12-12-12.socal.res.rr.com:2631 (ESTABLISHED)
```

系统管理员可以通过此命令查看其它用户正在执行什么

**示例3: 列出特定文件的用户**
```bash
$ lsof /bin/vi
COMMAND  PID  USER  FD   TYPE DEVICE   SIZE   NODE NAME
vi      7258 root   txt   REG    8,1 474608 475196 /bin/vi
vi      7300 ramesh txt   REG    8,1 474608 475196 /bin/vi
```

# 94.Vmstat命令
`vmstat` 一个典型的性能监控命令, 可以显示内存, 交换区, IO, 系统和CPU性能信息

```bash
# 每秒一次, 总共统计100次
$ vmstat 1 100
procs -----------memory---------- ---swap-- -----io---- --system-- -----cpu-----
 r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa st
 1  1      0 188820 407840 2059520    0    0    37    55  174  430  1  0 95  3  0
 0  0      0 188812 407840 2059520    0    0     0    12  598 1678  0  0 99  1  0
 1  0      0 188812 407840 2059520    0    0     0     0  564 1721  0  0 100  0  0
....
```

**procs部分**:
- `r` - 运行中的进程数量
- `b` - 阻塞的进程总数

**memory部分**:
- `swpd` - 使用的交互区使用量
- `free` - 内存RAM空闲量
- `buff` - 用于缓冲区的内存RAM量
- `cache` - 用于文件系统缓存的内存RAM

**swap部分**:
- `si` - 每秒从磁盘交换的内存量
- `so` - 每秒交换到磁盘的内存量

**io部分**:
- `bi` - 从磁盘接收的块
- `bo` - 块写入磁盘

**system部分**:
- `in` - 每秒中断次数
- `cs` - 每秒的上下文切换次数

**cpu部分**:
- `us` - 时间花在运行用户代码上（非内核代码）
- `sy` - 运行内核代码的时间
- `id` - 空闲时间
- `wa` - 等待IO的时间

**更多**:
- [24 iostat, vmstat and mpstat Examples for Linux Performance Monitoring](http://www.thegeekstuff.com/2011/07/iostat-vmstat-mpstat-examples/)

# 95.Netstat命令
`netstat` 命令显示网络相关信息，如网络连接，路由表，接口统计信息

**示例1: 显示活动的Internet连接和域套接字**
```bash
$ netstat -an
Active Internet connections (servers and established)
Proto Recv-Q Send-Q Local Address               Foreign Address             State
tcp        0      0 0.0.0.0:3306                0.0.0.0:*                   LISTEN
tcp        0      0 0.0.0.0:3690                0.0.0.0:*                   LISTEN
tcp        0      0 0.0.0.0:40842               0.0.0.0:*                   LISTEN

...

Active UNIX domain sockets (servers and established)
Proto RefCnt Flags       Type       State         I-Node Path
unix  2      [ ACC ]     STREAM     LISTENING     15663  /tmp/orbit-gdm/linc-881-0-3a7acfa19d9c3
unix  2      [ ACC ]     STREAM     LISTENING     15671  /tmp/orbit-gdm/linc-87e-0-23dcda2d9db12
unix  2      [ ACC ]     STREAM     LISTENING     15738  /tmp/orbit-gdm/linc-88a-0-906af235bd9b
unix  2      [ ACC ]     STREAM     LISTENING     13845  /var/run/abrt/abrt.socket
...
```

**示例2: 显示活动链接的进程ID和程序名称**
```bash
$ netstat -tap
Active Internet connections (servers and established)
Proto Recv-Q Send-Q Local Address               Foreign Address             State       PID/Program name
tcp        0      0 *:mysql                     *:*                         LISTEN      3022/mysqld
tcp        0      0 *:svn                       *:*                         LISTEN      3035/svnserve
tcp        0      0 *:csccredir                 *:*                         LISTEN      -
tcp        0      0 *:40522                     *:*                         LISTEN      1555/rpc.statd
tcp        0      0 *:rquotad                   *:*                         LISTEN      1773/rpc.rquotad
tcp        0      0 *:40942                     *:*                         LISTEN      1789/rpc.mountd
tcp        0      0 *:sunrpc                    *:*                         LISTEN      1428/rpcbind
tcp        0      0 192.168.122.1:domain        *:*                         LISTEN      2001/dnsmasq
tcp        0      0 *:ssh                       *:*                         LISTEN      1829/sshd
tcp        0      0 localhost.localdomain:ipp   *:*                         LISTEN      1644/cupsd
tcp        0      0 *:nfs                       *:*                         LISTEN      -
tcp        0      0 localhost.localdomain:mysql localhost.localdomain:46421 ESTABLISHED 3022/mysqld

...
```

**示例3: 显示路由表**
```bash
$ netstat --route
Kernel IP routing table
Destination     Gateway         Genmask         Flags   MSS Window  irtt Iface
192.168.7.0     *               255.255.255.0   U         0 0          0 eth1
169.254.95.0    *               255.255.255.0   U         0 0          0 usb0
192.168.122.0   *               255.255.255.0   U         0 0          0 virbr0
link-local      *               255.255.0.0     U         0 0          0 eth1
link-local      *               255.255.0.0     U         0 0          0 usb0
default         192.168.7.1     0.0.0.0         UG        0 0          0 eth1
```

**示例4: 显示RAW网络统计信息**
```bash
$ netstat --statistics --raw
Ip:
    11075442 total packets received
    0 forwarded
    0 incoming packets discarded
    11074743 incoming packets delivered
    11071019 requests sent out
Icmp:
    8 ICMP messages received
    0 input ICMP message failed.
    ICMP input histogram:
        destination unreachable: 7
        echo requests: 1
    46 ICMP messages sent
    0 ICMP messages failed
    ICMP output histogram:
        destination unreachable: 45
        echo replies: 1
IcmpMsg:
        InType3: 7
        InType8: 1
        OutType0: 1
        OutType3: 45
UdpLite:
IpExt:
    InMcastPkts: 5307
    OutMcastPkts: 1682
    InBcastPkts: 10034
    InOctets: 1398070979
    OutOctets: 1438582706
    InMcastOctets: 606612
    OutMcastOctets: 121544
    InBcastOctets: 1206660
```

**示例5: 其他netstat命令**
```bash
# 展示TCP连接列表
$ netstat –-tcp –-numeric

# 显示服务器正在侦听的TCP端口以及在特定端口上侦听的程序
$ netstat --tcp --listening –-programs

# 显示路由缓存
$ netstat –rnC
```

**更多**:
- [UNIX / Linux: 10 Netstat Command Examples](http://www.thegeekstuff.com/2010/03/netstat-command-examples/)

# 96.Sysctl命令
Linux内核参数可以使用 `sysctl` 命令实时更改. `sysctl` 有助于在运行时配置Linux内核参数

```bash
$ sysctl -a
dev.cdrom.autoclose = 1
fs.quota.writes = 0
kernel.ctrl-alt-del = 0
kernel.domainname = (none)
kernel.exec-shield = 1
net.core.somaxconn = 128
net.ipv4.tcp_window_scaling = 1
net.ipv4.tcp_wmem = 4096        16384   131072
net.ipv6.route.mtu_expires = 600
sunrpc.udp_slot_table_entries = 16
vm.block_dump = 0
```

**示例1: 修改/etc/sysctl.conf中的Kernel参数以进行永久更改**
```bash
$ vi /etc/sysctl.conf

# 提交修改(应用生效, 重启后依然有效)
$ sysctl –p
```

**示例2: 临时修改内核参数(重启后无效)**
```bash
$ sysctl –w {variable-name=value}
```

# 97.Nice命令
内核根据nice值决定一个进程需要多少处理器时间. 范围:-20~20; -20表示最高优先级; 20表示最低优先级

**示例1: 查看正在执行的进程的 nice 值**
```bash
# 第6列就是 nice 优先级的值了
$ ps axl
F   UID   PID  PPID PRI  NI    VSZ   RSS WCHAN  STAT TTY        TIME COMMAND
4     0     1     0  20   0  19336  1168 poll_s Ss   ?          0:04 /sbin/init
1     0     2     0  20   0      0     0 kthrea S    ?          0:00 [kthreadd]
5     0     5     2 -100  -      0     0 watchd S    ?          0:00 [watchdog/0]
5     0   411     1  16  -4  11212   296 poll_s S<s  ?          0:00 /sbin/udevd -d
1     0    51     2  25   5      0     0 ksm_sc SN   ?          0:00 [ksmd]
1     0    52     2  39  19      0     0 khugep SN   ?          0:01 [khugepaged]
```

**示例2: 如何降低优先级的执行脚本(把nice值调高)**
```bash
$ ./nice-test.sh &
[3] 13009

# 默认的 nice 值为0
$ ps axl | grep nice-test
0 509 13009 12863 17 0 4652 972 wait S pts/1 0:00 /bin/bash ./nice-test.sh


# 优先级设置为了:10
$ nice -10 ./nice-test.sh &
[1] 13016

$ ps axl | grep nice-test
0 509 13016 12863 30 10 4236 968 wait SN pts/1 0:00 /bin/bash ./nice-test.sh
```

**示例3: 如何提高优先级(把nice值调底)执行脚本**
```bash
# 记得使用root用户执行
$ nice --10 ./nice-test.sh &
[1] 13021
$ nice: cannot set priority: Permission denied

# 调高优先级
$ nice --10 ./nice-test.sh &
[1] 13060

$ ps axl | grep nice-test
4 0 13060 13024 10 -10 5388  964 wait S< pts/1 0:00 /bin/bash ./nice-test.sh
```

# 98.Renice命令
`renice` 可以改变正在运行的进程的调度优先级

**示例1: 如何降低正在运行的进程的优先级？(调高nice值)**
```bash
$ ps axl | grep nice-test
0 509 13245 13216 30 10 5244 968 wait SN pts/1 0:00 /bin/bash ./nice-test.sh

# 由10改为16
$ renice 16 -p 13245
13245: old priority 10, new priority 16

$ ps axl | grep nice-test
0 509 13245 13216 36 16 5244 968 wait SN pts/1 0:00 /bin/bash ./nice-test.sh
```

**示例2: 如何提高正在运行的进程的优先级？(调低nice值)**
```bash
$ ps axl | grep nice-test
0 509 13254 13216 30 10 4412 968 wait SN pts/1 0:00 /bin/bash ./nice-test.sh

# 由10改为5
$ renice 5 -p 13254
13254: old priority 10, new priority 5

$ ps axl | grep nice-test
0 509 13254 13216 30 5 4412 968 wait SN pts/1 0:00 /bin/bash ./nice-test.sh
```

# 99.Kill命令 
`kill` 命令可以用来终止正在运行的进程. 通常, 此命令用于终止挂起而不响应的进程

语法:`kill [options] [pids|commands]`

**示例1: 如何杀死一个挂起的过程？**
```bash
$ ps aux | grep httpd
USER       PID %CPU %MEM    VSZ    RSS TTY  STAT START  TIME COMMAND
apache   31186 0.0   1.6  23736  17556 ?    S    Jul26  0:40  /usr/local/apache2/bin/httpd
apache   31187 0.0   1.3  20640  14444 ?    S    Jul26  0:37  /usr/local/apache2/bin/httpd

$ kill 31186 31187
```

**示例2: 另一种kill多个进程的脚本(放到.bash_profile即可)**
```bash
function psgrep ()
{
    ps aux | grep "$1" | grep -v 'grep'
} 

function psterm ()
{
    [ ${#} -eq 0 ] && echo "usage: $FUNCNAME STRING" && return 0
    local pid
    pid=$(ps ax | grep "$1" | grep -v grep | awk '{ print $1 }')
    echo -e "terminating '$1' / process(es):\n$pid"
    kill -SIGTERM $pid
}
```

查看和kill调用
```bash
$ psgrep http
USER       PID %CPU %MEM    VSZ    RSS TTY  STAT START  TIME COMMAND
apache   31186 0.0   1.6  23736  17556 ?    S    Jul26  0:40  /usr/local/apache2/bin/httpd
apache   31187 0.0   1.3  20640  14444 ?    S    Jul26  0:37  /usr/local/apache2/bin/httpd

# kill进程
$ psterm httpd
terminating 'httpd' / process(es):
31186
31187
```

**更多**:
- [4 Ways to Kill a Process – kill, killall, pkill, xkill](http://www.thegeekstuff.com/2009/12/4-ways-to-kill-a-process-kill-killall-pkill-xkill/)

# 100.Ps命令
`ps` 命令（进程状态）将显示所有活动进程的快照信息
语法:`ps [options]`

**示例1: 显示所有运行中的进程**
```bash
$ ps aux | more
USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root         1  0.0  0.0  19336  1168 ?        Ss   Nov27   0:04 /sbin/init
root         2  0.0  0.0      0     0 ?        S    Nov27   0:00 [kthreadd]
root         3  0.0  0.0      0     0 ?        S    Nov27   0:00 [migration/0]
root         4  0.0  0.0      0     0 ?        S    Nov27   0:00 [ksoftirqd/0]
...
```
类似的:`ps -ef | more` 也是差不多的效果

**示例2: 打印进程树**
```bash
# pstree 也是以树形结构展示
$ ps axuf
root     Oct14   0:00 /opt/VRTSralus/bin/beremote
root     Oct14   0:00  \_ /opt/VRTSralus/bin/beremote
root     Oct14   0:00      \_ /opt/VRTSralus/bin/beremote
root     Oct14   0:00      \_ /opt/VRTSralus/bin/beremote
root     Oct14   0:01      \_ /opt/VRTSralus/bin/beremote
root     Oct14   0:00      \_ /opt/VRTSralus/bin/beremote
root     Dec03   0:01 /usr/local/sbin/sshd
root     Dec22   1:08 /usr/local/sbin/sshd
root     23:35   0:00  \_ /usr/local/sbin/sshd
511      23:35   0:00      \_ -bash
511                           \_ ps axuf
```

**示例3: 查看特定用户拥有的进程**
```bash
$ ps U oracle
PID TTY  STAT   TIME COMMAND
5014 ?   Ss     0:01 /oracle/bin/tnslsnr    
7124 ?   Ss     0:00 ora_q002_med    
8206 ?   Ss     0:00 ora_cjq0_med    
8852 ?   Ss     0:01 ora_pmon_med    
8854 ?   Ss     0:00 ora_psp0_med    
8911 ?   Ss     0:02 oraclemed (LOCAL=NO)    
```

**示例4: 查看当前用户拥有的进程**
```bash
$ ps U $USER
PID TTY      STAT   TIME COMMAND
10329 ?        S    0:00 sshd: ramesh@pts/1,pts/2
10330 pts/1    Ss   0:00 -bash
10354 pts/2    Ss+  0:00 -bash
10530 pts/1    R+   0:00 ps U ramesh
```

**更多**:
- [UNIX / Linux: 7 Practical PS Command Examples for Process Monitoring](http://www.thegeekstuff.com/2011/04/ps-command-examples/)

# 101.Sar命令
`sar` 命令随 `sysstat` 包一起提供. 确保已经安装了 `sysstat`. 如果您的系统上没有安装sar，请从sysstat项目获取它

`sar` 是一个很好的监控工具，显示系统几乎所有资源的性能数据，包括CPU，内存，IO，寻呼，联网，中断等，

`sar` 收集，报告（显示）并保存性能数据, 三个方面的数据分别来看:

**Sadc - 系统活动数据收集器**

`/usr/lib/sadc` (System activity data collector) 命令以指定的时间间隔收集系统数据. 数据存放的位置为:`/var/log/sa/sa[dd]` dd表示几号

**Sa1 shell脚本**

`/usr/lib/sa1` 定时调用调用 `/usr/lib/sadcs`:
```bash 
*/5 * * * * root /usr/lib/sa/sa1 1 1
```

**Sa2 shell脚本**

`/usr/lib/sa2` 脚本用来处理每天的 `/var/log/sa/sa[dd]` 日报(dd表示几号), 也是定时执行的:
```bash
59 23 * * * root /usr/lib/sa/sa2 –A
```

**注意: `/etc/cron.d/sysstat` 文件用来存放sa1和sa2默认值的, 需要的话可以再这里进行修改**

**示例1: 使用Sar命令显示CPU统计信息**
```bash
$ sar -u
Linux 2.6.32-71.el6.x86_64 (localhost.wayne) 	2017年11月29日 	_x86_64_	(4 CPU)

00时00分01秒     CPU     %user     %nice   %system   %iowait    %steal     %idle
00时10分01秒     all      0.59      0.00      0.23      4.02      0.00     95.15
00时20分01秒     all      0.57      0.00      0.22      3.88      0.00     95.33
00时30分01秒     all      0.43      0.00      0.19      3.81      0.00     95.57
...

07时20分01秒     CPU     %user     %nice   %system   %iowait    %steal     %idle
07时30分01秒     all      0.60      0.00      0.22      3.80      0.00     95.38
07时40分01秒     all      0.60      0.00      0.22      3.77      0.00     95.40
07时50分01秒     all      0.60      0.00      0.23      3.68      0.00     95.49
08时00分01秒     all      0.58      0.00      0.23      3.76      0.00     95.43
08时10分01秒     all      0.54      0.00      0.20      3.94      0.00     95.32
...

14时40分01秒     CPU     %user     %nice   %system   %iowait    %steal     %idle
14时50分01秒     all      0.59      0.00      0.22      3.91      0.00     95.28
15时00分01秒     all      0.52      0.00      0.19      3.87      0.00     95.41
15时10分01秒     all      0.58      0.00      0.21      4.07      0.00     95.14
...

平均时间:     all      0.57      0.00      0.21      3.89      0.00     95.33
```
如果想要统计每个独立的CPU: `sar -u -P ALL`

**示例2: 使用sar命令显示磁盘IO统计信息**
```bash
$ sar -d
Linux 2.6.32-71.el6.x86_64 (localhost.wayne) 	2017年11月29日 	_x86_64_	(4 CPU)

00时00分01秒       DEV       tps  rd_sec/s  wr_sec/s  avgrq-sz  avgqu-sz     await     svctm     %util
00时10分01秒    dev8-0     24.64      2.71    466.18     19.03      0.22      8.78      6.55     16.15
00时20分01秒    dev8-0     23.62     11.18    442.02     19.19      0.24     10.17      6.60     15.58
...

14时40分01秒       DEV       tps  rd_sec/s  wr_sec/s  avgrq-sz  avgqu-sz     await     svctm     %util
14时50分01秒    dev8-0     24.52      4.07    449.43     18.49      0.21      8.64      6.38     15.63
15时00分01秒    dev8-0     24.49      2.12    454.85     18.66      0.21      8.70      6.38     15.62
...

均时间:    dev8-0     24.32      5.19    452.68     18.82      0.22      9.01      6.40     15.57 
```

**示例3: 使用sar命令显示网络统计信息**
```bash
$ sar -n DEV | more
Linux 2.6.32-71.el6.x86_64 (localhost.wayne) 	2017年11月29日 	_x86_64_	(4 CPU)

00时00分01秒     IFACE   rxpck/s   txpck/s    rxkB/s    txkB/s   rxcmp/s   txcmp/s  rxmcst/s
00时10分01秒        lo     65.35     65.35      7.24      7.24      0.00      0.00      0.00
00时10分01秒      eth0      0.00      0.00      0.00      0.00      0.00      0.00      0.00
00时10分01秒      eth1      8.87      8.12      1.37      1.05      0.00      0.00      0.00
...


sar -n SOCK |more
Linux 2.6.32-71.el6.x86_64 (localhost.wayne) 	2017年11月29日 	_x86_64_	(4 CPU)

00时00分01秒    totsck    tcpsck    udpsck    rawsck   ip-frag    tcp-tw
00时10分01秒       566        62        14         0         0         7
00时20分01秒       556        58        14         0         0         6
00时30分01秒       555        58        14         0         0         5
```

**更多**:
- [10 Useful Sar (Sysstat) Examples for UNIX / Linux Performance Monitoring](http://www.thegeekstuff.com/2011/03/sar-examples/)


