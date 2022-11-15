---
layout: post
title: "Python flask jsonify TypeError: Object of type 'Decimal' is not JSON serializable"
keywords: "python flask json typeerror"
description: "Python flask TypeError: Object of type 'Decimal' is not JSON serializable"
tagline: ""
date: '2022-11-15 09:52:30 +0800'
category: python
tags: python flask json
---
> {{ page.description }}

# 导入 simplejson 包

不改动代码的情况下, 快速解决: 

```shell
pip install  simplejson
```

# 自定义Jsonify的Json编码

也可以自己封装一下: 

```python
import decimal

from flask import current_app as app
from flask import Jsonify
from flask.json import JSONEncoder

class JsonEncoder(JSONEncoder):
    def default(self, obj):
        if isinstance(obj, decimal.Decimal):
            return float(obj)
        return JSONEncoder.default(self, obj)

@app.route('/test_jsonify')
def test_jsonify():
    data = {
        'float': 7.5,
        'decimal': decimal.Decimal(7.5)
    }

    app.json_encoder = JsonEncoder
    return jsonify(data)
```

---
参考：
- [typeerror object of type ‘decimal‘ is not json serializable jsonify ](https://blog.51cto.com/liangdongchang/3116513){:target='blank'}
- [TypeError: Object of type Decimal is not JSON serializable](https://stackoverflow.com/questions/65309377/typeerror-object-of-type-decimal-is-not-json-serializable){:target='blank'}
- [Flask Jsonify Custom JsonEncoder](https://code.luasoftware.com/tutorials/flask/flask-jsonify-custom-jsonencoder/){:target='blank'}

