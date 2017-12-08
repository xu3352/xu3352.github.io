---
layout: post
title: "CentOS7 安装 Docker CE"
tagline: ""
description: "CentOS 7 快速安装 Docker CE 教程"
date: '2017-12-08 13:33:23 +0800'
category: linux
tags: linux centos docker
---
> {{ page.description }}

# Docker CE 和 EE 区别
`CE` 是社区版本, 基本功能都有, 免费; `EE` 是企业版, 高级功能, 收费;

详细的对比可以看这里:[Docker CE 还是 Docker EE](http://blog.csdn.net/liumiaocn/article/details/60468257)

# 准备工作
`CentOS 7` 刚好可以达到安装 `Docker` 的最低要求, 上一篇文章已经给我们安装好了 `CentOS 7`, 这里我们直接可以开始了; 

如果安装了老版本的 `Docker`, 需要先卸载掉:
```bash
$ sudo yum remove docker \
                  docker-common \
                  docker-selinux \
                  docker-engine
```

# 安装 Docker CE
这里我们选择 `yum` 简化安装, 当然你也可以使用 rpm 包

## 设置仓库
```bash
# 工具包和存储层支持
$ sudo yum install -y yum-utils \
  device-mapper-persistent-data \
  lvm2

# 使用稳定版库
$ sudo yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo

# (可选)使用edge或test库, 默认是关闭状态的
$ sudo yum-config-manager --enable docker-ce-edge
$ sudo yum-config-manager --enable docker-ce-test

# 不想用的话也可以手动再关掉
$ sudo yum-config-manager --disable docker-ce-edge
```

## 安装
```bash
# 直接安装最新版本的
$ sudo yum install docker-ce

# 也可以指定版本进行安装, 查看版本
$ yum list docker-ce --showduplicates | sort -r
docker-ce.x86_64            17.09.ce-1.el7.centos             docker-ce-stable

# 指定版本 上面的:<FULLY-QUALIFIED-PACKAGE-NAME> 为 docker-ce-17.09.1.ce
$ sudo yum install <FULLY-QUALIFIED-PACKAGE-NAME>


# 启动docker
$ sudo systemctl start docker

# 检查是否能运行起来
$ sudo docker run hello-world
```

# 镜像加速
在国内, 如果没有配置加速, 即使最简单的 `sudo docker run hello-world` 也可能拉取超时...

针对 `CentOS 7`, 如下操作即可:
```bash
$ vim /etc/docker/daemon.json
{
  "registry-mirrors": [
    "https://registry.docker-cn.com"
  ]
}


# docker服务重新加载并重启
$ sudo systemctl daemon-reload
$ sudo systemctl restart docker
```

# 卸载 Docker CE
```bash
# 卸载安装包
$ sudo yum remove docker-ce

# 清理所有的镜像, 容器, 数据卷
$ sudo rm -rf /var/lib/docker
```

---
参考：
- [官网安装步骤:Get Docker CE for CentOS](https://docs.docker.com/engine/installation/linux/docker-ce/centos/)
- [选择 Docker CE 还是 Docker EE](http://blog.csdn.net/liumiaocn/article/details/60468257)
- [Docker:镜像加速器](https://yeasy.gitbooks.io/docker_practice/content/install/mirror.html)
