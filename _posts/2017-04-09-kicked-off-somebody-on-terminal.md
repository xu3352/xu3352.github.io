---
layout: post
title:  "在终端上踢掉别人"
date:   2017-04-09 12:42:00 +0800
categories: linux command-line
---
>  系统被黑客入侵了，怎么办？改密码，踢掉！！！

    早上收到提醒，一个国外IP登陆了系统，可能被黑了，还好只是个测试账号，没什么大事。。。
    有一个测试账号(test)密码被黑客破解了，应该是123456之类的密码吧，不过应该没什么权限

第一反应就改密码，然后把他踢掉

    # 1.修改密码(root用户可以随便改别人的密码)
    passwd test
    # 2.踢掉test用户(用 w 命令查看当前在线的用户，一眼就能看出来了)
    pkill -kill -t pts/1
    # 3.清理没用的账户
    userdel test
    # 4.修改root密码，如果比较简单的话
    passwd root

参考：  
[linux下如何踢掉其他用户](http://www.cnblogs.com/fbwfbi/archive/2013/05/06/3063331.html)    
[Linux下创建和删除用户](https://www.ezloo.com/2008/03/add_and_delete_user.html)


