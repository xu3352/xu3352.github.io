---
layout: post
title: "Gson解析json数组"
tagline: ""
description: "gson快捷方便的解析Java对象数组"
date: '2018-04-04 16:03:16 +0800'
category: java
tags: gson json java
---
> {{ page.description }}

# 字符串数组
比如字符串数组:
```json
["Android","Java","PHP"]
```
测试代码:
```java
Gson gson = new Gson();
String jsonArray = "[\"Android\",\"Java\",\"PHP\"]";
String[] strings = gson.fromJson(jsonArray, String[].class);
```

这里可以看到简单的字符串类型解析非常方便

# 对象数组
实体类:`Car`
```java
public class Car implements Serializable {
    public String brand;
    public int    doors;

    public Car() {
    }

    public Car(String brand, int doors) {
        this.brand = brand;
        this.doors = doors;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public int getDoors() {
        return doors;
    }

    public void setDoors(int doors) {
        this.doors = doors;
    }

    @Override
    public String toString() {
        return "Car{" +
                "brand='" + brand + '\'' +
                ", doors=" + doors +
                '}';
    }
}
```

数组转json
```java
List<Car> list = new ArrayList<Car>();
list.add(new Car("Jeep", 3));
list.add(new Car("Porsche", 2));
System.out.println( gson.toJson(list) );
```

可以得到json字符串:
```json
[{"brand":"Jeep","doors":3},{"brand":"Porsche","doors":2}]
```

json数组转Java数组
```java
String jsonString = "[{\"brand\":\"Jeep\",\"doors\":3},{\"brand\":\"Porsche\",\"doors\":2}]";
Type listType = new TypeToken<List<Car>>(){}.getType();
Gson gson = new Gson();
List<Car> carList = gson.fromJson(jsonString, listType);
System.out.println( carList );
```
打印结果为:
```java
[Car{brand='Jeep', doors=3}, Car{brand='Porsche', doors=2}]
```

是不是也是非常简单而强大

---
参考：
- [Gson维基百科](https://zh.wikipedia.org/wiki/Gson)
- [Java中使用Gson解析json](https://xu3352.github.io/java/2017/04/17/json-parse-using-gson-for-java)
- [Gson解析json数组](https://blog.csdn.net/adayabetter/article/details/43084375)
- [你真的会用Gson吗?Gson使用指南](https://www.jianshu.com/p/e740196225a4)

