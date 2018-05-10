---
layout: post
title: "Javascript Table数据列点击排序:正序或倒序"
tagline: ""
description: "针对表头的点击事件进行排序, 首次点击默认倒序, 再次点击按相反顺序排列"
date: '2018-05-10 19:43:43 +0800'
category: javascript
tags: javascript jquery-plugin jquery
---
> {{ page.description }}

接着上一篇文章:[Javascript Table数据列可以指定表达式求值](https://xu3352.github.io/javascript/2018/05/09/javascript-table-column-data-expression) 继续扩展, 加一个排序的处理

# 排序
直接上代码了, 其余代码见上一篇文章
```bash
/**
 * 点击表头进行排序处理 倒序(默认)|正序
 * $("table thead tr th") 绑定点击事件
 */
function data_grid_orderby(table) {
    var $table = $(table);
    $table.find("thead tr th").on("click", function () {
        var $th = $(this);
        var arrow = $th.find("code").text();  // ⇡ or ⇣
        var index = $table.find("thead tr th").index($th);
        var $trList = $table.find("tbody tr");

        // 正序排列
        $trList.sort(function (tr1, tr2) {
            var d1 = parseFloat($(tr1).find("td:eq(" + index + ")").text());
            var d2 = parseFloat($(tr2).find("td:eq(" + index + ")").text());
            if (isNaN(d1)) return 0;
            if ("⇣" == arrow) return d1 > d2 ? 1 : -1;  // (无 | 倒序) => 正序
            return d1 < d2 ? 1 : -1;    // 正序 => 倒序(默认)
        });

        // 重新排序
        $table.find("tbody tr").remove();
        for (var i in $trList) {
            if ( $trList[i].tagName == "TR" ) {
                $table.append( $trList[i] );
            }
        }
        // 设置小图标
        $table.find("thead tr th code").remove();
        $th.prepend("<code>" + ("⇣" == arrow ? "⇡" : "⇣") + "</code>");
    });
}

$(function(){
    /* 多个table
    $("table.data-grid.stat").each(function () {
        data_grid_sum(this);
    });
    */
    data_grid_sum($("#myTable"));
    data_grid_calc($("#myTable"));
    data_grid_orderby($("#myTable"));
});
```

# 效果
![表格排序](http://on6gnkbff.bkt.clouddn.com/20180510115140_js-table-column-sorting.png){:width="100%"}

1. 首次点击, 默认倒序(`⇣`), 再次点击正序(`⇡`)
2. 以数字开头的列是可以当做数字来进行排序的, 所以百分比的列也没问题

---
参考：
- [Javascript Table数据列可以指定表达式求值](https://xu3352.github.io/javascript/2018/05/09/javascript-table-column-data-expression)

