---
layout: post
title: "golang搭建简单的web日志服务"
date: '2017-03-19 01:25:38'
category: go
tags: go nginx web
---

> GOOGLE开发的一门语言，精简，高效，资源消耗少

# 一本入门书
找到一个作者写的书：`build-web-application-with-golang` 感谢人家的劳动成果🙏
```
1.安装go
1.1安装 Go
2.安装日志包
12.1 应用日志
    导入的时候注意大小写，：github.com/sirupsen/logrus
3.web server demo运行
3.2 Go搭建一个Web服务器
4.改造
    a.日志输出到指定文件
    b.只输出指定的参数内容的日志
    c.正则替换所有空白字符，多行模式
5.后台启动
```

# 后台启动
```bash
# 直接控制台运行
go run myweb.go
# 放到后台运行，终端关掉后不影响
nohup go run myweb.go &
```

# nginx设置
```nignx
# 把nginx指向到新搭建的日志server
location ^~ /xxx/xxx/serverlog.htm {
    proxy_pass http://127.0.0.1:9090/serverlog;
}
```

# myweb.go
```go
package main

import (
    "fmt"
    "net/http"
    "strings"
    "os"
    "github.com/Sirupsen/logrus"
    "regexp"
)

func serverlog(w http.ResponseWriter, r *http.Request) {
    r.ParseForm()  //解析参数，默认是不会解析的
    re := regexp.MustCompile(`(?m:\s+)`)
    for k, v := range r.Form {
        // fmt.Println("key:", k)
        // fmt.Println("val:", strings.Join(v, ""))
        if (k == "jsonLog") {
            values := strings.Join(v, "");
            logrus.Info( re.ReplaceAllString(values, "") )
        }
    }
    fmt.Fprintf(w, "{'code':'0'}") //这个写入到w的是输出到客户端的
}

func main() {
    // open a file
    filepath := "/mnt/platformlogs/client_verbose.log"
    f, err := os.OpenFile(filepath, os.O_APPEND | os.O_CREATE | os.O_RDWR, 0666)
    if err != nil {
        fmt.Printf("error opening file: %v", err)
    }

    // don't forget to close it
    defer f.Close()

    // output file
    logrus.SetOutput(f)
    // logrus.SetOutput(os.Stdout)
    // log level
    logrus.SetLevel(logrus.InfoLevel)
    customFormatter := new(logrus.TextFormatter)
    customFormatter.TimestampFormat = "2006-01-02 15:04:05"
    customFormatter.FullTimestamp = true
    logrus.SetFormatter(customFormatter)

    // http linstening
    http.HandleFunc("/serverlog", serverlog) //设置访问的路由
    err2 := http.ListenAndServe(":9090", nil) //设置监听的端口
    if err != nil {
        logrus.Fatal("ListenAndServe: ", err2)
    }
}
```

参考：[build-web-application-with-golang](https://github.com/astaxie/build-web-application-with-golang)

