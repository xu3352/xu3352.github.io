---
layout: post
title: "Java获取本机内网IP地址"
tagline: ""
description: "Java 获取本机 IP 地址列表, 识别内网IP地址"
date: '2017-08-20 15:25:37 +0800'
category: java
tags: java
---
> {{ page.description }}

# 获取本机IP
```java
/** 本机IP 列表 */
public static List<String> getLocalIps() {
    List<String> ips = new ArrayList<String>();
    try {
        Enumeration<NetworkInterface> enumeration = NetworkInterface.getNetworkInterfaces();
        while (enumeration.hasMoreElements()) {
            NetworkInterface iface = enumeration.nextElement();
            // filters out 127.0.0.1 and inactive interfaces
            if (iface.isLoopback() || !iface.isUp()) continue;

            Enumeration<InetAddress> inetAddresses = iface.getInetAddresses();
            while (inetAddresses.hasMoreElements()) {
                String ip = inetAddresses.nextElement().getHostAddress();
                // 排除 回环IP/ipv6 地址
                if (ip.contains(":")) continue;
                if (StringUtils.isNotBlank(ip)) ips.add(ip);
            }
        }
    } catch (SocketException e1) {
        e1.printStackTrace();
    }
    return ips;
}
```

去掉了 `127.0.0.1` 和 IPV6 的地址; 正常一台PC机是一个网卡, 而服务器一般会有两个网卡, 所以这里直接是放入 `List` 列表里


# 获取本机内网IP
```java
/** 获取内网IP */
public static String getLocalIntranetIp() {
    List<String> ips = getLocalIps();
    for (String ip : ips) {
        if (isIntranetIp(ip)) return ip;
    }
    return "";
}

/** 判断是否为内网IP
 *  tcp/ip协议中, 专门保留了三个IP地址区域作为私有地址, 其地址范围如下:
 *  10.0.0.0/8: 10.0.0.0～10.255.255.255
 *  172.16.0.0/12: 172.16.0.0～172.31.255.255
 *  192.168.0.0/16: 192.168.0.0～192.168.255.255
 */
public static boolean isIntranetIp(String ip) {
    try {
        if (ip.startsWith("10.") || ip.startsWith("192.168.")) return true;
        // 172.16.x.x～172.31.x.x
        String[] ns = ip.split("\\.");
        int ipSub = Integer.valueOf(ns[0] + ns[1]);
        if (ipSub >= 17216 && ipSub <= 17231) return true;
    } catch (Exception e) {
        e.printStackTrace();
    }
    return false;
}
```

先获取本机 IP 列表, 然后迭代判断是否为内网 IP, 如果是, 直接返回即可

---
参考：
- [如何判断自己IP是内网IP还是外网IP](http://blog.csdn.net/wqf363/article/details/1434051)
- [how to identify Intranet/Interbet IP address? ](https://coderanch.com/t/206200/java/identify-Intranet-Interbet-IP-address)

