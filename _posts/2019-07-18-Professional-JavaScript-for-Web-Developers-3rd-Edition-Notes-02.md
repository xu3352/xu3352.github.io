---
layout: post
title: "JavaScript高级程序设计(第三版)-笔记(二)"
keywords: "javascript,books"
description: "JavaScript高级程序设计(第三版): 学习笔记(二), 查漏补缺"
tagline: ""
date: '2019-07-18 09:43:56 +0800'
category: javascript
tags: javascript, books
---
> {{ page.description }}

# 6.面向对象的程序设计

面向对象（ObjectOriented，OO）的语言有一个标志，那就是它们都有类的概念，而通过类可以创建任意多个具有相同属性和方法的对象。前面提到过，ECMAScript中没有类的概念，因此它的对象也与基于类的语言中的对象有所不同。

ECMA262把对象定义为：“无序属性的集合，其属性可以包含基本值、对象或者函数。”严格来讲，这就相当于说对象是一组没有特定顺序的值。对象的每个属性或方法都有一个名字，而每个名字都映射到一个值。正因为这样（以及其他将要讨论的原因），我们可以把ECMAScript的对象想象成散列表：无非就是一组名值对，其中值可以是数据或函数。

## 6.1 理解对象

创建对象最简单的方式就是创建一个 Object 示例, 然后再为它添加属性和方法
```js
var person = new Object();
person.name = "Nicholas";
person.age = 29;
person.job = "Software Engineer";

person.sayName = function(){
    alert(this.name);
}
```

更简洁的字面量表示法:
```js
var person = {
    name: "Nicholas", 
    age: 29,
    job: "Software Engineer",

    sayName: function(){
        alert(this.name);
    }
}
```

### 6.1.1 属性类型

ECMAScript 中有两种属性：数据属性和访问器属性 (ECMA-262 第5版)

1.数据属性

**4个特性**:
- `[[Configurable]]` - 表示能否通过delete删除属性从而重新定义属性，能否修改属性的特性，或者能否把属性修改为访问器属性。像前面例子中那样直接在对象上定义的属性，它们的这个特性默认值为true。
- `[[Enumerable]]` - 表示能否通过 for-in 循环返回属性。像前面例子中那样直接在对象上定义的属性，它们的这个特性默认值为true。
- `[[Writable]]` - 表示能否修改属性的值。像前面例子中那样直接在对象上定义的属性，它们的这个特性默认值为true。
- `[[Value]]` - 包含这个属性的数据值。读取属性值的时候，从这个位置读；写入属性值的时候，把新值保存在这个位置。这个特性的默认值为undefined。


要修改属性默认的特性，必须使用 ECMAScript5 的 `Object.defineProperty()` 方法。

```js
var person = {};
// 第三个参数必须是: configurable, enumerable, writable, value 中的一个或多个; 
// 如果不指定前三者, 则默认为false
Object.defineProperty(person, "name", {
    writable: false,
    value: "Nicholas"
});

console.log(person.name);   // "Nicholas"
person.name = "Greg";
console.log(person.name);   // "Nicholas"
```

2.访问器属性

访问器属性不包含数据值；它们包含一对儿getter和setter函数（不过，这两个函数都不是必需的）

**4个特性**:
- `[[Configurable]]` - 同前面的
- `[[Enumerable]]` - 同前面的
- `[[Get]]` - 在读取属性时调用的函数。默认值为undefined
- `[[Set]]` - 在写入属性时调用的函数。默认值为undefined

```js
var book = {
    _year: 2004,
    edition: 1
}

Object.defineProperty(book, "year", {
    get: function(){
        return this._year;
    },
    set: function(newValue){
        if (newValue > 2004) {
            this._year = newValue;
            this.edition += newValue - 2004;    
        }
    }
});

book.year = 2005;
console.log(book.edition);      //2
```

`_year` 前面的下划线是一种常用的记号，用于表示只能通过对象方法访问的属性。而访问器属性 `year` 则包含一个getter函数和一个setter函数。

不一定非要同时指定getter和setter。只指定getter意味着属性是不能写，尝试写入属性会被忽略。在严格模式下，尝试写入只指定了getter函数的属性会抛出错误。类似地，没有指定setter函数的属性也不能读，否则在非严格模式下会返回undefined，而在严格模式下会抛出错误。

## 6.2 创建对象

### 6.2.1 工厂模式

```js
function createPerson(name, age, job){
    var o = new Object();
    o.name = name;
    o.age = age;
    o.job = job;
    o.sayName = function(){
        console.log(this.name);
    }
    return o;
}

var person1 = createPerson("Nicholas", 29, "Software Engineer");
var person2 = createPerson("Greg", 27, "Doctor");
```

### 6.2.2 构造函数模式

```js
function Person(name, age, job) {
    this.name = name;
    this.age = age;
    this.job = job;
    this.sayName = function(){
        console.log(this.name);
    }
}

var person1 = new Person("Nicholas", 29, "Software Engineer");
var person2 = new Person("Greg", 27, "Doctor");
```

**不同之处**:
- 没有显示的创建对象
- 直接将属性和方法赋给了 this 对象
- 没有 return 语句
- 函数名 Person 按照惯例构造函数始终以首字母大写开始 (借鉴自其他OO语言)

要创建 `Person` 的新实例, 必须使用 new 操作符. 这种方式调用构造会经历以下4个步骤:
- 创建一个新对象
- 将构造函数的作用域赋予给新对象 (因此 this 就指向了这个新对象)
- 执行构造函数中的代码 (为这个新对象添加属性)
- 返回新对象

#### 1.将构造函数当做函数

构造函数与其他函数的唯一区别，就在于调用它们的方式不同法。任何函数，只要通过new操作符来调用，那它就可以作为构造函数；而任何函数，如果不通过new操作符来调用，那它跟普通函数也不会有什么两样。

```js
// 当做构造函数使用
var person = new Person("Nicholas", 29, "Software Engineer");
person.sayName();   //"Nicholas"

// 作为普通函数调用
Person("Greg", 27, "Doctor");   // 添加到 window
window.sayName();   // "Greg"

// 在另一个对象的作用域中调用
var o = new Object();
Person.call(o, "Kristen", 25, "Nurse");
o.sayName();        // "Kristen"
```

当在全局作用域中调用一个函数时，this 对象总是指向 Global 对象（在浏览器中就是window对象）。

最后，也可以使用call()（或者apply()）在某个特殊对象的作用域中调用Person()函数。这里是在对象o的作用域中调用的，因此调用后o就拥有了所有属性和sayName()方法。

#### 2.构造函数的问题

构造函数模式虽然好用，但也并非没有缺点。使用构造函数的主要问题，就是每个方法都要在每个实例上重新创建一遍。

```js
alert(person1.sayName == person2.sayName);  //false
```

### 6.2.3 原型模式

我们创建的每个函数都有一个prototype（原型）属性，这个属性是一个指针，指向一个对象，而这个对象的用途是包含可以由特定类型的所有实例共享的属性和方法。如果按照字面意思来理解，那么prototype就是通过调用构造函数而创建的那个对象实例的原型对象。使用原型对象的好处是可以让所有对象实例共享它所包含的属性和方法。换句话说，不必在构造函数中定义对象实例的信息，而是可以将这些信息直接添加到原型对象中

```js
function Person() {
}

Person.prototype.name = "Nicholas";
Person.prototype.age = 29;
Person.prototype.job = "Software Engineer";
Person.prototype.sayName = function(){
    console.log(this.name);
}

var person1 = new Person();
person1.sayName();      // "Nicholas"

var person2 = new Person();
person1.sayName();      // "Nicholas"

console.log( person1.sayName == person2.sayName );  // true
```

#### 1.理解原型对象

无论什么时候，只要创建了一个新函数，就会根据一组特定的规则为该函数创建一个 prototype 属性，这个属性指向函数的原型对象。在默认情况下，所有原型对象都会自动获得一个 constructor（构造函数）属性，这个属性包含一个指向 prototype 属性所在函数的指针。就拿前面的例子来说，Person.prototype.constructor 指向 Person。而通过这个构造函数，我们还可继续为原型对象添加其他属性和方法。

创建了自定义的构造函数之后，其原型对象默认只会取得 constructor 属性; 至于其他方法，则都是从 Object 继承而来的。当调用构造函数创建一个新实例后，该实例的内部将包含一个指针（内部属性），指向构造函数的原型对象。

以前面使用 Person 构造函数和 Person.prototype 创建实例的代码为例

![desc](/assets/archives/Person.prototype-fs8.png){:width="100%"}


```js
function Person() {
}

Person.prototype.name = "Nicholas";
Person.prototype.age = 29;
Person.prototype.job = "Software Engineer";
Person.prototype.sayName = function(){
    console.log(this.name);
}

var person1 = new Person();
var person2 = new Person();

person1.name = "Greg";
console.log( person1.name  );   // "Greg" (来自实例)
console.log( person2.name  );   // "Nicholas" (来自原型)

delete person1.name;
console.log( person1.name  );   // "Nicholas" (来自原型)
```

当为对象实例添加一个属性时，这个属性就会 **屏蔽** 原型对象中保存的同名属性；换句话说，添加这个属性只会阻止我们访问原型中的那个属性，但不会修改那个属性。即使将这个属性设置为null，也只会在实例中设置这个属性，而不会恢复其指向原型的连接。不过，使用delete操作符则可以完全删除实例属性，从而让我们能够重新访问原型中的属性

#### 2.原型与in操作符

有两种方式使用 in 操作符：单独使用和在 for-in 循环中使用。在单独使用时，in操作符会在通过对象能够访问给定属性时返回true，无论该属性存在于实例中还是原型中。

在使用forin循环时，返回的是所有能够通过对象访问的、可枚举的（enumerated）属性，其中既包括存在于实例中的属性，也包括存在于原型中的属性。屏蔽了原型中不可枚举属性（即将[[Enumerable]]标记的属性）的实例属性也会在forin循环中返回，因为根据规定，所有开发人员定义的属性都是可枚举的——只有在IE8及更早版本中例外。

#### 3.更简单的原型语法

```js
function Person(){
}

Person.prototype = {
    name : "Nicholas",
    age : 29,
    job : "Software Engineer",
    sayName : function() {
        console.log( this.name  );
    }
}
```

本质上完全重写了默认的 prototype 对象，因此 constructor 属性也就变成了新对象的 constructor 属性（指向Object构造函数），不再指向 Person 函数

如果 constructor 的值真的很重要, 可以手动指定

```js
...
Person.prototype = {
    constructor : Person,
...
```

#### 4.原型的动态性

由于在原型中查找值的过程是一次搜索，因此我们对原型对象所做的任何修改都能够立即从实例上反映出来——即使是先创建了实例后修改原型也照样如此。请看下面的例子

```js
var person = new Person();

Person.prototype.sayHi = function() {
    console.log("hi");
};

person.sayHi();     // "hi" (没有问题!)
```

以上代码先创建了Person的一个实例，并将其保存在person中。然后，下一条语句在Person.prototype中添加了一个方法sayHi()。即使person实例是在添加新方法之前创建的，但它仍然可以访问这个新方法。其原因可以归结为实例与原型之间的松散连接关系。当我们调用person.sayHi()时，首先会在实例中搜索名为sayHi的属性，在没找到的情况下，会继续搜索原型。因为实例与原型之间的连接只不过是一个指针，而非一个副本，因此就可以在原型中找到新的sayHi属性并返回保存在那里的函数。

尽管可以随时为原型添加属性和方法，并且修改能够立即在所有对象实例中反映出来，但如果是重写整个原型对象，那么情况就不一样了。我们知道，调用构造函数时会为实例添加一个指向最初原型的[[Prototype]]指针，而把原型修改为另外一个对象就等于切断了构造函数与最初原型之间的联系。请记住：<span style="color:red;">实例中的指针仅指向原型，而不指向构造函数</span> 看下面的例子:

```js
function Person(){
}

var friend = new Person();

Person.prototype = {
    constructor: Person,
    name: "Nicholas",
    age: 29,
    job: "Software Engineer",
    sayName: function() {
        console.log(this.name);
    }
};

friend.sayName();       //error
```

图解过程:

![desc](/assets/archives/rewrite-prototype-fs8.png){:width="100%"}

从图可以看出，重写原型对象切断了现有原型与任何之前已经存在的对象实例之间的联系；它们引用的仍然是最初的原型。

#### 5.原型对象的原型

原型模式的重要性不仅体现在创建自定义类型方面，就连所有原生的引用类型，都是采用这种模式创建的。所有原生引用类型（`Object`、`Array`、`String`，等等）都在其构造函数的原型上定义了方法。例如，在 Array.prototype 中可以找到 `sort()` 方法，而在 String.prototype 中可以找到 `substring()` 方法

```js
console.log( typeof Array.prototype.sort );        // "function"
console.log( typeof String.prototype.substring );  // "function"
```

通过原生对象的原型，不仅可以取得所有默认方法的引用，而且也可以定义新方法。可以像修改自定义对象的原型一样修改原生对象的原型，因此可以随时添加方法。下面的代码就给基本包装类型 String 添加了一个名为 `startsWith()` 的方法。

```js
String.prototype.startsWith = function(text) {
    return this.indexOf(text) == 0;
};

var msg = "Hello world!";
console.log( msg.startsWith("Hello") );     //true
```

既然方法被添加给了String.prototype，那么当前环境中的所有字符串就都可以调用它。

#### 6.原型对象的问题

原型模式的最大问题是由其共享的本性所导致的。

原型中所有属性是被很多实例共享的，这种共享对于函数非常合适。然而，对于包含引用类型值(比如数组)的属性来说，问题就比较突出了。(好比 Java 里的静态变量, 所有示例都共享)

### 6.2.4 组合使用构造函数模式和原型模式

创建自定义类型的最常见方式，就是组合使用构造函数模式与原型模式。构造函数模式用于定义实例属性，而原型模式用于定义方法和共享的属性。结果，每个实例都会有自己的一份实例属性的副本，但同时又共享着对方法的引用，最大限度地节省了内存。

```js
function Person(name, age, job){
    this.name = name;
    this.age = age;
    this.job = job;
    this.friends = ["Shelby", "Court"];
}

Person.prototype = {
    constructor: Person,
    sayName: function(){
       console.log(this.name);
    }
}

var person1 = new Person("Nicholas", 29, "Software Engineer");
var person2 = new Person("Greg", 27, "Doctor");

person1.friends.push("Van");
console.log(person1.friends);   //["Shelby", "Court", "Van"]
console.log(person2.friends);   //["Shelby", "Court"]
console.log(person1.friends === person2.friends);   // false
console.log(person1.sayName === person2.sayName);   // true
```

这种构造函数与原型混成的模式，是目前在 ECMAScript 中使用最广泛、认同度最高的一种创建自定义类型的方法。可以说，这是用来定义引用类型的一种默认模式。

### 6.2.5 动态原型模式

```js
function Person(name, age, job){
    // 属性
    this.name = name;
    this.age = age;
    this.job = job;

    // 方法
    if (typeof this.sayName != "function") {
        Person.prototype.sayName = function(){
            console.log(this.name);
        };
    }
}

var friend = new Person("Nicholas", 29, "Software Engineer");
friend.sayName();
```

这段代码只会在初次调用构造函数时才会执行。此后，原型已经完成初始化，不需要再做什么修改了。其中，if语句检查的可以是初始化之后应该存在的任何属性或方法——不必用一大堆if语句检查每个属性和每个方法；只要检查其中一个即可。

### 6.2.6 寄生构造函数模式

通常，在前述的几种模式都不适用的情况下，可以使用寄生（parasitic）构造函数模式。这种模式的基本思想是创建一个函数，该函数的作用仅仅是封装创建对象的代码，然后再返回新创建的对象；

```js
function Person(name, age, job) {
    var o = new Object();
    o.name = name;
    o.age = age;
    o.job = job;
    o.sayName = function(){
        console.log(this.name);
    };
    return o;
}

var friend = new Person("Nicholas", 29, "Software Engineer");
friend.sayName();   //"Nicholas"
```

在这个例子中，Person函数创建了一个新对象，并以相应的属性和方法初始化该对象，然后又返回了这个对象。除了使用new操作符并把使用的包装函数叫做构造函数之外，这个模式跟工厂模式其实是一模一样的。构造函数在不返回值的情况下，默认会返回新对象实例。而通过在构造函数的末尾添加一个return语句，可以重写调用构造函数时返回的值。

### 6.2.7 稳妥构造函数模式

道格拉斯·克罗克福德（Douglas Crockford）发明了JavaScript中的稳妥对象（durable objects）这个概念。所谓稳妥对象，指的是没有公共属性，而且其方法也不引用this的对象。稳妥对象最适合在一些安全的环境中（这些环境中会禁止使用this和new），或者在防止数据被其他应用程序（如Mashup程序）改动时使用。稳妥构造函数遵循与寄生构造函数类似的模式，但有两点不同：
- 一是新创建对象的实例方法不引用this；
- 二是不使用new操作符调用构造函数。

```js
function Person(name, age, job){
    // 创建要返回的对象
    var o = new Object();

    // 可以再这里定义私有变量和函数

    // 添加方法
    o.sayName = function(){
        console.log(name);
    };

    // 返回对象
    return o;
}

var friend = Person("Nicholas", 29, "Software Engineer");
friend.sayName();   //"Nicholas"
```

## 6.3 继承

继承是OO语言中的一个最为人津津乐道的概念。许多OO语言都支持两种继承方式：接口继承和实现继承。接口继承只继承方法签名，而实现继承则继承实际的方法。如前所述，由于函数没有签名，在ECMAScript中无法实现接口继承。ECMAScript只支持实现继承，而且其实现继承主要是依靠原型链来实现的。

### 6.3.1 原型链

ECMAScript 中描述了 **原型链** 的概念，并将原型链作为实现继承的主要方法。其基本思想是利用原型让一个引用类型继承另一个引用类型的属性和方法。简单回顾一下构造函数、原型和实例的关系：每个构造函数都有一个原型对象，原型对象都包含一个指向构造函数的指针，而实例都包含一个指向原型对象的内部指针。实现原型链有一种基本模式，其代码大致如下

```js
function SuperType(){
    this.property = true;
}
SuperType.prototype.getSuperValue = function(){
    return this.property;
};

function SubType(){
    this.subproperty = false;
}

// 继承 SuperType
SubType.prototype = new SuperType();

SubType.prototype.getSubValue = function(){
    return this.subproperty;
};

var instance = new SubType();
console.log(instance.getSuperValue());      //true
```

![通过原型链继承](/assets/archives/inherit-prototype-fs8.png){:width="100%"}

### 6.3.2 借用构造函数

在解决原型中包含引用类型值所带来问题的过程中，开发人员开始使用一种叫做 **借用构造函数**（constructorstealing）的技术（有时候也叫做伪造对象或经典继承）。这种技术的基本思想相当简单，即在子类型构造函数的内部调用超类型构造函数。别忘了，函数只不过是在特定环境中执行代码的对象，因此通过使用 `apply()` 和 `call()` 方法也可以在（将来）新创建的对象上执行构造函数

```js
function SuperType(){
    this.colors = ["red", "blue", "green"];
}

function SubType(){
    // 继承了 SuperType
    SuperType.call(this);
}

var instance1 = new SubType();
instance1.colors.push("black");
console.log(instance1.colors);      //"red,blue,green,black"

var instance2 = new SubType();
console.log(instance2.colors);      //"red,blue,green"
```

### 6.3.3 组合继承

组合继承（combinationinheritance），有时候也叫做伪经典继承，指的是将原型链和借用构造函数的技术组合到一块，从而发挥二者之长的一种继承模式。其背后的思路是使用原型链实现对原型属性和方法的继承，而通过借用构造函数来实现对实例属性的继承。这样，既通过在原型上定义方法实现了函数复用，又能够保证每个实例都有它自己的属性。

```js
function SuperType(name){
    this.name = name;
    this.colors = ["red", "blue", "green"];
}

SuperType.prototype.sayName = function(){
    console.log(this.name);
}

function SubType(name, age){
    // 继承属性
    SuperType.call(this, name);
    this.age = age;
}

// 继承方法
SubType.prototype = new SuperType();

SubType.prototype.sayAge = function(){
    console.log(this.age);
}

var instance1 = new SubType("Nicholas", 29);
instance1.colors.push("black");
console.log(instance1.colors);      //"red,blue,green,black"
instance1.sayName();                //"Nicholas"
instance1.sayAge();                 //29

var instance2 = new SubType("Greg", 27);
console.log(instance2.colors);      //"red,blue,green"
instance2.sayName();                //"Greg"
instance2.sayAge();                 //27
```

组合继承避免了原型链和借用构造函数的缺陷，融合了它们的优点，成为JavaScript中最常用的继承模式。而且，`instanceof` 和 `isPrototypeOf()` 也能够用于识别基于组合继承创建的对象。

### 6.3.4 原型式继承

这种方法并没有使用严格意义上的构造函数。借助原型可以基于已有的对象创建新对象，同时还不必因此创建自定义类型。

```js
function object(o){
    function F(){}
    F.prototype = o;
    return new F();
}
```

在 object() 函数内部，先创建了一个临时性的构造函数，然后将传入的对象作为这个构造函数的原型，最后返回了这个临时类型的一个新实例。从本质上讲，object() 对传入其中的对象执行了一次浅复制。

ECMAScript5 通过新增 `Object.create()` 方法规范化了原型式继承。这个方法接收两个参数：一个用作新对象原型的对象和（可选的）一个为新对象定义额外属性的对象。在传入一个参数的情况下， `Object.create()` 与 `object()` 方法的行为相同。

### 6.3.5 寄生式继承

寄生式（parasitic）继承是与原型式继承紧密相关的一种思路，并且同样也是由克罗克福德推而广之的。寄生式继承的思路与寄生构造函数和工厂模式类似，即创建一个仅用于封装继承过程的函数，该函数在内部以某种方式来增强对象，最后再像真地是它做了所有工作一样返回对象。

```js
function createAnother(original){
    var clone = object(original);   // 通过调用函数创建一个新对象
    clone.sayHi = function(){       // 以某种方式来增强这个对象
        console.log("hi");
    };
    return clone;                   // 返回这个对象
}
```

```js
var person = {
    name: "Nicholas",
    friends: ["Shelby", "Court", "Van"]
};

var anotherPerson = createAnother(person);
anotherPerson.sayHi();  //"hi"
```

### 6.3.6 寄生组合式继承

所谓寄生组合式继承，即通过借用构造函数来继承属性，通过原型链的混成形式来继承方法。其背后的基本思路是：**不必为了指定子类型的原型而调用超类型的构造函数，我们所需要的无非就是超类型原型的一个副本而已。**本质上，就是使用寄生式继承来继承超类型的原型，然后再将结果指定给子类型的原型。

```js
function inheritProtoType(subType, superType){
    var prototype = object(superType.prototype);    // 创建对象
    prototype.constructor = subType;                // 增强对象
    subType.prototype = prototype;                  // 指定对象
}
```

```js
function SuperType(name){
    this.name = name;
    this.colors = ["red", "blue", "green"];
}

SuperType.prototype.sayName = function(){
    console.log(this.name);
};

function SubType(name, age){
    SuperType.call(this, name);

    this.age = age;
}

inheritProtoType(SubType, SuperType);

SubType.prototype.sayAge = function(){
    console.log(this.age);
};
```

