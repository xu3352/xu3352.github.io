---
layout: post
title: "CentOS 5 yum源地址变更问题"
tagline: ""
description: "系统为阿里云ECS早期的镜像, 版本为centos5, 使用yum的时候就完蛋了, 各种404, 没法用!!!"
date: '2018-02-01 21:26:21 +0800'
category: linux
tags: linux centos5 yum
---
> {{ page.description }}

# yum无法使用
`yum` 来管理软件还是很方便的, 某些时候难免要源码安装部分软件, 而 `yum` 可以很方便的额解决依赖问题.

折腾了半天... 

中间也是阿里和163的各种换, 也是各种不好使, 感谢大神的分享

```bash
[root@server_xxx yum.repos.d]# yum clean all
Loaded plugins: fastestmirror
gpgcheck=1
Cleaning up Everything
Cleaning up list of fastest mirrors
[root@server_weixin_slave4 yum.repos.d]#
[root@server_weixin_slave4 yum.repos.d]#
[root@server_weixin_slave4 yum.repos.d]# yum makecache
Loaded plugins: fastestmirror
Determining fastest mirrors
 * epel: mirrors.aliyuncs.com
http://mirrors.163.com/centos/5/addons/x86_64/repodata/repomd.xml: [Errno 14] HTTP Error 404: Not Found
Trying other mirror.
Error: Cannot retrieve repository metadata (repomd.xml) for repository: addons. Please verify its path and try again
```


把 `/etc/yum.repos.d/CentOS-Base.repo` 内容改成下面的
```bash
# CentOS-Base.repo
#
# The mirror system uses the connecting IP address of the client and the
# update status of each mirror to pick mirrors that are updated to and
# geographically close to the client.  You should use this for CentOS updates
# unless you are manually picking other mirrors.
#
# If the mirrorlist= does not work for you, as a fall back you can try the 
# remarked out baseurl= line instead.
#
#
[base]  
name=CentOS-$releasever - Base  
#mirrorlist=http://mirrorlist.centos.org/?release=$releasever&arch=$basearch&repo=os  
#baseurl=http://mirror.centos.org/centos/$releasever/os/$basearch/  
baseurl=http://vault.centos.org/5.11/os/$basearch/  
gpgcheck=1  
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-5  


#released updates   
[updates]  
name=CentOS-$releasever - Updates  
#mirrorlist=http://mirrorlist.centos.org/?release=$releasever&arch=$basearch&repo=updates  
#baseurl=http://mirror.centos.org/centos/$releasever/updates/$basearch/  
baseurl=http://vault.centos.org/5.11/updates/$basearch/  
gpgcheck=1  
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-5  


#additional packages that may be useful  
[extras]  
name=CentOS-$releasever - Extras  
#mirrorlist=http://mirrorlist.centos.org/?release=$releasever&arch=$basearch&repo=extras  
#baseurl=http://mirror.centos.org/centos/$releasever/extras/$basearch/  
baseurl=http://vault.centos.org/5.11/extras/$basearch/  
gpgcheck=1  
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-5


#additional packages that extend functionality of existing packages  
[centosplus]  
name=CentOS-$releasever - Plus  
#mirrorlist=http://mirrorlist.centos.org/?release=$releasever&arch=$basearch&repo=centosplus  
#baseurl=http://mirror.centos.org/centos/$releasever/centosplus/$basearch/  
baseurl=http://vault.centos.org/5.11/centosplus/$basearch/  
gpgcheck=1  
enabled=0  
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-5  


#contrib - packages by Centos Users  
[contrib]  
name=CentOS-$releasever - Contrib  
#mirrorlist=http://mirrorlist.centos.org/?release=$releasever&arch=$basearch&repo=contrib  
#baseurl=http://mirror.centos.org/centos/$releasever/contrib/$basearch/  
baseurl=http://vault.centos.org/5.11/contrib/$basearch/  
gpgcheck=1  
enabled=0  
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-5
```

有些地方可能还是报404的错, 不过好像不影响使用, 就是速度很慢...

---
参考：
- [centos5.X yum源地址变更](http://blog.csdn.net/qq_36357820/article/details/77732656)
- [阿里云镜像YUM源 EPEL源](https://my.oschina.net/dingzang/blog/702891)

