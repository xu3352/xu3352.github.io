---
layout: post
title: "Javascript Table数据列可以指定表达式求值"
tagline: ""
description: "最近搞统计, 有一些原始值从后端过来后需要进行一些计算, 或者要做求百分比的展示, 这里我就放到浏览器来完成了"
date: '2018-05-09 19:22:10 +0800'
category: javascript
tags: javascript jquery-plugin jquery
---
> {{ page.description }}

# 需求
上一篇文章: [Javascript Table指定列数字汇总](https://xu3352.github.io/javascript/2018/05/06/javascript-table-column-data-summary) 貌似开了个头, 下面继续搞事...

上一篇文章做了表格的汇总, 但是有个问题, 就是比率(`如:10.5%`)的比较尴尬, 直接做列累加肯定是不行的...

另外, 某些列的计算我是想直接放到前端的; 而原始数据一般直接从数据库查, 有时也用数据库进行一些简单的计算; 如果逻辑复杂一点的计算就放到后端(java)来搞, 这个是比较常见的一种处理方式

比如原始数据如下图:
![原始数据表](http://on6gnkbff.bkt.clouddn.com/20180509114555_js-table-data-grid-calc-01.png){:width="100%"}

然后需要结果如下:
![最终展示数据表](http://on6gnkbff.bkt.clouddn.com/20180509114556_js-table-data-grid-calc-02.png){:width="100%"}

这个一看应该就懂了, `c6` 和 `c7` 是求百分比的, 注意: 这里的 `c7` 用了还没有值的 `c5` 列的结果

**常规思路**:
1. 数据库直接查询出来列:`c2 c3 c4`, `c5` 也可以由 `sql` 完成
2. `c6 c7` 由后端 `java` 完成, 非要用 `sql` 我也不拦着你
3. 后端 `java` 把汇总算好, 放列表最后一行 (你再用 `sql` 试试)

# JS 方案
汇总的请看看上一篇文章

汇总的列计算都搞定了, 那么行计算就小意思了, 比如直接绑定2个值到 `td` 属性上, 然后 `js` 来进行运算即可完成

<span style="color:red">难点在于:</span>     
`c6 c7` 汇总的百分比计算, 这个就需要先把前面的汇总的值都计算好, 然后在求百分比才行

后来想到了`eval` 函数, 这个可以直接把一个字符串的表达式的结果计算出来
```js
console.log( eval("(23+30)/100") );

0.53
```

放入表达式的必须是数字, 或者已经定义的变量, 那么如何完成这个计算呢: `c3+c4` 

针对每一行来讲, `c3` 代表第4列(从0开始)的值, `c4` 代表第5列的值; 所以这里我们需要把列的值对应的替换掉就可以了

# 源码:汇总+表达式求值
`table_column_calculate.html` 
```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="zh-CN">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Table计算测试</title>
</head>
<style>
    body {
        margin-left: 3px;
        margin-top: 0px;
        margin-right: 3px;
        margin-bottom: 0px;
        background-color:#FFFFFF
    }

    table.data-grid {
        width: 100%;
        font-size: 11px;
        text-align: center;
        color: #344B50;
        background-color: #a8c7ce;
        border:0;
        margin:0;
        border-collapse:separate;
        border-spacing:1px;
    }

    table.data-grid {
        float:left;
        width:auto;
        font-size:12px;
        margin:10px;
    }

    table.data-grid thead tr {
        height: 25;
        background-color: #d3eaef;
    }

    table.data-grid tbody tr {
        height: 20;
        font-size: 11px;
        background-color: #FFFFFF;
    }

    table.data-grid tbody tr.selected {
        background-color: #d5fffe;
    }

    table.data-grid tbody tr:hover {
        background-color: #d5f4fe;
    }

    table.data-grid tbody tr.active {
        background-color: yellowgreen;
    }
</style>
<body>
<table id="myTable" class="data-grid stat" cellspacing="3" cellpadding="3">
    <thead>
        <tr>
            <th>序号</th>
            <th>标题</th>
            <th grid-alias="x" class="sum">数据c2<br/>alias=x</th>
            <th grid-alias="y" class="sum">数据c3<br/>alias=y</th>
            <th grid-alias="z" class="sum">数据c4<br/>alias=z</th>
            <th grid-alias="total" grid-expr="y+z">c5=y+z<br/>alias=total</th>
            <th grid-expr="(c2/(c3+c4)).percent(1)">c6=(c2/(c3+c4)).percent(1)</th>
            <th grid-expr="(c2/(c5+c2)).percent(2)">c7=(c2/(c5+c2)).percent(2)</th>
            <th grid-expr="(x/(total+x)).percent(2)">c8=(x/(total+x)).percent(2)</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>1</td>
            <td>xx1</td>
            <td>10</td>
            <td>11</td>
            <td>30</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        </tr>
        <tr>
            <td>2</td>
            <td>xx2</td>
            <td>10</td>
            <td>20</td>
            <td>8</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        </tr>
        <tr>
            <td>3</td>
            <td>xx3</td>
            <td>2</td>
            <td>20</td>
            <td>30</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        </tr>
    </tbody>
</table>

</body>
<script src="https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js"></script>
<script type="text/javascript">
/**
 * 小数转百分比形式
 * @param num 保留几位小数
 * @returns ##.#%
 */
Number.prototype.percent = function(num) {
    if (!isFinite(this)) return "";
    var n = (this * 100).toFixed(num);
    if (n == 0) return "";
    return n.toString() + '%';
}

// console.log( 0.11234.percent(1) );
// console.log( eval("((23+30)/100).percent(1)") );

/**
 * table列表达式计算
 * $("table thead tr th[grid-expr]") 这一列会进行计算
 * 数据列以 [c0, c1, c2 ...] 命名, 可以使用 grid-alias 取别名
 * @see https://xu3352.github.io/javascript/2018/05/09/javascript-table-column-data-expression
 * @param table
 */
function data_grid_calc(table) {
    var $table = $(table);

    // 过滤出哪些列需要计算 [{index:expr}]
    var exprList = [];
    $table.find("thead tr th[grid-expr]").each(function () {
        var $th = $(this);
        var index = $table.find("thead tr th").index($th);
        var expr = $(this).attr("grid-expr");
        exprList.push( {index:index, expr:expr} );
    });
    if (exprList.length <= 0) return;

    // 别名字典 {aliasA:c3}
    var aliasDict = {};
    $table.find("thead tr th[grid-alias]").each(function () {
        var $th = $(this);
        var index = $table.find("thead tr th").index($th);
        var alias = $(this).attr("grid-alias");
        aliasDict[alias] = "c" + index;
    });
    var aliasList = grid_alias_reverse_list(aliasDict);
    // console.log( aliasDict );

    // 统计 tbody 对应的 td 的 text, 放到字典里
    var row = 1;
    $table.find("tbody tr").each(function () {
        var $tr = $(this);

        // 此行所有列的值取出来
        var dataTdList = [];
        var $tds = $tr.find("td");
        for (var i = 0; i < $tds.length; i++) {
            var v = parseInt($($tds[i]).text());
            if (isNaN(v)) {
                v = 0;
                // 如果没有值, 但这一列是表达式呢?
                var index = $tr.find("td").index($tds[i]);
                var $head_tr = $table.find("thead tr th:eq("+index+")");
                if ($head_tr.attr("grid-expr")) {
                    v = "(" + $head_tr.attr("grid-expr") + ")"
                }
            }
            dataTdList.push(v);
        }
        // console.log( "dataTdList:" + dataTdList );

        // 按表达式求值
        for (var i = 0; i < exprList.length; i++) {
            var index = exprList[i]["index"];
            var expr = exprList[i]["expr"];

            // 表达式填值后 eval 计算
            var numberExpr = grid_expr_complex_to_simple(expr, aliasDict, aliasList, dataTdList);
            var number = eval( numberExpr );
            // 展示
            $tr.find("td:eq(" + index + ")").text( number );
            // 日志
            // console.log("data[" + row + "," + index + "] expr:" + expr + " numberExpr:" + numberExpr + " number:" + number);
        }
        row++;
    });
}
// 表达式计算:复杂->简单->数字
function grid_expr_complex_to_simple(expr, aliasDict, aliasList, dataTdList) {
    var newExpr = expr;

    // console.log(newExpr);
    // 循环求值:直到表达式 (没有别名 && 没有[c0, c1, c2 ...]) 的时候为止
    do {
        newExpr = grid_expr_alias_replace(newExpr, aliasList, aliasDict);
        // console.log(newExpr);
        newExpr = grid_expr_fill(newExpr, dataTdList);
        // console.log(newExpr);
    } while (grid_expr_has_alias(newExpr, aliasList) || newExpr.match(/c\d+/))
    return newExpr;
}
// 倒序的别名List
function grid_alias_reverse_list(aliasDict) {
    var aliasList = [];
    for (var alias in aliasDict) {
        aliasList.push(alias);
    }
    // 倒序:长的排前面, 一样长的按字母倒序
    aliasList.sort(function (a, b) {
       if (a.length != b.length) return a.length < b.length;
       if (a == b) return 0;
       return a < b;
    });
    return aliasList;
}
// 表达式是否包含别名
function grid_expr_has_alias(expr, aliasList) {
    for (var i in aliasList) {
        if (expr.indexOf(aliasList[i]) >= 0) return true;
    }
    return false;
}
// 表达式别名替换:别名长的优先!
function grid_expr_alias_replace(expr, aliasList, aliasDict) {
    var newExpr = expr;
    // 包含别名的进行别名替换
    if (aliasDict.length <= 0) return newExpr;
    if (!grid_expr_has_alias(newExpr, aliasList)) return newExpr;

    for (var i in aliasList) {
        var alias = aliasList[i];
        newExpr = newExpr.replace(new RegExp(alias, 'g'), aliasDict[alias]);
    }
    return newExpr;
}
// 表达式填充:列编号大的优先!
function grid_expr_fill(expr, list) {
    var newExpr = expr;
    // 匹配 [c0, c1, c2 ...] 的进行数值填充
    if (!newExpr.match(/c\d+/)) return newExpr;

    // 倒序!(不然超过10列会悲剧)
    for (var i = list.length - 1; i >= 0; i--) {
        var reg = new RegExp("c" + i, 'g');
        newExpr = newExpr.replace(reg, list[i]);
    }
    return newExpr;
}

/**
 * 合计指定列的值, 最后追加table最后一行, 指定列将会自动累加
 * $("table thead tr th.sum") 这一列的 text()
 * @param table
 */
function data_grid_sum(table) {
    var $table = $(table);

    // 过滤出哪些 th.sum 列需要统计
    var indexList = [];
    $table.find("thead tr th.sum").each(function () {
        var $th = $(this);
        indexList.push($table.find("thead tr th").index($th))
    });
    if (indexList.length <= 0) return;

    // init dict
    var dict = {};
    for (var i = 0; i < indexList.length; i++) {
        dict[indexList[i]] = 0;
    }

    // 统计 tbody 对应的 td 的 text, 放到字典里
    $table.find("tbody tr").each(function () {
        var $tr = $(this);
        for (var i = 0; i < indexList.length; i++) {
            var index = indexList[i];
            var v = parseInt($tr.find("td:eq(" + index + ")").text());
            if (isNaN(v)) continue;
            dict[index] += v;
        }
    });

    // 追加 tr 到 table 的 末尾
    var tr = '<tr>';
    var columSize = $table.find("thead tr th").length;
    for (var i = 0; i < columSize; i++) {
        var v = '';
        if (dict[i]) v = dict[i];
        if (i === 0 && v === '') v = '合计';
        tr += '<td>' + v + '</td>';
    }
    tr += '</tr>';
    $table.append(tr);
}


$(function(){
    /* 多个table
    $("table.data-grid.stat").each(function () {
        data_grid_sum(this);
    });
    */
    data_grid_sum($("#myTable"));
    data_grid_calc($("#myTable"));
});
</script>
</html>          
```

**注意事项**:
1. `data_grid_sum` 合计行处理
2. `data_grid_calc` 表达式计算处理
3. `Number.prototype.percent` 百分比处理, 参数为保留小数位数
4. 在 `table thead tr th` 绑定表达式属性: `grid-expr` 如:`<th grid-expr="c3+c4">cx列</th>`
5. 表达式列:支持使用小写字母 `c` + 数字 <span style="color:red">0开始算</span> 如:`c0 c1 .... c10`, 超过的话会报错的!!!

# 别名支持
实际使用过程中, 如果列比较多(超过10列), 数起来会比较容易出错, 想过使用 `c-1 c-2` 之类的, 替换的时候比较麻烦; 最后还是使用别名来解决吧

![别名](http://on6gnkbff.bkt.clouddn.com/20180510055255_js-table-data-grid-calc-03.png){:width="100%"}

**详解**:
- 可使用 `grid-alias` 定义别名, 然后别的表达式就可以使用别名了, 实际效果等价 `x=c2`
- `c7` 和 `c8` 的表达式是等同的; `c7` 表达式使用的`列+编号`, `c8` 表达式使用的别名


列数较少的可以直接使用: `c0 c1 c2 ...` 来写表达式

缺点:一是容易数错编号(0开始), 二是列的位置如果变动, 则需要修改对应的编号

所以建议: <span style="color:red">全部使用别名表达式!!!</span> 命名时避免使用 `c0 c1 c2 ...` 的情况!


# 表达式计算过程
以上图最后一行的 `c8` 列表达式为例: 
1. 原始表达式:`(x/(total+x)).percent(2)`
2. 替换掉别名后:`(c2/(c5+c2)).percent(2)` 
3. 列包含了表达式: `(22/((c3+c4)+22)).percent(2)`  这里的 `c5=c3+c4`
3. 最终的数字表达式:`(22/((51+68)+22)).percent(2)`

复杂表达式, 后来想到想到别名和cx混用的情况, 然后再进行了改造:
![别名](http://on6gnkbff.bkt.clouddn.com/20180510080324_js-table-data-grid-calc-04.png){:width="100%"}

还是以上图最后一行 `c8` 列为例, 但这里的 `c5=y+z`, 过程如下:

1. `(x/(total+x)).percent(2)`
1. `(c2/(c5+c2)).percent(2)`
1. `(22/((y+z)+22)).percent(2)`
1. `(22/((c3+c4)+22)).percent(2)`
1. `(22/((51+68)+22)).percent(2)`

`data[4,8]` 数据:
- expr:`(x/(total+x)).percent(2)` 
- numberExpr:`(22/((51+68)+22)).percent(2)` 
- number:`15.60%`

目测这个用着就比较舒服了

# 其他
`grid_alias_reverse_list` 方法排序有问题, 之前只是做了一个 `reverse` 反转操作, 而并不是理想的倒序排的, 其实只要解决长的别名排在前面就行, 防止别名字符串有包含的情况时替换出现问题; 另外此函数改为在别名字典取值后就执行, 减少调用次数

(2018.05.27 更)

---
参考：
- [Javascript Table指定列数字汇总](https://xu3352.github.io/javascript/2018/05/06/javascript-table-column-data-summary)

