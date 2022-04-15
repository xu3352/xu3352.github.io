---
layout: post
title: "JavaScript金额精度问题"
keywords: "javascript money"
description: "JavaScript金额精度问题"
tagline: ""
date: '2022-03-21 18:04:32 +0800'
category: javascript
tags: javascript
---
> {{ page.description }}

# 代码清单
直接上代码, 大部分问题应该是可以解决了

```js
var money = function() {
    /*
     * 判断obj是否为一个整数
     */
    function isInteger(obj) {
        return Math.floor(obj) === obj
    }

    /*
     * 将一个浮点数转成整数，返回整数和倍数。如 3.14 >> 314，倍数是 100
     * @param floatNum {number} 小数
     * @return {object}
     *   {times:100, num: 314}
     */
    function toInteger(floatNum) {
        var ret = {
            times: 1,
            num: 0,
            _o: floatNum,
        };
        if (isInteger(floatNum)) {
            ret.num = floatNum;
            return ret
        }
        var strfi = floatNum + '';
        var dotPos = strfi.indexOf('.');
        var len = strfi.substr(dotPos + 1).length;
        var times = Math.pow(10, len);
        // var intNum = parseInt(floatNum * times + 0.5, 10);  // 负数有问题
        var intNum = parseInt((floatNum * times).toFixed(0) + "");
        ret.times = times;
        ret.num = intNum;
        return ret
    }

    /*
     * 核心方法，实现加减乘除运算，确保不丢失精度
     * 思路：把小数放大为整数（乘），进行算术运算，再缩小为小数（除）
     *
     * @param a {number} 运算数1
     * @param b {number} 运算数2
     * @param op {string} 运算类型，有加减乘除（add/subtract/multiply/divide）
     *
     */
    function operation(a, b, op) {
        var o1 = toInteger(a);
        var o2 = toInteger(b);
        var n1 = o1.num;
        var n2 = o2.num;
        var t1 = o1.times;
        var t2 = o2.times;
        var max = t1 > t2 ? t1 : t2;
        var result = null;
        switch (op) {
            case 'add':
                if (t1 === t2) { // 两个小数位数相同
                    result = n1 + n2
                } else if (t1 > t2) { // o1 小数位 大于 o2
                    result = n1 + n2 * (t1 / t2)
                } else { // o1 小数位 小于 o2
                    result = n1 * (t2 / t1) + n2
                }
                return result / max;
            case 'subtract':
                if (t1 === t2) {
                    result = n1 - n2
                } else if (t1 > t2) {
                    result = n1 - n2 * (t1 / t2)
                } else {
                    result = n1 * (t2 / t1) - n2
                }
                return result / max;
            case 'multiply':
                result = (n1 * n2) / (t1 * t2);
                return result;
            case 'divide':
                result = (n1 / n2) * (t2 / t1);
                return result
        }
    }

    // 加减乘除的四个接口
    function add(a, b) {
        return operation(a, b, 'add')
    }

    // 批量累加
    function adds() {
        var sum = 0;
        for (var i = 0; i < arguments.length; i++) {
            sum = operation(sum, arguments[i], 'add')
        }
        return sum;
    }

    function subtract(a, b) {
        return operation(a, b, 'subtract')
    }

    function multiply(a, b) {
        return operation(a, b, 'multiply')
    }

    function divide(a, b) {
        return operation(a, b, 'divide')
    }

    // exports
    return {
        add: add,
        adds: adds,
        sub: subtract,
        mul: multiply,
        div: divide
    }
}();
```

- 2022-04-15: 解决负数转换时的问题

---
参考：
- [js浮点金额计算精度](https://www.cnblogs.com/dxzg/p/10548823.html){:target='blank'}

