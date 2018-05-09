---
layout: post
title: "Javascript Table指定列数字汇总"
tagline: ""
description: "也可以算个小插件了 :) "
date: '2018-05-06 13:29:21 +0800'
category: javascript
tags: javascript jquery
---
> {{ page.description }}

# 想法
做统计的时候可能会用到汇总(累和)的情况, 通常情况都是后端(比如:`java`)处理好, 然后页面只负责展现即可

不过如果遇到 `table` 比较多, 那么每个展示的 `list` 都需要进行迭代, 然后汇总数据追加到 `list` 末尾, 那么代码量也是比较可观的

那么这个工作就交给浏览器去处理吧

# HTML文档
```html
<table id="myTable">
    <thead>
        <tr>
            <th>序号</th>
            <th>标题</th>
            <th class="sum">数据A</th>
            <th class="sum">数据B</th>
            <th class="sum">数据C</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>1</td>
            <td>xx1</td>
            <td>10</td>
            <td>20</td>
            <td>30</td>
        </tr>
        <tr>
            <td>2</td>
            <td>xx2</td>
            <td>10</td>
            <td>20</td>
            <td>30</td>
        </tr>
        <tr>
            <td>3</td>
            <td>xx3</td>
            <td>10</td>
            <td>20</td>
            <td>30</td>
        </tr>
    </tbody>
</table>
```

# JS 处理
做成公共的方法, 方便以后使用
```javascript
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
```

`$("table thead tr th.sum")` 对应的这一列的内容会被统计到; 依赖: [Jquery](http://jquery.com/)

# 使用
```html
<script src="https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js"></script>
<script type="text/javascript">
    $(function(){
        /* 多个table
        $("table.data-grid.stat").each(function () {
            data_grid_sum(this);
        });
        */

        data_grid_sum($("#myTable"));
    });
</script>
```

# 效果图
![效果图](http://on6gnkbff.bkt.clouddn.com/20180506061821_javascript-table-column-sum.png){:width="100%"}

---
参考：
- [jQuery判断当前元素是第几个元素&获取第N个元素](https://www.zhidao91.com/jquery-select-element-index/)

