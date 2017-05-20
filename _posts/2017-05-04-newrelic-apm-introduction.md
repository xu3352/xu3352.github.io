---
layout: post
title: "New Relic APM 监控介绍"
tagline: ""
date: '2017-05-04 16:40:34 +0800'
category: monitor
tags: new-relic APM java linux
---
> 一款非常好用的应用性能监控服务。免费版就已经非常强大，你值得拥有！！！    
> **See (don't guess) where are your app's bottlenecks**  
> **找到（不要猜测）你的应用程序的瓶颈在哪里**

# New Relic介绍
[New Relic](https://newrelic.com/) 是国外知名的、老牌、资深监控服务商。  
这么好的东西，之前免费使用了几个月，有义务宣传一下。  
Google上搜索一下“apm 监控 推荐”，第一个是知乎的：[有什么知名的开源apm(Application Performance Management)工具吗？](https://www.zhihu.com/question/27994350)

***为什么选择 New Relic：***  
- 监控是必须的，不然就好比摸着石头过河，哪里有坑，踩下去了才知道！！！
- 可一直免费试用，当日高级版功能更加强大，现已转到收费版，获得的收益非常可观
- 非侵入式安装，无需在代码里埋点，只需简单的安装即可。大部分语言都支持，最喜欢这点了，简直无敌了
- 功能强大，报表丰富，让性能低下的地方无所遁形，error 也可直观的统计到，对你的应用性能了如指掌

如果你还在犹豫，那么你应该是少一个翻墙工具(Mac推荐[鱼摆摆](https://ybb1024.com/))了，是否好用，也就只有用过之后才知道。 :-)

# APM介绍
[APM](https://docs.newrelic.com/docs/apm/new-relic-apm/getting-started/introduction-new-relic-apm)：**Application Performance Monitoring**  应用性能监控    
是什么：是 New Relic 公司的一款应用程序性能监控软件分析产品，可以提供有关Web应用程序性能方面的实时、趋势以及最终用户体验满意度等方面数据。 通过端对端的事务跟踪和各种色彩的图表和报告，APM可做到深达的代码级别的可视化数据。

您的开发人员/操作团队不需要猜测性能问题是来自应用程序本身、CPU可用性、数据库加载还是其他无法预期的事情上。使用New Relic APM，您可以在影响最终用户之前快速识别潜在的问题。


# 安装 Java Agent
支持语言：`Ruby、PHP、Java、.Net、Python、NodeJs、Go`    
这里介绍 Java 版本：[快捷安装Java Agent文档](https://rpm.newrelic.com/accounts/1488405/applications/setup)   
1. 获取 License Key，点击查看就可以了
2. 下载 Java Agent，默认是最新的版本
3. 安装 Agent （Linux or Mac）   
4. 配置 newrelic.yml
5. 重启 Tomcat
6. 5分钟后看数据

```bash
# 3.1 解压到 tomcat 安装目录
unzip newrelic-java-3.38.0.zip -d /path/to/appserver/

# 3.2 一键安装，忽悠安装日志，你会看到其实他把 bin/catalina.sh 增加了启动参数，里面搜索 newrelic 就能找到了
# 如果是 copy tomcat的话，注意这里可能需要改一下 tomcat 路径
cd /path/to/appserver/newrelic
java -jar newrelic.jar install

# 4. 自定义app显示名称：app_name
vim /path/to/appserver/newrelic/newrelic.yml
```

# APM-Overview介绍
选择一个 app_name 应用进行查看，默认进入到 Overview 主界面，如果多个 agent 里的 app_name 名称是一样的，采集的数据合并到一起，比如 tomcat 集群时，其实同属于一个 app_name，每个 tomcat 有独立的 jvm，可以在单独选择某一个 jvm 进行查看。

***全局设置：***  
![全局设置图](http://on6gnkbff.bkt.clouddn.com/20170504122404_new-relic-apm-globle-settings.png){:width="100%"}
- **APPS**：默认当前应用名称，可快速切换应用
- **TIME PICKER**：时段选择，可自定义时间段
- **JVMS**：如果有多个 Agent 的 app_name 一致，这里会出现所有集群 JVM 列表，以 host_name:port 的形式，如果默认的看着不舒服，建议把 host_name 改一下，方便区分

***Overview 主界面详解：***  
![Overview](http://on6gnkbff.bkt.clouddn.com/20170503063912_new-relic-apm-summary.png){:width="100%"}
- Web transactions time：JVM、Mysql、Web external、Response time 整体耗时报表
- Apdex score：apm 综合打分，满分1.0
- Throughtput：整体吞吐量，单位分钟
- Transactions：请求调用等，这块展示规则没太搞明白 Top5
- Error rate：错误率，如果检测到系统错误，这里会提现处理，如果达到一定错误率，会有系统报警（邮件），报表背景将会是：淡红色
- Host：JVM 报表，每个 jvm 具体情况，比如：  

| Host name | Apdex | Resp.time | Throughtput | Error Rate | CPU usage | Memory |

- Recent events：近期历史事件，常见的就是报警了

# APM-Transactions介绍
![Transactions](http://on6gnkbff.bkt.clouddn.com/20170503063913_new-relic-apm-transactions.png){:width="100%"}
***Transactions 主界面详解：***   
- Type：Web、Non-Web（Java/Job/SpringController等，定时任务之类的）
- 排序：
    - Most Time consuming：耗时最多的
    - Slowest average response time：响应最慢的
    - Adpex most dissatisfying：Adpex打分最不满意的
    - Highest throughput：吞吐量最高的
- Top 5 web Transactions：耗时最多的5个web请求百分比，可以选择不同的报表展示方式
- Transaction traces：一般是有问题的请求事件会出现在这里，点进去可以看到堆栈的东西，查询sql之类的等
    - Summary：汇总
    - Trace details：跟踪详情
    - Database queries：数据库查询

附上 Transaction traces 3张截图：
![Summary](http://on6gnkbff.bkt.clouddn.com/20170504153559_apm-transaction-traces-summary.png){:width="100%"}
![Trace details](http://on6gnkbff.bkt.clouddn.com/20170504153558_apm-transaction-traces-details.png){:width="100%"}
![Database queries](http://on6gnkbff.bkt.clouddn.com/20170504153556_apm-transaction-traces-db-queries.png){:width="100%"}

# APM-DataBases介绍
![DataBases](http://on6gnkbff.bkt.clouddn.com/20170503063911_new-relic-apm-databases.png){:width="100%"}
***DataBases 主界面详解：***
- SORT BY：排序
    - Most time consuming：秏时最多的
    - Slowest query time：查询最慢的
    - Throughtput：吞吐量最大的（频率最高的）
- MySQL overview：根据排序来展现的详细报表，仅第一个根据排序变化
    - Top database operations by time consumed：耗时最多的5个查询
    - Top database operations by query time：整体增删改查耗时
    - Top database operations by throughput：整体增删改查吞吐量

# APM-External services介绍
比如嵌入了第三方的API，调用时也会被记录下来，比如：吞吐量、平均响应时长等信息

# APM-JVMs介绍
直接看图吧
![](http://on6gnkbff.bkt.clouddn.com/20170504160439_new-relic-apm-jvms.png){:width="100%"}

# New Relic相关产品
主要产品：  
- APM：应用性能监控
- Browser：浏览器监控：如果非常注重Web前端体验的话，这个是个不错的东东
- Synthetics：合并监控：通过创建一个新的监视器来监控世界各地的网站，关键业务交易和API终端
- Mobile：移动端监控：移动APP性能监控（iOS、Android、Titanium、Unity、tvOS）
- Plugins：插件监控：貌似也是非常强大，比如：Nginx、Mysql、Memcached、Redis、MongoDB......
- Infrastructure：基础设施监控：主机的网络IO、CPU、内存、磁盘、系统负载等

# 后话
由于可使用免费版，就特别适合个人和中小型企业使用，这点不得不佩服老外做得很好。   
国内有 OneAPM，之前有过免费版，不过现在已经不提供了，没使用过。使用方面看起来和 New Relic 几乎是一模一样的。

参考：
- [New Relic：性能监测商业工具](http://hao.jobbole.com/new-relic/)

