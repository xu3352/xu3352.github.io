---
layout: post
title: "Javascript Table数据列可以指定表达式求值"
tagline: ""
description: "最近搞统计, 有一些原始值从后端过来后需要进行一些计算, 或者要做求百分比的展示, 这里我就放到浏览器来完成了"
date: '2018-05-09 19:22:10 +0800'
category: javascript
tags: javascript jquery
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
            <th class="sum">数据C2</th>
            <th class="sum">数据C3</th>
            <th class="sum">数据C4</th>
            <th grid-calc-expr="c3+c4">c5=c3+c4</th>
            <th grid-calc-expr="(c2/(c3+c4)).percent(1)">c6=(c2/(c3+c4)).percent(1)</th>
            <th grid-calc-expr="(c2/(c5+c2)).percent(2)">c7=(c2/(c5+c2)).percent(2)</th>
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
        </tr>
    </tbody>
</table>

</body>
<script src="https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js"></script>
<script type="text/javascript">
/**
 * 小数转百分比形式
 * @param num 保留几位小数
 */
Number.prototype.percent = function(num) {
    if (!isFinite(this)) return "";
    var n = (this * 100).toFixed(num);
    if (n == 0) return "";
    return n.toString() + '%';
}

console.log( 0.11234.percent(1) );
console.log( eval("((23+30)/100).percent(1)") );

/**
 * table列表达式计算
 * $("table thead tr th[grid-calc-expr]") 这一列会进行计算
 * @param table
 */
function data_grid_calc(table) {
    var $table = $(table);

    // 过滤出哪些列需要计算 [{index:expr}]
    var exprList = [];
    $table.find("thead tr th[grid-calc-expr]").each(function () {
        var $th = $(this);
        var index = $table.find("thead tr th").index($th);
        var expr = $(this).attr("grid-calc-expr");
        exprList.push( {index:index, expr:expr} );
    });

    // 统计 tbody 对应的 td 的 text, 放到字典里
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
                if ($head_tr.attr("grid-calc-expr")) {
                    v = "(" + $head_tr.attr("grid-calc-expr") + ")"
                }
            }
            dataTdList.push(v);
        }
        // console.log( "dataTdList:" + dataTdList );

        // 按表达式求值
        for (var i = 0; i < exprList.length; i++) {
            var index = exprList[i]["index"];
            var expr = exprList[i]["expr"];

            var valueExpr = grid_calc_expr_fill(expr, dataTdList);
            // console.log("expr:" + expr + " valueExpr:"+valueExpr);

            // 把最终结果放入指定的列
            var data = eval( valueExpr );
            $tr.find("td:eq(" + index + ")").text( data );
        }
    });
}

// 表达式填充
function grid_calc_expr_fill(expr, list) {
    var valueExpr = expr;
    // 倒序!(不然超过10列会悲剧)
    for (var i = list.length - 1; i >= 0; i--) {
        var reg = new RegExp("c" + i, 'g');
        valueExpr = valueExpr.replace(reg, list[i]);
    }
    // 递归一下, 如果 list 里也有表达式的话
    if (valueExpr.match(/c\d+/)) return grid_calc_expr_fill(valueExpr, list);
    return valueExpr;
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

# 注意事项
1. `data_grid_sum` 合计行处理
2. `data_grid_calc` 表达式计算处理
3. `grid_calc_expr_fill` 填充数据(如果列包含了表达式, 递归填充)
4. `Number.prototype.percent` 百分比处理, 参数为保留小数位数
5. 在 `table thead tr th` 绑定表达式属性: `grid-calc-expr` 如:`<th grid-calc-expr="c3+c4">cx列</th>`
6. 表达式列:仅用小写字母 `c` + 数字 <span style="color:red">0开始算</span> 如:`c0 c1 .... c10`, 超过的话会报错的!!!
7. 表达式可以嵌套不是原始值的列, 如:`c7` 当中使用的 `c5`
8. 可以自定义函数(如:百分比处理函数), 非常强大!

---
参考：
- [Javascript Table指定列数字汇总](https://xu3352.github.io/javascript/2018/05/06/javascript-table-column-data-summary)

