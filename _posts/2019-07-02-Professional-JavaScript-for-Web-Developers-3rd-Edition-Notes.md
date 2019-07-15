---
layout: post
title: "JavaScript高级程序设计(第三版)-笔记"
keywords: "javascript,books"
description: "JavaScript高级程序设计(第三版): 学习笔记, 查漏补缺"
tagline: ""
date: '2019-07-02 14:07:48 +0800'
category: javascript
tags: javascript, books
---
> {{ page.description }}

# 1.JavaScript简史

### 1.2.1 ECMAScript

![](/assets/archives/ECMAScript-browser-support.png){:width="100%"}
\*不完全兼容的实现

# 3.基本概念

### 3.6.9 switch语句

在 `switch` 语句中使用任何数据类型（在很多其他语言中只能使用数值），无论是字符串，还是对象都没有问题。其次，每个 `case` 的值不一定是常量，可以是变量，甚至是表达式。

`switch` 语句在比较值时使用的是全等(`===`)操作符，因此不会发生类型转换（例如，字符串\"10\" 不等于数值10）。

### 3.7.1 理解参数

ECMAScript函数的参数与大多数其他语言中函数的参数有所不同。ECMAScript函数不介意传递进来多少个参数，也不在乎传进来参数是什么数据类型。JS 的函数可以接受任意多的参数, 不管你定义的是几个。

实际上，在函数体内可以通过 `arguments` 对象来访问这个参数数组，从而获取传递给函数的每一个参数。

```js
function howManyArgs() {
    var str = "";
    for (var i = 0; i < arguments.length; i++) {
        str += arguments[i] + " ";
    }
    console.log("参数总数:" + arguments.length + " 数据:" + str);
}
howManyArgs("b", 2);        // 参数总数:2 数据:b 2 
howManyArgs("c", 5, "d");   // 参数总数:3 数据:c 5 d 
```

# 4.变量、作用域和内存问题

### 4.2.2 没有块级作用域

```js
for(var i=0; i < 10; i++){
    doSomething(i);
}
alert(i);   //10
```

而在 `C` 或 `Java` 中这样可是会报错的

# 5.引用类型

## 5.2 Array数组

数组的length属性很有特点——它不是只读的。因此，通过设置这个属性，可以从数组的末尾移除项或向数组中添加新项。

```js
var colors=["red","blue","green"]; //创建一个包含3个字符串的数组
colors.length=2;
alert(colors[2]);                  //undefined
```

利用length属性也可以方便地在数组末尾添加新项

```js
var colors=["red","blue","green"];  //创建一个包含3个字符串的数组
colors[colors.length]="black";      //（在位置3）添加一种颜色
colors[colors.length]="brown";      //（在位置4）再添加一种颜色
```

### 5.2.3 栈方法
- `push()` - 数组末尾添加项，并返回修改后数组的长度
- `pop()` - 数组移除最后一项, 并返回移除项

### 5.2.4 队列方法
- `push()` - 数组末尾添加项，并返回修改后数组的长度
- `shift()` - 数组移除第一项, 并返回移除项

### 5.2.5 重排序方法
- `reverse()` - 反转数组项的顺序
- `sort()` - 按升序排列数组项

默认情况下, 按 `toString()` 的字符串进行比较
```js
var values = [0, 1, 5, 10, 15];
values.sort();
alert(values);  // 0,1,10,15,5
```

因此 `sort()` 方法可以接收一个比较函数作为参数，以便我们指定哪个值位于哪个值的前面
```js
function compare(value1, value2) {
    if (value1 < value2) {
        return -1;
    } else if (value1 > value2) {
        return 1;
    }
    return 0;
}
var values = [0, 1, 5, 10, 15];
values.sort(compare);
alert(values);
```

对于数值类型或者其 `valueOf()` 方法会返回数值类型的对象类型，可以使用一个更简单的比较函数。这个函数只要用第二个值减第一个值即可。

```js
function compare(value1, value2) {
    return value2 - value1;
}
```

### 5.2.6 操作方法

`concat()` 方法可以基于当前数组中的所有项创建一个新数组. 具体来说, 这个方法会先创建当前数组的一个副本, 然后将接受到的参数添加到这个副本的末尾, 最后返回新构建的数组.

```js
var colors = ["red", "green", "blue"];
var colors2 = colors.concat("yellow", ["black", "brown"]);
alert(colors);      //red,green,blue
alert(colors2);     //red,green,blue,yellow,black,brown
```

`slice()` 方法能够基于当前数组中的一或多个项创建一个新数组. 
```js
var colors = ["red", "green", "blue", "yellow", "purple"];
var colors2 = colors.slice(1);
var colors3 = colors.slice(1,4);

alert(colors2);     //green,blue,yellow,purple
alert(colors3);     //green,blue,yellow

alert(colors.slice(-2, -1));    //yellow
```

`splice()` 方法主要用途是向数组的中部插入项 

语法: `arrayObj.splice(start, deleteCount, [item1[, item2[, . . . [,itemN]]]])`

从一个数组中移除一个或多个元素，如果必要，在所移除元素的位置上插入新元素，返回所移除的元素

```js
var colors = ["red", "green", "blue"];
var removed = colors.splice(0, 1);                  // 删除第一项
alert(colors);      //green,blue
alert(removed);     //red

removed = colors.splice(1, 0, "yellow", "orange");  // 从位置1开始插入两项
alert(colors);      //green,yellow,orange,blue
alert(removed);     //返回的是一个空数组

removed = colors.splice(1, 1, "red", "purple");  // 插入两项, 删除一项
alert(colors);      //green,red,purple,orange,blue
alert(removed);     //yellow
```

### 5.2.7 位置方法
ECMAScript 5 为数组添加了两个位置方法: `indexOf()` 和 `lastIndexOf()`; 返回要查找项在数组中的位置, 比较时使用全等操作符(`===`). 支持浏览器包括 IE9+, Firefox 2+, Safari 3+, Opera 9.5+ 和 Chrome

```js
var numbers=[1,2,3,4,5,4,3,2,1];
alert(numbers.indexOf(4));      //3
alert(numbers.lastIndexOf(4));  //5

alert(numbers.indexOf(4,4));    //5
alert(numbers.lastIndexOf(4,4));//3

var person={name:"Nicholas"};
var people=[{name:"Nicholas"}];

var morePeople=[person];

alert(people.indexOf(person));      //-1
alert(morePeople.indexOf(person));  //0
```

### 5.2.8 迭代方法
ECMAScript5为数组定义了5个迭代方法。

- `every()` - 对数组中的每一项运行给定函数，如果该函数对每一项都返回true，则返回true。
- `filter()` - 对数组中的每一项运行给定函数，返回该函数会返回true的项组成的数组。
- `forEach()` - 对数组中的每一项运行给定函数。这个方法没有返回值。
- `map()` - 对数组中的每一项运行给定函数，返回每次函数调用的结果组成的数组。
- `some()` - 对数组中的每一项运行给定函数，如果该函数对任一项返回true，则返回true。

以上方法都不会修改数组中的包含的值

```js
var numbers = [1,2,3,4,5,4,3,2,1];
var everyResult = numbers.every(function(item,index,array){
    return (item>2);
});
alert(everyResult); //false

var someResult = numbers.some(function(item,index,array){
    return (item>2);
});
alert(someResult);  //true

var filterResult = numbers.filter(function(item,index,array){
    return (item>2);
});
alert(filterResult);//3,4,5,4,3

var mapResult = numbers.map(function(item,index,array){
    return item*2;
});
alert(mapResult);   //2,4,6,8,10,8,6,4,2
```

### 5.2.9 缩小方法

ECMAScript5 还新增了两个缩小数组的方法：`reduce()` 和 `reduceRight()`; 前者是从第一到最后对数组遍历, 后者相反

```js
var values = [1,2,3,4,5];
var sum = values.reduce(function(prev,cur,index,array){
    return prev+cur;
});

alert(sum);  //15
```
支持这两个缩小函数的浏览器有IE9+、Firefox3+、Safari4+、Opera10.5和Chrome。

## 5.4 RegExp类型

ECMAScript通过RegExp类型来支持正则表达式

`var expression = /pattern/flags;`  


- `pattern` : 可以是任何简单或复杂的正则表达式
- `flags` : 一个或多个标志位

**flags**:
- `g` - 全局(global) 模式，即模式将被应用于所有字符串，而非在发现第一个匹配项时立即停止
- `i` - 不区分大小写(case-insensitive) 模式
- `m` - 多行(multiline) 模式

**pattern** 模式中使用的 *元字符* 需要转移, 包括:`([{\^$|)?*+.]}`

上面的是简化的字面量形式的, 如果要使用 RegExp 构造的写法: (要注意`\`的转义, 推荐简写方式)

`var expression = new RegExp(pattern, flags);`


