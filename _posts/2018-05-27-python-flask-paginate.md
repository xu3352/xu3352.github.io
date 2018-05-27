---
layout: post
title: "Python Flask Paginate数据分页插件(bootstrap4支持)"
tagline: ""
description: "`flask-paginate` 一个精简的 `flask` 分页扩展, 默认使用 `bootstrap2` 样式; 支持最新的 `bootstrap4` 样式"
date: '2018-05-27 10:57:25 +0800'
category: python
tags: flask-paginate flask python
---
> {{ page.description }}

最新版 `0.5.1` 已支持 `bootstrap4`, 简单的设置一下即可

# 插件安装升级
```bash
# 安装/升级插件
$ pip install -U flask-paginate
```

# 插件使用
后端: (e.g. `views/users.py`)
```python
from flask import Blueprint
from flask_paginate import Pagination, get_page_parameter

mod = Blueprint('users', __name__)


@mod.route('/')
def index():
    search = False
    q = request.args.get('q')
    if q:
        search = True

    page = request.args.get(get_page_parameter(), type=int, default=1)

    users = User.find(...)
    pagination = Pagination(page=page, total=users.count(), bs_version=4, search=search, record_name='users')
    # 'page' is the default name of the page parameter, it can be customized
    # e.g. Pagination(page_parameter='p', ...)
    # or set PAGE_PARAMETER in config file
    # also likes page_parameter, you can customize for per_page_parameter
    # you can set PER_PAGE_PARAMETER in config file
    # e.g. Pagination(per_page_parameter='pp')

    return render_template('users/index.html', users=users, pagination=pagination)
```

模板文件: `users/index.html`
```html{% raw %}
{{ pagination.info }}
{{ pagination.links }}
<table>
  <thead>
    <tr>
      <th>#</th>
      <th>Name</th>
      <th>Email</th>
    </tr>
  </thead>
  <tbody>
    {% for user in users %}
      <tr>
        <td>{{ loop.index + pagination.skip }}</td>
        <td>{{ user.name }}</td>
        <td>{{ user.email }}</td>
      </tr>
    {% endfor %}
  </tbody>
</table>
{{ pagination.links }}{% endraw %}
```

**详解**:
1. `Blueprint` 这个是 flask 蓝图([blueprints](http://docs.jinkan.org/docs/flask/blueprints.html)) 概念的一个组建, 多个模块用这个管理比较方便
2. `get_page_parameter()` 这个默认值为 `page`, 也就是分页编号, 表示当前是第几页
3. `users = User.find(...)` 这个是查询具体数据, 分页就要注意 `limit start, count` 这块了
4. `pagination` 分页对象实体, 根据核心参数创建对象 
    - `page=` 当前是第几页
    - `total=` 数据总量
    - `bs_version=` 这个就是 `bootstrap` 的版本号了, 默认值是2
    - `search=` 是否是搜索, `pagination.info` 格式化时文案会不一样
    - `record_name=` 展示文案 `pagination.info` 中的值

5. `render_template(...)` `Jinja2`模板格式化, 第一个参数为模板位置, 后面就是数据
    - `users=users` 传递给模板的参数, 页面用于迭代的数据列表
    - `pagination=pagination` 分页实体参数

6. `pagination.info` 分页数据总量的展示
7. `pagination.links` 一组可点击的分页页码的展示


# CSS定制
可以根据自己的需求调整
```css
.pagination-page-info {
    padding: .6em;
    padding-left: 0;
    width: 40em;
    margin: .5em;
    margin-left: 0;
    font-size: 12px;
}
.pagination-page-info b {
    color: black;
    background: #6aa6ed;
    padding-left: 2px;
    padding: .1em .25em;
    font-size: 150%;
}
```

# 效果图
数据展示: {% raw %}`{{ pagination.info }}`{% endraw %}

![](http://flask-paginate.readthedocs.io/en/latest/_images/paginate-info.png){:with="100%"}
![](http://flask-paginate.readthedocs.io/en/latest/_images/paginate-info2.png){:with="100%"}

页码展示: {% raw %}`{{ pagination.links }}`{% endraw %}

![](http://flask-paginate.readthedocs.io/en/latest/_images/paginate-links.png){:with="100%"}

# 其他

参数: `per_page` 可调整分页每页的数量, 默认10/页

参数: `display_msg` 可修改数据展示模板 比如:    
`display_msg='展示 <b>{start}-{end}</b> 总共 <b>{total}</b>'`

[更多分页参数](http://flask-paginate.readthedocs.io/en/latest/#deep-into-the-pagination)

---
参考：
- [Github:lixxu/flask-paginate](https://github.com/lixxu/flask-paginate)
- [Flask-Paginate 最新文档](http://flask-paginate.readthedocs.io/en/latest/)

