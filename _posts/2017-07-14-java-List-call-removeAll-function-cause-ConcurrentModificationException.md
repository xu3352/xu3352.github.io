---
layout: post
title: "List.removeAll() 导致 java.util.ConcurrentModificationException 异常"
tagline: ""
description: "Java `List`集合里截取子集`subList`，然后把子集`subList`从`List`里删除，导致了：`java.util.ConcurrentModificationException` 异常"
date: '2017-07-14 13:55:18 +0800'
category: java
tags: java list exception
---
> {{ page.description }}

# List 的 subList 和 removeAll 方法
只是从原始集合里截取了部分集合，但是原始集合里的数据并不会减少，相当于是复制了子集出去    
`List<E> subList(int fromIndex, int toIndex);`      
- fromIndex 起始索引，包含，fromIndex >= 0
- toIndex 结束索引，不包含，toIndex <= size()

然而 List 提供按子集删除的方法，批量删除当然比单个删除用起来舒服：     
`boolean removeAll(Collection<?> c);`       

直接上代码：
```java
public static void main(String[] args) {
    List<String> list = new ArrayList<String>();
    list.add("A");
    list.add("B");
    list.add("c");
    System.out.println("集合:" + list);

    List<String> subList = list.subList(0, 1);
    list.removeAll(subList);

    System.out.println("子集:" + subList);
    System.out.println("集合剩余:" + list);
}
```

这样会直接导致 `ConcurrentModificationException` 异常！！！

如果迭代 List 的时候，同时也在删除元素，可得注意了，容易导致 `ConcurrentModificationException` 或者 `ArrayIndexOutOfBoundsException` 情况：
- 一种解决办法是按下标索引从后往前迭代，然后删除；
- 一种办法是复制一个列表，然后迭代复制的列表，然后匹配，然后删除原始列表的元素;

# 解决
这里使用复制的方式，简单一点
```java
public static void main(String[] args) {
    List<String> list = new ArrayList<String>();
    list.add("A");
    list.add("B");
    list.add("c");
    System.out.println("集合:" + list);

    List<String> subList = new ArrayList<String>(list.subList(0, 1));
    list.removeAll(subList);

    System.out.println("子集:" + subList);
    System.out.println("集合剩余:" + list);
}
```

# 封装
由于调用频发，这里可以封装成公共的方法
```java
/** 返回子列表,并从原始列表中删除 */
public static <T> List<T> popSubList(List<T> list, int len) {
    if (ParamUtil.isEmpty(list) || len <= 0) return null;
    int index = len < list.size() ? len : list.size();
    List<T> subList = new ArrayList<T>(list.subList(0, index));
    list.removeAll(subList);    // remove subList
    return subList;
}
```

---
参考：
- [subList引发的血案](http://huangyunbin.iteye.com/blog/1735376)
- [Iterating through a Collection, avoiding ConcurrentModificationException when removing in loop](https://stackoverflow.com/questions/223918/iterating-through-a-collection-avoiding-concurrentmodificationexception-when-re)


