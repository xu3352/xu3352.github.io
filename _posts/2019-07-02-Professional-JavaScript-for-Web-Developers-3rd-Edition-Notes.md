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

### 5.4.1 RegExp示例属性

- `global` - 布尔值, 表示是否设置了 g 标志
- `ignoreCase` - 布尔值, 表示是否设置了 i 标志
- `lastIndex` - 整数, 表示开始搜索下一个匹配项的字符位置, 从0算起
- `multiline` - 布尔值, 表示是否设置了 m 标志
- `source` - 正则表达式的字符串表示, 按照字面量形式而非传入构造函数中的字符串

```js
// 等同于 new RegExp("\\[bc\\]at", "i");
var pattern = /\[bc\]at/i;
console.log( pattern.global  );      //false
console.log( pattern.ignoreCase  );  //true
console.log( pattern.multiline  );   //false
console.log( pattern.lastIndex  );   //0
console.log( pattern.source  );      //"\[bc\]at"
```

### 5.4.2 RegExp实例方法

`exec()` - 专门为捕获组而设计的, 实例包含两个额外属性: index 和 input

```js
var text = "mom and dad and baby";
var pattern = /mom( and dad( and baby )? )?/gi;

var matches = pattern.exec(text);
console.log(matches.index);     // 0
console.log(matches.input);     // "mom and dad and baby"
console.log(matches[0]);        // "mom and dad and baby"
console.log(matches[1]);        // " and dad and baby"
console.log(matches[2]);        // " and baby"
```

对于 `exec()` 方法而言，即使在模式中设置了全局标志（g），它每次也只会返回一个匹配项。在不设置全局标志的情况下，在同一个字符串上多次调用 `exec()` 将始终返回第一个匹配项的信息。而在设置全局标志的情况下，每次调用 `exec()` 则都会在字符串中继续查找新匹配项

```js
var text = "cat, bat, sat, fat";
var pattern1 = /.at/;

var matches = pattern1.exec(text);
console.log(matches.index);         //0
console.log(matches[0]);            //cat
console.log(pattern1.lastIndex);    //0

var matches = pattern1.exec(text);
console.log(matches.index);         //0
console.log(matches[0]);            //cat
console.log(pattern1.lastIndex);    //0


var pattern2 = /.at/g;

var matches = pattern2.exec(text);
console.log(matches.index);         //0
console.log(matches[0]);            //cat
console.log(pattern2.lastIndex);    //3

var matches = pattern2.exec(text);
console.log(matches.index);         //5
console.log(matches[0]);            //bat
console.log(pattern2.lastIndex);    //8
```

`test()` - 在模式与字符串参数匹配时返回 true, 否则返回 false; 通常放到 if 语句里

```js
var text = "123-45-6789";
var pattern = /(\d{3})-(\d{2})-(\d{4})/;

if (pattern.test(text)) {
    console.log("pattern was matched.");
    console.log(RegExp.$1); // "123"
    console.log(RegExp.$2); // "45"
    console.log(RegExp.$3); // "6789"
}
```

注意, 如果 `test()` 为 `false` 时, 不能使用 `RegExp.$1` 取值 (全局的, 结果为最后保存的捕获组内容, 最多到 `RegExp.$9`)!!!

## 5.5 Function类型

说起来ECMAScript中什么最有意思，我想那莫过于函数了——而有意思的根源，则在于函数实际上是对象。每个函数都是Function类型的实例，而且都与其他引用类型一样具有属性和方法。由于函数是对象，因此函数名实际上也是一个指向函数对象的指针，不会与某个函数绑定

```javascript
// 函数声明方式
function sum(num1, num2) {
    return num1 + num2;
}

// 变量方式定义, 注意最后有分号!
var sum = function(num1, num2) {
    return num1 + num2;
};
```

### 5.5.1 没有重载(深入理解)
将函数名想象为指针，也有助于理解为什么ECMAScript中没有函数重载的概念。

```js
function addSomeNumber(num) {
    return num + 100;
}

function addSomeNumber(num) {
    return num + 200;
}

var result = addSomeNumber(100);
console.log(result);    // 300
```

### 5.5.4 函数内部属性

在函数内部, 有两个特殊的对象: `arguments` 和 `this`. 

`arguments` 为类数组对象, 包含传入函数中的所有参数; 此对象还有一个叫 `callee` 的属性, 该属性是一个指针, 执行拥有这个 `arguments` 对象的函数

```js
// 递归的阶层函数
function factorial(num) {
    if (num <= 1) {
        return 1;
    } else {
        return num * factorial(num - 1);
    }
}

// 解耦合的实现 arguments.callee
function factorial(num) {
    if (num <= 1) {
        return 1;
    } else {
        return num * arguments.callee(num - 1);
    }
}
```

第一种方式可能的问题
```js
var trueFactorial = factorial;
factorial = function() {
    return 0;
};

console.log(trueFactorial(5));  // 120
console.log(factorial(5));      // 0
```

`this` 函数内部的另一个特殊对象, 其行为与 Java 和 C# 中的 this 大致类似. 换句话说, this 引用的是函数据以执行的环境对象 ------ 或者也可以说是 this 值 (当在网页的全局作用域中调用函数时, this 对象引用的就是 `window`)

```js
window.color = "red";
var o = { color: "blue"  };

function sayColor() {
    console.log(this.color);
}

sayColor();     // "red"
o.sayColor = sayColor;
o.sayColor();   // "blue"
```

在调用函数之前，this 的值并不确定，因此 this 可能会在代码执行过程中引用不同的对象

### 5.5.5 函数属性和方法

每个函数都包含两个属性：`length` 和 `prototype`

- `length` - 表示函数希望接收的命名参数的个数
- `prototype` - 对于 ECMAScript 中的引用类型而言, prototype 是保存它们所有实例方法的真正所在. 在创建自定义引用类型以及实现继承时, prototype 属性的作用是极为重要的

每个函数都包含两个非继承而来的方法：`apply()` 和 `call()`. 这两个方法的用途都是在特定的作用域中调用函数, 实际上等于设置函数体内this对象的值.

- `apply()` - 方法接收两个参数: 
    - 运行函数的作用域
    - 参数数组, 可以是Array示例, 也可以是 arguments 对象
- `call()` - 参数的个数按函数定义的来
    - 运行函数的作用域
    - 其他参数则是函数定义定义好的挨个传

```js
function sum(num1, num2) {
    return num1 + num2;
}

// apply 的两种传参
function sum1(num1, num2) {
    return sum.apply(this, arguments);
}
function sum2(num1, num2) {
    return sum.apply(this, [num1, num2]);
}
// call 则具体传参
function sum3(num1, num2) {
    return sum.call(this, num1, num2);
}

console.log( sum1(10, 10)  );    // 20
console.log( sum2(10, 10)  );    // 20
console.log( sum3(10, 10)  );    // 20
```

两者的作用都相同, 区别就是参数的使用方式不同

事实上，传递参数并非 `apply()` 和 `call()` 真正的用武之地；它们真正强大的地方是能够扩充函数赖以运行的作用域
```js
window.color = "red";
var o = { color: "blue"  };

function sayColor() {
    console.log( this.color  );
}

sayColor();             // red
sayColor.call(this);    // red
sayColor.call(window);  // red
sayColor.call(o);       // blue
```

ECMAScript5 还定义了一个方法：`bind()`。这个方法会创建一个函数的实例，其this值会被绑定到传给bind()函数的值
```js
window.color = "red";
var o = { color: "blue"  };

function sayColor() {
    console.log( this.color  );
}

var objectSayColor = sayColor.bind(o);
objectSayColor();   // blue
```
支持bind()方法的浏览器有IE9+、Firefox4+、Safari5.1+、Opera12+和Chrome







