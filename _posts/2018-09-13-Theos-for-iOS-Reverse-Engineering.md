---
layout: post
title: "iOS逆向工程之Theos:入门"
tagline: ""
description: "这里实现一个简单的屏幕解锁提示弹框"
date: '2018-09-13 10:19:18 +0800'
category: iOS
tags: theos iOS
---
> {{ page.description }}

# 安装THEOS
这里以 `mac` 为例:

依赖: `Homebrew` `Xcode 5.0+`

```bash
# 依赖包安装
$ brew install ldid xz

# 配置环境变量
$ echo "export THEOS=~/theos" >> ~/.profile

# 源码拉取
$ git clone --recursive https://github.com/theos/theos.git $THEOS
```

其他系统安装参考:[Theos - 安装文档](https://github.com/theos/theos/wiki/Installation)

# 工程创建
屏幕解锁弹框

```bash
$ $THEOS/bin/nic.pl
NIC 2.0 - New Instance Creator
------------------------------
  [1.] iphone/activator_event
  [2.] iphone/application_modern
  [3.] iphone/cydget
  [4.] iphone/flipswitch_switch
  [5.] iphone/framework
  [6.] iphone/ios7_notification_center_widget
  [7.] iphone/library
  [8.] iphone/notification_center_widget
  [9.] iphone/preference_bundle_modern
  [10.] iphone/tool
  [11.] iphone/tweak
  [12.] iphone/xpc_service
Choose a Template (required): 11
Project Name (required): LockScreenAlter
Package Name [com.yourcompany.lockscreenalter]:
Author/Maintainer Name [xuyinglong]:
[iphone/tweak] MobileSubstrate Bundle filter [com.apple.springboard]:
[iphone/tweak] List of applications to terminate upon installation (space-separated, '-' for none) [SpringBoard]:
Instantiating iphone/tweak in lockscreenalter/...
Done.
```
**步骤**:
- 模板选择 `tweak` 所以这里选择: `11`
- 项目名称: `LockScreenAlter` 
- 其他的 `回车` 默认就可以了

**几个核心文件**:
- `LockScreenAlter.plist` - `Bundle ID` 绑定
- `Makefile` - 编译选项配置
- `Tweak.xm` - HOOK主体逻辑
- `control` - 一些配置信息

`Tweak.xm`:(屏幕解锁之后加个弹框)
```c
%hook SBLockScreenManager
- (void)lockUIFromSource:(NSUInteger)source withOptions:(id)options {
    %orig;

    UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"你好" 
        message:@"hello world!" 
        delegate:nil 
        cancelButtonTitle:@"确定" 
        otherButtonTitles:nil];
    [alert show];
}
%end
```

`Makefile`:
```bash
THEOS_DEVICE_IP=192.168.7.124
ARCHS = armv7 armv7s arm64
SDKVERSION = 11.4
TARGET = iphone:clang:11.4:8.0

include $(THEOS)/makefiles/common.mk

TWEAK_NAME = LockScreenAlter
LockScreenAlter_FILES = Tweak.xm

include $(THEOS_MAKE_PATH)/tweak.mk

after-install::
        install.exec "killall -9 SpringBoard"
```

额外配置说明:
```python
THEOS_DEVICE_IP=192.168.7.153   # 设备IP, 和电脑同一网段
ARCHS = armv7 armv7s arm64      # 指定处理器架构
SDKVERSION = 11.4               # XCode SDK版本
TARGET = iphone:clang:11.4:8.0  # IOS SDK版本和手机系统版本
```

`XCode` SDK版本查看:
```bash
$ xcodebuild -showsdks
iOS SDKs:
        iOS 11.4                        -sdk iphoneos11.4
```

# 编译/打包/部署

## 编译
```bash
$ make
> Making all for tweak LockScreenAlter…
==> Preprocessing Tweak.xm…
==> Compiling Tweak.xm (armv7)…
==> Linking tweak LockScreenAlter (armv7)…
==> Generating debug symbols for LockScreenAlter…
rm /Users/xuyinglong/work-theos/lockscreenalter/.theos/obj/debug/armv7/Tweak.xm.mm
==> Preprocessing Tweak.xm…
==> Compiling Tweak.xm (armv7s)…
==> Linking tweak LockScreenAlter (armv7s)…
==> Generating debug symbols for LockScreenAlter…
rm /Users/xuyinglong/work-theos/lockscreenalter/.theos/obj/debug/armv7s/Tweak.xm.mm
==> Preprocessing Tweak.xm…
==> Compiling Tweak.xm (arm64)…
==> Linking tweak LockScreenAlter (arm64)…
==> Generating debug symbols for LockScreenAlter…
rm /Users/xuyinglong/work-theos/lockscreenalter/.theos/obj/debug/arm64/Tweak.xm.mm
==> Merging tweak LockScreenAlter…
==> Signing LockScreenAlter…
```

## 打包
```
$ make package
> Making all for tweak LockScreenAlter…
make[2]: Nothing to be done for `internal-library-compile'.
> Making stage for tweak LockScreenAlter…
dm.pl: building package `com.yourcompany.lockscreenalter:iphoneos-arm' in `./packages/com.yourcom
pany.lockscreenalter_0.0.1-1+debug_iphoneos-arm.deb'
```

## 部署
```
$ make install
==> Installing…
root@192.168.7.124's password:
Selecting previously unselected package com.yourcompany.lockscreenalter.
(Reading database ... 2789 files and directories currently installed.)
Preparing to unpack /tmp/_theos_install.deb ...
Unpacking com.yourcompany.lockscreenalter (0.0.1-1+debug) ...
Setting up com.yourcompany.lockscreenalter (0.0.1-1+debug) ...
install.exec "killall -9 SpringBoard"
root@192.168.7.124's password:
```
需要输入2次密码; 第一次进行安装, 第二次重启`SpringBoard` 面板 (和电脑注销差不多)

然后应该就可以看到弹框了

---
参考：
- [iOS逆向工程之Theos](https://www.cnblogs.com/ludashi/p/5714095.html)
- [Theos - 安装文档](https://github.com/theos/theos/wiki/Installation)

