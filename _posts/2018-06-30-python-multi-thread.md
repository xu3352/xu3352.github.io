---
layout: post
title: "Python多线程入门"
tagline: ""
description: "有时候单线程需要长时间才能得到结果的, 可以考虑使用多线程来加速处理"
date: '2018-06-30 16:20:05 +0800'
category: python
tags: python
---
> {{ page.description }}

# threading模块
使用Threading模块创建线程，直接从threading.Thread继承，然后重写__init__方法和run方法：
```python
#!/usr/bin/python
# -*- coding: UTF-8 -*-
 
import threading
import time
 
exitFlag = 0
 
class myThread (threading.Thread):   #继承父类threading.Thread
    def __init__(self, threadID, name, counter):
        threading.Thread.__init__(self)
        self.threadID = threadID
        self.name = name
        self.counter = counter
    def run(self):                   #把要执行的代码写到run函数里面 线程在创建后会直接运行run函数 
        print "Starting " + self.name
        print_time(self.name, self.counter, 5)
        print "Exiting " + self.name
 
def print_time(threadName, delay, counter):
    while counter:
        if exitFlag:
            (threading.Thread).exit()
        time.sleep(delay)
        print "%s: %s" % (threadName, time.ctime(time.time()))
        counter -= 1
 
# 创建新线程
thread1 = myThread(1, "Thread-1", 1)
thread2 = myThread(2, "Thread-2", 2)
 
# 开启线程
thread1.start()
thread2.start()
 
print "Exiting Main Thread"
```

# 返回线程结果
`test_multi_thread.py` 代码
```python
#!/usr/bin/env python
# -*- coding: UTF-8 -*-
# author: xu3352<xu3352@gmail.com>
"""
多线程返回值测试
"""

import threading
import time
import random


class MultiThread(threading.Thread):
    """ 多线程封装 """
    def __init__(self, start_num, end_num, result):
        threading.Thread.__init__(self)
        self.start_num = start_num
        self.end_num = end_num
        self.result = result

    def run(self):
        print("开始线程：" + self.name)
        do_something(self.name, self.start_num, self.end_num, self.result)
        print("退出线程：" + self.name)


def do_something(threadName, start_num, end_num, result):
    """ 结果合并 """
    array = []
    for i in range(5):
        cnt = random.randint(start_num, end_num)
        print('{} 本次随机数:{}'.format(threadName, cnt))
        array.append(cnt)
        time.sleep(random.randint(1, 3))
    print('{} 结果列表:{}'.format(threadName, array))
    result += array


def multi_job(start_num, end_num):
    result = []
    thread_list = []
    for i in range(5 + 1):
        thread = MultiThread(start_num, end_num, result)  # 创建新线程
        thread.start()  # 启动线程
        thread_list.append(thread)

    # 等待完成, 返回最终结果
    for t in thread_list:
        t.join()
    return result


if __name__ == '__main__':
    result = multi_job(5, 10)
    print(result)
    print("主线程结束")
```

运行结果:(每次运行都会不一样)
```
开始线程：Thread-6
Thread-6 本次随机数:5
开始线程：Thread-7
Thread-7 本次随机数:10
开始线程：Thread-8
Thread-8 本次随机数:8
开始线程：Thread-9
Thread-9 本次随机数:10
开始线程：Thread-10
Thread-10 本次随机数:6
开始线程：Thread-11
Thread-11 本次随机数:7
Thread-6 本次随机数:8
Thread-8 本次随机数:8
Thread-11 本次随机数:5
Thread-7 本次随机数:7
Thread-9 本次随机数:9
Thread-6 本次随机数:7
Thread-10 本次随机数:9
Thread-9 本次随机数:6
Thread-7 本次随机数:9
Thread-8 本次随机数:5
Thread-9 本次随机数:7
Thread-11 本次随机数:6
Thread-8 本次随机数:10
Thread-10 本次随机数:7
Thread-6 本次随机数:6
Thread-11 本次随机数:8
Thread-7 本次随机数:7
Thread-8 本次随机数:8
Thread-9 本次随机数:10
Thread-11 本次随机数:7
Thread-6 本次随机数:5
Thread-10 本次随机数:5
Thread-11 结果列表:[7, 5, 6, 8, 7]
退出线程：Thread-11
Thread-7 本次随机数:5
Thread-8 结果列表:[8, 8, 5, 10, 8]
退出线程：Thread-8
Thread-9 结果列表:[10, 9, 6, 7, 10]
退出线程：Thread-9
Thread-6 结果列表:[5, 8, 7, 6, 5]
退出线程：Thread-6
Thread-10 本次随机数:8
Thread-7 结果列表:[10, 7, 9, 7, 5]
退出线程：Thread-7
Thread-10 结果列表:[6, 9, 7, 5, 8]
退出线程：Thread-10
[7, 5, 6, 8, 7, 8, 8, 5, 10, 8, 10, 9, 6, 7, 10, 5, 8, 7, 6, 5, 10, 7, 9, 7, 5, 6, 9, 7, 5, 8]
主线程结束
```

# 另一种方式
`multiprocessing` 模块实现
```python
#!/usr/bin/env python
# -*- coding: UTF-8 -*-
# author: xu3352<xu3352@gmail.com>
"""
多线程返回值测试
"""
import time
import random
import multiprocessing


def worker(procnum, return_dict):
    '''worker function'''
    array = []
    for i in range(5):
        cnt = random.randint(1, 5)
        array.append(cnt)
        print('procnum{} 本次随机数:{}'.format(procnum, cnt))
        time.sleep(random.randint(1, 3))
    print('procnum{} 结果列表:{}'.format(procnum, array))
    return_dict[procnum] = array


if __name__ == '__main__':
    manager = multiprocessing.Manager()
    return_dict = manager.dict()
    jobs = []
    for i in range(5):
        p = multiprocessing.Process(target=worker, args=(i, return_dict))
        jobs.append(p)
        p.start()

    for proc in jobs:
        proc.join()

    print(return_dict.values())
```
运行结果:
```
procnum0 本次随机数:3
procnum1 本次随机数:1
procnum2 本次随机数:3
procnum3 本次随机数:2
procnum4 本次随机数:5
procnum0 本次随机数:2
procnum1 本次随机数:1
procnum2 本次随机数:4
procnum4 本次随机数:1
procnum0 本次随机数:5
procnum1 本次随机数:3
procnum2 本次随机数:4
procnum3 本次随机数:5
procnum0 本次随机数:1
procnum1 本次随机数:2
procnum2 本次随机数:2
procnum0 本次随机数:1
procnum3 本次随机数:2
procnum2 本次随机数:1
procnum4 本次随机数:3
procnum0 结果列表:[3, 2, 5, 1, 1]
procnum3 本次随机数:4
procnum1 本次随机数:4
procnum4 本次随机数:2
procnum2 结果列表:[3, 4, 4, 2, 1]
procnum4 本次随机数:3
procnum3 本次随机数:3
procnum1 结果列表:[1, 1, 3, 2, 4]
procnum4 结果列表:[5, 1, 3, 2, 3]
procnum3 结果列表:[2, 5, 2, 4, 3]
[[3, 2, 5, 1, 1], [1, 1, 3, 2, 4], [3, 4, 4, 2, 1], [2, 5, 2, 4, 3], [5, 1, 3, 2, 3]]
```

---
参考：
- [菜鸟教程 - Python3 多线程](http://www.runoob.com/python3/python3-multithreading.html)
- [How can I recover the return value of a function passed to multiprocessing.Process?](https://stackoverflow.com/questions/10415028/how-can-i-recover-the-return-value-of-a-function-passed-to-multiprocessing-proce)
